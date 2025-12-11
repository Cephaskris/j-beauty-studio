import React, { useState, useEffect } from 'react';
import { X, Lock, Save, Calendar, Settings, LogOut, User, ShieldCheck, Mail, Key, BellRing } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
      bookings, 
      knowledgeBase, 
      updateKnowledgeBase, 
      login, 
      logout, 
      currentUser,
      requestVerification,
      verifyAuthCode,
      updateSecuritySettings
  } = useAppContext();
  
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard States
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings' | 'security'>('bookings');
  const [infoText, setInfoText] = useState(knowledgeBase);

  // Security Flow States
  const [securityStep, setSecurityStep] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [verificationCode, setVerificationCode] = useState('');
  const [displayedCode, setDisplayedCode] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  // Sync info text when knowledge base changes or on open
  useEffect(() => {
    setInfoText(knowledgeBase);
    if (isOpen && currentUser) {
        setNewEmail(currentUser.email);
    }
  }, [knowledgeBase, isOpen, currentUser]);

  // Reset security state when tab changes
  useEffect(() => {
      setSecurityStep('idle');
      setVerificationCode('');
      setDisplayedCode(null);
      setNewPassword('');
      setSecurityMsg({ type: '', text: '' });
      if(currentUser) setNewEmail(currentUser.email);
  }, [activeTab, currentUser]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const success = login(username, password);
    if (!success) {
      setLoginError('Invalid credentials. Default: admin / admin123');
    }
  };

  const handleLogout = () => {
    logout();
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const handleSaveSettings = () => {
    updateKnowledgeBase(infoText);
    alert('Knowledge Base updated! Please reconnect the Voice Agent to apply changes.');
  };

  // --- Security Handlers ---

  const handleSendCode = () => {
      const code = requestVerification();
      if (code) {
          setSecurityStep('sent');
          setDisplayedCode(code); // Display code in UI for this demo
          setSecurityMsg({ type: 'success', text: `Verification code sent to ${currentUser?.email}` });
      } else {
          setSecurityMsg({ type: 'error', text: 'Failed to send code.' });
      }
  };

  const handleVerifyCode = () => {
      const isValid = verifyAuthCode(verificationCode);
      if (isValid) {
          setSecurityStep('verified');
          setSecurityMsg({ type: 'success', text: 'Identity verified. You may now update details.' });
          setDisplayedCode(null); // Hide code after verification
      } else {
          setSecurityMsg({ type: 'error', text: 'Invalid verification code.' });
      }
  };

  const handleUpdateSecurity = (e: React.FormEvent) => {
      e.preventDefault();
      updateSecuritySettings(newEmail, newPassword);
      setSecurityMsg({ type: 'success', text: 'Profile updated successfully!' });
      setSecurityStep('idle');
      setVerificationCode('');
      setNewPassword('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-stone-800">J-Beauty Admin Database</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        {!currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-stone-50">
             <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900">Admin Login</h3>
                  <p className="text-stone-500 text-sm mt-2">Enter credentials to access the database</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="e.g. admin"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
                        />
                    </div>
                    
                    {loginError && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-500 text-sm font-medium text-center">
                        {loginError}
                      </div>
                    )}

                    <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10">
                        Access Database
                    </button>
                </form>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
             {/* Sidebar */}
             <div className="w-64 bg-stone-50 border-r border-stone-200 p-4 flex flex-col">
                <div className="mb-8 px-4">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Logged in as</p>
                  <p className="font-bold text-stone-900 truncate">{currentUser.username}</p>
                </div>

                <nav className="space-y-2 flex-1">
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'bookings' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                    >
                        <Calendar className="w-5 h-5" />
                        Bookings DB
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                    >
                        <Settings className="w-5 h-5" />
                        AI Knowledge
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'security' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                    >
                        <ShieldCheck className="w-5 h-5" />
                        Security
                    </button>
                </nav>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
             </div>

             {/* Main Panel */}
             <div className="flex-1 p-8 overflow-y-auto bg-white">
                {activeTab === 'bookings' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Bookings Database</h2>
                        <p className="text-stone-500 mb-6 text-sm">Real-time records from Amara Voice Agent.</p>
                        
                        {bookings.length === 0 ? (
                            <div className="text-center py-20 text-stone-400 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                No bookings recorded yet.
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-stone-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-stone-100 text-stone-700 font-semibold">
                                        <tr>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Service</th>
                                            <th className="p-4">Date/Time</th>
                                            <th className="p-4">Contact</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {bookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-stone-50 transition-colors">
                                                <td className="p-4 font-medium">{booking.customerName}</td>
                                                <td className="p-4">
                                                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-semibold">
                                                        {booking.service}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium">{booking.date}</div>
                                                    <div className="text-stone-500 text-xs">{booking.time}</div>
                                                </td>
                                                <td className="p-4">{booking.phoneNumber}</td>
                                                <td className="p-4">
                                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Confirmed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'settings' && (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">AI Knowledge Base</h2>
                                <p className="text-stone-500 text-sm">Update the context and business rules for the AI.</p>
                            </div>
                            <button 
                                onClick={handleSaveSettings}
                                className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                        <div className="flex-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
                            <textarea 
                                value={infoText}
                                onChange={(e) => setInfoText(e.target.value)}
                                className="w-full h-full p-6 rounded-lg bg-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-0 resize-none"
                                placeholder="Enter system instructions..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-bold mb-2">Security Settings</h2>
                        <p className="text-stone-500 mb-8 text-sm">Update your email and password. Verification required.</p>

                        <div className="space-y-8">
                            
                            {/* Step 1: Send Verification */}
                            <div className={`p-6 rounded-2xl border transition-all ${securityStep === 'idle' ? 'bg-white border-amber-200 shadow-lg shadow-amber-500/5' : 'bg-stone-50 border-stone-200 opacity-50'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-900">1. Verify Identity</h4>
                                            <p className="text-xs text-stone-500">Send code to {currentUser?.email}</p>
                                        </div>
                                    </div>
                                    {securityStep === 'idle' && (
                                        <button onClick={handleSendCode} className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800">
                                            Send Code
                                        </button>
                                    )}
                                </div>
                                
                                {/* Notification Banner for Code */}
                                {displayedCode && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                                        <BellRing className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-800 mb-1">System Notification</p>
                                            <p className="text-xs text-blue-600 leading-relaxed">
                                                Since this app is in demo mode (no backend), here is your code:<br/>
                                                <span className="text-lg font-mono font-bold tracking-widest text-stone-900 block mt-2 bg-white px-2 py-1 rounded border border-blue-200 w-fit select-all">
                                                    {displayedCode}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Verify Code */}
                            <div className={`p-6 rounded-2xl border transition-all ${securityStep === 'sent' ? 'bg-white border-amber-200 shadow-lg shadow-amber-500/5' : 'bg-stone-50 border-stone-200 opacity-50'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900">2. Enter Code</h4>
                                        <p className="text-xs text-stone-500">Enter the code displayed above</p>
                                    </div>
                                </div>
                                {securityStep === 'sent' && (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit code"
                                            value={verificationCode}
                                            onChange={e => setVerificationCode(e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        />
                                        <button onClick={handleVerifyCode} className="px-6 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600">
                                            Verify
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Step 3: Update Profile */}
                            <div className={`p-6 rounded-2xl border transition-all ${securityStep === 'verified' ? 'bg-white border-green-200 shadow-lg shadow-green-500/5' : 'bg-stone-50 border-stone-200 opacity-50'}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-stone-900">3. Update Credentials</h4>
                                        <p className="text-xs text-stone-500">Change password or email</p>
                                    </div>
                                </div>
                                
                                {securityStep === 'verified' && (
                                    <form onSubmit={handleUpdateSecurity} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email Address</label>
                                            <input 
                                                type="email"
                                                value={newEmail}
                                                onChange={e => setNewEmail(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">New Password</label>
                                            <input 
                                                type="password"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                placeholder="Leave blank to keep current"
                                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                            />
                                        </div>
                                        <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors">
                                            Save Changes
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Status Message */}
                            {securityMsg.text && (
                                <div className={`p-4 rounded-xl text-sm font-medium text-center ${securityMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {securityMsg.text}
                                </div>
                            )}

                        </div>
                    </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;