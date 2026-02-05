import React from 'react';
import { X, ArrowLeft, MessageCircle } from 'lucide-react';

interface PriceListProps {
    onClose: () => void;
    category?: string | null;
}

const PriceList: React.FC<PriceListProps> = ({ onClose, category }) => {
    const servicesData: Record<string, { title: string; items: { name: string; price?: string; isHeader?: boolean }[] }> = {
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
                { name: "Mega Volume Lash Set", price: "70,000" },
                { name: "Volume Lash Set", price: "60,000" },
                { name: "Hybrid Lash Set", price: "50,000" },
                { name: "Wet Look Lash Set", price: "50,000" },
                { name: "Wispy Lash Set", price: "50,000" },
                { name: "Classic Lash Set", price: "40,000" },
                { name: "Colored Lash Extensions", price: "45,000" },
                { name: "Foreign Fill (From another tech)", price: "30,000" },
                { name: "Lash Fill (3 week)", price: "30,000" },
                { name: "Lash Fill (2 week)", price: "25,000" },
                { name: "Lash Fill (1 week)", price: "25,000" },
                { name: "Mini Fill / Touch Up", price: "25,000" },
                { name: "Bottom Lash Extensions full set", price: "30,000" },
                { name: "Lash Removal", price: "15,000" },
            ]
        },
        "Nails": {
            title: "Nail Services Price List",
            items: [
                { name: "ACRYLIC SERVICES", isHeader: true },
                { name: "Encapsulated Acrylic (with design inside)", price: "70,000" },
                { name: "Acrylic Full Set -Long", price: "50,000" },
                { name: "Medium", price: "40,000" },
                { name: "Short", price: "35,000" },
                { name: "Ombré Acrylic Set", price: "45,000" },
                { name: "Colored Acrylic Full Set", price: "50,000" },
                { name: "Acrylic Fill In", price: "30,000" },
                { name: "Acrylic Overlay (On natural nails)", price: "20,000" },

                { name: "GEL SERVICES", isHeader: true },
                { name: "Gel Full Set (with extension)", price: "25,000" },
                { name: "Gel Polish Change", price: "15,000" },
                { name: "Gel Overlay (On natural nails)", price: "20,000" },
                { name: "Gel Polish Manicure", price: "15,000" },
                { name: "Gel x (soft gel extension)", price: "30,000" },

                { name: "DIP POWDER SERVICES", isHeader: true },
                { name: "Dip Powder with Tips", price: "30,000" },
                { name: "Dip Powder on Natural Nails", price: "25,000" },
                { name: "Dip Nail Removal", price: "10,000" },

                { name: "NATURAL NAIL SERVICES", isHeader: true },
                { name: "Nail Strengthening Treatment", price: "25,000" },
                { name: "Classic Manicure", price: "25,000" },
                { name: "Russian Manicure", price: "30,000" },
                { name: "Nails Shaping & Buffing", price: "15,000" },
                { name: "Nail Repair", price: "15,000" },
                { name: "Add-On & Extras", price: "30,000" },
                { name: "Long Nails Fee XXXL", price: "70,000" },
                { name: "XL or XXL", price: "60,000" },
                { name: "Rhinestones/Gem", price: "70,000" },
                { name: "Chromes Nails", price: "50,000" },
                { name: "Custom Hand -Printed Art", price: "70,000" },
                { name: "3D Nail Designs", price: "60,000" },
                { name: "French Tip Designs", price: "50,000" },
                { name: "Cat Eye Effect", price: "50,000" },
                { name: "Nail Art (simple to advanced)", price: "40,000" },
                { name: "Foil/ Glitters/Stickers", price: "70,000" },
                { name: "Marble Design", price: "70,000" },
                { name: "Press On Nails", price: "30,000" },
                { name: "Matte Top Coat", price: "30,000" },

                { name: "REMOVAL SERVICES", isHeader: true },
                { name: "Gel X Removal", price: "10,000" },
                { name: "Dip Powder Removal", price: "10,000" },
                { name: "Nail Extensions Removal", price: "13,000" },
                { name: "Acrylic Soak -Off", price: "10,000" },
                { name: "Gel Polish Removal", price: "7,000" },
            ]
        },
        "Pedicure": {
            title: "Pedicure Price List",
            items: [
                { name: "Detox pedicure (charcoal or herbal soak)", price: "50,000" },
                { name: "Pedicure with foot massage", price: "50,000" },
                { name: "Callus treatment Pedicure", price: "45,000" },
                { name: "Men’s Pedicure", price: "45,000" },
                { name: "Jelly pedicure", price: "45,000" },
                { name: "Deluxe Pedicure", price: "45,000" },
                { name: "Hot stone Pedicure", price: "40,000" },
                { name: "Paraffin Pedicure", price: "45,000" },
                { name: "Gel Pedicure", price: "40,000" },
                { name: "Spa Pedicure", price: "40,000" },
                { name: "Basic Pedicure", price: "30,000" },
                { name: "Kids Pedicure", price: "25,000" },
                { name: "Ingrown Toenails Care (Non-medical)", price: "35,000" },
                { name: "Pedicure Add On (Nail  Specific)", isHeader: true },
                { name: "Full Set Toes (Acrylic)", price: "25,000" },
                { name: "Gel Polish Change", price: "20,000" },
                { name: "Acrylic Toes (Big Toe)", price: "10,000" },
                { name: "Toe Polish Change", price: "15,000" },
            ]
        },
        "Makeup": {
            title: "Makeup Price List",
            items: [
                { name: "Full glam", price: "100,000" },
                { name: "Soft glam", price: "50,000" },
                { name: "Natural glam", price: "50,000" },
                { name: "Smokey eye look", price: "100,000" },
                { name: "Bridal Makeup (Trial+Wedding Day)", price: "350,000" },
                { name: "Travel on site makeup Lagos", price: "1,000,000" },
                { name: "Outside Lagos", price: "1,500,000" },
                { name: "Bridesmaid/ Bridal Party Makeup", price: "500,000" },
                { name: "Prom/Graduation Glam", price: "300,000" },
                { name: "Photo shoot Makeup", price: "300,000" },
                { name: "Bridal Makeup island", price: "1,000,000" },
                { name: "Bridal makeup mainland", price: "1,200,000" },
                { name: "Bridal makeup Outside Lagos", price: "2,000,000" },
                { name: "Bridal makeup trial (onsite)", price: "1,000,000" },
                { name: "Bridal makeup trial (travel)", price: "2,000,000" },
                { name: "Birthday Glam", price: "200,000" },
                { name: "Evening/Event Makeup", price: "200,000" },
                { name: "Colorful Eyeshadow Glam", price: "80,000" },
                { name: "Makeup for Men", price: "70,000" },
                { name: "Dewy Finished Glam", price: "100,000" },
                { name: "Bold/Dramatic Glam", price: "120,000" },
                { name: "Matte Finish Glam", price: "100,000" },
                { name: "Touch Up Service", price: "30,000" },
                { name: "Lashes Add on", price: "25,000" },
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
                                        <div key={index} className="py-4 flex justify-between items-center group hover:bg-white/[0.02] -mx-4 px-4 transition-colors rounded-lg">
                                            <span className="text-stone-300 group-hover:text-white transition-colors capitalize">{service.name}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="hidden md:block w-32 h-[1px] bg-white/10 group-hover:bg-amber-500/30 transition-colors"></div>
                                                <span className="font-bold text-stone-100 group-hover:text-amber-500 transition-colors">₦{service.price}</span>
                                            </div>
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
