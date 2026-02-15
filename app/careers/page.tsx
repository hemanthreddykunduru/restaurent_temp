import { ArrowLeft, Briefcase, Users, TrendingUp, Heart, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CareersPage() {
    const positions = [
        {
            title: 'Executive Chef',
            department: 'Culinary',
            location: 'Banjara Hills',
            type: 'Full-time',
            experience: '8+ years',
            description: 'Lead our culinary team in creating exceptional dining experiences with traditional Indian flavors.'
        },
        {
            title: 'Restaurant Manager',
            department: 'Operations',
            location: 'Multiple Locations',
            type: 'Full-time',
            experience: '5+ years',
            description: 'Oversee daily operations and ensure exceptional guest experiences across our Hyderabad outlets.'
        },
        {
            title: 'Sommelier',
            department: 'Beverage',
            location: 'Jubilee Hills',
            type: 'Full-time',
            experience: '3+ years',
            description: 'Curate wine selections and provide expert pairing recommendations to our discerning guests.'
        },
        {
            title: 'Marketing Coordinator',
            department: 'Marketing',
            location: 'Gachibowli',
            type: 'Full-time',
            experience: '2+ years',
            description: 'Drive brand awareness and execute marketing campaigns across digital and traditional channels.'
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
                    <Badge className="bg-primary text-white border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs">Join Our Team</Badge>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
                        Build Your Career<br />
                        <span className="text-primary italic">With Excellence</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                        Join the Sangam family and be part of India's premier fine-dining experience. We're always looking for passionate professionals.
                    </p>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-black mb-12 text-center">Why Choose <span className="text-primary">Sangam</span>?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: 'Collaborative Culture', desc: 'Work with a passionate team dedicated to culinary excellence' },
                            { icon: TrendingUp, title: 'Career Growth', desc: 'Clear advancement paths and professional development opportunities' },
                            { icon: Heart, title: 'Work-Life Balance', desc: 'Competitive benefits and flexible scheduling options' },
                            { icon: Briefcase, title: 'Industry Leadership', desc: 'Learn from the best in Indian fine-dining hospitality' }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all group">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                                <p className="text-muted-foreground font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 px-4 bg-card/30">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-black mb-12 text-center">Current <span className="text-primary">Openings</span></h2>
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {positions.map((pos, i) => (
                            <div key={i} className="p-8 rounded-3xl border-2 border-border bg-background hover:border-primary/50 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">{pos.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="font-bold">{pos.department}</Badge>
                                            <Badge variant="outline" className="font-bold">{pos.type}</Badge>
                                            <Badge variant="outline" className="font-bold">{pos.experience}</Badge>
                                        </div>
                                    </div>
                                    <Button className="bg-primary hover:bg-primary/90 rounded-2xl font-black px-8 h-12 whitespace-nowrap">
                                        Apply Now
                                    </Button>
                                </div>
                                <p className="text-muted-foreground font-medium mb-3">{pos.description}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-bold">{pos.location}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-2xl text-center space-y-8">
                    <h2 className="text-4xl font-black">Don't See Your Role?</h2>
                    <p className="text-lg text-muted-foreground font-medium">
                        We're always interested in meeting talented professionals. Send us your resume and we'll keep you in mind for future opportunities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="mailto:careers@sangamhotels.com" className="inline-flex">
                            <Button className="bg-primary hover:bg-primary/90 rounded-2xl font-black px-8 h-14 gap-2">
                                <Mail className="w-5 h-5" />
                                careers@sangamhotels.com
                            </Button>
                        </a>
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
