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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif italic text-amber-500 font-bold text-xl">J Beauty</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {step === 1 ? 'Step 1 of 3: Policy' : step === 2 ? 'Step 2 of 3: Details' : 'Step 3 of 3: Complete'}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {step === 1 && 'Booking & Privacy Policy'}
              {step === 2 && 'Schedule Your Appointment'}
              {step === 3 && 'Booking Confirmed!'}
            </h2>
          </div>

          <button
            onClick={handleModalClose}
            aria-label="Close booking modal"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
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

        {/* STEP 1: BOOKING PRIVACY POLICY */}
        {step === 1 && (
          <div className="mt-6 space-y-6 relative z-10">
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar text-sm leading-relaxed text-stone-300">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <h4>1. 50% Commitment Deposit</h4>
                </div>
                <p>
                  To secure your scheduled salon or home session, a <span className="text-white font-semibold">50% non-refundable deposit</span> is required at the time of booking. The remaining balance is payable upon completion of your service.
                </p>
                <div className="p-3 bg-white/5 rounded-xl text-xs space-y-1 text-stone-300">
                  <p><span className="text-amber-300 font-medium">Bank:</span> Providus Bank</p>
                  <p><span className="text-amber-300 font-medium">Account Number:</span> 9642252198</p>
                  <p><span className="text-amber-300 font-medium">Account Name:</span> J BEAUTY STUDIO</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Clock className="w-5 h-5" />
                  <h4>2. 24/7 Hours & Late-Night Charge</h4>
                </div>
                <p>
                  We are proudly open 24/7. An additional <span className="text-white font-semibold">₦20,000 extra charge</span> applies to appointments booked during late-night hours between <span className="text-amber-300">8:00 PM and 6:00 AM</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertCircle className="w-5 h-5" />
                  <h4>3. Punctuality & Grace Period</h4>
                </div>
                <p>
                  Please arrive 10–15 minutes early. A grace period of 15 minutes is allowed. Late arrivals exceeding 20 minutes may be rescheduled to ensure other clients are not delayed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-5 h-5" />
                  <h4>4. Privacy & Personal Information</h4>
                </div>
                <p>
                  Your personal information (name, phone number, and appointment details) is strictly confidential. We only use your information to coordinate your booking, provide appointment confirmations, and dispatch stylists.
                </p>
              </div>
            </div>

            {/* Checkbox Agreement */}
            <label className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-colors">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 focus:ring-offset-stone-900 cursor-pointer"
              />
              <span className="text-sm text-stone-200">
                I have read, understood, and agree to the <span className="text-amber-400 font-semibold">J-Beauty Studio Booking Policy & Terms</span>, including the 50% deposit requirement.
              </span>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-6 py-3 rounded-full text-stone-400 hover:text-white font-medium text-sm transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!policyAccepted}
                onClick={handleProceedToForm}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg ${
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
          <form onSubmit={handleConfirmBooking} className="mt-6 space-y-5 relative z-10">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                  Scheduled Time Slot (24/7 Available) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
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
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                Service Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocationType('salon')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    locationType === 'salon'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Salon Visit
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">Lekki Phase I, Lagos</p>
                </button>

                <button
                  type="button"
                  onClick={() => setLocationType('home')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    locationType === 'home'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Home / Mobile
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">Doorstep service</p>
                </button>
              </div>

              {locationType === 'home' && (
                <div className="mt-3">
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
              <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                Special Requests or Hair/Nail Specifications (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Extra long length, blonde ombre ends, specific nail shape..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Deposit Calculation Summary Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-300 space-y-1.5">
              <div className="flex justify-between text-stone-300">
                <span>Total Service Price:</span>
                <span className="font-bold text-white">₦{service.price}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-bold text-sm pt-1 border-t border-white/10">
                <span>50% Required Deposit:</span>
                <span>₦{depositAmount.toLocaleString()}</span>
              </div>
              <p className="text-stone-400 text-[11px] pt-1">
                Providus Bank • 9642252198 • J BEAUTY STUDIO
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-5 py-3 rounded-full text-stone-400 hover:text-white font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-amber-500/25 active:scale-95 cursor-pointer"
              >
                <span>{isSubmitting ? 'Confirming...' : 'Confirm Booking'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: BOOKING CONFIRMATION & WHATSAPP DISPATCH */}
        {step === 3 && (
          <div className="mt-6 space-y-6 relative z-10">
            {/* Success Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-black/60 border border-amber-500/40 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Booking Initiated!</h3>
              <p className="text-stone-300 text-sm max-w-md mx-auto">
                Reference Code: <span className="font-mono font-bold text-amber-400 text-base">{bookingRef}</span>
              </p>
              <p className="text-stone-400 text-xs">
                Send your booking summary and proof of deposit to our official WhatsApp to lock in your appointment.
              </p>
            </div>

            {/* Outlined Booking Summary (as requested) */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-sm">
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
              <div className="flex justify-between items-center pt-1 text-base">
                <span className="text-stone-300 font-semibold">50% Deposit Due:</span>
                <span className="font-bold text-amber-400">₦{depositAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Primary Action: Send to WhatsApp */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-green-500/25 transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 fill-white" />
                <span>Send Booking to WhatsApp (+234 704 100 8039)</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-white/10"
                >
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center transition-colors border border-white/10"
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
