'use client';

import { motion } from 'framer-motion';
import { Check, Utensils, PartyPopper, Truck, Briefcase } from 'lucide-react';
import { restaurantInfo } from '@/lib/restaurant-data';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const iconMap: { [key: string]: any } = {
    utensils: Utensils,
    party: PartyPopper,
    truck: Truck,
    briefcase: Briefcase
};

export default function AboutSection() {
    return (
        <section className="py-32 bg-background relative overflow-hidden px-4">
            {/* Background elements for premium feel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary text-primary font-black uppercase tracking-widest text-xs">Our Heritage</Badge>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                            {restaurantInfo.tagline.split('Since')[0]}
                            <span className="text-primary italic block">Since 1995</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                            {restaurantInfo.aboutUs}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 grid grid-cols-2 gap-4"
                    >
                        {restaurantInfo.services.map((service, index) => {
                            const Icon = iconMap[service.icon];
                            return (
                                <Card key={index} className="p-8 group hover:bg-primary transition-all duration-500 rounded-[2.5rem] border-border hover:border-primary shadow-lg hover:shadow-primary/20">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                                        {Icon && <Icon className="w-6 h-6 text-primary group-hover:text-white" />}
                                    </div>
                                    <h3 className="font-black text-lg mb-2 group-hover:text-white uppercase tracking-tight">{service.title}</h3>
                                    <p className="text-xs text-muted-foreground group-hover:text-white/80 leading-relaxed">{service.description}</p>
                                </Card>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
