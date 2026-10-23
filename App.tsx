import React, { useState, useRef, useEffect } from 'react';
import { Star, MapPin, Phone, Mic, ArrowUpRight, Sparkles, CheckCircle2, User, Play, Pause, Quote, Lock, Instagram, Clock, Heart, Menu, X, ShieldCheck } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import { useAppContext } from './context/AppContext';
import VoiceWidget from './components/VoiceWidget';
import AdminPanel from './components/AdminPanel';
import { useLiveApi } from './hooks/use-live-api';
import PriceList from './components/PriceList';

// --- Sub-Components ---

const AboutSection = () => (
  <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          {/* Decorative Image Frame */}
          <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Image updated to match the Arched Mirrors / White & Gold Salon reference */}
            <img
              src="https://ik.imagekit.io/tmuciohgs/Screenshot%202025-12-11%20at%202.35.35%20PM.png"
              alt="J-Beauty Salon Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>

            {/* Floating Badge */}
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 bg-white/15 backdrop-blur-md border border-white/25 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg">
              <p className="text-white text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                "Beauty is not just about looking good, it's about feeling your best self."
              </p>
            </div>
          </div>

          {/* Abstract Decorative Element */}
          <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-amber-600 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Who We Are</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-900 mb-5 sm:mb-8 tracking-tight leading-[1.15]">
            Redefining Luxury <br /> in the Heart of Lekki.
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
            Welcome to <span className="text-stone-900 font-semibold">J-Beauty Studio</span>. We are more than just a salon; we are a sanctuary for the modern woman. Located in the vibrant Lekki Phase I, we bring international standards of beauty care to Lagos.
          </p>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            From precision hair styling to therapeutic pedicures, our mission is to provide an immersive experience where you can unwind, rejuvenate, and leave feeling like the best version of yourself. We are proud to be <span className="font-semibold text-stone-900">open 24 hours a day, 7 days a week</span>, ensuring you can glow on your own schedule.
          </p>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 border-t border-stone-100 pt-6 sm:pt-8">
            <div>
              <h4 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">500+</h4>
              <p className="text-stone-400 text-xs sm:text-sm">Happy Clients</p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-1">24/7</h4>
              <p className="text-stone-400 text-xs sm:text-sm">Always Open</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface ServiceItem {
  title: string;
  desc: string;
  image: string;
  duration: string;
  badge?: string;
  route: string;
  price: string;
  subPrice: string;
  imagePosition?: string;
}

