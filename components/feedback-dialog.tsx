'use client';

import { useState, useRef } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, User, Upload, X, Receipt } from 'lucide-react';
import { Branch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface FeedbackDialogProps {
    branch: Branch;
}

export default function FeedbackDialog({ branch }: FeedbackDialogProps) {
    const [orderNumber, setOrderNumber] = useState('');
    const [name, setName] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<{ orderNumber?: string; feedbackType?: string; rating?: string; message?: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const feedbackTypes = [
        { value: 'feedback', label: 'General Feedback' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'suggestion', label: 'Suggestion' },
        { value: 'compliment', label: 'Compliment' },
        { value: 'quality', label: 'Food Quality Issue' },
        { value: 'service', label: 'Service Issue' },
        { value: 'cleanliness', label: 'Cleanliness Concern' },
        { value: 'ambiance', label: 'Ambiance/Atmosphere' },
        { value: 'pricing', label: 'Pricing/Value Concern' },
        { value: 'wait-time', label: 'Wait Time Issue' },
        { value: 'staff-behavior', label: 'Staff Behavior' },
        { value: 'menu', label: 'Menu Options/Variety' },
        { value: 'portion', label: 'Portion Size' },
        { value: 'temperature', label: 'Food Temperature Issue' },
        { value: 'allergy', label: 'Allergy/Dietary Concerns' },
        { value: 'reservation', label: 'Reservation Issue' },
        { value: 'billing', label: 'Billing/Payment Issue' },
        { value: 'delivery', label: 'Delivery/Takeout' },
        { value: 'parking', label: 'Parking Issue' },
        { value: 'accessibility', label: 'Accessibility Concern' },
        { value: 'noise', label: 'Noise Level' },
        { value: 'seating', label: 'Seating/Table Issue' },
        { value: 'hygiene', label: 'Hygiene Standards' },
        { value: 'wifi', label: 'WiFi/Connectivity' },
        { value: 'other', label: 'Other' }
    ];

    const validateForm = () => {
        const newErrors: { orderNumber?: string; feedbackType?: string; rating?: string; message?: string } = {};

        if (!orderNumber.trim()) {
            newErrors.orderNumber = 'Order number is required';
        }

        if (!feedbackType) {
            newErrors.feedbackType = 'Please select feedback type';
        }

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (!message.trim()) {
            newErrors.message = 'Please write your feedback';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        newImages.push(event.target.result as string);
                        if (newImages.length === files.length) {
                            setImages(prev => [...prev, ...newImages].slice(0, 5));
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const feedbackData = {
            order_number: orderNumber.trim(),
            customer_name: name.trim() || null,
            feedback_type: feedbackType,
            rating,
            message: message.trim(),
            images,
            branch_id: branch.id,
        };

        try {
            if (!supabase) {
                console.error('Supabase client not initialized. Feedback not stored.');
                setSubmitted(true);
                setIsSubmitting(false);
                return;
            }

            const { error } = await supabase
                .from('feedback')
                .insert([feedbackData]);

            if (error) throw error;

            console.log('Feedback submitted to database:', feedbackData);
            setSubmitted(true);
        } catch (error) {
            console.error('Error storing feedback:', error);
            // Fallback or error notification could go here
            // For now, we'll keep the UI flow but log the error
            setSubmitted(true);
        }

        setIsSubmitting(false);

        setTimeout(() => {
            setOpen(false);
            setTimeout(() => {
                setSubmitted(false);
                setOrderNumber('');
                setName('');
                setFeedbackType('');
                setRating(0);
                setMessage('');
                setImages([]);
                setErrors({});
            }, 300);
        }, 2000);
    };

    if (submitted) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl sm:rounded-full border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all h-8 sm:h-10 px-2 sm:px-5 font-black uppercase tracking-widest text-[8px] sm:text-[9px] group active:scale-95 flex-shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="hidden sm:inline">Share Feedback</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <div className="py-8 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold">Thank You!</h3>
                        <p className="text-sm text-muted-foreground">Your feedback has been received.</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl sm:rounded-full border border-primary/20 hover:border-primary hover:bg-primary/5 transition-all h-8 sm:h-10 px-2 sm:px-5 font-black uppercase tracking-widest text-[8px] sm:text-[9px] group active:scale-95 flex-shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="hidden sm:inline">Share Feedback</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter uppercase leading-none">
                        Share Your <span className="text-primary italic">Feedback</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Order Number */}
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order Number *</Label>
                        <div className="relative">
                            <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <Input
                                value={orderNumber}
                                onChange={(e) => {
                                    setOrderNumber(e.target.value);
                                    setErrors({ ...errors, orderNumber: undefined });
                                }}
                                placeholder="ORD123456"
                                className="pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold focus:ring-primary shadow-inner"
                            />
                        </div>
                        {errors.orderNumber && <p className="text-xs text-red-500 font-bold">{errors.orderNumber}</p>}
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Name (Optional)</Label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="pl-12 bg-muted/50 border-border rounded-2xl h-14 font-bold focus:ring-primary shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Feedback Type */}
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Feedback Type *</Label>
                        <Select value={feedbackType} onValueChange={(value) => {
                            setFeedbackType(value);
                            setErrors({ ...errors, feedbackType: undefined });
                        }}>
                            <SelectTrigger className="bg-muted/50 border-border rounded-2xl h-14 font-bold focus:ring-primary shadow-inner">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {feedbackTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.feedbackType && <p className="text-xs text-red-500 font-bold">{errors.feedbackType}</p>}
                    </div>

                    {/* Rating */}
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Rating *</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                        setRating(star);
                                        setErrors({ ...errors, rating: undefined });
                                    }}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${rating >= star ? 'fill-primary text-primary' : 'text-gray-300'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        {errors.rating && <p className="text-xs text-red-500 font-bold">{errors.rating}</p>}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message *</Label>
                        <Textarea
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setErrors({ ...errors, message: undefined });
                            }}
                            placeholder="Tell us about your experience..."
                            className="min-h-[100px] bg-muted/50 border-border rounded-2xl font-medium focus:ring-primary shadow-inner"
                        />
                        {errors.message && <p className="text-xs text-red-500 font-bold">{errors.message}</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Images (Optional, Max 5)</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={images.length >= 5}
                            className="w-full border-2 border-dashed hover:border-primary rounded-2xl h-12 font-bold"
                        >
                            <Upload className="w-4 h-4 mr-2 text-primary" />
                            Upload Images ({images.length}/5)
                        </Button>

                        {images.length > 0 && (
                            <div className="grid grid-cols-5 gap-2 mt-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-border group">
                                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-3xl h-16 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-5 h-5" />
                                Submit Feedback
                            </span>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
