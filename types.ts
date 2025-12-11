export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  customerName: string;
  phoneNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, this should be a hash
  role: 'admin' | 'editor';
}

export enum LiveStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

export interface AudioStreamConfig {
  sampleRate: number;
}