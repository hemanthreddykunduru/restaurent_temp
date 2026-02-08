'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, Phone, User, ArrowRight } from 'lucide-react';
import { Branch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface TableBookingDialogProps {
    branch: Branch;
}

export default function TableBookingDialog({ branch }: TableBookingDialogProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Table booking request submitted! Our host will call you shortly.');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="gap-2 bg-background hover:bg-muted border-border text-foreground rounded-xl px-5 py-3 h-auto shadow-sm">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm tracking-tight text-foreground">Book a Table</span>
                        </Button>
                    </motion.div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[calc(100%-1rem)] bg-card border-border border-2 rounded-[2rem] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh] focus:outline-none">
                <DialogHeader className="mb-6 sm:mb-8 text-left">
                    <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase whitespace-pre-line leading-none">
                        Reserve Your <span className="text-primary italic">Table</span>
                    </DialogTitle>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[8px] sm:text-[10px] mt-2">Branch: {branch.name.replace('Sangam Hotels - ', '')}</p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input id="name" placeholder="Full Name" className="pl-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl h-14 font-bold focus:ring-primary shadow-inner" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input id="phone" type="tel" placeholder="+91 XXXX XXX XXX" className="pl-12 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/50 rounded-2xl h-14 font-bold focus:ring-primary shadow-inner" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guests" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Guests</Label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input id="guests" type="number" min="1" max="20" placeholder="2" className="pl-12 bg-muted/50 border-border text-foreground rounded-2xl h-14 font-bold focus:ring-primary shadow-inner" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Time</Label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                <Input id="time" type="time" className="pl-12 bg-muted/50 border-border text-foreground rounded-2xl h-14 font-bold focus:ring-primary shadow-inner" required />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Date</Label>
                            <div className="p-2 sm:p-4 rounded-2xl border border-border bg-muted/30 shadow-inner flex justify-center">
                                <CalendarComponent
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="scale-90 sm:scale-100 origin-center"
                                    disabled={(date: Date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
                                />
                            </div>
                        </div>

                        <motion.div className="pt-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-lg font-black shadow-xl hover:shadow-primary/20 transition-all group">
                                Confirm Booking <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
