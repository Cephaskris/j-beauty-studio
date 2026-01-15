import React from 'react';
import { Mic, MicOff, Phone, X, Calendar, Loader2 } from 'lucide-react';
import { UseLiveApiReturn } from '../hooks/use-live-api';
import LivePulse from './LivePulse';
import { LiveStatus } from '../types';

interface VoiceWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  api: UseLiveApiReturn;
}

const VoiceWidget: React.FC<VoiceWidgetProps> = ({ isOpen, onClose, api }) => {
  const { status, isMuted, toggleMute, volume } = api;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative">

        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
          <img
            src="https://placehold.co/140x40/transparent/d97706?text=J+Beauty+Studio&font=playfair-display"
            alt="J-Beauty"
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Live</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 ml-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 py-12 flex flex-col items-center justify-center bg-gradient-to-b from-white to-amber-50/50 min-h-[400px]">

          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-stone-800 mb-1">Vera</h3>
            <p className="text-stone-500 text-sm">Customer Success @ J-Beauty</p>
            <p className="text-xs text-amber-600 font-medium mt-1">Lekki Phase I</p>
          </div>

          {/* Visualizer */}
          <div className="mb-12">
            {status === LiveStatus.CONNECTING ? (
              <div className="w-32 h-32 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              </div>
            ) : (
              <LivePulse volume={volume} active={status === LiveStatus.CONNECTED} />
            )}
          </div>

          <div className="text-center px-8">
            <p className="text-stone-400 text-sm font-medium">
              {status === LiveStatus.CONNECTED
                ? (isMuted ? "Vera is listening..." : "Talk to Vera...")
                : status === LiveStatus.CONNECTING
                  ? "Connecting to J-Beauty..."
                  : "Disconnected"}
            </p>
          </div>

        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t border-stone-100 grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50" disabled>
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Book</span>
          </button>

          <button
            onClick={toggleMute}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isMuted ? 'text-red-500' : 'text-stone-800'}`}
          >
            <div className={`p-4 rounded-full ${isMuted ? 'bg-red-50' : 'bg-stone-100 hover:bg-stone-200'}`}>
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </div>
          </button>

          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-1 text-red-500 hover:text-red-600 transition-colors"
          >
            <div className="p-4 rounded-full bg-red-50 hover:bg-red-100">
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoiceWidget;