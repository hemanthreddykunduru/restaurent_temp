import { ArrowLeft, Gift, Building2, Star, Package, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CorporateGiftingPage() {
    const packages = [
        {
            name: 'Executive Essentials',
            price: '₹5,000',
            items: ['Premium Gift Hamper', '₹3,000 Dining Voucher', 'Exclusive Menu Preview', 'Personalized Card'],
            ideal: 'Client Appreciation'
        },
        {
            name: 'Celebration Collection',
            price: '₹10,000',
            items: ['Luxury Gift Box', '₹7,000 Dining Voucher', 'Complimentary Dessert Platter', 'Priority Reservations', 'Custom Branding'],
            ideal: 'Festivals & Events',
            featured: true
        },
        {
            name: 'Prestige Package',
            price: '₹25,000',
            items: ['Ultra-Premium Hamper', '₹20,000 Dining Voucher', 'Private Dining Experience', 'Chef\'s Special Menu', 'Concierge Service', 'Custom Packaging'],
            ideal: 'VIP Clientele'
        }
    ];

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
            <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto text-center space-y-8">
                    <Badge className="bg-primary text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs">Business Solutions</Badge>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
                        Corporate<br />
                        <span className="text-primary italic">Gifting</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Elevate your business relationships with exquisite culinary experiences and premium gift solutions.
                    </p>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-black mb-12 text-center">Why Choose <span className="text-primary">Sangam</span> for Gifting?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Gift, title: 'Premium Quality', desc: 'Curated selections featuring the finest ingredients and presentation' },
                            { icon: Building2, title: 'Custom Branding', desc: 'Personalized packaging with your company logo and message' },
                            { icon: Star, title: 'Exclusive Experience', desc: 'Access to private dining and chef-curated menus' }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all group text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all mx-auto">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                                <p className="text-muted-foreground font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section className="py-20 px-4 bg-card/30">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-black mb-12 text-center">Our <span className="text-primary">Packages</span></h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {packages.map((pkg, i) => (
                            <div key={i} className={`p-8 rounded-3xl border-2 bg-background hover:shadow-2xl transition-all ${pkg.featured ? 'border-primary shadow-xl scale-105' : 'border-border'}`}>
                                {pkg.featured && (
                                    <Badge className="bg-primary text-white border-none mb-4 font-black">MOST POPULAR</Badge>
                                )}
                                <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                                <div className="text-4xl font-black text-primary mb-4">{pkg.price}</div>
                                <div className="space-y-3 mb-6">
                                    {pkg.items.map((item, j) => (
                                        <div key={j} className="flex items-start gap-2">
                                            <Package className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                            <span className="text-sm font-medium text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-border mb-6">
                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ideal For</span>
                                    <p className="font-bold mt-1">{pkg.ideal}</p>
                                </div>
                                <Button className={`w-full rounded-2xl h-12 font-black ${pkg.featured ? 'bg-primary hover:bg-primary/90' : ''}`} variant={pkg.featured ? 'default' : 'outline'}>
                                    Select Package
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Solutions */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="p-12 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent text-center space-y-6">
                        <h2 className="text-4xl font-black">Need a Custom Solution?</h2>
                        <p className="text-lg text-muted-foreground font-medium">
                            Our corporate gifting specialists will work with you to create bespoke packages tailored to your budget and requirements.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <a href="mailto:corporate@sangamhotels.com" className="inline-flex">
                                <Button className="bg-primary hover:bg-primary/90 rounded-2xl font-black px-8 h-14 gap-2">
                                    <Mail className="w-5 h-5" />
                                    corporate@sangamhotels.com
                                </Button>
                            </a>
                            <a href="tel:+914012345678" className="inline-flex">
                                <Button variant="outline" className="rounded-2xl font-black px-8 h-14 gap-2 border-2">
                                    <Phone className="w-5 h-5" />
                                    +91 40 1234 5678
                                </Button>
                            </a>
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
