'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Smartphone, Banknote, ArrowRight } from 'lucide-react';
import { Branch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface CheckoutDialogProps {
    open: boolean;
    onClose: () => void;
    total: number;
    branch: Branch;
}

export default function CheckoutDialog({ open, onClose, total, branch }: CheckoutDialogProps) {
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('upi');

    const handlePlaceOrder = () => {
        alert(`Order placed successfully! Total: ₹${total.toFixed(0)}`);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-[calc(100%-1rem)] bg-card border-border border-2 rounded-[2.5rem] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] focus:outline-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <DialogHeader className="mb-6 relative z-10 text-left">
                    <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
                        Confirm Your <span className="text-primary italic">Order</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-10 relative z-10">
                    <div className="space-y-6">
                        <Label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Service Mode</Label>
                        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as any)}>
                            <TabsList className="grid w-full grid-cols-3 bg-muted p-1.5 rounded-2xl h-16 border border-border">
                                <TabsTrigger value="delivery" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl rounded-xl transition-all font-black text-xs uppercase tracking-widest h-full">
                                    Delivery
                                </TabsTrigger>
                                <TabsTrigger value="takeaway" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl rounded-xl transition-all font-black text-xs uppercase tracking-widest h-full">
                                    Takeaway
                                </TabsTrigger>
                                <TabsTrigger value="dine-in" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl rounded-xl transition-all font-black text-xs uppercase tracking-widest h-full">
                                    Dine-In
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <Label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    { id: 'upi', label: 'UPI', icon: Smartphone },
                                    { id: 'card', label: 'Card', icon: CreditCard },
                                    { id: 'cash', label: 'Cash', icon: Banknote },
                                    { id: 'wallet', label: 'Wallet', icon: Wallet },
                                ].map((method) => (
                                    <motion.div key={method.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <div className="relative h-full">
                                            <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                                            <Label
                                                htmlFor={method.id}
                                                className="flex flex-col items-center justify-center rounded-3xl border-2 border-border bg-card p-4 sm:p-6 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full"
                                            >
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-colors ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                    <method.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </div>
                                                <span className={`font-black text-[9px] sm:text-[10px] uppercase tracking-widest ${paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`}>{method.label}</span>
                                            </Label>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="bg-muted p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-inner">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8">
                            <div className="text-center sm:text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Total Payable</p>
                                <h3 className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter">₹{total.toFixed(0)}<span className="text-primary text-xl">.00</span></h3>
                            </div>
                            <div className="text-center sm:text-right space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                                    {orderType === 'delivery' && 'Est. 45 Mins'}
                                    {orderType === 'takeaway' && 'Pick-up: 20 Mins'}
                                    {orderType === 'dine-in' && 'Priority Active'}
                                </div>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none truncate max-w-[150px]">{branch.name.replace('Sangam Hotels - ', '')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-16 text-xs font-black uppercase tracking-widest border-2 hover:bg-muted transition-all">
                            Review Cart
                        </Button>
                        <Button onClick={handlePlaceOrder} className="flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-sm sm:text-lg font-black shadow-xl hover:shadow-primary/30 transition-all group">
                            Place Order <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
