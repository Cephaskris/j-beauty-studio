import { User } from '../types';

const USERS_DB_KEY = 'jb_users_db_v2';
const CODES_DB_KEY = 'jb_auth_codes';

// Initialize DB with default admin if empty
const initializeDatabase = () => {
  const existingUsers = localStorage.getItem(USERS_DB_KEY);
  if (!existingUsers) {
    const defaultAdmin: User = {
      id: 'usr_init_001',
      username: 'admin',
      email: 'cephaskris@yahoo.com',
      password: 'admin123', // Default password
      role: 'admin'
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify([defaultAdmin]));
    console.log('Database: Initialized with default admin.');
  }
};

export const Database = {
  init: () => {
    initializeDatabase();
  },

  authenticate: (username: string, password: string): User | null => {
    initializeDatabase(); // Ensure DB exists
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    if (!usersJson) return null;

    try {
      const users: User[] = JSON.parse(usersJson);
      const user = users.find(u => u.username === username && u.password === password);
      return user || null;
    } catch (e) {
      console.error('Database Error: Failed to parse users', e);
      return null;
    }
  },

  // Returns the code string on success, null on failure
  requestVerificationCode: (userId: string): string | null => {
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    if (!usersJson) return null;
    
    const users: User[] = JSON.parse(usersJson);
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save code to mock DB
    const codes = JSON.parse(localStorage.getItem(CODES_DB_KEY) || '{}');
    codes[userId] = code;
    localStorage.setItem(CODES_DB_KEY, JSON.stringify(codes));

    // For a real app, this would be an API call to an email service.
    // For this demo, we return it to display in the UI.
    console.log(`[Email Service] Code generated for ${user.email}: ${code}`);
    
    return code;
  },

  verifyCode: (userId: string, code: string): boolean => {
    const codes = JSON.parse(localStorage.getItem(CODES_DB_KEY) || '{}');
    if (codes[userId] && codes[userId] === code) {
      // Consume code
      delete codes[userId];
      localStorage.setItem(CODES_DB_KEY, JSON.stringify(codes));
      return true;
    }
    return false;
  },

  updateUser: (userId: string, updates: Partial<User>): User | null => {
    const usersJson = localStorage.getItem(USERS_DB_KEY);
    if (!usersJson) return null;

    try {
      const users: User[] = JSON.parse(usersJson);
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) return null;

      // Merge updates
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      
      return users[userIndex];
    } catch (e) {
      return null;
    }
  }
};