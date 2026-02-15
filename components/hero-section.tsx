'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export default function HeroSection() {
    const scrollToMenu = () => {
        const menuSection = document.getElementById('menu-section');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full pt-32 pb-16 md:py-32 bg-transparent overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground">
                            Experience The Best <br />
                            <span className="text-primary italic">In Hyderabad</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg md:text-2xl text-muted-foreground max-w-2xl font-medium"
                    >
                        Bringing you the authentic secrets of Indian cuisine since 1995. Fresh ingredients, legendary recipes, and world-class service.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                    >
                        <Button
                            size="lg"
                            onClick={scrollToMenu}
                            className="bg-primary hover:bg-primary/90 text-white font-bold text-lg h-14 px-8 rounded-full shadow-lg"
                        >
                            Order Now <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10 font-bold text-lg h-14 px-8 rounded-full"
                        >
                            <Calendar className="mr-2 w-5 h-5" /> Table Booking
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
