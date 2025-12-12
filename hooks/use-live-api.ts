import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, FunctionDeclaration, Type, Modality } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array, INPUT_SAMPLE_RATE, PCM_SAMPLE_RATE } from '../utils/audio-utils';
import { LiveStatus } from '../types';
import { useAppContext } from '../context/AppContext';

// Tool Definitions
const checkAvailabilityTool: FunctionDeclaration = {
  name: 'checkAvailability',
  description: 'Check if a specific service is available at a given date and time.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format' },
      time: { type: Type.STRING, description: 'Time in HH:MM 24hr format' },
      service: { type: Type.STRING, description: 'Type of beauty service (e.g., Lashes, Nails, Braids)' }
    },
    required: ['date', 'time', 'service']
  }
};

const bookAppointmentTool: FunctionDeclaration = {
  name: 'bookAppointment',
  description: 'Book a confirmed appointment. This tool adds the event to Google Calendar AND records the customer details into the Google Sheet registry.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format' },
      time: { type: Type.STRING, description: 'Time in HH:MM 24hr format' },
      service: { type: Type.STRING, description: 'Type of beauty service' },
      customerName: { type: Type.STRING, description: 'Name of the customer' },
      phoneNumber: { type: Type.STRING, description: 'Phone number of the customer' }
    },
    required: ['date', 'time', 'service', 'customerName', 'phoneNumber']
  }
};

export interface UseLiveApiReturn {
  status: LiveStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number; // For visualizer
}

