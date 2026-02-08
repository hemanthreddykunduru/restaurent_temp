'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';
import { Branch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setOpen(false);
            setSubmitted(false);
            setRating(0);
            setComment('');
        }, 3000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all h-12 px-6 font-black uppercase tracking-widest text-[10px] group">
                    <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Share Feedback
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl bg-card border-border border-2 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden focus:outline-none">
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
                                <DialogTitle className="text-4xl font-black tracking-tighter uppercase leading-none">
                                    Your <span className="text-primary italic">Thoughts</span>
                                </DialogTitle>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-4">Branch: {branch.name.replace('Sangem Hotels - ', '')}</p>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Overall Rating</Label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="group focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-all duration-300 ${rating >= star ? 'fill-primary text-primary scale-110 rotate-[12deg]' : 'text-muted hover:text-primary/30'}`}
                                                />
                                            </button>
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
                                    disabled={rating === 0}
                                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group"
                                >
                                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Submit Feedback
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
