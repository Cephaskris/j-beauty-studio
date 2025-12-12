import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, User } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

interface AppContextType {
  bookings: Appointment[];
  addBooking: (booking: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => Promise<string | null>;
  knowledgeBase: string;
  updateKnowledgeBase: (text: string) => void;
  login: (email: string, password: string) => Promise<void>;
  currentUser: User | null;
  logout: () => Promise<void>;
  // Security methods
  requestVerification: () => string | null;
  verifyAuthCode: (code: string) => boolean;
  updateSecuritySettings: (email: string, password?: string) => Promise<void>;
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

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to App User
        setCurrentUser({
          id: firebaseUser.uid,
          username: firebaseUser.displayName || 'Admin',
          email: firebaseUser.email || '',
          password: '', // Not accessible
          role: 'admin'
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize Firestore listener for Bookings
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings: Appointment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));
      setBookings(fetchedBookings);
    });
    return () => unsubscribe();
  }, []);



  useEffect(() => {
    localStorage.setItem('jb_knowledge', knowledgeBase);
  }, [knowledgeBase]);

  const addBooking = React.useCallback(async (bookingData: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        timestamp: Date.now(),
        status: 'confirmed'
      });
      return docRef.id;
    } catch (e) {
      console.error("Error adding booking: ", e);
      return null;
    }
  }, []);

  const updateKnowledgeBase = React.useCallback((text: string) => {
    setKnowledgeBase(text);
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = React.useCallback(async () => {
    await signOut(auth);
  }, []);

  const requestVerification = React.useCallback((): string | null => {
    if (!currentUser) return null;
    return Database.requestVerificationCode(currentUser.id);
  }, [currentUser]);

  const verifyAuthCode = React.useCallback((code: string): boolean => {
    if (!currentUser) return false;
    return Database.verifyCode(currentUser.id, code);
  }, [currentUser]);

  const updateSecuritySettings = React.useCallback(async (email: string, password?: string) => {
    console.log("Update requested for", email);
  }, []);

  const contextValue = React.useMemo(() => ({
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
  }), [bookings, addBooking, knowledgeBase, updateKnowledgeBase, login, logout, currentUser, requestVerification, verifyAuthCode, updateSecuritySettings]);

  return (
    <AppContext.Provider value={contextValue}>
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