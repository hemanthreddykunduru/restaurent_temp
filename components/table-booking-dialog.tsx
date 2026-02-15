'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, Phone, User, ArrowRight } from 'lucide-react';
import { Branch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
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
                <Button variant="outline" className="gap-1 sm:gap-2 bg-background hover:bg-muted border-border text-foreground rounded-xl px-2 sm:px-4 py-2 sm:py-3 h-auto shadow-sm active:scale-95 transition-all flex-shrink-0">
                    <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    <span className="font-bold text-xs sm:text-sm tracking-tight text-foreground hidden sm:inline">Book a Table</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[calc(100%-1rem)] bg-card border-border border-2 rounded-[2rem] p-4 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh] focus:outline-none">
                <DialogHeader className="mb-6 sm:mb-8 text-left">
                    <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase whitespace-pre-line leading-none">
                        Reserve Your <span className="text-primary italic">Table</span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Book a table at your preferred branch by providing your details.
                    </DialogDescription>
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
                        <div className="space-y-4">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Date</Label>
                            <div className="p-1 sm:p-2 rounded-2xl border border-border bg-muted/30 shadow-inner flex justify-center bg-card">
                                <CalendarComponent
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="w-full"
                                    disabled={(date: Date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
                        <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="submit" className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-white rounded-3xl h-16 sm:h-20 text-lg sm:text-2xl font-black shadow-2xl shadow-primary/30 transition-all group border-b-4 border-primary-foreground/20 flex items-center justify-center gap-2">
                                <span className="translate-y-[1px]">Confirm Booking</span>
                                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform shrink-0" />
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