export function useLiveApi(): UseLiveApiReturn {
  const { addBooking, knowledgeBase } = useAppContext();
  const [status, setStatus] = useState<LiveStatus>(LiveStatus.DISCONNECTED);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);

  // Audio Context Refs
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Playback Refs
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Session Ref
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const cleanupAudio = useCallback(() => {
    // Stop input processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }

    // Stop output playback
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    activeSourcesRef.current.clear();

    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }

    nextStartTimeRef.current = 0;
    setVolume(0);
  }, []);

  const disconnect = useCallback(async () => {
    if (sessionPromiseRef.current) {
      try {
        const session = await sessionPromiseRef.current;
        if (session && typeof session.close === 'function') {
          session.close();
        }
      } catch (e) {
        console.warn("Error closing session", e);
      }
    }
    sessionPromiseRef.current = null;
    cleanupAudio();
    setStatus(LiveStatus.DISCONNECTED);
  }, [cleanupAudio]);

  const connect = useCallback(async () => {
    if (status === LiveStatus.CONNECTED || status === LiveStatus.CONNECTING) return;

    setStatus(LiveStatus.CONNECTING);

    try {
      if (!process.env.API_KEY) {
        console.error("API_KEY is missing from environment variables.");
        throw new Error("API Key missing");
      }

      // 1. Initialize Audio Contexts
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: PCM_SAMPLE_RATE });

      // Analyser for visualization
      analyserRef.current = outputContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.connect(outputContextRef.current.destination);

      // 2. Start Microphone
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 3. Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: ['AUDIO'],
          systemInstruction: knowledgeBase, // Use dynamic knowledge base from context
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          tools: [{ functionDeclarations: [checkAvailabilityTool, bookAppointmentTool] }]
        }
      };

      // 4. Define Callbacks
      const callbacks = {
        onopen: () => {
          console.log('Gemini Live Session Opened');
          setStatus(LiveStatus.CONNECTED);

          // Start streaming input audio
          if (!inputContextRef.current || !streamRef.current) return;

          sourceRef.current = inputContextRef.current.createMediaStreamSource(streamRef.current);
          processorRef.current = inputContextRef.current.createScriptProcessor(4096, 1, 1);

          processorRef.current.onaudioprocess = (e) => {
            if (isMuted) return; // Don't send data if muted

            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);

            // Send to model
            if (sessionPromiseRef.current) {
              sessionPromiseRef.current.then(session => {
                try {
                  session.sendRealtimeInput({ media: pcmBlob });
                } catch (e) {
                  console.error("Error sending input", e);
                }
              });
            }
          };

          sourceRef.current.connect(processorRef.current);
          processorRef.current.connect(inputContextRef.current.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle Tool Calls
          if (message.toolCall) {
            const responses = [];
            for (const fc of message.toolCall.functionCalls) {
              console.log(`Tool call received: ${fc.name}`, fc.args);
              let result = {};

              if (fc.name === 'checkAvailability') {
                // MOCK LOGIC - In a real app, this queries the Calendar API
                const isAvailable = Math.random() > 0.2; // 80% chance available
                result = {
                  status: isAvailable ? 'available' : 'unavailable',
                  message: isAvailable ? 'That slot is open.' : 'Sorry, that time is booked by another customer.'
                };
              } else if (fc.name === 'bookAppointment') {
                // MOCK LOGIC - Simulate Google Sheet + Calendar interaction
                console.group(" [System] Processing Booking");
                console.log(" 📅 Google Calendar: Event Created");
                console.log(" 📊 Google Sheets: Row Appended");
                console.table(fc.args);
                console.groupEnd();

                // Save to AppContext for Admin Dashboard
                const savedId = await addBooking({
                  date: fc.args.date as string,
                  time: fc.args.time as string,
                  service: fc.args.service as string,
                  customerName: fc.args.customerName as string,
                  phoneNumber: fc.args.phoneNumber as string
                });

                const bookingId = savedId || 'JB-' + Math.floor(Math.random() * 100000);
                result = {
                  status: 'confirmed',
                  bookingId: bookingId,
                  sheetRow: 'Firestore',
                  calendarLink: `https://calendar.google.com/event?id=${bookingId}`,
                  message: `Success! I've added ${fc.args.customerName} to the system and blocked the Calendar for ${fc.args.date} at ${fc.args.time}. Reference: ${bookingId}.`
                };
              }

              responses.push({
                id: fc.id,
                name: fc.name,
                response: { result }
              });
            }

            // Send response back
            if (responses.length > 0 && sessionPromiseRef.current) {
              const session = await sessionPromiseRef.current;
              session.sendToolResponse({ functionResponses: responses });
            }
          }

          // Handle Audio Output
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputContextRef.current) {
            const ctx = outputContextRef.current;

            // Decode
            const audioBuffer = await decodeAudioData(
              base64ToUint8Array(base64Audio),
              ctx
            );

            // Schedule Playback
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;

            // Connect to analyser for visualization, then destination
            if (analyserRef.current) {
              source.connect(analyserRef.current);
            } else {
              source.connect(ctx.destination);
            }

            source.start(nextStartTimeRef.current);

            // Track source
            activeSourcesRef.current.add(source);
            source.onended = () => activeSourcesRef.current.delete(source);

            nextStartTimeRef.current += audioBuffer.duration;
          }

          // Handle Interruptions
          if (message.serverContent?.interrupted) {
            console.log('Model interrupted');
            activeSourcesRef.current.forEach(s => {
              try { s.stop(); } catch (e) { }
            });
            activeSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => {
          console.log('Session closed');
          setStatus(LiveStatus.DISCONNECTED);
          cleanupAudio();
        },
        onerror: (err: any) => {
          // Log simple message to avoid circular structure errors
          console.error('Session encountered an error');
          setStatus(LiveStatus.ERROR);
          cleanupAudio();
        }
      };

      // 5. Connect
      sessionPromiseRef.current = ai.live.connect({ ...config, callbacks });

    } catch (error) {
      console.error("Failed to connect", error);
      setStatus(LiveStatus.ERROR);
      cleanupAudio();
    }
  }, [status, cleanupAudio, isMuted, knowledgeBase, addBooking]); // Added dependencies

  // Visualizer loop
  useEffect(() => {
    let frameId: number;
    const updateVolume = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setVolume(avg);
      }
      frameId = requestAnimationFrame(updateVolume);
    };
    if (status === LiveStatus.CONNECTED) {
      updateVolume();
    } else {
      setVolume(0);
    }
    return () => cancelAnimationFrame(frameId);
  }, [status]);

  const toggleMute = () => setIsMuted(prev => !prev);

  return {
    status,
    connect,
    disconnect,
    isMuted,
    toggleMute,
    volume
  };
}