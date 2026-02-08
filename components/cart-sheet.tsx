'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CartItem extends MenuItem {
    quantity: number;
}

interface CartSheetProps {
    cartItems: CartItem[];
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onRemoveItem: (itemId: string) => void;
    onCheckout: () => void;
}

export default function CartSheet({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartSheetProps) {
    const [open, setOpen] = useState(false);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    // ... rest of calculations ...
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.price - (item.price * item.discount / 100);
        return sum + (price * item.quantity);
    }, 0);
    const taxes = subtotal * 0.05;
    const total = subtotal + taxes;

    const handleCheckout = () => {
        setOpen(false);
        onCheckout();
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <div className="fixed bottom-8 right-8 z-50">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <Button className="rounded-full w-20 h-20 shadow-2xl bg-primary hover:bg-primary/90 relative group border-4 border-background">
                            <ShoppingCart className="w-8 h-8 text-white" />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1"
                                    >
                                        <Badge className="rounded-full min-w-[32px] h-8 flex items-center justify-center bg-foreground text-background border-2 border-primary font-black text-xs">
                                            {totalItems}
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </div>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="w-full sm:max-w-md p-0 flex flex-col h-full bg-background border-l border-border z-[2001] shadow-2xl">
                {/* Header with Close Button */}
                <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter uppercase whitespace-nowrap">Your <span className="text-primary italic">Cart</span></h2>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{totalItems} delightful items selected</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpen(false)}
                        className="rounded-full w-12 h-12 border-2 border-border hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {cartItems.length === 0 ? (
                            <motion.div
                                className="text-center py-20 flex flex-col items-center justify-center h-full opacity-60"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-10 border-4 border-dashed border-border">
                                    <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Your cart is empty</h3>
                                <p className="text-xs text-muted-foreground font-medium max-w-[200px] leading-relaxed mx-auto">Add some delicious items from our menu to get started!</p>
                                <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="mt-10 rounded-full px-10 h-14 font-black uppercase tracking-widest text-xs border-2"
                                >
                                    Start Ordering
                                </Button>
                            </motion.div>
                        ) : (
                            cartItems.map((item) => {
                                const discountedPrice = item.price - (item.price * item.discount / 100);
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex gap-6 p-6 border-b border-border group hover:bg-muted/30 transition-all rounded-3xl"
                                    >
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-xl leading-tight group-hover:text-primary transition-colors tracking-tight uppercase">{item.name}</h4>
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">{item.category}</Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="h-10 w-10 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors rounded-xl"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-1 shadow-sm">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                        className="h-10 w-10 rounded-xl hover:bg-muted"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="w-8 text-center font-black text-lg">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="h-10 w-10 rounded-xl hover:bg-muted"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground line-through opacity-50">₹{(item.price * item.quantity).toFixed(0)}</p>
                                                    <p className="font-black text-2xl tracking-tighter">₹{(discountedPrice * item.quantity).toFixed(0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 sm:p-8 bg-muted border-t border-border space-y-4 sm:space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] mt-auto">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Taxes (5%)</span>
                                <span>₹{taxes.toFixed(0)}</span>
                            </div>
                            <Separator className="my-2 sm:my-4 bg-border/50" />
                            <div className="flex justify-between items-end">
                                <div className="space-y-0.5 sm:space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary leading-none">Total Amount</span>
                                    <h3 className="font-black text-3xl sm:text-4xl tracking-tighter leading-none">₹{total.toFixed(0)}<span className="text-primary text-xl">.00</span></h3>
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 sm:h-20 text-xl sm:text-2xl font-black shadow-2xl shadow-primary/30 transition-all group active:scale-[0.98] border-b-4 border-primary-foreground/20" size="lg">
                            Checkout Now <ArrowRight className="ml-2 w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
