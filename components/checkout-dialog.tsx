'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, Smartphone, Banknote, ArrowRight, User, Phone, Mail, MapPin, Navigation, Loader2, CheckCircle2 } from 'lucide-react';
import { Branch, MenuItem } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

interface CheckoutDialogProps {
    open: boolean;
    onClose: () => void;
    total: number;
    branch: Branch;
    items: (MenuItem & { quantity: number })[];
}

export default function CheckoutDialog({ open, onClose, total, branch, items }: CheckoutDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsGettingLocation(false);
                    alert("Could not get your location. Please enter your address manually.");
                }
            );
        } else {
            setIsGettingLocation(false);
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone || !address) {
            alert("Please fill in Name, Phone, and Address.");
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            customer_name: name,
            customer_phone: phone,
            customer_email: email,
            delivery_address: address,
            latitude: location?.lat,
            longitude: location?.lng,
            branch_id: branch.id,
            total_amount: total,
            payment_method: 'Cash on Delivery',
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            if (!supabase) throw new Error("Supabase client not initialized.");

            const { error } = await supabase
                .from('orders')
                .insert([orderData]);

            if (error) throw error;

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                // Clear form
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
                setLocation(null);
            }, 3000);
        } catch (error: any) {
            console.error("Error placing order:", error);
            alert("Failed to place order. " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-md bg-card border-border border-2 rounded-[2.5rem] p-10 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Order Placed!</h3>
                    <p className="text-muted-foreground font-bold mb-6">Your delicious meal is being prepared. Cash on Delivery is active.</p>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl w-[calc(100%-1rem)] bg-card border-border border-2 rounded-[2.5rem] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] focus:outline-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <DialogHeader className="mb-6 relative z-10 text-left">
                    <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
                        Confirm Your <span className="text-primary italic">Order</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                        Cash on Delivery at {branch.name.replace('Sangam Hotels - ', '')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handlePlaceOrder} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name *</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" placeholder="+91 XXXXX XXXXX" className="pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address (Optional)</Label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" className="pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Delivery Address *</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={handleGetLocation} disabled={isGettingLocation} className="text-primary hover:text-primary/80 h-auto p-0 flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest">
                                {isGettingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                                {location ? 'Location Shared' : 'Share Lives Location'}
                            </Button>
                        </div>
                        <Textarea value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Enter your full building/house address..." className="bg-muted/50 border-border rounded-2xl min-h-[100px] font-bold py-4" />
                        {location && (
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 mt-2 font-bold px-3 py-1">
                                <MapPin className="w-3 h-3 mr-1.5" /> High Precision Coordinates Captured
                            </Badge>
                        )}
                    </div>

                    <div className="bg-muted p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-inner mt-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
                            <div className="text-center sm:text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Total Payable</p>
                                <h3 className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter">₹{total.toFixed(0)}<span className="text-primary text-xl">.00</span></h3>
                                <Badge className="mt-2 bg-zinc-900 text-white border-none font-black text-[9px] uppercase tracking-widest">Cash on Delivery</Badge>
                            </div>
                            <div className="text-center sm:text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest mb-2">
                                    Est. 30-45 Mins
                                </div>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">{branch.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 rounded-2xl h-16 text-xs font-black uppercase tracking-widest border-2 hover:bg-muted transition-all">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-sm sm:text-lg font-black shadow-xl hover:shadow-primary/30 transition-all group">
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Order <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
