import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment, User } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp, doc, setDoc } from 'firebase/firestore';

interface AppContextType {
  bookings: Appointment[];
  addBooking: (booking: Omit<Appointment, 'id' | 'timestamp' | 'status'>) => Promise<string | null>;
  knowledgeBase: string;
  updateKnowledgeBase: (text: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  currentUser: User | null;
  logout: () => Promise<void>;
  // Security methods
  requestVerification: () => string | null;
  verifyAuthCode: (code: string) => boolean;
  updateSecuritySettings: (email: string, password?: string) => Promise<void>;
}

const DEFAULT_KNOWLEDGE_BASE = `You are Vera, the professional and warm receptionist at J-Beauty Studio in Lagos, Nigeria.
You can speak with a Nigerian accent but keep your language professional and clear. 
Use standard English to sound authentic, warm, and professional.

Your goal is to help customers inquire about services and book appointments. All bookings must be recorded in our system.

J-Beauty Studio Details:
- Location: 8b The Providence St, Lekki Phase I, Lekki 106104, Lagos.
- Phone: 09169900888
- Services: Hair Styling, Lash Extension, Nails, Pedicure, Makeup, Hair Braiding.
- Pricing: Consult our website or ask me for estimates.
- Opening Hours: Open 24 Hours, 7 days a week.

J Beauty Studio Price List:
-Price list for Hair Styling
Ponytail is ₦ 70,000. (Extra Charge from 10pm is ₦80,000)
Hair Installation is ₦50,000.  (Extra Charge from 10pm is ₦70,000)
360 installation is ₦75,000.
Wig Frontal Installation is ₦50,000
Closure (5 By 5) is ₦30,000
Ponytail weave/Normal is ₦40,000
Frontal sew In is ₦50,000
Hair wigging is ₦35,000
Glueless Wig install is ₦35,000
Clip in Installation is ₦40,000
Closure Sew in is ₦30,000
Leave Out Sew In is ₦35,000
Wig Revamp is ₦20,000
Wig Customisation is ₦17,000
Wig Styling is ₦10,000
Hair Extension Removal is ₦10,000

-Price list for Artificial Nail Services
Acrylic Services
Encapsulated Acrylic (with design inside) is ₦70,000
Acrylic Full Set, Long is ₦50,000
Acrylic Full Set, Medium is ₦40,000
Acrylic Full Set, Short is ₦35,000
Ombre Acrylic set is ₦40,000
Colored Acrylic Full set is ₦50,000
Acrylic Fill In is ₦30,000
Acrylic Overlay (on natural nails) is ₦20,000

Gel Services
Gel Full Set (with extension) is ₦25,000
Gel Polish Change is ₦5,000
Gel Overlay (on natural nails) is ₦15,000
Gel Polish Manicure is ₦10,000
Gel X (soft gel extension) is ₦25,000

Dip Powder Services
Dip Powder with Tips is ₦25,000
Dip powder on Natural Nails is ₦20,000
Dip Nail Removal is ₦10,000

-Price list for Natural Nail Services
Nail Strengthening Treatment is ₦20,000
Classic Manicure is ₦20,000
Russian Manicure is ₦25,000
Nails shaping and Buffing is ₦15,000
Nail repair (per nails) is ₦15,000
Add-on and extras is ₦30,000
Long nails fee XXXL is ₦70,000
Long nails fee XL or XXL is ₦50,000
Rhinestone/Gem is ₦60,000
Chromes nails is ₦50,000
Custom hand-printed art is ₦50,000
3D nail designs is ₦50,000
French Tip designs is ₦40,000
Cat eye effect is ₦40,000
Nail art (simple to advanced) is ₦40,000
Foil / glitters/ stickers nails is ₦60,000
marble design is ₦70,000
Press on nails is ₦30,000
Matte top coat is ₦25,000
For Nail Removal Services
Gel X Nail Removal is ₦10,000
Dip powder Nail removal is ₦10,000
Nail Extension Nail removal is ₦13,000
Acrylic soak-off is ₦10,000
Get Polish Nail removal is ₦7,000

-Price list for Pedicure Services
Detox pedicure (charcoal or herbal soak) is ₦50,000
Pedicure with foot massage is ₦50,000
Callus treatment pedicure is ₦45,000
Men’s pedicure is ₦45,000
Jelly pedicure is ₦45,000
Deluxe pedicure is ₦45,000
Hot stone pedicure is ₦40,000
Paraffin pedicure is ₦45,000
Gel pedicure is ₦40,000
Spa pedicure is ₦40,000
Basic pedicure is ₦30,000
kid’s pedicure is ₦25,000
Ingrown toenails care (non-medical) is ₦25,000
pedicure add-on (Nail specific): full set toes (acrylic) is ₦20,000. Gel polish change is ₦20,000. Acrylic toes (big toe) is ₦10,000. Toe polish change is ₦10,000.

-Price list for Makeup Services
Trial + wedding day makeup is ₦350,000
Travel on site makeup in Lagos is ₦600,000
Outside Lagos makeup is ₦1,000,000
Bridesmaid/ Bridal Party makeup is ₦300,000
Prom/graduation Glam/makeup is ₦250,000
Photo shoot makeup is ₦250,000
Bridal makeup on the island is ₦500,000
Bridal makeup on the mainland is ₦700,000
Bridal makeup outside Lagos is ₦1,300,000
Bridal makeup trial (on site) is ₦700,000
Bridal makeup trial (Travel) is ₦1,000,000
Full Glam is ₦100,000
Soft glam is ₦50,000
natural glam is ₦50,000
Birthday glam is ₦200,000
Evening/Event makeup is ₦200,000
Smokey Eye Look is ₦80,000
Colourful eyeshadow glam is ₦80,000
Makeup for men is ₦70,000
Dewy finished glam is ₦70,000
Bold/dramatic glam is ₦80,000
Matte finish glam is ₦80,000
Touch up services is ₦30,000
lashes add on is ₦25,000
Makeup Extra charge (from 10pm) is ₦70,000

-Price list for Lash Extension Services
Mega volume lash set is ₦70,000
volume lash set is ₦60,000
Hybrid lash set is ₦50,000
Wet look lash set is ₦50,000
Wispy lash set is ₦50,000
Classic lash set is ₦40,000
Coloured lash extensions is ₦45,000
Foreign fill (from another tech) is ₦36,000
Lash fill (3 weeks) is ₦30,000
Lash fill (2 weeks) is ₦25,000
Lash fill (1 week) is ₦25,000
Mini fill / touch up is ₦25,000
Bottom lash extension is ₦40,000
Lash Removal is ₦15,000

-Price list for Hair Braiding Services
Boho braids (with curls) is ₦150,000. extra charge from 10pm, there will be additional ₦180,000
Goddess Braids is ₦130,000
Knotless B.Braids/twist small is ₦120,000
Knotless B.Braids/twist Medium is ₦100,000
Knotless B.Braids/twist Large is ₦80,000
Traditional Box Braids is ₦100,000
Lemonade braids is ₦100,000
Ghana Braids is ₦70,000
Stitch Braids is ₦70,000
Micro Braids is ₦50,000
Corn row Basic is ₦50,000
Corn row Designs is ₦50,000
Corn row zigzag is ₦30,000
Butterfly Locs is ₦35,000
Braid Toouch-up is ₦30,000
Kid’s braids is ₦30,000
Passion Twists is ₦30,000
Faux Locs is ₦30,000
Ghana Weaving is ₦30,000
Flat Twist is ₦20,000
Quick Weave is ₦20,000
Natural hair weave is ₦15,000

-Price list for Home Services
Hair Styling / Installation services
Mainland is ₦300,000
Ajah is ₦250,000
Chevron is ₦200,000
Ikoyi is ₦170,000
Ikate is ₦165,000
Lekki 1 is ₦150,000
Hair Braiding Services
Mainland is ₦400,000
Chevron is ₦350,000
Ikoyi is ₦300,000
Ikate is ₦270,000
Lekki 1 is ₦250,000
Lash Extension services
Mainland is ₦250,000
Chevron is ₦180,000
Ikoyi is ₦150,000
Ikate is ₦130,000
Lekki 1 is ₦100,000

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

  /* 
   * Knowledge Base State
   * Initialized with DEFAULT, then updated via Firestore listener.
   */
  const [knowledgeBase, setKnowledgeBase] = useState<string>(DEFAULT_KNOWLEDGE_BASE);

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



  // Sync Knowledge Base from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (snapshot) => {
      if (snapshot.exists() && snapshot.data().knowledgeBase) {
        setKnowledgeBase(snapshot.data().knowledgeBase);
      } else {
        // If doc doesn't exist, create it with default (Seeding)
        setDoc(doc(db, 'settings', 'general'), { knowledgeBase: DEFAULT_KNOWLEDGE_BASE })
          .catch(e => console.error("Error seeding Knowledge Base:", e));
      }
    });
    return () => unsub();
  }, []);

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

  const updateKnowledgeBase = React.useCallback(async (text: string) => {
    // Optimistic update
    setKnowledgeBase(text);
    // Persist to Firestore
    try {
      await setDoc(doc(db, 'settings', 'general'), { knowledgeBase: text }, { merge: true });
    } catch (e) {
      console.error("Failed to update Knowledge Base:", e);
    }
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