'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';
import { Branch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FeedbackDialogProps {
    branch: Branch;
}

export default function FeedbackDialog({ branch }: FeedbackDialogProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);

        // Auto-close after 3 seconds
        setTimeout(() => {
            setOpen(false);
            // Reset after animation
            setTimeout(() => {
                setSubmitted(false);
                setRating(0);
                setComment('');
            }, 500);
        }, 3000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl sm:rounded-full border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all h-8 sm:h-10 px-2 sm:px-5 font-black uppercase tracking-widest text-[8px] sm:text-[9px] group active:scale-95 flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="hidden sm:inline">Share Feedback</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl w-[calc(100%-1rem)] bg-card border-border border-2 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden focus:outline-none">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-8"
                        >
                            <DialogHeader>
                                <DialogTitle className="text-3xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
                                    Your <span className="text-primary italic">Thoughts</span>
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    Share your dining experience with us by rating and commenting.
                                </DialogDescription>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-4">Branch: {branch.name.replace('Sangam Hotels - ', '')}</p>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Overall Rating</Label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                type="button"
                                                whileHover={{ scale: 1.15, rotate: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setRating(star)}
                                                className="group focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-all duration-300 ${rating >= star ? 'fill-primary text-primary scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'text-muted-foreground/30 hover:text-primary/30'}`}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Special Comments</Label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us about your experience..."
                                        className="min-h-[120px] bg-muted border-border border-2 focus-visible:ring-primary rounded-2xl p-4 text-sm font-medium resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={rating === 0 || isSubmitting}
                                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-3xl h-20 text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all active:scale-[0.98] group flex items-center justify-center border-b-4 border-primary-foreground/20"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <Send className="w-6 h-6 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Submit Your Feedback
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Thank <span className="text-primary italic">You</span>!</h3>
                            <p className="text-sm text-muted-foreground font-medium max-w-[280px]">Your feedback helps us maintain our legacy of excellence.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
