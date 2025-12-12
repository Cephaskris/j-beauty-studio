import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, User } from '../types';
import { Database } from '../utils/database';

interface AppContextType {
  bookings: Appointment[];
  addBooking: (booking: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => void;
  knowledgeBase: string;
  updateKnowledgeBase: (text: string) => void;
  login: (username: string, password: string) => boolean;
  currentUser: User | null;
  logout: () => void;
  // Security methods
  requestVerification: () => string | null;
  verifyAuthCode: (code: string) => boolean;
  updateSecuritySettings: (email: string, password?: string) => void;
}

const DEFAULT_KNOWLEDGE_BASE = `You are Amara, the vibrant Gen-Z receptionist at J-Beauty Studio in Lagos, Nigeria.
You are a Nigerian female in your 20s. Speak with a natural, trendy Lagos accent. 
Use a mix of standard English and light Nigerian Pidgin/Slang to sound authentic, warm, and relatable (e.g., "No wahala", "You go shine", "We dey for you", "Abeg check am", "Oya let's book am").

Your goal is to help customers inquire about services and book appointments. All bookings must be recorded in our system.

J-Beauty Studio Details:
- Location: 8b The Providence St, Lekki Phase I, Lekki 106104, Lagos.
- Phone: 09169900888
- Services: Hair Styling, Lash Extension, Nails, Pedicure, Makeup, Hair Braiding.
- Pricing: Consult our website or ask me for estimates.
- Opening Hours: Open 24 Hours, 7 days a week.

Booking Rules:
- Always ask for the preferred date and time.
- Always ask for the customer's name and phone number.
- Use the 'bookAppointment' tool to confirm the booking.
- Mention that we are open 24/7 if they are unsure about timing.

Be energetic, polite, and helpful.`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('jb_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [knowledgeBase, setKnowledgeBase] = useState<string>(() => {
    const saved = localStorage.getItem('jb_knowledge');
    return saved || DEFAULT_KNOWLEDGE_BASE;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initialize DB on mount
  useEffect(() => {
    Database.init();
  }, []);

  useEffect(() => {
    localStorage.setItem('jb_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('jb_knowledge', knowledgeBase);
  }, [knowledgeBase]);

  const addBooking = (bookingData: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => {
    const newBooking: Appointment = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: 'confirmed'
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateKnowledgeBase = (text: string) => {
    setKnowledgeBase(text);
  };

  const login = (username: string, password: string): boolean => {
    const user = Database.authenticate(username, password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const requestVerification = (): string | null => {
    if (!currentUser) return null;
    return Database.requestVerificationCode(currentUser.id);
  };

  const verifyAuthCode = (code: string): boolean => {
    if (!currentUser) return false;
    return Database.verifyCode(currentUser.id, code);
  };

  const updateSecuritySettings = (email: string, password?: string) => {
    if (!currentUser) return;

    const updates: Partial<User> = { email };
    if (password && password.trim() !== '') {
      updates.password = password;
    }

    const updatedUser = Database.updateUser(currentUser.id, updates);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  };

  return (
    <AppContext.Provider value={{
      bookings,
      addBooking,
      knowledgeBase,
      updateKnowledgeBase,
      login,
      logout,
      currentUser,
      requestVerification,
      verifyAuthCode,
      updateSecuritySettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};