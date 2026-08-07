import React from 'react';
import { X, ArrowLeft, MessageCircle } from 'lucide-react';

interface PriceListProps {
    onClose: () => void;
    category?: string | null;
}

const PriceList: React.FC<PriceListProps> = ({ onClose, category }) => {
    const servicesData: Record<string, { title: string; items: { name: string; price?: string; isHeader?: boolean; desc?: string }[] }> = {
        "Hair Braiding": {
            title: "Hair Braiding Price List",
            items: [
                { name: "Boho Braids (With Curls)", price: "180,000" },
                { name: "Goddess Braids", price: "150,000" },
                { name: "Knotless B. Braids/ Twist small", price: "130,000" },
                { name: "Medium", price: "120,000" },
                { name: "Large", price: "100,000" },
                { name: "Traditional Box Braids", price: "120,000" },
                { name: "Lemonade Braids", price: "120,000" },
                { name: "Ghana Braids", price: "80,000" },
                { name: "Stitch Braids", price: "80,000" },
                { name: "Micro Braids", price: "60,000" },
                { name: "Corn Rows Basic Braids", price: "60,000" },
                { name: "Designs", price: "70,000" },
                { name: "Zigzag", price: "50,000" },
                { name: "Butterfly locs", price: "40,000" },
                { name: "Braids Touch-up", price: "35,000" },
                { name: "Kids Braids", price: "35,000" },
                { name: "Passion Twist", price: "40,000" },
                { name: "Faux Locs", price: "40,000" },
                { name: "Ghana Weaving Braids", price: "50,000" },
                { name: "Flat Twist Braids", price: "30,000" },
                { name: "Quick Weave Braids", price: "35,000" },
                { name: "Natural Hair Weave", price: "15,000" },
            ]
        },
        "Lash Extensions": {
            title: "Lash Extensions Price List",
            items: [
                { name: "Bottom lash", price: "20,000" },
                { name: "Mega volume lash set", price: "70,000" },
                { name: "Volume lash set", price: "60,000" },
                { name: "Hybrid lash set", price: "50,000" },
                { name: "Wet look set", price: "50,000" },
                { name: "Wispy lash set", price: "70,000" },
                { name: "Classic lash set", price: "40,000" },
                { name: "Colored lash extensions", price: "45,000" },
                { name: "Customized signature lash", price: "80,000" },
                { name: "Customized signature lash (with bottom lash)", price: "100,000" },
                { name: "Foreign Fill (From Another Tech)", price: "30,000" },
                { name: "Lash Fill (3weeks)", price: "30,000" },
                { name: "Lash Fill (2weeks)", price: "25,000" },
                { name: "Lash fill (1week)", price: "25,000" },
                { name: "Mini Fill/Touch up", price: "25,000" },
                { name: "Bottom Lash Extensions Full Set", price: "30,000" },
                { name: "Lash Removal", price: "15,000" },
                { name: "ADDITIONAL EXTRA CHARGE FROM (8PM TO 6AM)", price: "20,000" },
                { name: "--EYEBROWS SERVICES--", isHeader: true },
                { name: "-OMBRÉ BROWS-", isHeader: true },
                { name: "Precise. Polished. Elegant", price: "80,000" },
                { name: "-SOFT OMBRÉ BROWS-", isHeader: true },
                { name: "Natural. Sculpted. Refined", price: "150,000" },
            ]
        },
        "Nails": {
            title: "Nail Services Price List",
            items: [
                { name: "ACRYLIC NAILS:", isHeader: true },
                { name: "Acrylic nails (short)", price: "45,000" },
                { name: "Acrylic Medium", price: "50,000" },
                { name: "Acrylic Long", price: "70,000" },
                { name: "Acrylic long with design", price: "90,000" },
                { name: "Acrylic fill in", price: "30,000" },
                { name: "Colored", price: "60,000" },
                { name: "Ombré acrylic", price: "50,000" },
                { name: "Acrylic on natural nails", price: "30,000" },

                { name: "GEL SERVICES:", isHeader: true },
                { name: "Gel full ( With extension)", price: "30,000" },
                { name: "Gel Polish change", price: "15,000" },
                { name: "Gel Overlay (on natural nails)", price: "25,000" },
                { name: "Gel Polish manicure", price: "20,000" },
                { name: "Gel-X (Soft Gel Extension)", price: "30,000" },

                { name: "DIP POWDER NAILS SERVICES:", isHeader: true },
                { name: "Dip powder on natural nails", price: "30,000" },
                { name: "Dip powder with tips", price: "40,000" },
                { name: "Dip nail removal", price: "10,000" },

                { name: "BIAB NAILS SERVICES:", isHeader: true },
                { name: "Biab on natural nails", price: "25,000" },
                { name: "Biab with extension", price: "30,000" },
                { name: "Additional Extra Charge from 8pm to 6am....", price: "20,000" },
            ]
        },
        "Pedicure": {
            title: "Pedicure Price List",
            items: [
                { name: "Detox pedicure (charcoal or herbal soak)", price: "50,000" },
                { name: "Athlete pedicure", price: "50,000" },
                { name: "Callous treatment pedicure", price: "45,000" },
                { name: "Men's Pedicure", price: "45,000" },
                { name: "Tumeric pedicure", price: "50,000" },
                { name: "Dry pedicure (Waterless)", price: "30,000" },
                { name: "Jelly pedicure", price: "45,000" },
                { name: "Deluxe pedicure", price: "45,000" },
                { name: "Hotstone pedicure", price: "40,000" },
                { name: "Paraffin Wax pedicure", price: "80,000" },
                { name: "Gel pedicure", price: "40,000" },
                { name: "Spa pedicure", price: "40,000" },
                { name: "Basic pedicure", price: "30,000" },
                { name: "Kids pedicure", price: "25,000" },
                { name: "Ingrown toenails care (Non-Medical)", price: "35,000" },
                { name: "PEDICURE ADD-ON (NAIL SPECIFIC)", isHeader: true },
                { name: "Full Set Toes (Acrylic)", price: "25,000" },
                { name: "Gel Polish change", price: "20,000" },
                { name: "Acrylic Big Toes", price: "10,000" },
                { name: "Toe Polish Change", price: "15,000" },
                { name: "ADDITIONAL EXTRA CHARGE FROM (8PM TO 6AM)", price: "20,000" },
            ]
        },
        "Makeup": {
            title: "Makeup Price List",
            items: [
                { name: "Soft glam", price: "70,000" },
                { name: "Natural glam", price: "70,000" },
                { name: "Full glam", price: "150,000" },
                { name: "Smokey eye look", price: "100,000" },
                { name: "Bridal makeup (Trad + Wedding day)", price: "350,000" },
                { name: "Travel onsite makeup Lagos", price: "1,000,000" },
                { name: "Outside Lagos", price: "1,500,000" },
                { name: "Bridesmaids/Bridal Party Makeup", price: "500,000" },
                { name: "Prom/Graduation glam", price: "300,000" },
                { name: "Photo Shoot makeup", price: "300,000" },
                { name: "Bridal makeup island", price: "1,000,000" },
                { name: "Bridal makeup mainland", price: "1,200,000" },
                { name: "Bridal makeup outside Lagos", price: "2,000,000" },
                { name: "Bridal makeup Trial (Onsite)", price: "1,000,000" },
                { name: "Bridal makeup Trial (Travel)", price: "2,000,000" },
                { name: "Birthday glam", price: "250,000" },
                { name: "Evening/event glam", price: "300,000" },
                { name: "Colorful Eyeshadow Glam", price: "80,000" },
                { name: "Makeup for men", price: "70,000" },
                { name: "Dewy finished glam", price: "100,000" },
                { name: "Bold/Dramatic Glam", price: "120,000" },
                { name: "Matte finish glam", price: "100,000" },
                { name: "Touch up services", price: "40,000" },
                { name: "Lashes Add-ons", price: "25,000" },
                { name: "Additional Makeup Extra charge from (8pm to 6am)", price: "20,000" },
            ]
        },
        "Hair Styling": {
            title: "Hair Styling Price List",
            items: [
                { name: "Ponytail", price: "70,000" },
                { name: "Hair installation", price: "50,000" },
                { name: "360 installation", price: "80,000" },
                { name: "Wig Install Frontal", price: "50,000" },
                { name: "Closure", price: "35,000" },
                { name: "5by5 installation", price: "35,000" },
                { name: "Ponytail Weave/Normal", price: "40,000" },
                { name: "Frontal Sew In", price: "40,000" },
                { name: "Hair Wigging", price: "35,000" },
                { name: "Glueless Wig Install", price: "35,000" },
                { name: "Clip In Installation", price: "40,000" },
                { name: "Closure Sew In", price: "40,000" },
                { name: "Leave Out Sew In", price: "40,000" },
                { name: "Wig Revamp", price: "20,000" },
                { name: "Wig Customization", price: "17,000" },
                { name: "Wig Styling", price: "20,000" },
                { name: "Hair straightening", price: "20,000" },
                { name: "Hair curly and styling", price: "25,000" },
                { name: "Hair Extension Removal", price: "15,000" },
                { name: "Hair curly", price: "20,000" },
            ]
        },
        "Hair Services": {
            title: "Hair Maintenance Price List",
            items: [
                { name: "Dread relook & twist", price: "50,000" },
                { name: "Braids maintenance ( moisturizing, oiling)", price: "25,000" },
                { name: "Relaxer Touch- up", price: "15,000" },
                { name: "Leave-in treatments", price: "20,000" },
                { name: "Hair loosening ( Braids)", price: "15,000" },
                { name: "Hair Wash & styling", price: "20,000" },
                { name: "Hair streaming", price: "20,000" },
                { name: "Deep conditioning", price: "15,000" },
                { name: "Scalp Detox", price: "20,000" },
                { name: "Hair Trim", price: "20,000" },
                { name: "Hair Detangling", price: "20,000" },
                { name: "Natural Hair Stretching", price: "15,000" },
                { name: "Natural Hair Washing", price: "7,000" },
                { name: "Blow Dry", price: "5,000" },
                { name: "Scalp massage", price: "5,000" },
                { name: "Hair loosening ( Natural weave)", price: "5,000" },
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
                { name: "Nail strengthening", price: "30,000" },
                { name: "Russian", price: "35,000" },
                { name: "Classic", price: "30,000" },
                { name: "Nail repair", price: "15,000" },
                { name: "Add-on and Extras", price: "30,000" },
                { name: "Long nails XXXL", price: "70,000" },
                { name: "Rhinestone/Gem nails", price: "70,000" },
                { name: "3D nails designs", price: "60,000" },
                { name: "Chromes Nails", price: "50,000" },
                { name: "Custom Hand-Printed Art", price: "70,000" },
                { name: "French tips with designs", price: "70,000" },
                { name: "Cat eye effect designs", price: "70,000" },
                { name: "Nail Art (Simple to Advanced)", price: "40,000" },
                { name: "Foil/Glitters/Stickers", price: "70,000" },
                { name: "Marble designs", price: "70,000" },
                { name: "Press-on Nails", price: "15,000" },
                { name: "Matte Top Coat", price: "30,000" },
                { name: "REMOVAL SERVICES:", isHeader: true },
                { name: "Gel-X Removal", price: "10,000" },
                { name: "Dip powder Removal", price: "10,000" },
                { name: "Nails extension removal", price: "13,000" },
                { name: "Acrylic soak-Off", price: "10,000" },
                { name: "Gel Polish Removal", price: "7,000" },
                { name: "Additional Extra Charge From 8pm to 6am", price: "20,000" },
            ]
        },
        "Home Services": {
            title: "Home Services Price List",
            items: [
                { name: "MAKE UP SERVICES:", isHeader: true },
                { name: "Mainland", price: "5,500,000" },
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

    const activeData = (category && servicesData[category]) || servicesData["Hair Braiding"];

    return (
        <div className="fixed inset-0 z-[70] bg-black text-white flex animate-in fade-in duration-300 overflow-hidden">
            {/* Sidebar with vertical text */}
            <div className="hidden md:flex w-32 border-r border-white/10 flex-col items-center justify-center bg-stone-900 pointer-events-none">
                <h1 className="text-[120px] font-black tracking-tighter text-white/5 rotate-90 whitespace-nowrap uppercase select-none">
                    Services
                </h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">
                {/* Header Navigation */}
                <div className="px-6 py-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-amber-500 font-bold tracking-widest uppercase text-xs">J Beauty Studio</h2>
                        <p className="text-white text-sm font-serif italic">Price List</p>
                    </div>
                    <div className="w-24"></div> {/* Spacer */}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-12 md:px-24">
                    <div className="max-w-3xl mx-auto">

                        {/* Payment Notification Note */}
                        <div className="mb-16 p-8 rounded-3xl bg-stone-900 border border-amber-500/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Terms of Payment & Bank Details
                                </h3>
                                <p className="text-stone-300 leading-relaxed mb-6">
                                    To confirm your booking, please make a <span className="text-white font-bold">50% deposit</span> for your selected service to the J Beauty Studio account. Kindly send your proof of payment to our WhatsApp number once completed.
                                </p>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">Account Number</p>
                                        <p className="text-lg font-mono text-white">9642252198</p>
                                        <p className="text-stone-400 text-xs mt-1">Providus Bank • J BEAUTY STUDIO</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                                        <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">WhatsApp Verification</p>
                                        <p className="text-lg font-mono text-white">+234 704 100 8039</p>
                                        <p className="text-stone-400 text-xs mt-1">Send screenshot after payment</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-amber-200 text-sm leading-relaxed">
                                        <span className="font-bold">Note:</span> An extra payment of <span className="font-bold text-white">₦20,000</span> will be collected for late night bookings <span className="italic">(8pm – 6am)</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Price List Section */}
                        <div className="space-y-12">
                            <div className="border-b border-white/10 pb-4">
                                <h2 className="text-4xl font-serif font-medium text-white mb-2 tracking-tight">{activeData.title}</h2>
                                <p className="text-stone-500 text-sm italic">Price List</p>
                            </div>

                            <div className="divide-y divide-white/5">
                                {activeData.items.map((service, index) => (
                                    service.isHeader ? (
                                        <div key={index} className="pt-8 pb-4">
                                            <h3 className="text-amber-500 font-bold tracking-widest uppercase text-sm border-b border-white/10 pb-2 mb-2 inline-block">
                                                {service.name}
                                            </h3>
                                        </div>
                                    ) : (
                                         <div key={index} className="py-4 flex justify-between items-start group hover:bg-white/[0.02] -mx-4 px-4 transition-colors rounded-lg">
                                            <div className="flex flex-col">
                                                <span className="text-stone-300 group-hover:text-white transition-colors capitalize">{service.name}</span>
                                                {service.desc && (
                                                    <span className="text-stone-500 group-hover:text-stone-400 text-xs mt-1 lowercase normal-case first-letter:uppercase">
                                                        {service.desc}
                                                    </span>
                                                )}
                                            </div>
                                            {service.price && (
                                                <div className="flex items-center gap-4">
                                                    <div className="hidden md:block w-32 h-[1px] bg-white/10 group-hover:bg-amber-500/30 transition-colors"></div>
                                                    <span className="font-bold text-stone-100 group-hover:text-amber-500 transition-colors">₦{service.price}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Footer space */}
                        <div className="py-20 text-center">
                            <p className="text-stone-600 text-xs tracking-widest uppercase">J Beauty Studio • Lekki Phase I • Lagos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceList;
