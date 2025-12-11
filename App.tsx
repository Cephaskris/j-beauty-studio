import React, { useState, useRef, useEffect } from 'react';
import { Star, MapPin, Phone, Mic, ArrowUpRight, Sparkles, CheckCircle2, User, Play, Pause, Quote, Lock } from 'lucide-react';
import VoiceWidget from './components/VoiceWidget';
import AdminPanel from './components/AdminPanel';
import { useLiveApi } from './hooks/use-live-api';

// --- Sub-Components ---

const AboutSection = () => (
  <section id="about" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
           {/* Decorative Image Frame */}
           <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
              {/* Image updated to match the Arched Mirrors / White & Gold Salon reference */}
              <img 
                src="https://ik.imagekit.io/tmuciohgs/Screenshot%202025-12-11%20at%202.35.35%20PM.png" 
                alt="J-Beauty Salon Interior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                <p className="text-white text-lg font-medium leading-relaxed">
                  "Beauty is not just about looking good, it's about feeling your best self."
                </p>
              </div>
           </div>
           
           {/* Abstract Decorative Element */}
           <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl"></div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-amber-600 font-medium tracking-wider uppercase text-sm mb-2 block">Who We Are</span>
          <h2 className="text-4xl lg:text-5xl font-medium text-stone-900 mb-8 tracking-tight leading-[1.1]">
            Redefining Luxury <br/> in the Heart of Lekki.
          </h2>
          <p className="text-stone-500 text-lg leading-relaxed mb-6">
            Welcome to <span className="text-stone-900 font-medium">J-Beauty Studio</span>. We are more than just a salon; we are a sanctuary for the modern woman. Located in the vibrant Lekki Phase I, we bring international standards of beauty care to Lagos.
          </p>
          <p className="text-stone-500 text-lg leading-relaxed mb-10">
            From precision hair styling to therapeutic pedicures, our mission is to provide an immersive experience where you can unwind, rejuvenate, and leave feeling like the best version of yourself. We are proud to be <span className="font-semibold text-stone-800">open 24 hours a day, 7 days a week</span>, ensuring you can glow on your own schedule.
          </p>
          
          <div className="grid grid-cols-2 gap-8 border-t border-stone-100 pt-8">
             <div>
                <h4 className="text-3xl font-bold text-stone-900 mb-1">500+</h4>
                <p className="text-stone-400 text-sm">Happy Clients</p>
             </div>
             <div>
                <h4 className="text-3xl font-bold text-stone-900 mb-1">24/7</h4>
                <p className="text-stone-400 text-sm">Always Open</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesSection = () => (
  <section id="services" className="py-24 bg-stone-50">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <span className="text-amber-600 font-medium tracking-wider uppercase text-sm mb-2 block">Our Menu</span>
                <h2 className="text-4xl lg:text-5xl font-medium text-stone-900 mb-4 tracking-tight">Curated Services</h2>
                <p className="text-stone-500 text-lg">Full glam for the Lagos babe.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-stone-900 font-medium hover:text-amber-600 transition-colors">
                View Full Menu <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { title: "Hair Braiding", desc: "Knotless, box braids, cornrows - neat and painless styling." },
                { title: "Lash Extensions", desc: "Classic, Hybrid, or Volume sets for that perfect flutter." },
                { title: "Nails", desc: "Gel polish, acrylics, and biab overlay designs." },
                { title: "Pedicure", desc: "Relaxing spa pedicure and foot treatment." },
                { title: "Makeup", desc: "Owambe glam, bridal, or soft natural beats." },
                { title: "Hair Styling", desc: "Wig installation, silk press, and revamping." }
            ].map((s, i) => (
                <div key={i} className="group p-8 rounded-[2rem] bg-white hover:bg-black hover:text-white transition-all duration-300 border border-stone-100 hover:border-black hover:-translate-y-1 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                              <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-900 group-hover:bg-white/10 group-hover:text-white flex items-center justify-center font-serif font-bold transition-colors">
                                {i+1}
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-medium mb-3">{s.title}</h3>
                        <p className="text-stone-500 group-hover:text-stone-400 text-base leading-relaxed">{s.desc}</p>
                    </div>
                    
                    <div className="mt-8 flex items-center gap-2 text-sm font-medium text-amber-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Book Service <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  </section>
);

const HowToBookSection = ({ onOpenAgent }: { onOpenAgent: () => void }) => (
  <section id="how-to-book" className="py-24 bg-white relative overflow-hidden">
     {/* Background Decor */}
     <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/50 -skew-x-12 translate-x-32 -z-0"></div>

     <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-600 font-medium tracking-wider uppercase text-sm mb-2 block">Seamless Experience</span>
            <h2 className="text-4xl lg:text-5xl font-medium text-stone-900 mb-6 tracking-tight">Booking made effortless.</h2>
            <p className="text-stone-500 text-lg">
                Forget the forms and phone tags. Our AI receptionist, Amara, handles your schedule instantly.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-stone-100 -z-10"></div>

            {[
                { 
                    icon: <Mic className="w-6 h-6 text-white" />, 
                    title: "Tap to Call", 
                    desc: "Click the 'Free Call' button anywhere on the site to launch the voice agent." 
                },
                { 
                    icon: <User className="w-6 h-6 text-white" />, 
                    title: "Speak with Amara", 
                    desc: "Tell her what you want. 'I need goddess braids on Friday at 2pm'." 
                },
                { 
                    icon: <CheckCircle2 className="w-6 h-6 text-white" />, 
                    title: "Instant Confirmation", 
                    desc: "Amara checks the calendar and books your slot immediately. No waiting." 
                }
            ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center mb-6 shadow-xl relative ring-8 ring-white">
                        {step.icon}
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                            {i+1}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
                    <p className="text-stone-500 leading-relaxed max-w-xs">{step.desc}</p>
                </div>
            ))}
        </div>

        <div className="mt-16 text-center">
            <button 
                onClick={onOpenAgent}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-1"
            >
                <Mic className="w-5 h-5" />
                Try it now with Amara
            </button>
        </div>
     </div>
  </section>
);

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 bg-stone-900 text-white relative overflow-hidden">
     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
     
     <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
                <span className="text-amber-500 font-medium tracking-wider uppercase text-sm mb-2 block">Testimonials</span>
                <h2 className="text-4xl lg:text-5xl font-medium text-white mb-4 tracking-tight">Lagos Babes Love Us</h2>
            </div>
            <div className="flex gap-1">
               {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {[
                { name: "Chioma Okeke", role: "Lekki Phase I", text: "I did my knotless braids here and it was so neat! The ambiance is top tier. Definitely my new spot." },
                { name: "Zainab Ahmed", role: "Victoria Island", text: "The pedicure service is to die for. Amara (the voice bot) made booking so easy, I was shocked!" },
                { name: "Tolu Oniru", role: "Ikoyi", text: "Finally a salon that keeps to time. My makeup for my birthday shoot was flawless. 10/10 recommend." }
            ].map((t, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <Quote className="w-8 h-8 text-amber-500 mb-6 opacity-50" />
                    <p className="text-white/80 text-lg leading-relaxed mb-8">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-stone-900 font-bold text-lg">
                            {t.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{t.name}</h4>
                            <p className="text-white/40 text-sm">{t.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
     </div>
  </section>
);

// --- Main App Component ---

export default function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const api = useLiveApi();

  const handleStartAgent = () => {
    setIsWidgetOpen(true);
    api.connect();
  };

  const handleCloseAgent = () => {
    api.disconnect();
    setIsWidgetOpen(false);
  };

  return (
    <div className="min-h-screen font-sans bg-stone-50 selection:bg-amber-500 selection:text-white scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <div id="hero" className="p-4 md:p-6 lg:p-8">
        <div className="relative w-full h-[850px] lg:h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black">
          
          {/* Background Video Iframe */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <iframe 
                src="https://streamable.com/e/nm9imi?autoplay=1&muted=1&loop=1&background=1" 
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 object-cover scale-125"
                allow="autoplay; fullscreen"
                style={{ border: 'none' }}
                title="J-Beauty Background"
            ></iframe>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 h-full flex flex-col max-w-[1600px] mx-auto px-6 md:px-12 pt-8 pb-12">
            
            {/* Navbar */}
            <nav className="flex justify-between items-center mb-16 lg:mb-24">
              <div className="flex items-center gap-2">
                 <img 
                  src="https://placehold.co/180x60/transparent/fbbf24?text=J+Beauty+Studio&font=playfair-display" 
                  alt="J-Beauty Studio" 
                  className="h-10 w-auto object-contain drop-shadow-md" 
                />
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
                <a href="#hero" className="hover:text-amber-400 transition-colors">Home</a>
                <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
                <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
                <a href="#how-to-book" className="hover:text-amber-400 transition-colors">How to Book</a>
              </div>

              <button 
                onClick={handleStartAgent}
                className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-sm font-medium hover:bg-white hover:text-stone-900 transition-all duration-300"
              >
                <span>Book Now</span>
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
            </nav>

            {/* Hero Main Content */}
            <div className="flex-1 grid lg:grid-cols-12 gap-8 items-end lg:items-center">
              
              {/* Left Column: Typography */}
              <div className="lg:col-span-7 flex flex-col justify-center h-full pb-12 lg:pb-0">
                <div className="flex items-center gap-3 text-white/80 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium tracking-wide">We invite you to care about the aesthetics of your look</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-[1.1] mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                  Glow Different. <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">Shine Forever.</span>
                </h1>

                <p className="lg:hidden text-white/70 text-lg leading-relaxed max-w-lg">
                  We are committed to providing exceptional beauty services. From lashes to braids, we bring the Lekki luxury vibe.
                </p>
              </div>

              {/* Right Column: Glass Cards */}
              <div className="lg:col-span-5 relative h-full w-full flex flex-col justify-end lg:justify-center items-end">
                
                {/* Floating Profile Card */}
                <div className="hidden lg:block absolute top-12 right-0 w-48 p-4 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 text-center animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 p-[2px] mx-auto mb-3">
                       <div className="w-full h-full rounded-full bg-stone-800 overflow-hidden">
                          <img src="https://placehold.co/100x100/d97706/white?text=A" alt="Amara" className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full mb-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                       <span className="text-[10px] text-white font-medium uppercase tracking-wider">Online</span>
                    </div>
                    <p className="text-white text-sm font-medium">Amara</p>
                    <p className="text-white/50 text-xs mb-4">Your AI Assistant</p>
                </div>

                {/* Main Call to Action Card */}
                <div className="relative w-full lg:w-[420px] lg:-ml-24 lg:mb-24 p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 hover:bg-white/15 transition-colors">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <h3 className="text-3xl font-medium text-white mb-4">Voice Booking.</h3>
                  <p className="text-white/70 leading-relaxed mb-8 text-sm md:text-base">
                    Skip the typing. Talk to Amara, our AI receptionist, to check availability and book your session instantly.
                  </p>
                  
                  <button 
                    onClick={handleStartAgent}
                    className="w-full py-4 bg-white text-stone-900 rounded-full font-bold text-base flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group"
                  >
                    <Mic className="w-5 h-5 text-amber-600" />
                    <span>Free call to book session</span>
                  </button>
                </div>

              </div>
            </div>
            
            {/* Desktop Bottom Text */}
            <div className="hidden lg:block max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
               <p className="text-white/60 text-sm leading-relaxed">
                  We are committed to providing exceptional beauty services to our clients. Our team of highly skilled and experienced stylists are dedicated to ensuring your beauty and well-being.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ABOUT US SECTION */}
      <AboutSection />

      {/* 3. OUR SERVICES SECTION */}
      <ServicesSection />

      {/* 4. HOW TO BOOK SECTION */}
      <HowToBookSection onOpenAgent={handleStartAgent} />

      {/* 5. TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* 6. FOOTER SECTION */}
      <footer id="footer" className="bg-black text-white py-16 border-t border-white/10">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
             <div className="grid md:grid-cols-4 gap-12 mb-12">
                 <div className="col-span-1 md:col-span-2">
                    <img 
                      src="https://placehold.co/180x60/transparent/fbbf24?text=J+Beauty+Studio&font=playfair-display" 
                      alt="J-Beauty Studio" 
                      className="h-10 w-auto object-contain mb-6" 
                    />
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                        The ultimate beauty destination in Lekki. Merging technology with luxury to provide seamless bookings and exceptional service.
                    </p>
                 </div>
                 
                 <div>
                     <h4 className="font-bold text-white mb-6">Quick Links</h4>
                     <ul className="space-y-4 text-sm text-white/60">
                         <li><a href="#about" className="hover:text-amber-500 transition-colors">About Us</a></li>
                         <li><a href="#services" className="hover:text-amber-500 transition-colors">Services</a></li>
                         <li><a href="#testimonials" className="hover:text-amber-500 transition-colors">Testimonials</a></li>
                         <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                     </ul>
                 </div>

                 <div>
                     <h4 className="font-bold text-white mb-6">Contact</h4>
                     <ul className="space-y-4 text-sm text-white/60">
                         <li className="flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-amber-500" />
                             8b The Providence St, Lekki Phase I
                         </li>
                         <li className="flex items-center gap-2">
                             <Phone className="w-4 h-4 text-amber-500" />
                             0916 990 0888
                         </li>
                     </ul>
                 </div>
             </div>
             
             <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                 <p className="text-white/40 text-xs">© 2024 J-Beauty Studio. All rights reserved.</p>
                 <div className="flex items-center gap-6">
                     <button 
                       onClick={() => setIsAdminOpen(true)}
                       className="flex items-center gap-1 text-xs text-white/20 hover:text-white transition-colors"
                     >
                        <Lock className="w-3 h-3" /> Admin Login
                     </button>
                     <div className="flex gap-4">
                        {/* Social Placeholders */}
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                            <span className="font-bold text-xs">IG</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                            <span className="font-bold text-xs">TT</span>
                        </div>
                     </div>
                 </div>
             </div>
         </div>
      </footer>

      {/* Voice Assistant Widget Overlay */}
      <VoiceWidget isOpen={isWidgetOpen} onClose={handleCloseAgent} api={api} />
      
      {/* Admin Panel Overlay */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}