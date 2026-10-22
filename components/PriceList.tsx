import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, MessageCircle } from 'lucide-react';
import BookingModal, { BookingServiceData } from './BookingModal';

interface PriceListProps {
    onClose: () => void;
    category?: string | null;
}

const PriceList: React.FC<PriceListProps> = ({ onClose, category }) => {
    const servicesData: Record<string, { title: string; items: { name: string; price?: string; isHeader?: boolean; desc?: string }[] }> = {
        "Hair Braiding": {
            title: "Hair Braiding Price List",
            items: [
                { name: "Boho Braids (With Curls)", price: "180,000", desc: "5-6 hours" },
                { name: "Goddess Braids", price: "150,000", desc: "5 hours" },
                { name: "Knotless B. Braids/ Twist small", price: "130,000", desc: "5 hours" },
                { name: "Medium", price: "120,000", desc: "4 hours" },
                { name: "Large", price: "100,000", desc: "3-4 hours" },
                { name: "Traditional Box Braids", price: "120,000", desc: "4-5 hours" },
                { name: "Lemonade Braids", price: "120,000", desc: "4-5 hours" },
                { name: "Ghana Braids", price: "80,000", desc: "4 hours" },
                { name: "Stitch Braids", price: "80,000", desc: "3-4 hours (Actual time depends on hairstyle)" },
                { name: "Micro Braids", price: "60,000", desc: "4-5 hours" },
                { name: "Corn Rows Basic Braids", price: "60,000", desc: "3-4 hours" },
                { name: "Designs", price: "70,000", desc: "3-4 hours" },
                { name: "Zigzag", price: "50,000", desc: "2-3 hours" },
                { name: "Butterfly locs", price: "40,000", desc: "3-4 hours" },
                { name: "Braids Touch-up", price: "35,000", desc: "2 hours" },
                { name: "Kids Braids", price: "35,000", desc: "2 hours" },
                { name: "Passion Twist", price: "40,000", desc: "4-5 hours" },
                { name: "Faux Locs", price: "40,000", desc: "3 hours" },
                { name: "Ghana Weaving Braids", price: "50,000", desc: "4 hours" },
                { name: "Flat Twist Braids", price: "30,000", desc: "3 hours" },
                { name: "Quick Weave Braids", price: "35,000", desc: "2-3 hours" },
                { name: "Natural Hair Weave", price: "15,000", desc: "45-60 mins" },
            ]
        },
        "Lash Extensions": {
            title: "Lash Extensions Price List",
            items: [
                { name: "Bottom lash", price: "20,000", desc: "20 mins" },
                { name: "Mega volume lash set", price: "70,000", desc: "3 hours" },
                { name: "Volume lash set", price: "60,000", desc: "2 hrs:40 mins" },
                { name: "Hybrid lash set", price: "50,000", desc: "2 hours" },
                { name: "Wet look set", price: "50,000", desc: "3 hours" },
                { name: "Wispy lash set", price: "70,000", desc: "2½ hours" },
                { name: "Classic lash set", price: "40,000", desc: "90 mins" },
                { name: "Colored lash extensions", price: "45,000", desc: "2 hours" },
                { name: "Customized signature lash", price: "80,000", desc: "3 hours" },
                { name: "Customized signature lash (with bottom lash)", price: "100,000", desc: "3 hours" },
                { name: "Foreign Fill (From Another Tech)", price: "30,000", desc: "60-90 mins" },
                { name: "Lash Fill (3weeks)", price: "30,000", desc: "60-90 mins" },
                { name: "Lash Fill (2weeks)", price: "25,000", desc: "60-90 mins" },
                { name: "Lash fill (1week)", price: "25,000", desc: "60-90 mins" },
                { name: "Mini Fill/Touch up", price: "25,000", desc: "60-90 mins" },
                { name: "Bottom Lash Extensions Full Set", price: "30,000", desc: "20 mins" },
                { name: "Lash Removal", price: "15,000", desc: "30 mins" },
                { name: "ADDITIONAL EXTRA CHARGE FROM (8PM TO 6AM)", price: "20,000" },
                { name: "EYEBROW SERVICES", isHeader: true },
                { name: "Ombre Brows", price: "80,000", desc: "3 hours" },
                { name: "Soft Ombre Brows", price: "150,000", desc: "3-4 hours" },
            ]
        },
        "Nails": {
            title: "Nail Services Price List",
            items: [
                { name: "ACRYLIC NAILS:", isHeader: true },
                { name: "Acrylic nails (short)", price: "45,000", desc: "3 hours" },
                { name: "Acrylic Medium", price: "50,000", desc: "3 hours" },
                { name: "Acrylic Long", price: "70,000", desc: "3 hours" },
                { name: "Acrylic long with design", price: "90,000", desc: "3 hours" },
                { name: "Acrylic fill in", price: "30,000", desc: "1-2 hours" },
                { name: "Colored", price: "60,000", desc: "60-90 mins" },
                { name: "Ombré acrylic", price: "50,000", desc: "2 hours" },
                { name: "Acrylic on natural nails", price: "30,000", desc: "3 hours" },

                { name: "GEL SERVICES:", isHeader: true },
                { name: "Gel full ( With extension)", price: "30,000", desc: "40-60 mins" },
                { name: "Gel Polish change", price: "15,000", desc: "45-60 mins" },
                { name: "Gel Overlay (on natural nails)", price: "25,000", desc: "30-40 mins" },
                { name: "Gel Polish manicure", price: "20,000", desc: "30 mins" },
                { name: "Gel-X (Soft Gel Extension)", price: "30,000", desc: "2 hours" },

                { name: "DIP POWDER NAILS SERVICES:", isHeader: true },
                { name: "Dip powder on natural nails", price: "30,000", desc: "1-2 hours" },
                { name: "Dip powder with tips", price: "40,000", desc: "2-2½ hours" },
                { name: "Dip nail removal", price: "10,000", desc: "30 mins" },

                { name: "BIAB NAILS SERVICES:", isHeader: true },
                { name: "Biab on natural nails", price: "25,000", desc: "2 hours" },
                { name: "Biab with extension", price: "30,000", desc: "2 hours" },
                { name: "Additional Extra Charge from 8pm to 6am....", price: "20,000" },
            ]
        },
        "Pedicure": {
            title: "Pedicure Price List",
            items: [
                { name: "Detox pedicure (charcoal or herbal soak)", price: "50,000", desc: "75 mins" },
                { name: "Athlete pedicure", price: "50,000", desc: "45-60 mins" },
                { name: "Callous treatment pedicure", price: "45,000", desc: "90 mins" },
                { name: "Men's Pedicure", price: "45,000", desc: "60 mins" },
                { name: "Tumeric pedicure", price: "50,000", desc: "60 mins" },
                { name: "Dry pedicure (Waterless)", price: "30,000", desc: "90 mins" },
                { name: "Jelly pedicure", price: "45,000", desc: "60 mins" },
                { name: "Deluxe pedicure", price: "45,000", desc: "90 mins" },
                { name: "Hotstone pedicure", price: "40,000", desc: "60-90 mins" },
                { name: "Paraffin Wax pedicure", price: "80,000", desc: "90 mins" },
                { name: "Gel pedicure", price: "40,000", desc: "60 mins" },
                { name: "Spa pedicure", price: "40,000", desc: "90 mins" },
                { name: "Basic pedicure", price: "30,000", desc: "60 mins" },
                { name: "Kids pedicure", price: "25,000", desc: "35 mins" },
                { name: "Ingrown toenails care (Non-Medical)", price: "35,000", desc: "90 mins" },
                { name: "PEDICURE ADD-ON (NAIL SPECIFIC)", isHeader: true },
                { name: "Full Set Toes (Acrylic)", price: "25,000", desc: "2 hours" },
                { name: "Gel Polish change", price: "20,000", desc: "40-60 mins" },
                { name: "Acrylic Big Toes", price: "10,000", desc: "20-30 mins" },
                { name: "Toe Polish Change", price: "15,000", desc: "30 mins" },
                { name: "ADDITIONAL EXTRA CHARGE FROM (8PM TO 6AM)", price: "20,000" },
            ]
        },
        "Makeup": {
            title: "Makeup Price List",
            items: [
                { name: "Soft glam", price: "70,000", desc: "90 mins" },
                { name: "Natural glam", price: "70,000", desc: "90 mins" },
                { name: "Full glam", price: "150,000", desc: "2-3 hours" },
                { name: "Smokey eye look", price: "100,000", desc: "3 hours" },
                { name: "Bridal makeup (Trad + Wedding day)", price: "350,000", desc: "2-3 hours" },
                { name: "Travel onsite makeup Lagos", price: "1,000,000", desc: "Depends on scheduled appointment" },
                { name: "Outside Lagos", price: "1,500,000", desc: "Depends on scheduled appointment" },
                { name: "Bridesmaids/Bridal Party Makeup", price: "500,000", desc: "3 hours" },
                { name: "Prom/Graduation glam", price: "300,000", desc: "2 hours" },
                { name: "Photo Shoot makeup", price: "300,000", desc: "2 hours" },
                { name: "Bridal makeup island", price: "1,000,000", desc: "2-3 hours" },
                { name: "Bridal makeup mainland", price: "1,200,000", desc: "2-3 hours" },
                { name: "Bridal makeup outside Lagos", price: "2,000,000", desc: "2-3 hours" },
                { name: "Bridal makeup Trial (Onsite)", price: "1,000,000", desc: "2-3 hours" },
                { name: "Bridal makeup Trial (Travel)", price: "2,000,000", desc: "2-3 hours" },
                { name: "Birthday glam", price: "250,000", desc: "2 hours" },
                { name: "Evening/event glam", price: "300,000", desc: "1-2 hours" },
                { name: "Colorful Eyeshadow Glam", price: "80,000", desc: "2-3 hours" },
                { name: "Makeup for men", price: "70,000", desc: "2 hours" },
                { name: "Dewy finished glam", price: "100,000", desc: "2-3 hours" },
                { name: "Bold/Dramatic Glam", price: "120,000", desc: "3-4 hours" },
                { name: "Matte finish glam", price: "100,000", desc: "2-3 hours" },
                { name: "Touch up services", price: "40,000", desc: "30 mins" },
                { name: "Lashes Add-ons", price: "25,000", desc: "10-20 mins" },
                { name: "Additional Makeup Extra charge from (8pm to 6am)", price: "20,000" },
            ]
        },
        "Hair Styling": {
            title: "Hair Styling Price List",
            items: [
                { name: "Ponytail", price: "70,000", desc: "40-60 mins" },
                { name: "Hair installation", price: "50,000", desc: "2-3 hours" },
                { name: "360 installation", price: "80,000", desc: "3-4 hours" },
                { name: "Wig Install Frontal", price: "50,000", desc: "2-3 hours" },
                { name: "Closure", price: "35,000", desc: "30-60 mins" },
                { name: "5by5 installation", price: "35,000", desc: "30-60 mins" },
                { name: "Ponytail Weave/Normal", price: "40,000", desc: "2-3 hours" },
                { name: "Frontal Sew In", price: "40,000", desc: "2-3 hours" },
                { name: "Hair Wigging", price: "35,000", desc: "90 mins" },
                { name: "Glueless Wig Install", price: "35,000", desc: "60-90 mins" },
                { name: "Clip In Installation", price: "40,000", desc: "60-90 mins" },
                { name: "Closure Sew In", price: "40,000", desc: "2 hours" },
                { name: "Leave Out Sew In", price: "40,000", desc: "40-60 mins" },
                { name: "Wig Revamp", price: "20,000", desc: "3-4 days" },
                { name: "Wig Customization", price: "17,000", desc: "40-60 mins" },
                { name: "Wig Styling", price: "20,000", desc: "30 mins" },
                { name: "Hair straightening", price: "20,000", desc: "30 mins" },
                { name: "Hair curly and styling", price: "25,000", desc: "30 mins" },
                { name: "Hair Extension Removal", price: "15,000", desc: "30 mins" },
                { name: "Hair curly", price: "20,000", desc: "30 mins" },
            ]
        },
        "Hair Services": {
            title: "Hair Maintenance Price List",
            items: [
                { name: "Dread relook & twist", price: "50,000", desc: "4 hours" },
                { name: "Braids maintenance ( moisturizing, oiling)", price: "25,000", desc: "1-1:30 hours" },
                { name: "Relaxer Touch- up", price: "15,000", desc: "40 mins" },
                { name: "Leave-in treatments", price: "20,000", desc: "1 hour" },
                { name: "Hair loosening ( Braids)", price: "15,000", desc: "30-45 mins" },
                { name: "Hair Wash & styling", price: "20,000", desc: "1 hour" },
                { name: "Hair streaming", price: "20,000", desc: "1 hour" },
                { name: "Deep conditioning", price: "15,000", desc: "1 hour" },
                { name: "Scalp Detox", price: "20,000", desc: "1 hour" },
                { name: "Hair Trim", price: "20,000", desc: "35 mins" },
                { name: "Hair Detangling", price: "20,000", desc: "1 hour" },
                { name: "Natural Hair Stretching", price: "15,000", desc: "30 mins" },
                { name: "Natural Hair Washing", price: "7,000", desc: "20 mins" },
                { name: "Blow Dry", price: "5,000", desc: "10 mins" },
                { name: "Scalp massage", price: "5,000", desc: "30 mins" },
                { name: "Hair loosening ( Natural weave)", price: "5,000", desc: "15 mins" },
            ]
        },
        "Tattoo & Microblading": {
            title: "Tattoo & Microblading Price List",
            items: [
                { name: "TATTOOS HOME SERVICE", isHeader: true },
                { name: "Lekki", price: "300,000" },
                { name: "Ikate", price: "350,000" },
                { name: "Ikoyi", price: "400,000" },
                { name: "Victoria island", price: "420,000" },
                { name: "Chevron", price: "450,000" },
                { name: "Ajah", price: "470,000" },
                { name: "Mainland", price: "600,000" },

                { name: "MICROBLADING HOME SERVICE", isHeader: true },
                { name: "OMBRÉ SERVICES", isHeader: true },
                { name: "Lekki 1", price: "200,000" },
                { name: "Ikate", price: "250,000" },
                { name: "Ikoyi", price: "300,000" },
                { name: "Victoria island", price: "320,000" },
                { name: "Chevron", price: "350,000" },
                { name: "Mainland", price: "400,000" },
                { name: "Ajah", price: "370,000" },

                { name: "SOFT OMBRÉ SERVICES", isHeader: true },
                { name: "Lekki", price: "300,000" },
                { name: "Ikate", price: "350,000" },
                { name: "Ikoyi", price: "400,000" },
                { name: "Victoria island", price: "420,000" },
                { name: "Chevron", price: "450,000" },
                { name: "Ajah", price: "470,000" },
                { name: "Mainland", price: "600,000" },
            ]
        },
        "Natural Nails Services": {
            title: "Natural Nails Services Price List",
            items: [
                { name: "Nail strengthening", price: "30,000", desc: "30-40 mins" },
                { name: "Russian", price: "35,000", desc: "45 mins" },
                { name: "Classic", price: "30,000", desc: "45 mins" },
                { name: "Nail repair", price: "15,000", desc: "30 mins" },
                { name: "Add-on and Extras", price: "30,000", desc: "30 mins" },
                { name: "Long nails XXXL", price: "70,000", desc: "2-3 hours" },
                { name: "Rhinestone/Gem nails", price: "70,000", desc: "2-3 hours" },
                { name: "3D nails designs", price: "60,000", desc: "2 hours" },
                { name: "Chromes Nails", price: "50,000", desc: "2 hours" },
                { name: "Custom Hand-Printed Art", price: "70,000", desc: "2-3 hours" },
                { name: "French tips with designs", price: "70,000", desc: "2 hours" },
                { name: "Cat eye effect designs", price: "70,000", desc: "2 hours" },
                { name: "Nail Art (Simple to Advanced)", price: "40,000", desc: "1-2 hours" },
                { name: "Foil/Glitters/Stickers", price: "70,000", desc: "3 hours" },
                { name: "Marble designs", price: "70,000", desc: "3 hours" },
                { name: "Press-on Nails", price: "15,000", desc: "20 mins" },
                { name: "Matte Top Coat", price: "30,000", desc: "45-60 mins" },
                { name: "REMOVAL SERVICES:", isHeader: true },
                { name: "Gel-X Removal", price: "10,000", desc: "30 mins" },
                { name: "Dip powder Removal", price: "10,000", desc: "30 mins" },
                { name: "Nails extension removal", price: "13,000", desc: "30 mins" },
                { name: "Acrylic soak-Off", price: "10,000", desc: "30-45 mins" },
                { name: "Gel Polish Removal", price: "7,000", desc: "15-20 mins" },
                { name: "Additional Extra Charge From 8pm to 6am", price: "20,000" },
            ]
        },
        "Home Services": {
            title: "Home Services Price List",
            items: [
                { name: "MAKE UP SERVICES:", isHeader: true },
                { name: "Mainland", price: "500,000" },
                { name: "Chevron and Ajah", price: "350,000" },
                { name: "Ikoyi", price: "250,000" },
                { name: "Lekki", price: "200,000" },
                { name: "Ikate", price: "220,000" },
                { name: "Victoria island", price: "270,000" },

                { name: "NAILS SERVICES:", isHeader: true },
                { name: "Mainland", price: "500,000" },
                { name: "Chevron or Ajah", price: "350,000" },
                { name: "Ikoyi", price: "250,000" },
                { name: "Lekki 1", price: "200,000" },
                { name: "Victoria island", price: "270,000" },

                { name: "PEDICURE SERVICES:", isHeader: true },
                { name: "Mainland", price: "350,000" },
                { name: "Lekki 1", price: "150,000" },
                { name: "Ikate", price: "170,000" },
                { name: "Ikoyi", price: "200,000" },
                { name: "Victoria island", price: "200,000" },
                { name: "Chevron", price: "250,000" },
                { name: "Ajah", price: "300,000" },

                { name: "BRAIDING SERVICES:", isHeader: true },
                { name: "Lekki", price: "300,000" },
                { name: "Ikate", price: "320,000" },
                { name: "Ikoyi", price: "350,000" },
                { name: "Victoria Island", price: "370,000" },
                { name: "Chevron", price: "400,000" },
                { name: "Mainland", price: "500,000" },

                { name: "LASH SERVICES:", isHeader: true },
                { name: "Lekki", price: "150,000" },
                { name: "Ikate", price: "170,000" },
                { name: "Ikoyi", price: "200,000" },
                { name: "Victoria island", price: "220,000" },
                { name: "Chevron", price: "250,000" },
                { name: "Ajah", price: "270,000" },
                { name: "Mainland", price: "350,000" },

                { name: "HAIRSTYLING/INSTALLATION SERVICES:", isHeader: true },
                { name: "Lekki", price: "200,000" },
                { name: "Ikate", price: "220,000" },
                { name: "Ikoyi", price: "250,000" },
                { name: "Victoria island", price: "250,000" },
                { name: "Chevron", price: "300,000" },
                { name: "Ajah", price: "350,000" },
                { name: "Mainland", price: "400,000" },
            ]
        }
    };

    const [currentCategory, setCurrentCategory] = useState<string>(category || "Hair Braiding");
    const [bookingService, setBookingService] = useState<BookingServiceData | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        if (category && servicesData[category]) {
            setCurrentCategory(category);
        }
    }, [category]);

    const activeData = servicesData[currentCategory] || servicesData["Hair Braiding"];

    const handleBookItem = (item: { name: string; price?: string; desc?: string }) => {
        if (!item.price) return;
        setBookingService({
            name: item.name,
            price: item.price,
            desc: item.desc,
            category: currentCategory
        });
        setIsBookingOpen(true);
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black text-white flex animate-in fade-in duration-300 overflow-hidden">
            {/* Sidebar with vertical text - visible only on large screens */}
            <div className="hidden lg:flex w-24 xl:w-32 border-r border-white/10 flex-col items-center justify-center bg-stone-900 pointer-events-none shrink-0">
                <h1 className="text-[90px] xl:text-[120px] font-black tracking-tighter text-white/5 rotate-90 whitespace-nowrap uppercase select-none">
                    Services
                </h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">
                {/* Header Navigation */}
                <div className="px-3 sm:px-6 py-3.5 sm:py-5 border-b border-white/10 flex justify-between items-center bg-black/60 backdrop-blur-md sticky top-0 z-20">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 sm:gap-2 text-stone-300 hover:text-white transition-colors group cursor-pointer py-1.5 px-2 -ml-2 rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-xs sm:text-sm">Back<span className="hidden sm:inline"> to Home</span></span>
                    </button>
                    
                    <div className="flex flex-col items-center text-center px-2 min-w-0">
                        <h2 className="text-amber-500 font-bold tracking-widest uppercase text-[10px] sm:text-xs truncate">J Beauty Studio</h2>
                        <p className="text-white text-xs sm:text-sm font-serif italic truncate">Price List & Direct Booking</p>
                    </div>

                    <div className="flex items-center justify-end w-16 sm:w-24">
                        <button
                            onClick={onClose}
                            aria-label="Close price list"
                            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-10 custom-scrollbar">
                    <div className="max-w-3xl mx-auto">

                        {/* Category Selector Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
                            {Object.keys(servicesData).map((catName) => (
                                <button
                                    key={catName}
                                    type="button"
                                    onClick={() => setCurrentCategory(catName)}
                                    className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                        currentCategory === catName
                                            ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/25 scale-[1.02]'
                                            : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10 border border-white/5'
                                    }`}
                                >
                                    {catName}
                                </button>
                            ))}
                        </div>

                        {/* Payment Notification Note */}
                        <div className="mb-8 sm:mb-12 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-stone-900 border border-amber-500/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000 pointer-events-none"></div>

                            <div className="relative z-10">
                                <h3 className="text-lg sm:text-xl font-bold text-amber-500 mb-3 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 shrink-0" />
                                    <span>Terms of Payment & Bank Details</span>
                                </h3>
                                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-5">
                                    To confirm your booking, please make a <span className="text-white font-bold">50% deposit</span> for your selected service to the J Beauty Studio account. Kindly send your proof of payment to our WhatsApp number once completed.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
                                    <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-white/5">
                                        <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">Account Number</p>
                                        <p className="text-base sm:text-lg font-mono text-white font-bold">9642252198</p>
                                        <p className="text-stone-400 text-xs mt-1">Providus Bank • J BEAUTY STUDIO</p>
                                    </div>
                                    <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-white/5">
                                        <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">WhatsApp Verification</p>
                                        <p className="text-base sm:text-lg font-mono text-white font-bold">+234 704 100 8039</p>
                                        <p className="text-stone-400 text-xs mt-1">Send screenshot after payment</p>
                                    </div>
                                </div>

                                <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2.5 text-xs sm:text-sm">
                                    <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                                        <span>Studio Booking Policy Summary</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300 text-xs">
                                        <p>• <span className="text-white font-medium">50% Deposit:</span> Non-refundable to confirm appointment.</p>
                                        <p>• <span className="text-white font-medium">Grace Period:</span> 25 to 30 mins before shortening/reschedule.</p>
                                        <p>• <span className="text-white font-medium">Late-Night (8pm–6am):</span> Strictly appointment only + ₦20,000 fee.</p>
                                        <p>• <span className="text-white font-medium">Cancellations:</span> Minimum 24 hours notice required.</p>
                                        <p>• <span className="text-white font-medium">Rescheduling:</span> 1 notice allowed; no-shows forfeit deposit.</p>
                                        <p>• <span className="text-white font-medium">Studio Etiquette:</span> Maximum 1 extra guest; zero abuse tolerance.</p>
                                    </div>
                                    <p className="text-amber-200/90 text-[11px] pt-1 border-t border-amber-500/20">
                                        <span className="font-bold">Address:</span> 8B Providence Road, Lekki Town Square Mall, Lekki Phase 1, Lagos. Daytime walk-ins welcome!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Price List Section */}
                        <div className="space-y-8 sm:space-y-10">
                            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-white mb-1 tracking-tight">{activeData.title}</h2>
                                    <p className="text-stone-400 text-xs sm:text-sm italic">Select a service to book directly with J-Beauty</p>
                                </div>
                                <span className="text-[11px] sm:text-xs font-semibold text-amber-500 uppercase tracking-widest">
                                    {activeData.items.filter(i => !i.isHeader).length} Services Available
                                </span>
                            </div>

                            <div className="divide-y divide-white/5">
                                {activeData.items.map((service, index) => (
                                    service.isHeader ? (
                                        <div key={index} className="pt-6 sm:pt-8 pb-2 sm:pb-3">
                                            <h3 className="text-amber-500 font-bold tracking-widest uppercase text-xs sm:text-sm border-b border-white/10 pb-2 mb-1 inline-block">
                                                {service.name}
                                            </h3>
                                        </div>
                                    ) : (
                                        <div key={index} className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2.5 sm:gap-4 group hover:bg-white/[0.03] -mx-2 sm:-mx-4 px-2 sm:px-4 transition-colors rounded-xl">
                                            <div className="flex flex-col flex-1 pr-2">
                                                <span className="text-stone-200 group-hover:text-white font-medium transition-colors capitalize text-sm sm:text-base">
                                                    {service.name}
                                                </span>
                                                {service.desc && (
                                                    <span className="text-stone-400 group-hover:text-stone-300 text-xs mt-0.5">
                                                        {service.desc}
                                                    </span>
                                                )}
                                            </div>

                                            {service.price && (
                                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 mt-1 sm:mt-0">
                                                    <span className="font-bold text-stone-100 group-hover:text-amber-400 transition-colors text-base sm:text-lg">
                                                        ₦{service.price}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleBookItem(service)}
                                                        className="px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-amber-500/25 active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                                                    >
                                                        <span>Book Now</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Footer space */}
                        <div className="py-12 sm:py-16 text-center">
                            <p className="text-stone-500 text-xs tracking-widest uppercase">J Beauty Studio • Lekki Phase I • Lagos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Complete 3-Step Booking Modal */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                service={bookingService}
            />
        </div>
    );
};

export default PriceList;
