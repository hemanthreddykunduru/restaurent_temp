import { ArrowLeft, Lock, Eye, Shield, Database, Cookie } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PrivacyPage() {
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
                    <Badge className="bg-primary text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs">Privacy</Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                        Privacy <span className="text-primary italic">Policy</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium">
                        Last updated: February 15, 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl space-y-12">
                    <div className="p-8 rounded-3xl border-2 border-primary/20 bg-primary/5">
                        <h2 className="text-2xl font-black mb-4">Our Commitment to Your Privacy</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            At Sangam Hotels, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Database className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black">1. Information We Collect</h2>
                            </div>
                            <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                <p><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and delivery address when you make a reservation or place an order.</p>
                                <p><strong className="text-foreground">Payment Information:</strong> Credit card details and billing information (processed securely through our payment partners).</p>
                                <p><strong className="text-foreground">Usage Data:</strong> IP address, browser type, pages visited, and time spent on our website.</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black">2. How We Use Your Information</h2>
                            </div>
                            <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                <p>• Process your reservations and online orders</p>
                                <p>• Send order confirmations and updates</p>
                                <p>• Improve our services and customer experience</p>
                                <p>• Send promotional offers and updates (with your consent)</p>
                                <p>• Comply with legal obligations</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black">3. Data Protection</h2>
                            </div>
                            <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                <p>We implement industry-standard security measures to protect your personal information:</p>
                                <p>• SSL encryption for all data transmission</p>
                                <p>• Secure payment processing through PCI-DSS compliant partners</p>
                                <p>• Regular security audits and updates</p>
                                <p>• Limited access to personal data by authorized personnel only</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Cookie className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black">4. Cookies & Tracking</h2>
                            </div>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <h2 className="text-2xl font-black mb-4">5. Third-Party Sharing</h2>
                            <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                <p>We do not sell your personal information. We may share data with:</p>
                                <p>• Payment processors for transaction handling</p>
                                <p>• Delivery partners for order fulfillment</p>
                                <p>• Analytics providers to improve our services</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <h2 className="text-2xl font-black mb-4">6. Your Rights</h2>
                            <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                                <p>You have the right to:</p>
                                <p>• Access your personal data</p>
                                <p>• Request corrections to your information</p>
                                <p>• Delete your account and data</p>
                                <p>• Opt-out of marketing communications</p>
                                <p>• Withdraw consent at any time</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-border bg-card">
                            <h2 className="text-2xl font-black mb-4">7. Contact Us</h2>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                For privacy-related questions or to exercise your rights, contact us at <a href="mailto:privacy@sangamhotels.com" className="text-primary font-bold hover:underline">privacy@sangamhotels.com</a>
                            </p>
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
