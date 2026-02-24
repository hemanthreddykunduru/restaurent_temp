'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowRight, User, Phone, Mail, MapPin, Navigation, Loader2, CheckCircle2, ChefHat, Truck, PartyPopper } from 'lucide-react';
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
    onOrderSuccess: () => void;
    total: number;
    branch: Branch;
    items: (MenuItem & { quantity: number })[];
}

// --- Order Progress Animation ---
const steps = [
    { id: 0, icon: CheckCircle2, label: 'Order Confirmed', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', done: true },
    { id: 1, icon: ChefHat, label: 'Kitchen is Cooking', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', done: false },
    { id: 2, icon: Truck, label: 'Out for Delivery', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', done: false },
    { id: 3, icon: PartyPopper, label: 'Enjoy your Meal!', color: 'text-primary', bg: 'bg-primary/10', done: false },
];

function OrderAnimation({ customerName, branchName }: { customerName: string; branchName: string }) {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        // Step 0 immediately, then advance every 1.8s through the 3 remaining steps
        const timers = [
            setTimeout(() => setActiveStep(1), 1200),
            setTimeout(() => setActiveStep(2), 3000),
            setTimeout(() => setActiveStep(3), 4800),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="flex flex-col items-center text-center py-6 px-4 select-none">
            {/* Main animated icon */}
            <div className="relative mb-8">
                <AnimatePresence mode="wait">
                    {steps.map((step, i) =>
                        i === activeStep ? (
                            <motion.div
                                key={step.id}
                                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                className={`w-28 h-28 rounded-full flex items-center justify-center ${step.bg}`}
                            >
                                <step.icon className={`w-14 h-14 ${step.color}`} strokeWidth={1.5} />
                            </motion.div>
                        ) : null
                    )}
                </AnimatePresence>

                {/* Orbiting dots while cooking */}
                {activeStep === 1 && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    >
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 rounded-full bg-orange-400"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${i * 120}deg) translateY(-58px) translateX(-50%)`,
                                }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Truck bounce while delivering */}
                {activeStep === 2 && (
                    <motion.div
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-2xl"
                        animate={{ x: [-8, 8, -8] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                    </motion.div>
                )}
            </div>

            {/* Step label */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                >
                    <p className={`text-2xl font-black mb-1 ${steps[activeStep].color}`}>
                        {steps[activeStep].label}
                    </p>
                    <p className="text-muted-foreground text-sm font-medium">
                        {activeStep === 0 && `Thanks ${customerName || 'there'}! Your order is confirmed.`}
                        {activeStep === 1 && `${branchName} kitchen is preparing your meal.`}
                        {activeStep === 2 && 'Your order is on the way! Cash on Delivery.'}
                        {activeStep === 3 && 'Sit back and enjoy your delicious food! 🍽️'}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Step progress dots */}
            <div className="flex items-center gap-3">
                {steps.map((step, i) => (
                    <motion.div
                        key={step.id}
                        className={`rounded-full transition-all ${i <= activeStep
                            ? `${step.bg} ${step.color} shadow-md`
                            : 'bg-muted'
                            }`}
                        animate={{ width: i === activeStep ? 32 : 10, height: 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                ))}
            </div>

            {/* Steps checklist */}
            <div className="mt-8 w-full max-w-xs space-y-3">
                {steps.map((step, i) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: i <= activeStep ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex items-center gap-3"
                    >
                        <motion.div
                            animate={{ scale: i === activeStep ? [1, 1.2, 1] : 1 }}
                            transition={{ repeat: i === activeStep ? Infinity : 0, duration: 1.5 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i <= activeStep ? step.bg : 'bg-muted'
                                }`}
                        >
                            <step.icon className={`w-4 h-4 ${i <= activeStep ? step.color : 'text-muted-foreground'}`} />
                        </motion.div>
                        <span className={`text-xs font-black uppercase tracking-wider ${i === activeStep ? step.color : i < activeStep ? 'text-muted-foreground line-through' : 'text-muted-foreground/40'
                            }`}>
                            {step.label}
                        </span>
                        {i < activeStep && (
                            <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                        )}
                        {i === activeStep && activeStep < 3 && (
                            <motion.div
                                className="ml-auto"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Loader2 className={`w-4 h-4 ${step.color} animate-spin`} />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const FieldError = ({ message }: { message: string }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
            opacity: 1,
            y: 0,
            backgroundColor: ["rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0.4)", "rgba(239, 68, 68, 0.1)"],
        }}
        transition={{
            backgroundColor: { repeat: Infinity, duration: 0.6, ease: "easeInOut" },
            opacity: { duration: 0.2 }
        }}
        className="text-[10px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 shadow-sm"
    >
        <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="w-1.5 h-1.5 rounded-full bg-red-500"
        />
        {message}
    </motion.div>
);

// --- Main Component ---
export default function CheckoutDialog({ open, onClose, onOrderSuccess, total, branch, items }: CheckoutDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [placedName, setPlacedName] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; location?: string; global?: string }>({});

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    setIsGettingLocation(false);
                    setErrors(prev => ({ ...prev, location: undefined }));
                },
                () => {
                    setIsGettingLocation(false);
                    setErrors(prev => ({ ...prev, location: 'Failed to access location. Please check browser permissions.' }));
                }
            );
        } else {
            setIsGettingLocation(false);
            alert('Geolocation is not supported by your browser.');
        }
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!name || !phone || !address) {
            setErrors({ global: 'Please fill in all mandatory fields (Name, Phone, and Address).' });
            return;
        }

        // Phone number validation: 10 digits only
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setErrors(prev => ({ ...prev, phone: '10-digit phone number is required.' }));
            return;
        }

        // Mandatory live location check
        if (!location) {
            setErrors(prev => ({ ...prev, location: 'Sharing live location is mandatory for delivery.' }));
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
            items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        };

        try {
            if (!supabase) throw new Error('Supabase client not initialized.');
            const { error } = await supabase.from('orders').insert([orderData]);
            if (error) throw error;

            setPlacedName(name);
            setIsSuccess(true);
            onOrderSuccess(); // ← clear cart immediately

            // Close after animation completes (6.5s covers all 4 steps)
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setName(''); setPhone(''); setEmail(''); setAddress(''); setLocation(null);
            }, 6500);
        } catch (error: any) {
            console.error('Error placing order:', error);
            alert('Failed to place order. ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-md bg-card border-border border-2 rounded-[2.5rem] p-8 focus:outline-none">
                    <OrderAnimation customerName={placedName} branchName={branch.name.replace('Sangem Hotels - ', '')} />
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
                        Cash on Delivery at {branch.name.replace('Sangem Hotels - ', '')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handlePlaceOrder} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name *</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input
                                    value={name}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                        setName(val);
                                    }}
                                    required
                                    placeholder="John Doe"
                                    className="pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setPhone(val);
                                    }}
                                    required
                                    type="tel"
                                    placeholder="10-digit number"
                                    className={`pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold transition-all ${errors.phone ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10 border-red-500' : ''}`}
                                />
                            </div>
                            {errors.phone && <FieldError message={errors.phone} />}
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
                            <div className="flex flex-col items-end gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGetLocation}
                                    disabled={isGettingLocation}
                                    className={`text-primary hover:text-primary/80 h-auto p-2 flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all ${errors.location ? 'bg-red-500/10 ring-2 ring-red-500' : ''}`}
                                >
                                    {isGettingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                                    {location ? 'Location Shared' : 'Share Live Location *'}
                                </Button>
                            </div>
                        </div>
                        {errors.location && <FieldError message={errors.location} />}
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
                        {errors.global && (
                            <motion.div
                                animate={{ x: [-2, 2, -2, 2, 0] }}
                                transition={{ duration: 0.4 }}
                                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center"
                            >
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">⚠️ {errors.global}</p>
                            </motion.div>
                        )}
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