const ServicesSection = ({ onOpenPriceList }: { onOpenPriceList: (category: string) => void }) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const services: ServiceItem[] = [
    {
      title: "Hair Braiding",
      desc: "Knotless, boho curls, cornrows & stitch braids - neat and painless styling.",
      image: "/assets/hair-braiding-service.jpg",
      duration: "3 - 5 HOURS",
      badge: "STITCH & BOHO",
      route: "Knotless → Boho Curls → Stitch Rows → Goddess → Box Braids",
      price: "from ₦35,000",
      subPrice: "~35k – 180k NGN • 24/7",
      imagePosition: "object-top"
    },
    {
      title: "Lash Extensions",
      desc: "Classic, Hybrid, or Volume sets for that perfect flutter.",
      image: "/assets/IMG_6594.JPG.jpeg",
      duration: "90 - 180 MINS",
      badge: "VOLUME & WISPY",
      route: "Classic → Hybrid → Volume → Mega Volume → Wispy",
      price: "from ₦20,000",
      subPrice: "~20k – 100k NGN • 24/7",
      imagePosition: "object-center"
    },
    {
      title: "Nails",
      desc: "Gel polish, acrylics, and biab overlay designs.",
      image: "/assets/IMG_6593.JPG.jpeg",
      duration: "60 - 180 MINS",
      badge: "ACRYLIC & BIAB",
      route: "Gel Polish → Acrylic Set → BIAB Overlay → Custom Art",
      price: "from ₦15,000",
      subPrice: "~15k – 90k NGN • 24/7",
      imagePosition: "object-center"
    },
    {
      title: "Makeup",
      desc: "Owambe glam, bridal, or soft natural beats.",
      image: "/assets/IMG_6591.JPG.jpeg",
      duration: "90 MINS - 4 HOURS",
      badge: "GLAM & BRIDAL",
      route: "Skin Prep → Soft Beat → Owambe Glam → Bridal Perfection",
      price: "from ₦30,000",
      subPrice: "~30k – 80k NGN • 24/7",
      imagePosition: "object-center"
    },
    {
      title: "Hair Styling",
      desc: "Wig installation, silk press, and revamping.",
      image: "/assets/IMG_6596.JPG.jpeg",
      duration: "2 - 3 HOURS",
      badge: "WIGS & REVAMP",
      route: "Frontal Melt → Custom Styling → Silk Press → Revamp",
      price: "from ₦25,000",
      subPrice: "~25k – 75k NGN • 24/7"
    },
    {
      title: "Hair Services",
      desc: "Professional hair washing and therapeutic hair treatments.",
      image: "/assets/IMG_6597.JPG.jpeg",
      duration: "45 - 90 MINS",
      badge: "WASH & THERAPY",
      route: "Scalp Detox → Deep Conditioning → Steam Therapy → Blowdry",
      price: "from ₦15,000",
      subPrice: "~15k – 45k NGN • 24/7"
    },
    {
      title: "Tattoo & Microblading",
      desc: "Premium home service tattoos and microblading ombre services.",
      image: "/assets/IMG_6598.JPG.jpeg",
      duration: "2 - 4 HOURS",
      badge: "SEMI-PERMANENT",
      route: "Ombré Brows → Soft Ombré → Microblading → Body Tattoo",
      price: "from ₦40,000",
      subPrice: "~40k – 150k NGN • 24/7"
    },
    {
      title: "Pedicure",
      desc: "Relaxing spa pedicure and foot treatment.",
      image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80",
      duration: "45 - 90 MINS",
      badge: "SPA WELLNESS",
      route: "Herbal Soak → Exfoliation → Callus Treatment → Massage → Gel Polish",
      price: "from ₦25,000",
      subPrice: "~25k – 60k NGN • 24/7"
    },
    {
      title: "Natural Nails Services",
      desc: "Strengthening, nail art, removal, and natural nail care treatments.",
      image: "/assets/j-beauty-studio-custom-nail-art.jpg",
      duration: "45 - 90 MINS",
      badge: "ORGANIC CARE",
      route: "Nail Health → Cuticle Care → Strengthening Overlay → Subtle Art",
      price: "from ₦15,000",
      subPrice: "~15k – 40k NGN • 24/7"
    },
    {
      title: "Home Services",
      desc: "Premium beauty services delivered to your doorstep in Lagos.",
      image: "/assets/IMG_6599.JPG.jpeg",
      duration: "VIP SERVICE",
      badge: "DOORSTEP LUXURY",
      route: "Lekki Phase I → Ikoyi → Victoria Island → Banana Island",
      price: "from ₦50,000",
      subPrice: "Any Service at Home • 24/7"
    }
  ];

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <span className="text-amber-600 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Our Menu</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-900 mb-2 sm:mb-4 tracking-tight">Curated Services</h2>
            <p className="text-stone-500 text-sm sm:text-base lg:text-lg">Full glam for the Lagos babe • Open 24/7.</p>
          </div>
          <button
            onClick={() => onOpenPriceList("Hair Braiding")}
            className="inline-flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-sm hover:text-amber-600 transition-colors self-start sm:self-auto cursor-pointer py-1"
          >
            <span>View Full Price List</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {services.map((s, i) => {
            const isFav = !!favorites[s.title];
            return (
              <div
                key={i}
                onClick={() => onOpenPriceList(s.title)}
                className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl lg:rounded-[2.2rem] p-3.5 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] border border-stone-200/70 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                {/* Top Image Frame (matches reference card) */}
                <div>
                  <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl lg:rounded-[1.6rem] overflow-hidden bg-stone-100">
                    <img
                      src={s.image}
                      alt={s.title}
                      className={`w-full h-full object-cover ${s.imagePosition || "object-center"} group-hover:scale-105 transition-transform duration-700 ease-out`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none"></div>

                    {/* Top-left Reference Duration Badge */}
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-10">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-sm">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 stroke-[2.5]" />
                        <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 tracking-wide uppercase">{s.duration}</span>
                      </div>
                    </div>

                    {/* Top-right Reference Heart Favorite Button */}
                    <button
                      type="button"
                      aria-label="Save to favorites"
                      onClick={(e) => toggleFavorite(s.title, e)}
                      className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/30 hover:bg-white backdrop-blur-md border border-white/40 flex items-center justify-center text-white hover:text-rose-500 transition-all duration-200 shadow-sm z-10 active:scale-90"
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>
                  </div>

                  {/* Title & Route (matches reference typography) */}
                  <div className="px-1.5 sm:px-2 pt-3.5 sm:pt-4">
                    <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-stone-500 text-xs sm:text-[13px] leading-relaxed mt-1.5 line-clamp-2">
                      <span className="font-semibold text-stone-700">Styles :</span> {s.route}
                    </p>
                  </div>
                </div>

                {/* Divider & Bottom Action Bar (matches reference bottom section) */}
                <div className="px-1.5 sm:px-2 pt-3.5 sm:pt-4 mt-auto">
                  <div className="border-t border-stone-100 mb-3 sm:mb-4"></div>
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPriceList(s.title);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-amber-500/25 transition-all shrink-0 cursor-pointer"
                    >
                      PRICE LIST
                    </button>

                    <div className="text-right min-w-0">
                      <div className="text-stone-900 font-extrabold text-sm sm:text-base lg:text-lg tracking-tight leading-none truncate">
                        {s.price}
                      </div>
                      <div className="text-stone-400 text-[10px] sm:text-[11px] font-medium leading-tight mt-1 truncate">
                        {s.subPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HowToBookSection = ({ onOpenAgent }: { onOpenAgent: () => void }) => (
  <section id="how-to-book" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
    {/* Background Decor */}
    <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/50 -skew-x-12 translate-x-32 -z-0 pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
        <span className="text-amber-600 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Seamless Experience</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-900 mb-4 sm:mb-6 tracking-tight">How to Book Your Appointment</h2>
        <p className="text-stone-500 text-base sm:text-lg">
          Securing your glow is just a few steps away!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
        {/* Connector Line - Hidden on mobile/tablet */}
        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-stone-100 -z-10"></div>

        {[
          {
            icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
            title: "1. Choose Your Service",
            desc: "Browse our service menu and select the treatment you’d like to book. Take note of the total price."
          },
          {
            icon: <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
            title: "2. Make Your Deposit",
            desc: "Secure your slot with a 50% deposit. Providus Bank • 9642252198 • J BEAUTY STUDIO."
          },
          {
            icon: <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
            title: "3. Send Proof",
            desc: "Send a screenshot of the transaction to our WhatsApp line: +234 704 100 8039."
          },
          {
            icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
            title: "4. Get Confirmation",
            desc: "We will verify your deposit and send a confirmation message with your appointment details."
          }
        ].map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl bg-stone-50/50 sm:bg-transparent">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-stone-900 flex items-center justify-center mb-4 sm:mb-6 shadow-xl shadow-stone-900/10 border-4 border-white relative z-0 shrink-0">
              {step.icon}
            </div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-stone-900 mb-2 sm:mb-3">{step.title}</h3>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 sm:mt-16 text-center">
        <button
          onClick={onOpenAgent}
          className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-amber-500 text-stone-950 font-bold rounded-full hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-1 text-sm sm:text-base cursor-pointer"
        >
          <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950" />
          <span>Try it now with J Beauty Studio</span>
        </button>
      </div>
    </div>
  </section>
);

const BookingPolicySection = () => (
  <section id="policy" className="py-16 sm:py-20 lg:py-24 bg-stone-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-amber-500 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Transparency & Excellence</span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white mb-4 tracking-tight">Studio Booking Policy</h2>
        <p className="text-stone-400 text-sm sm:text-base lg:text-lg">
          To provide an exceptional luxury experience and protect appointment schedules for all clients, please review our official studio and late-night booking guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Card 1: Official 16 Main Booking Policy Rules */}
        <div className="bg-stone-850/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Main Booking Policy</h3>
                  <p className="text-xs text-stone-400">Standard studio operations & client terms</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                16 Key Rules
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p><strong className="text-white">Booking & Deposit:</strong> Required a non-refundable deposit to secure appointment.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p><strong className="text-white">Appointments Confirmation:</strong> Appointments are only confirmed once payment/deposit is received.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p><strong className="text-white">50% Deposit:</strong> 50% deposit of total service price is required before any appointment can be confirmed.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p><strong className="text-white">Balance Payment:</strong> The remaining 50% balance must be paid on the day of your appointment before or after service.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                <p><strong className="text-white">Late Night Fee:</strong> Any appointment booked between 8:00 PM to 6:00 AM will attract an additional ₦20,000 late night appointment fee (separate from service price).</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">6</span>
                <p><strong className="text-white">Late Arrival:</strong> Grace period of 25 to 30 minutes. After that the appointment may be shortened, rescheduled, or cancelled.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">7</span>
                <p><strong className="text-white">Cancellations:</strong> Cancellation made less than 24 hours notice may result in the loss of the 50% booking deposit.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">8</span>
                <p><strong className="text-white">No-Shows:</strong> Will automatically forfeit their deposit. A new deposit will be required before any appointment (emergencies reviewed at studio discretion).</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">9</span>
                <p><strong className="text-white">Rescheduling:</strong> One rescheduled notice is only allowed; repeating rescheduling can require a new deposit.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">10</span>
                <p><strong className="text-white">Services Change:</strong> Client should communicate changes before appointment rather than expecting extra services during booking.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">11</span>
                <p><strong className="text-white">Children / Guests:</strong> Client can only bring 1 extra person only.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">12</span>
                <p><strong className="text-white">Home Service / VIP Bookings:</strong> Require full or large deposit because staff are dispatched down to the client.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">13</span>
                <p><strong className="text-white">Refunds:</strong> Deposits are strictly non-refundable.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">14</span>
                <p><strong className="text-white">Pricing:</strong> Prices can change, but price confirmed at booking will apply unless client changes service.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">15</span>
                <p><strong className="text-white">Respectful Behavior:</strong> Zero tolerance for abuse, harassment, argument, or disrespect towards staff.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">16</span>
                <p><strong className="text-white">Walk-Ins:</strong> Daytime walk-ins are always welcome.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Late-Night Booking Policy (8:00 PM - 6:00 AM) & Verification */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-stone-850/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-500/30 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Late-Night Policy</h3>
                  <p className="text-xs text-amber-300">Applicable between 8:00 PM and 6:00 AM</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                24/7 Service
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 mb-5 leading-relaxed">
              To provide the best experience for our clients and properly schedule our staff, the following policy applies to all appointments between <strong className="text-white">8:00 PM and 6:00 AM</strong>:
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">1.</span> Appointment Only
                </p>
                <p className="text-stone-400 text-xs">All services between 8:00 PM and 6:00 AM are strictly by appointment. Walk-ins will not be accepted during these hours.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">2.</span> 50% Deposit Required
                </p>
                <p className="text-stone-400 text-xs">A 50% deposit must be paid and confirmed before your late-night appointment is scheduled.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">3.</span> ₦20,000 Late-Night Fee
                </p>
                <p className="text-stone-400 text-xs">All appointments booked between 8:00 PM and 6:00 AM attract an additional ₦20,000 booking fee per appointment.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">4.</span> 24 Hours Cancellation Notice
                </p>
                <p className="text-stone-400 text-xs">Clients must provide at least 24 hours' notice to cancel or reschedule; otherwise deposit is forfeited.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">5.</span> Punctuality Strictly Enforced
                </p>
                <p className="text-stone-400 text-xs">Clients are expected to arrive on time. Late arrival may affect service duration, lead to cancellation, or incur additional charges.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">6.</span> No-Show Policy
                </p>
                <p className="text-stone-400 text-xs">Failing to show up for a confirmed late-night slot forfeits deposit; a new deposit is required to rebook.</p>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-amber-400">7.</span> Late-Night Home Service
                </p>
                <p className="text-stone-400 text-xs">Late-night home service appointments are subject to the applicable late-night fee and must be booked in advance.</p>
              </div>
            </div>
          </div>

          {/* Official Bank Details & Address */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">Official Payment & Studio Verification</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-black/50 rounded-xl border border-white/5">
                <p className="text-stone-400 text-[10px] uppercase font-bold">Bank Account (50% Deposit)</p>
                <p className="text-sm font-mono text-white font-bold mt-0.5">9642252198</p>
                <p className="text-stone-400 text-[11px]">Providus Bank • J BEAUTY STUDIO</p>
              </div>
              <div className="p-3 bg-black/50 rounded-xl border border-white/5">
                <p className="text-stone-400 text-[10px] uppercase font-bold">WhatsApp Proof & Inquiries</p>
                <p className="text-sm font-mono text-white font-bold mt-0.5">+234 704 100 8039</p>
                <p className="text-stone-400 text-[11px]">Send receipt screenshot here</p>
              </div>
            </div>
            <p className="text-stone-400 text-[11px] mt-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>8B Providence Road, Lekki Town Square Mall, Lekki Phase 1, Lagos.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-stone-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 gap-4 sm:gap-6">
        <div>
          <span className="text-amber-500 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-2 sm:mb-4 tracking-tight">Lagos Babes Love Us</h2>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {[
          { name: "Chioma Okeke", role: "Lekki Phase I", text: "I did my knotless braids here and it was so neat! The ambiance is top tier. Definitely my new spot." },
          { name: "Zainab Ahmed", role: "Victoria Island", text: "The pedicure service is to die for. J Beauty Studio (the voice bot) made booking so easy, I was shocked!" },
          { name: "Tolu Oniru", role: "Ikoyi", text: "Finally a salon that keeps to time. My makeup for my birthday shoot was flawless. 10/10 recommend." }
        ].map((t, i) => (
          <div key={i} className="p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mb-4 sm:mb-6 opacity-50" />
            <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">"{t.text}"</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-stone-900 font-bold text-base sm:text-lg shrink-0">
                {t.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">{t.name}</h4>
                <p className="text-white/40 text-xs sm:text-sm">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section id="gallery" className="py-16 sm:py-20 lg:py-24 bg-stone-50 overflow-hidden">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-16 gap-4 sm:gap-6">
        <div>
          <span className="text-amber-600 font-semibold tracking-wider uppercase text-xs sm:text-sm mb-2 block">Our Portfolio</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-900 mb-2 sm:mb-4 tracking-tight">Real Results by J Beauty</h2>
          <p className="text-stone-500 text-sm sm:text-base lg:text-lg max-w-xl">
            Explore our latest transformations. Each look is crafted to perfection.
          </p>
        </div>
        <a
          href="https://www.instagram.com/jbeautystudio2_/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-stone-900 text-white rounded-full font-medium text-sm sm:text-base hover:bg-amber-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 self-start sm:self-auto"
        >
          <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>View More on Instagram</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Column 1 */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="group relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden aspect-[1080/1350] shadow-sm hover:shadow-2xl transition-all duration-500">
            <img
              src="/assets/j-beauty-studio-bob-wig-style.jpg"
              alt="Bob Wig Style"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden aspect-[1080/1350] shadow-sm hover:shadow-2xl transition-all duration-500">
            <img
              src="/assets/j-beauty-studio-custom-nail-art.jpg"
              alt="Custom Nail Art"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
          </div>
        </div>

        {/* Column 2 - Offset Top on large screens */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:mt-16">
          <div className="group relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden aspect-[1080/1350] shadow-sm hover:shadow-2xl transition-all duration-500">
            <img
              src="/assets/j-beauty-studio-blonde-wig-installation.jpg"
              alt="Blonde Wig Installation"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
          </div>
          <div className="group relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden aspect-[1080/1350] shadow-sm hover:shadow-2xl transition-all duration-500">
            <img
              src="/assets/j-beauty-studio-glam-makeup-ponytail.jpg"
              alt="Glam Makeup"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6 sm:gap-8 sm:col-span-2 lg:col-span-1">
          <div className="group relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden aspect-[1080/1350] shadow-sm hover:shadow-2xl transition-all duration-500">
            <img
              src="/assets/j-beauty-studio-knotless-braids-back-view.jpg"
              alt="Knotless Braids"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
          </div>

          {/* Decorative / CTA Block */}
          <div 
            onClick={() => {
              const el = document.getElementById('services');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden aspect-[4/3] sm:aspect-[1080/1350] bg-stone-900 flex items-center justify-center p-6 sm:p-8 lg:p-12 text-center shadow-2xl cursor-pointer group"
          >
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-amber-500 mx-auto mb-3 sm:mb-6" />
              <h3 className="text-2xl sm:text-3xl font-medium text-white mb-2 sm:mb-4">Your Turn to Glow</h3>
              <p className="text-white/60 mb-5 sm:mb-8 text-xs sm:text-sm md:text-base max-w-xs mx-auto">Ready for your transformation? Book your appointment today.</p>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white text-stone-900 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            {/* Abstract BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

// --- Main App Component ---

export default function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { logout } = useAppContext();
  const api = useLiveApi();

  const handleStartAgent = () => {
    setIsWidgetOpen(true);
    setIsMobileNavOpen(false);
    api.connect();
  };

  const handleCloseAgent = () => {
    api.disconnect();
    setIsWidgetOpen(false);
  };

  // Ensure page always starts from the hero section when opened or refreshed
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Clear any initial hash so the browser doesn't automatically jump past the hero
    if (window.location.hash && window.location.hash !== '#hero') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const scrollToHero = () => {
      window.scrollTo(0, 0);
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    };

    scrollToHero();
    requestAnimationFrame(scrollToHero);
    const t1 = setTimeout(scrollToHero, 50);
    const t2 = setTimeout(scrollToHero, 150);
    const t3 = setTimeout(scrollToHero, 300);

    const handlePageShow = () => {
      scrollToHero();
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans bg-stone-50 selection:bg-amber-500 selection:text-white scroll-smooth w-full overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <div id="hero" className="p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="relative w-full min-h-[92vh] sm:min-h-[820px] lg:h-[90vh] lg:min-h-[700px] rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl bg-black flex flex-col justify-between">

          {/* Background Video Iframe */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <iframe
              src="https://streamable.com/e/nm9imi?autoplay=1&muted=1&loop=1&background=1"
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 object-cover scale-125"
              allow="autoplay; fullscreen"
              style={{ border: 'none' }}
              title="J-Beauty Background"
            ></iframe>
            <div className="absolute inset-0 bg-black/45"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35"></div>
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 h-full flex flex-col justify-between max-w-[1600px] w-full mx-auto px-4 sm:px-8 md:px-12 pt-5 sm:pt-8 pb-6 sm:pb-10">

            {/* Navbar */}
            <nav className="flex justify-between items-center mb-6 sm:mb-10 lg:mb-12 relative z-30">
              <a href="#hero" className="flex items-center gap-2 group cursor-pointer">
                <div className="flex flex-col leading-none select-none">
                  <span className="font-serif text-2xl sm:text-3xl italic text-amber-400 tracking-wide font-medium group-hover:text-amber-300 transition-colors">J Beauty</span>
                  <span className="font-sans text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.3em] text-amber-500 font-bold uppercase mt-0.5 sm:mt-1">Studio</span>
                </div>
              </a>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-white/90">
                <a href="#hero" className="hover:text-amber-400 transition-colors">Home</a>
                <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
                <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
                <a href="#how-to-book" className="hover:text-amber-400 transition-colors">How to Book</a>
                <a href="#policy" className="hover:text-amber-400 transition-colors">Policy</a>
                <a href="#gallery" className="hover:text-amber-400 transition-colors">Gallery</a>
                <a href="#testimonials" className="hover:text-amber-400 transition-colors">Testimonials</a>
              </div>

              {/* Action Buttons & Mobile Hamburger */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="#services"
                  className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-medium hover:bg-white hover:text-stone-900 transition-all duration-300"
                >
                  <span>Book Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-45 transition-transform" />
                </a>

                {/* Mobile Menu Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                  className="md:hidden p-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </nav>

            {/* Mobile Navigation Dropdown Drawer */}
            {isMobileNavOpen && (
              <div className="md:hidden absolute top-20 left-4 right-4 z-40 bg-stone-900/95 backdrop-blur-2xl border border-amber-500/30 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col space-y-3.5 text-center font-medium text-white/90 pb-4 border-b border-white/10">
                  <a
                    href="#hero"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    Home
                  </a>
                  <a
                    href="#about"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    About Us
                  </a>
                  <a
                    href="#services"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    Our Services
                  </a>
                  <a
                    href="#how-to-book"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    How to Book
                  </a>
                  <a
                    href="#policy"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    Booking Policy
                  </a>
                  <a
                    href="#gallery"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    Client Portfolio
                  </a>
                  <a
                    href="#testimonials"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="py-1 hover:text-amber-400 transition-colors text-base"
                  >
                    Testimonials
                  </a>
                </div>

                <div className="pt-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleStartAgent}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Mic className="w-4 h-4 text-stone-950" />
                    <span>Free Voice Call with J-Beauty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      setSelectedCategory("Hair Braiding");
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors border border-white/10 text-center"
                  >
                    View Complete Price List
                  </button>
                </div>
              </div>
            )}

            {/* Hero Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2 sm:py-6">

              {/* Left Column: Typography */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 sm:gap-3 text-white/90 mb-3 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium tracking-wide">We invite you to care about the aesthetics of your look</span>
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white tracking-tight leading-[1.12] mb-3 sm:mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                  Glow Different. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-white">Shine Forever.</span>
                </h1>

                <p className="text-white/80 text-xs sm:text-base lg:text-lg leading-relaxed max-w-lg mb-4 sm:mb-6 lg:mb-0">
                  We are committed to providing exceptional beauty services. From lashes to braids, we bring international luxury to Lekki Phase I.
                </p>
              </div>

              {/* Right Column: Glass Cards */}
              <div className="lg:col-span-5 relative w-full flex flex-col justify-center items-center lg:items-end">

                {/* Floating Profile Card - Desktop only */}
                <div className="hidden lg:block absolute -top-16 right-0 w-48 p-4 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 text-center animate-in fade-in zoom-in duration-1000 delay-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 p-[2px] mx-auto mb-2.5">
                    <div className="w-full h-full rounded-full bg-stone-800 overflow-hidden flex items-center justify-center font-serif text-amber-400 font-bold text-lg">
                      JB
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-[10px] text-white font-medium uppercase tracking-wider">Online 24/7</span>
                  </div>
                  <p className="text-white text-sm font-medium">J Beauty Studio</p>
                  <p className="text-white/50 text-xs">Your AI Assistant</p>
                </div>

                {/* Main Call to Action Card */}
                <div className="relative w-full max-w-md lg:max-w-[420px] lg:-ml-12 xl:-ml-24 p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 hover:bg-white/15 transition-colors">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"></div>

                  <h3 className="text-2xl sm:text-3xl font-medium text-white mb-2 sm:mb-3">Voice Booking.</h3>
                  <p className="text-white/80 leading-relaxed mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">
                    Skip the typing. Talk to J Beauty Studio, our AI receptionist, to check availability and book your session instantly.
                  </p>

                  <button
                    onClick={handleStartAgent}
                    className="w-full py-3 sm:py-4 px-4 bg-white text-stone-900 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 sm:gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group cursor-pointer"
                  >
                    <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                    <span>Free call to book session</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Desktop Bottom Text */}
            <div className="hidden lg:block max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                We are committed to providing exceptional beauty services to our clients. Our team of highly skilled and experienced stylists are dedicated to ensuring your beauty and well-being.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT US SECTION */}
      <AboutSection />

      {/* 3. OUR SERVICES SECTION */}
      <ServicesSection onOpenPriceList={(category) => setSelectedCategory(category)} />

      {/* 4. HOW TO BOOK SECTION */}
      <HowToBookSection onOpenAgent={handleStartAgent} />

      {/* 4.5. OFFICIAL BOOKING POLICY SECTION */}
      <BookingPolicySection />

      {/* 5. GALLERY SECTION */}
      <GallerySection />

      {/* 5. TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* 6. FOOTER SECTION */}
      <footer id="footer" className="bg-black text-white py-12 sm:py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 sm:mb-12">
            <div className="sm:col-span-2">
              <div className="flex flex-col items-start leading-none select-none mb-4 sm:mb-6">
                <span className="font-serif text-2xl sm:text-3xl italic text-amber-500 tracking-wide font-medium">J Beauty</span>
                <span className="font-sans text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.3em] text-amber-600 font-bold uppercase mt-1">Studio</span>
              </div>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-sm">
                The ultimate beauty destination in Lekki. Merging technology with luxury to provide seamless bookings and exceptional service.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/60">
                <li><a href="#about" className="hover:text-amber-500 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-amber-500 transition-colors">Services</a></li>
                <li><a href="#policy" className="hover:text-amber-500 transition-colors">Booking Policy</a></li>
                <li><a href="#gallery" className="hover:text-amber-500 transition-colors">Gallery</a></li>
                <li><a href="#testimonials" className="hover:text-amber-500 transition-colors">Testimonials</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-6 text-sm sm:text-base">Contact & Location</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>8b The Providence St, Lekki Phase I, Lagos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <a href="tel:07041008039" className="hover:text-amber-400 transition-colors">0704 100 8039</a>
                </li>
                <li className="flex items-center gap-2 text-stone-400">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Open 24 Hours / 7 Days</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4 items-center text-white/40 text-xs">
              <p>© 2024 J-Beauty Studio. All rights reserved.</p>
              <span className="hidden sm:block text-white/20">|</span>
              <p>Designed By <a href="https://primbeav.com.ng" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Primbeav Services</a></p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors cursor-pointer py-1"
              >
                <Lock className="w-3.5 h-3.5" /> Admin Login
              </button>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="https://www.instagram.com/jbeautystudio2_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer text-white"
                  aria-label="Instagram"
                >
                  <span className="font-bold text-xs">IG</span>
                </a>
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer text-white"
                  aria-label="TikTok"
                >
                  <span className="font-bold text-xs">TT</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Voice Assistant Widget Overlay */}
      <VoiceWidget isOpen={isWidgetOpen} onClose={handleCloseAgent} api={api} />

      {/* Admin Panel Overlay */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          logout();
          setIsAdminOpen(false);
        }}
      />

      {/* Price List Overlay */}
      {selectedCategory && (
        <PriceList category={selectedCategory} onClose={() => setSelectedCategory(null)} />
      )}

      <Analytics />
    </div>
  );
}