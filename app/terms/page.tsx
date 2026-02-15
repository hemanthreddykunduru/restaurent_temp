import { ArrowLeft, Scale, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 hover:bg-muted">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-bold">Back to Home</span>
                        </Button>
                    </Link>
                    <span className="text-2xl font-black tracking-tighter text-primary">SANGAM</span>
                </div>
            </header>

            {/* Hero */}
            <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto max-w-4xl text-center space-y-6">
                    <Badge className="bg-primary text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs">Legal</Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                        Terms of <span className="text-primary italic">Service</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        Last updated: February 15, 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl space-y-12">
                    <div className="prose prose-lg max-w-none">
                        <div className="space-y-8">
                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Scale className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black">1. Acceptance of Terms</h2>
                                </div>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    By accessing and using Sangam Hotels' website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                                </p>
                            </div>

                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black">2. Reservation & Bookings</h2>
                                </div>
                                <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                    <p>All table reservations are subject to availability and confirmation by our team.</p>
                                    <p>We reserve the right to modify or cancel reservations due to unforeseen circumstances.</p>
                                    <p>Cancellations must be made at least 24 hours in advance for large party bookings (8+ guests).</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black">3. Use of Service</h2>
                                </div>
                                <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                    <p>You agree to use our online ordering and reservation services only for lawful purposes.</p>
                                    <p>You must provide accurate and complete information when placing orders or making reservations.</p>
                                    <p>You are responsible for maintaining the confidentiality of your account information.</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <h2 className="text-2xl font-black mb-4">4. Pricing & Payment</h2>
                                <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                    <p>All prices are listed in Indian Rupees (₹) and are subject to applicable taxes.</p>
                                    <p>We reserve the right to modify prices without prior notice.</p>
                                    <p>Payment is required at the time of service unless otherwise arranged.</p>
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <h2 className="text-2xl font-black mb-4">5. Intellectual Property</h2>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Sangam Hotels and is protected by Indian and international copyright laws.
                                </p>
                            </div>

                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <h2 className="text-2xl font-black mb-4">6. Limitation of Liability</h2>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    Sangam Hotels shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
                                </p>
                            </div>

                            <div className="p-8 rounded-3xl border border-border bg-card">
                                <h2 className="text-2xl font-black mb-4">7. Contact Information</h2>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    For questions about these Terms of Service, please contact us at <a href="mailto:legal@sangamhotels.com" className="text-primary font-bold hover:underline">legal@sangamhotels.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-4 bg-card/30">
                <div className="container mx-auto text-center text-sm text-muted-foreground font-bold">
                    © 2026 Sangam Hotels. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
