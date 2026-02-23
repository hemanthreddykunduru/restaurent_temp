'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles, ChefHat, Clock } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
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

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.price - (item.price * (item.discount || 0) / 100);
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
                <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                    >
                        <Button className="rounded-2xl w-14 h-14 sm:w-16 sm:h-16 shadow-xl bg-primary hover:bg-primary/90 relative group border-2 border-white dark:border-zinc-900 p-0">
                            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 z-20"
                                    >
                                        <Badge className="rounded-full min-w-[20px] h-5 sm:min-w-[24px] sm:h-6 flex items-center justify-center bg-zinc-900 text-white border border-white dark:border-zinc-800 font-black text-[9px] sm:text-[10px] shadow-lg">
                                            {totalItems}
                                        </Badge>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </div>
            </SheetTrigger>

            <SheetContent showCloseButton={false} className="w-full sm:max-w-[400px] p-0 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-[2001] shadow-2xl">
                <SheetHeader className="sr-only">
                    <SheetTitle>Your Cart</SheetTitle>
                    <SheetDescription>Review your selected dishes.</SheetDescription>
                </SheetHeader>

                {/* Compact Header */}
                <div className="p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight uppercase text-zinc-900 dark:text-white">
                                    Your <span className="text-primary italic">Cart</span>
                                </h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                                    {totalItems} items selected
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            className="rounded-xl w-10 h-10 border border-zinc-100 dark:border-zinc-800 hover:bg-primary hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Items List - Scaled Down */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
                    <AnimatePresence initial={false} mode="popLayout">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                                <ChefHat className="w-12 h-12 text-zinc-300 mb-4" />
                                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">Empty Cart</h3>
                                <p className="text-xs text-zinc-500 font-medium">Add some flavors to get started</p>
                            </div>
                        ) : (
                            cartItems.map((item) => {
                                const discountedPrice = item.price - (item.price * (item.discount || 0) / 100);
                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all sm:p-4"
                                    >
                                        <div className="flex gap-4">
                                            {/* Compact Image */}
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white truncate">
                                                            {item.name}
                                                        </h4>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-1 border border-zinc-100 dark:border-zinc-700/50">
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-5 text-center font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">{item.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white dark:bg-zinc-700 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="font-black text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white">
                                                        ₹{Math.floor(discountedPrice * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Streamlined Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Subtotal</span>
                                <span>₹{Math.floor(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Tax (5%)</span>
                                <span>₹{Math.floor(taxes)}</span>
                            </div>
                            <Separator className="bg-zinc-100 dark:bg-zinc-800/50" />
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Total Amount</span>
                                <h3 className="font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">
                                    ₹{Math.floor(total)}<span className="text-primary text-sm">.00</span>
                                </h3>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            className="w-full h-14 sm:h-16 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-black shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            Checkout <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
