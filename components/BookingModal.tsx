import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  MessageCircle, 
  Copy, 
  ExternalLink 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export interface BookingServiceData {
  name: string;
  price: string;
  desc?: string;
  category?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: BookingServiceData | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, service }) => {
  const { addBooking } = useAppContext();

  // Booking Flow Steps: 1 = Policy, 2 = Form Details, 3 = Confirmation & WhatsApp
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('12:00 PM');
  const [locationType, setLocationType] = useState<'salon' | 'home'>('salon');
  const [homeAddress, setHomeAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !service) return null;

  // Calculate clean numeric price and 50% deposit
  const numericPrice = parseInt(service.price.replace(/[^0-9]/g, ''), 10) || 0;
  const depositAmount = Math.round(numericPrice * 0.5);

  // Check if late night (8 PM to 6 AM)
  const isLateNight = ['08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '02:00 AM', '04:00 AM', '06:00 AM'].includes(selectedTime);

  const timeSlots = [
    '09:00 AM', '10:30 AM', '12:00 PM', 
    '01:30 PM', '03:00 PM', '04:30 PM', 
    '06:00 PM', '08:00 PM', '10:00 PM'
  ];

  const handleProceedToForm = () => {
    if (policyAccepted) {
      setStep(2);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phoneNumber.trim() || !selectedDate) {
      alert('Please fill in your name, phone number, and preferred date.');
      return;
    }

    setIsSubmitting(true);
    const refCode = `JB-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);

    try {
      const fullLocation = locationType === 'salon' 
        ? 'Salon Visit (8b The Providence St, Lekki Phase I)' 
        : `Home Service (${homeAddress || 'Address on WhatsApp'})`;

      const combinedNotes = [
        `Ref: ${refCode}`,
        `Location: ${fullLocation}`,
        `Deposit Due: ₦${depositAmount.toLocaleString()}`,
        isLateNight ? 'Late Night Booking (+₦20,000)' : '',
        notes ? `Notes: ${notes}` : ''
      ].filter(Boolean).join(' | ');

      await addBooking({
        date: selectedDate,
        time: selectedTime,
        service: `${service.name} (₦${service.price})`,
        customerName: clientName,
        phoneNumber: phoneNumber,
        notes: combinedNotes
      });
    } catch (err) {
      console.warn('Booking stored locally or offline:', err);
    } finally {
      setIsSubmitting(false);
      setStep(3);
    }
  };

  // Generate WhatsApp formatted message
  const generateWhatsAppMessage = () => {
    const fullLocation = locationType === 'salon' 
      ? 'Salon Visit (8b The Providence St, Lekki Phase I)' 
      : `Home Service (${homeAddress || 'Lagos doorstep'})`;

    return `✨ *NEW APPOINTMENT BOOKING - J BEAUTY STUDIO* ✨
──────────────────────────
📋 *Booking Ref:* ${bookingRef || 'JB-PENDING'}
👤 *Client Name:* ${clientName}
📱 *Phone / WhatsApp:* ${phoneNumber}
💇‍♀️ *Selected Service:* ${service.name}
💰 *Total Service Price:* ₦${service.price}
💵 *50% Deposit Due:* ₦${depositAmount.toLocaleString()}
📅 *Appointment Date:* ${selectedDate}
⏰ *Scheduled Time:* ${selectedTime} ${isLateNight ? '(Late Night +₦20k)' : ''}
📍 *Service Location:* ${fullLocation}
${notes ? `📝 *Special Notes:* ${notes}\n` : ''}──────────────────────────
💳 *Payment Account:*
Providus Bank | 9642252198 | J BEAUTY STUDIO
(Proof of payment screenshot attached)
──────────────────────────
I have accepted the booking policy. Please verify my deposit and confirm my appointment slot! 🌟`;
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/2347041008039?text=${text}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleModalClose = () => {
    setStep(1);
    setPolicyAccepted(false);
    setClientName('');
    setPhoneNumber('');
    setSelectedDate('');
    setHomeAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-2xl text-white my-auto sm:my-8 overflow-hidden max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10 relative z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif italic text-amber-500 font-bold text-lg sm:text-xl">J Beauty</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.25em] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {step === 1 ? 'Step 1 of 3: Policy' : step === 2 ? 'Step 2 of 3: Details' : 'Step 3 of 3: Complete'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {step === 1 && 'Booking & Privacy Policy'}
              {step === 2 && 'Schedule Your Appointment'}
              {step === 3 && 'Booking Confirmed!'}
            </h2>
          </div>

          <button
            onClick={handleModalClose}
            aria-label="Close booking modal"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Service Snippet */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div>
            <span className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Selected Service</span>
            <h4 className="text-lg font-bold text-white capitalize">{service.name}</h4>
            {service.desc && <p className="text-stone-400 text-xs mt-0.5">{service.desc}</p>}
          </div>
          <div className="text-right">
            <span className="text-stone-400 text-xs uppercase tracking-wider font-semibold">Service Fee</span>
            <div className="text-xl font-extrabold text-amber-400">₦{service.price}</div>
          </div>
        </div>

        {/* STEP 1: OFFICIAL BOOKING POLICY & REGULATIONS */}
        {step === 1 && (
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 relative z-10 flex-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-3 sm:space-y-4 max-h-[44vh] sm:max-h-[380px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar text-xs sm:text-sm leading-relaxed text-stone-300">
              
              {/* Bank Deposit Box */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <h4 className="text-sm sm:text-base">1. Non-Refundable 50% Deposit</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">Rule 1, 2, 3 & 13</span>
                </div>
                <p className="text-stone-200">
                  A <span className="text-white font-bold">50% non-refundable deposit</span> is required before any appointment can be confirmed. Appointments are strictly confirmed only once payment/deposit has been received.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 sm:p-3 bg-black/40 rounded-xl text-[11px] sm:text-xs text-stone-300 border border-white/5">
                  <p><span className="text-amber-400 font-medium">Bank:</span> Providus Bank</p>
                  <p><span className="text-amber-400 font-medium">Account:</span> <span className="font-mono text-white font-bold">9642252198</span></p>
                  <p><span className="text-amber-400 font-medium">Account Name:</span> J BEAUTY STUDIO</p>
                </div>
                <p className="text-[11px] text-amber-200/90 italic">
                  Rule 4: The remaining 50% balance must be paid on the day of your appointment before or after service.
                </p>
              </div>

              {/* Late-Night Policy (8:00 PM – 6:00 AM) */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <h4 className="text-sm sm:text-base">2. Late-Night Policy (8:00 PM – 6:00 AM)</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">Rule 5 & Late-Night</span>
                </div>
                <ul className="space-y-1.5 text-stone-300 list-disc list-inside">
                  <li><span className="text-white font-semibold">Strictly Appointment Only:</span> Walk-ins will not be accepted between 8:00 PM and 6:00 AM.</li>
                  <li><span className="text-white font-semibold">₦20,000 Late-Night Fee:</span> Any appointment between 8:00 PM and 6:00 AM attracts an additional ₦20,000 late-night appointment fee (separate from the service price).</li>
                  <li>Late-night home service appointments are also subject to this ₦20,000 fee and must be booked in advance.</li>
                </ul>
              </div>

              {/* Punctuality & Grace Period */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <h4 className="text-sm sm:text-base">3. Punctuality & Grace Period (25–30 Mins)</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">Rule 6</span>
                </div>
                <p>
                  Clients are expected to arrive on time. We provide a <span className="text-white font-semibold">grace period of 25 to 30 minutes</span>. After that, the appointment may be shortened, rescheduled, or cancelled, and may result in additional charges depending on circumstances.
                </p>
              </div>

              {/* Cancellations, Rescheduling & No-Shows */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <h4 className="text-sm sm:text-base">4. Cancellations, Rescheduling & No-Shows</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">Rule 7, 8 & 9</span>
                </div>
                <ul className="space-y-1.5 text-stone-300 list-disc list-inside">
                  <li><span className="text-white font-semibold">Cancellations (Rule 7):</span> Cancellations made with less than 24 hours notice will result in the forfeiture of your 50% deposit.</li>
                  <li><span className="text-white font-semibold">No-Shows (Rule 8):</span> Clients who fail to show up will automatically forfeit their deposit. A new deposit will be required for any future appointment (genuine emergencies may be reviewed at studio discretion).</li>
                  <li><span className="text-white font-semibold">Rescheduling (Rule 9):</span> Only one rescheduled appointment notice is allowed. Repeated rescheduling will require a new deposit.</li>
                </ul>
              </div>

              {/* Studio Etiquette, Guests & VIP Home Service */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <h4 className="text-sm sm:text-base">5. Studio Etiquette, Guests & VIP Bookings</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-full">Rule 10, 11, 12, 14, 15, 16</span>
                </div>
                <ul className="space-y-1.5 text-stone-300 list-disc list-inside">
                  <li><span className="text-white font-semibold">Service Changes (Rule 10):</span> Please communicate any change in service before the appointment rather than expecting extra services during the session.</li>
                  <li><span className="text-white font-semibold">Children & Guests (Rule 11):</span> Clients can only bring <span className="text-amber-300 font-semibold">1 extra person only</span>.</li>
                  <li><span className="text-white font-semibold">Home Service / VIP (Rule 12):</span> Requires a full or large deposit because staff are specifically dispatched to your location.</li>
                  <li><span className="text-white font-semibold">Pricing (Rule 14):</span> Prices are subject to review, but the price confirmed at booking will apply unless you modify your service.</li>
                  <li><span className="text-white font-semibold">Respectful Behavior (Rule 15):</span> Zero tolerance for abuse, harassment, argument, or disrespect towards staff.</li>
                  <li><span className="text-white font-semibold">Walk-Ins (Rule 16):</span> Daytime walk-ins are always warmly welcomed.</li>
                </ul>
              </div>

            </div>

            {/* Checkbox Agreement */}
            <label className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-colors">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 focus:ring-offset-stone-900 cursor-pointer shrink-0"
              />
              <span className="text-xs sm:text-sm text-stone-200 leading-snug">
                I have read, understood, and agree to the <span className="text-amber-400 font-semibold">J-Beauty Studio Booking Policy & Terms</span>, including the 50% deposit requirement.
              </span>
            </label>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 pt-1 sm:pt-2 shrink-0">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-full text-stone-400 hover:text-white font-medium text-xs sm:text-sm transition-colors text-center"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!policyAccepted}
                onClick={handleProceedToForm}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg ${
                  policyAccepted
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 hover:shadow-amber-500/25 active:scale-95 cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <span>Continue to Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: APPOINTMENT DETAILS FORM */}
        {step === 2 && (
          <form onSubmit={handleConfirmBooking} className="mt-4 sm:mt-6 space-y-4 sm:space-y-5 relative z-10 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Chioma Okeke"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  WhatsApp Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {/* Preferred Date */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Preferred Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                  Scheduled Time Slot (24/7 Available) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="bg-stone-900 text-white">
                        {time} {['08:00 PM', '10:00 PM'].includes(time) ? '(Late Night +₦20k)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Type */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Service Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setLocationType('salon')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    locationType === 'salon'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Salon Visit
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Lekki Phase I, Lagos</p>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationType('home')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    locationType === 'home'
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Home / Mobile
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Doorstep service</p>
                </button>
              </div>

              {locationType === 'home' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Enter your address in Lagos (e.g. Ikoyi, Victoria Island, Lekki)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                Special Requests or Hair/Nail Specifications (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra long length, blonde ombre ends, specific nail shape..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Deposit Calculation Summary Card */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-300 space-y-1">
              <div className="flex justify-between text-stone-300">
                <span>Total Service Price:</span>
                <span className="font-bold text-white">₦{service.price}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-bold text-sm pt-1 border-t border-white/10">
                <span>50% Required Deposit:</span>
                <span>₦{depositAmount.toLocaleString()}</span>
              </div>
              <p className="text-stone-400 text-[11px] pt-0.5">
                Providus Bank • 9642252198 • J BEAUTY STUDIO
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 shrink-0">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-stone-400 hover:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer"
              >
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Booking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: BOOKING CONFIRMATION & WHATSAPP DISPATCH */}
        {step === 3 && (
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 relative z-10 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {/* Success Banner */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-500/20 to-black/60 border border-amber-500/40 text-center space-y-1.5 sm:space-y-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Booking Initiated!</h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-md mx-auto">
                Reference Code: <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">{bookingRef}</span>
              </p>
              <p className="text-stone-400 text-[11px] sm:text-xs">
                Send your booking summary and proof of deposit to our official WhatsApp to lock in your appointment.
              </p>
            </div>

            {/* Outlined Booking Summary */}
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-stone-400">Client Name:</span>
                <span className="font-bold text-white">{clientName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-stone-400">Phone / WhatsApp:</span>
                <span className="font-bold text-white">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-stone-400">Service:</span>
                <span className="font-bold text-amber-400">{service.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-stone-400">Scheduled Date & Time:</span>
                <span className="font-bold text-white">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-stone-400">Location:</span>
                <span className="font-medium text-stone-200">
                  {locationType === 'salon' ? 'Salon (8b The Providence St, Lekki)' : `Home (${homeAddress || 'Lagos'})`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                <span className="text-stone-300 font-semibold">50% Deposit Due:</span>
                <span className="font-bold text-amber-400">₦{depositAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Primary Action: Send to WhatsApp */}
            <div className="space-y-2.5 sm:space-y-3 shrink-0">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 sm:gap-3 shadow-xl hover:shadow-green-500/25 transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white shrink-0" />
                <span className="truncate">Send Booking to WhatsApp (+234 704 100 8039)</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80 shrink-0" />
              </button>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
