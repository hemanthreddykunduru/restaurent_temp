'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { restaurantInfo } from '@/lib/restaurant-data';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export default function TestimonialsSection() {
    return (
        <section className="py-24 md:py-32 bg-muted/30 px-4 overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 space-y-4"
                >
                    <Badge variant="outline" className="px-6 py-2 rounded-full border-primary text-primary font-black uppercase tracking-widest text-xs">Guest Reviews</Badge>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                        Voices of <span className="text-primary italic">Delight</span>
                    </h2>
                    <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
                        Over three decades of culinary excellence reflected in the words of our cherished patrons.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {restaurantInfo.testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <Card className="p-8 h-full flex flex-col bg-card border-border shadow-md hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] relative overflow-hidden group">
                                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />

                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-1.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'fill-primary text-primary' : 'text-muted-foreground/20'}`}
                                            />
                                        ))}
                                    </div>
                                    <Badge variant="secondary" className="bg-muted text-foreground font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
                                        Verified Visit
                                    </Badge>
                                </div>

                                <div className="flex-1 space-y-4 relative z-10">
                                    <p className="text-lg font-bold text-foreground leading-relaxed italic">
                                        "{testimonial.content}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-8 border-t border-border flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                        {testimonial.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-base leading-none mb-1">{testimonial.name}</p>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
