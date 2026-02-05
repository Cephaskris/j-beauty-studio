import React, { useState, useEffect, useMemo } from 'react';
import { X, Lock, Save, Calendar, Settings, LogOut, User, ShieldCheck, Mail, Key, BellRing, LayoutDashboard, TrendingUp, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}



const DashboardView = ({ bookings }: { bookings: any[] }) => {
    const [filter, setFilter] = useState<'daily' | 'monthly' | '3months' | '6months' | 'yearly'>('monthly');

    const filteredBookings = useMemo(() => {
        const now = new Date();
        const cutoff = new Date();

        switch (filter) {
            case 'daily':
                cutoff.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                cutoff.setMonth(now.getMonth() - 1);
                break;
            case '3months':
                cutoff.setMonth(now.getMonth() - 3);
                break;
            case '6months':
                cutoff.setMonth(now.getMonth() - 6);
                break;
            case 'yearly':
                cutoff.setFullYear(now.getFullYear() - 1);
                break;
        }

        return bookings.filter(b => {
            // Use timestamp if avaiable
            if (b.timestamp) return b.timestamp >= cutoff.getTime();
            // Fallback for simple date strings if timestamp missing
            const bookingDate = new Date(b.date);
            if (!isNaN(bookingDate.getTime())) return bookingDate >= cutoff;
            return false;
        });
    }, [bookings, filter]);

    const totalBookings = filteredBookings.length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Dashboard</h2>
                    <p className="text-stone-500 text-sm">Overview of performance and booking stats.</p>
                </div>

                <div className="flex gap-2 p-1 bg-stone-100 rounded-lg overflow-x-auto">
                    {[
                        { id: 'daily', label: 'Today' },
                        { id: 'monthly', label: '30 Days' },
                        { id: '3months', label: '3 Months' },
                        { id: '6months', label: '6 Months' },
                        { id: 'yearly', label: 'Year' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${filter === f.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Total Bookings</span>
                    </div>
                    <p className="text-4xl font-bold">{totalBookings}</p>
                    <div className="mt-4 text-xs font-medium bg-white/20 inline-block px-2 py-1 rounded">
                        {filter === 'daily' ? 'Today' : `Last ${filter.replace('months', ' Months').replace('monthly', 'Month').replace('yearly', 'Year 12 Months')}`}
                    </div>
                </div>

                <div className="p-6 bg-white border border-stone-100 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-stone-500">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-wider">Top Service</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900 truncate">
                        {filteredBookings.length > 0 ?
                            Object.entries(filteredBookings.reduce((acc: any, curr) => {
                                acc[curr.service] = (acc[curr.service] || 0) + 1;
                                return acc;
                            }, {})).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'
                            : 'No Data'}
                    </p>
                    <p className="text-stone-400 text-xs mt-1">Most popular in this period</p>
                </div>
            </div>

            {/* Recent filtered list preview */}
            <div>
                <h3 className="text-lg font-bold text-stone-800 mb-4">Filtered Records</h3>
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-400">
                        <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No bookings found for this period.
                    </div>
                ) : (
                    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                        {filteredBookings.slice(0, 5).map(b => (
                            <div key={b.id} className="p-4 border-b border-stone-100 last:border-0 flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-bold text-stone-900">{b.customerName}</p>
                                    <p className="text-stone-500 text-xs">{b.service}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-stone-700">{b.date}</p>
                                    <p className="text-stone-400 text-xs">{b.time}</p>
                                </div>
                            </div>
                        ))}
                        {filteredBookings.length > 5 && (
                            <div className="p-3 bg-stone-50 text-center text-xs font-bold text-stone-500 uppercase tracking-widest">
                                + {filteredBookings.length - 5} more records
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

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
    const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'settings' | 'security'>('dashboard');
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
    }, [knowledgeBase, isOpen, currentUser]);

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        try {
            await login(username, password);
        } catch (error: any) {
            setLoginError(error.message || 'Invalid login credentials.');
        }
    };

    const handleLogout = async () => {
        await logout();
        setUsername('');
        setPassword('');
        setLoginError('');
    };

    const handleSaveSettings = async () => {
        await updateKnowledgeBase(infoText);
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto md:overflow-hidden">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] md:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50 shrink-0">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-600" />
                        <span className="font-bold text-stone-800 text-sm md:text-base">J-Beauty Database</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                {/* Content */}
                {!currentUser ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-stone-50 overflow-y-auto">
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
                                        placeholder="your@email.com"
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

                                <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10 active:scale-95 transform duration-100">
                                    Access Database
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 p-4 flex flex-col shrink-0">
                            <div className="mb-4 md:mb-8 px-0 md:px-4 flex items-center justify-between md:block">
                                <div>
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1 hidden md:block">Logged in as</p>
                                    <p className="font-bold text-stone-900 truncate max-w-[200px]">{currentUser.email || currentUser.username}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 font-medium">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'bookings' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                                >
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                                    Bookings DB
                                </button>
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'dashboard' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'settings' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                                >
                                    <Settings className="w-4 h-4 md:w-5 md:h-5" />
                                    AI Knowledge
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === 'security' ? 'bg-amber-100 text-amber-900' : 'text-stone-600 hover:bg-stone-100'}`}
                                >
                                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                                    Security
                                </button>
                            </nav>

                            <div className="hidden md:block flex-1"></div> {/* Spacer */}

                            <button
                                onClick={handleLogout}
                                className="hidden md:flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>

                        {/* Main Panel */}
                        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-white">
                            {activeTab === 'bookings' && (
                                <div className="h-full flex flex-col">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold">Bookings Database</h2>
                                            <p className="text-stone-500 text-xs md:text-sm">Real-time records from J Beauty Studio Voice Agent.</p>
                                        </div>
                                    </div>

                                    {bookings.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-stone-400 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            No bookings recorded yet.
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            {/* Desktop Table */}
                                            <div className="hidden md:block overflow-hidden rounded-xl border border-stone-200">
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
                                                                <td className="p-4 text-stone-600">{booking.phoneNumber}</td>
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

                                            {/* Mobile Cards */}
                                            <div className="md:hidden space-y-4">
                                                {bookings.map((booking) => (
                                                    <div key={booking.id} className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm active:scale-[0.99] transition-transform">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="font-bold text-stone-900">{booking.customerName}</h4>
                                                                <p className="text-stone-500 text-sm">{booking.phoneNumber}</p>
                                                            </div>
                                                            <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-bold">
                                                                {booking.service}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm pt-3 border-t border-stone-100">
                                                            <div className="flex items-center gap-2 text-stone-600">
                                                                <Calendar className="w-4 h-4 text-stone-400" />
                                                                <span>{booking.date}, {booking.time}</span>
                                                            </div>
                                                            <span className="text-green-600 font-medium text-xs flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                                Confirmed
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'dashboard' && (
                                <DashboardView bookings={bookings} />
                            )}

                            {activeTab === 'settings' && (
                                <div className="h-full flex flex-col">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold">AI Knowledge Base</h2>
                                            <p className="text-stone-500 text-sm">Update context and business rules.</p>
                                        </div>
                                        <button
                                            onClick={handleSaveSettings}
                                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
                                        >
                                            <Save className="w-4 h-4" /> Save Changes
                                        </button>
                                    </div>
                                    <div className="flex-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
                                        <textarea
                                            value={infoText}
                                            onChange={(e) => setInfoText(e.target.value)}
                                            className="w-full h-full min-h-[300px] p-4 md:p-6 rounded-lg bg-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-0 resize-none shadow-inner"
                                            placeholder="Enter system instructions..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="max-w-xl mx-auto md:mx-0">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2">Security Settings</h2>
                                    <p className="text-stone-500 mb-8 text-sm">Update your email and password.</p>

                                    <div className="space-y-6 md:space-y-8">

                                        {/* Step 1: Send Verification */}
                                        <div className={`p-4 md:p-6 rounded-2xl border transition-all ${securityStep === 'idle' ? 'bg-white border-amber-200 shadow-lg shadow-amber-500/5' : 'bg-stone-50 border-stone-200 opacity-50'}`}>
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-stone-900">1. Verify Identity</h4>
                                                        <p className="text-xs text-stone-500">Send code to {currentUser?.email}</p>
                                                    </div>
                                                </div>
                                                {securityStep === 'idle' && (
                                                    <button onClick={handleSendCode} className="w-full md:w-auto px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800">
                                                        Send Code
                                                    </button>
                                                )}
                                            </div>

                                            {displayedCode && (
                                                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                                                    <BellRing className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-bold text-blue-800 mb-1">System Notification</p>
                                                        <p className="text-xs text-blue-600 leading-relaxed">
                                                            Demo Code:<br />
                                                            <span className="text-lg font-mono font-bold tracking-widest text-stone-900 block mt-2 bg-white px-2 py-1 rounded border border-blue-200 w-fit select-all">
                                                                {displayedCode}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Step 2: Verify Code */}
                                        <div className={`p-4 md:p-6 rounded-2xl border transition-all ${securityStep === 'sent' ? 'bg-white border-amber-200 shadow-lg shadow-amber-500/5' : 'bg-stone-50 border-stone-200 opacity-50'}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-stone-900">2. Enter Code</h4>
                                                    <p className="text-xs text-stone-500">Enter the 6-digit code</p>
                                                </div>
                                            </div>
                                            {securityStep === 'sent' && (
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="000000"
                                                        value={verificationCode}
                                                        onChange={e => setVerificationCode(e.target.value)}
                                                        className="flex-1 px-4 py-3 md:py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-center md:text-left text-lg tracking-widest md:tracking-normal"
                                                    />
                                                    <button onClick={handleVerifyCode} className="w-full md:w-auto px-6 py-3 md:py-2 bg-amber-500 text-white font-bold md:font-medium rounded-lg hover:bg-amber-600">
                                                        Verify
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Step 3: Update Profile */}
                                        <div className={`p-4 md:p-6 rounded-2xl border transition-all ${securityStep === 'verified' ? 'bg-white border-green-200 shadow-lg shadow-green-500/5' : 'bg-stone-50 border-stone-200 opacity-50'}`}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
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
                                                            className="w-full px-4 py-3 md:py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">New Password</label>
                                                        <input
                                                            type="password"
                                                            value={newPassword}
                                                            onChange={e => setNewPassword(e.target.value)}
                                                            placeholder="Leave blank to keep current"
                                                            className="w-full px-4 py-3 md:py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                                        />
                                                    </div>
                                                    <button type="submit" className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10 active:scale-95">
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