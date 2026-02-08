'use client';

import { motion } from 'framer-motion';
import { Star, Plus, Minus } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MenuCardProps {
    item: MenuItem;
    onAdd: () => void;
    onRemove: () => void;
    quantity: number;
}

export default function MenuCard({ item, onAdd, onRemove, quantity }: MenuCardProps) {
    const discountedPrice = item.price - (item.price * item.discount / 100);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative bg-card border-border border-2 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 w-full"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.discount > 0 && (
                        <Badge className="bg-primary text-white border-none px-2 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest shadow-lg">
                            {item.discount}% OFF
                        </Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/95 text-black px-2 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest shadow-md">
                        {item.foodType}
                    </Badge>
                </div>

                {item.isSpecial && (
                    <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white shadow-xl">
                            <Star className="w-3 h-3 fill-white" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm sm:text-base font-black uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors flex-1">{item.name}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-[9px] font-black tracking-widest">{item.rating}</span>
                        </div>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed tracking-tight">{item.description}</p>
                    <Badge variant="outline" className="text-[7px] font-black uppercase tracking-[0.2em] bg-muted/30 text-muted-foreground border-border px-1.5 py-0">
                        {item.category}
                    </Badge>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="space-y-0">
                        <p className="text-base sm:text-lg font-black tracking-tighter">₹{discountedPrice.toFixed(0)}</p>
                        {item.discount > 0 && (
                            <p className="text-[8px] text-muted-foreground line-through opacity-50 font-bold">₹{item.price}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        {quantity > 0 ? (
                            <div className="flex items-center gap-1.5 bg-muted/50 p-0.5 rounded-lg border border-border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onRemove}
                                    className="h-7 w-7 rounded-md hover:bg-background transition-all"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-4 text-center font-black text-xs">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onAdd}
                                    className="h-7 w-7 rounded-md hover:bg-background transition-all"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={onAdd}
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white rounded-lg h-8 px-3 font-black uppercase tracking-widest text-[9px] shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
