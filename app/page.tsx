'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, CheckCircle2, ShoppingBag, Menu as MenuIcon, Phone, Clock, LogIn } from 'lucide-react';
import Link from 'next/link';
import { branches, menuItems } from '@/lib/data';
import { MenuItem, Branch } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HeroSection from '@/components/hero-section';
import AboutSection from '@/components/about-section';
import TestimonialsSection from '@/components/testimonials-section';
import BranchSelector from '@/components/branch-selector';
import MenuCard from '@/components/menu-card';
import CartSheet from '@/components/cart-sheet';
import CheckoutDialog from '@/components/checkout-dialog';
import TableBookingDialog from '@/components/table-booking-dialog';
import FeedbackDialog from '@/components/feedback-dialog';
import ThemeToggle from '@/components/theme-toggle';
import { restaurantInfo } from '@/lib/restaurant-data';
import DishesGrid from '@/components/DishesGrid';
import LoginDialog from '@/components/login-dialog';

interface CartItem extends MenuItem {
    quantity: number;
}

export default function Home() {
    const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [foodTypeFilter, setFoodTypeFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    // Filter menu based on selected branch
    const branchMenu = useMemo(() => {
        return menuItems.filter(item => item.branch.includes(selectedBranch.id));
    }, [selectedBranch]);

    const filteredMenu = useMemo(() => {
        return branchMenu.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFoodType = foodTypeFilter === 'all' || item.foodType === foodTypeFilter;
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            return matchesSearch && matchesFoodType && matchesCategory;
        });
    }, [branchMenu, searchTerm, foodTypeFilter, categoryFilter]);

    const categories = useMemo(() => {
        const cats = new Set(branchMenu.map(item => item.category));
        return ['all', ...Array.from(cats)];
    }, [branchMenu]);

    const handleQuantityChange = (itemId: string, quantity: number, dynamicItem?: any) => {
        setCartItems(prev => {
            if (quantity === 0) return prev.filter(i => i.id !== itemId);
            const exists = prev.find(i => i.id === itemId);
            if (exists) return prev.map(i => i.id === itemId ? { ...i, quantity } : i);

            // Try to find in static menuItems first
            const item = menuItems.find(i => i.id === itemId) || dynamicItem;
            return item ? [...prev, { ...item, quantity }] : prev;
        });
    };

    const handleCheckout = () => setCheckoutOpen(true);

    const subtotal = cartItems.reduce((sum, item) => {
        const p = item.price - (item.price * item.discount / 100);
        return sum + (p * item.quantity);
    }, 0);
    const total = subtotal * 1.05;

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Premium Crystal White Glass Navbar */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1.5rem)] max-w-7xl">
                <header className="rounded-[2.5rem] border border-white/20 bg-white/30 dark:bg-black/20 backdrop-blur-[20px] px-2 sm:px-6 py-2.5 sm:py-4 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between gap-1 sm:gap-3 ring-1 ring-white/10">
                    {/* Brand - Always show logo, text from 360px+ */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <div className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
                            <span className="text-white font-black text-sm sm:text-xl md:text-2xl italic">S</span>
                        </div>
                        <div className="flex flex-col hidden min-[360px]:flex">
                            <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-primary tracking-tighter leading-none">SANGAM</span>
                            <span className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none mt-0.5 hidden sm:block">Elite Dining</span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center gap-0.5 sm:gap-1.5 md:gap-3 min-w-0 flex-1 justify-end">
                        <BranchSelector selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} />
                        <TableBookingDialog branch={selectedBranch} />
                        <FeedbackDialog branch={selectedBranch} />
                        <Button onClick={() => setLoginOpen(true)} variant="outline" size="icon" className="rounded-xl sm:rounded-full border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all w-8 h-8 sm:w-10 sm:h-10 active:scale-95 flex-shrink-0">
                            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-600 dark:text-zinc-400 transition-colors" />
                        </Button>
                        <div className="h-5 w-px bg-border hidden lg:block opacity-30" />
                        <ThemeToggle />
                    </div>
                </header>
            </div>

            <main className="flex-1">
                {/* Dynamic Hero with Branch Background */}
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedBranch.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 z-0"
                        >
                            <img
                                src={selectedBranch.image}
                                alt={selectedBranch.name}
                                className="w-full h-full object-cover scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
                        </motion.div>
                    </AnimatePresence>

                    <div className="relative z-10">
                        <HeroSection />
                    </div>
                </div>

                {/* Enhanced Branch Features Section */}
                <section className="py-12 bg-card/50 border-y border-border px-4 overflow-hidden">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="w-full md:w-1/3 space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-xs uppercase">
                                        Vibe
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-xs">Branch Highlights</span>
                                </div>
                                <h2 className="text-3xl font-black leading-tight">Specifically for <br /><span className="text-primary italic">{selectedBranch.name.replace('Sangem Hotels - ', '')}</span></h2>
                                <p className="text-muted-foreground font-medium">{selectedBranch.address}</p>
                            </div>

                            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {selectedBranch.features.map((f, i) => (
                                    <motion.div
                                        key={f}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border shadow-sm group hover:border-primary/50 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{f}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <AboutSection />

                <DishesGrid
                    branchId={selectedBranch.id}
                    onAdd={(dish) => handleQuantityChange(dish.id, (cartItems.find(ci => ci.id === dish.id)?.quantity || 0) + 1, dish)}
                    onRemove={(id) => handleQuantityChange(id, Math.max(0, (cartItems.find(ci => ci.id === id)?.quantity || 0) - 1))}
                    getQuantity={(id) => cartItems.find(ci => ci.id === id)?.quantity || 0}
                />
                {/* Locations Grid with Visual Cards - Stabilized Noir Section */}
                <section className="py-32 bg-background text-white px-4 border-y border-white/5 relative overflow-hidden">

                    <div className="container mx-auto relative z-10">
                        <div className="text-center mb-20 space-y-4">
                            <Badge className="bg-primary text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">Elite Access</Badge>
                            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                Our Hyderabad <br />
                                <span className="text-primary italic">Legacy</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {branches.map((b, i) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -12 }}
                                    onClick={() => {
                                        setSelectedBranch(b);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`group relative overflow-hidden rounded-[3rem] border-2 cursor-pointer transition-all duration-500 h-[500px] ${selectedBranch.id === b.id ? 'border-primary shadow-[0_0_50px_rgba(230,66,69,0.3)]' : 'border-white/10 hover:border-white/30 shadow-2xl'}`}
                                >
                                    <img
                                        src={b.image}
                                        alt={b.name}
                                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                                    <div className="absolute bottom-0 left-0 right-0 p-10 space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-2">
                                                <span className="text-primary text-[10px] font-black uppercase tracking-widest block opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">Hyderabad Elite branch</span>
                                                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{b.name.replace('Sangem Hotels - ', '')}</h3>
                                            </div>
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 scale-90 group-hover:scale-100 ${selectedBranch.id === b.id ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'bg-white/10 backdrop-blur-xl text-white group-hover:bg-primary'}`}>
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-white/60 text-sm font-medium leading-relaxed line-clamp-2 pr-4">{b.address}</p>
                                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-primary pt-6 border-t border-white/10">
                                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {b.openHours}</span>
                                                <span className="text-white/40 group-hover:text-primary transition-colors">Book Table →</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedBranch.id === b.id && (
                                        <div className="absolute top-8 right-8">
                                            <Badge className="bg-primary text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl border-none">Active Outlet</Badge>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <TestimonialsSection />
            </main>

            <footer className="bg-background py-32 border-t border-border px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                        <div className="space-y-6">
                            <span className="text-4xl font-black tracking-tighter text-primary">SANGEM</span>
                            <p className="text-muted-foreground font-medium leading-relaxed">Defining the art of Indian fine-dining since 1995. Our commitment to authenticity and excellence remains unchanged across all Hyderabad branches.</p>
                            <div className="flex gap-4">
                                {Object.entries(restaurantInfo.socialMedia).map(([key, value]) => (
                                    <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                                        <span className="capitalize text-xs font-bold">{key[0]}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xl font-black uppercase tracking-widest">Our Outlets</h4>
                            <ul className="space-y-4">
                                {branches.map(b => (
                                    <li key={b.id}>
                                        <button
                                            onClick={() => { setSelectedBranch(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="text-muted-foreground hover:text-primary font-bold transition-colors text-left"
                                        >
                                            {b.name.replace('Sangam Hotels - ', '')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xl font-black uppercase tracking-widest">Quick Links</h4>
                            <ul className="space-y-4">
                                <li><Link href="/careers" className="text-muted-foreground hover:text-primary font-bold transition-colors">Career Opportunities</Link></li>
                                <li><Link href="/terms" className="text-muted-foreground hover:text-primary font-bold transition-colors">Terms of Service</Link></li>
                                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary font-bold transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/corporate-gifting" className="text-muted-foreground hover:text-primary font-bold transition-colors">Corporate Gifting</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xl font-black uppercase tracking-widest">Contact Us</h4>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Call Center</span>
                                        <span className="font-bold">{restaurantInfo.phone}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">General Enquiries</span>
                                        <span className="font-bold">{restaurantInfo.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-sm font-bold text-muted-foreground">
                            &copy; 2026 Sangam Resorts. All culinary rights reserved.
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">Made with ❤️ by DevArts</span>
                        </div>
                    </div>
                </div>
            </footer>

            <CartSheet
                cartItems={cartItems}
                onUpdateQuantity={handleQuantityChange}
                onRemoveItem={(id) => handleQuantityChange(id, 0)}
                onCheckout={handleCheckout}
            />

            <CheckoutDialog
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                onOrderSuccess={() => setCartItems([])}
                total={total}
                branch={selectedBranch}
                items={cartItems}
            />

            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
        </div>
    );
}