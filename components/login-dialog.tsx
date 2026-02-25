'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, Eye, EyeOff, Loader2, Shield, ChefHat, Truck, AlertCircle, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { setSession } from '@/lib/auth';

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
}

const BRANCHES = [
    { id: 'br1', label: 'Banjara Hills', email: 'branch1@sangem.com', pass: 'branch@1123' },
    { id: 'br2', label: 'Jubilee Hills', email: 'branch2@sangem.com', pass: 'branch@2123' },
    { id: 'br3', label: 'Gachibowli', email: 'branch3@sangem.com', pass: 'branch@3123' },
    { id: 'br4', label: 'Madhapur', email: 'branch4@sangem.com', pass: 'branch@4123' },
    { id: 'br5', label: 'Kondapur', email: 'branch5@sangem.com', pass: 'branch@5123' },
];

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showBranchPick, setShowBranchPick] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) { setError('Database not connected.'); return; }
        setLoading(true);
        setError('');

        try {
            const { data, error: dbErr } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .eq('password', password)
                .single();

            if (dbErr || !data) {
                setError('Invalid email or password. Please try again.');
                setLoading(false);
                return;
            }

            setSession({ id: data.id, email: data.email, role: data.role, branch_id: data.branch_id });
            onClose();
            resetForm();

            if (data.role === 'admin') {
                router.push('/admin');
            } else if (data.role === 'delivery') {
                router.push('/delivery-dashboard');
            } else {
                router.push('/branch-dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail(''); setPassword(''); setError(''); setShowPass(false); setShowBranchPick(false);
    };

    const handleClose = () => { resetForm(); onClose(); };

    const quickFillAdmin = () => {
        setEmail('admin@sangem.com'); setPassword('admin@123'); setError(''); setShowBranchPick(false);
    };

    const quickFillBranch = (b: typeof BRANCHES[0]) => {
        setEmail(b.email); setPassword(b.pass); setError(''); setShowBranchPick(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 24 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full max-w-md">
                            <div className="relative bg-zinc-950 rounded-[2rem] shadow-2xl border border-zinc-800 overflow-hidden">
                                {/* top accent */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-400 to-primary" />

                                {/* close */}
                                <button onClick={handleClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-all z-10">
                                    <X className="w-4 h-4 text-zinc-400" />
                                </button>

                                <div className="p-7 pt-9">
                                    {/* Header */}
                                    <div className="text-center mb-7">
                                        <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <LogIn className="w-7 h-7 text-primary" />
                                        </div>
                                        <h2 className="text-xl font-black text-white tracking-tight">Staff Portal</h2>
                                        <p className="text-zinc-500 text-xs font-medium mt-1">Sign in to your dashboard</p>
                                    </div>

                                    {/* Quick fill section */}
                                    <div className="mb-6 space-y-2">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">Quick Access</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Admin button */}
                                            <button onClick={quickFillAdmin}
                                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all">
                                                <Shield className="w-4 h-4 text-primary shrink-0" />
                                                <div className="text-left min-w-0">
                                                    <div className="text-[9px] font-black uppercase text-zinc-600">Fill</div>
                                                    <div className="text-xs font-bold text-white truncate">Admin Login</div>
                                                </div>
                                            </button>

                                            {/* Branch picker button */}
                                            <div className="relative">
                                                <button onClick={() => setShowBranchPick(s => !s)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 hover:bg-primary/5 transition-all">
                                                    <ChefHat className="w-4 h-4 text-primary shrink-0" />
                                                    <div className="text-left flex-1 min-w-0">
                                                        <div className="text-[9px] font-black uppercase text-zinc-600">Select</div>
                                                        <div className="text-xs font-bold text-white truncate">Branch Login</div>
                                                    </div>
                                                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform shrink-0 ${showBranchPick ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {showBranchPick && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                                            className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl z-50">
                                                            {BRANCHES.map(b => (
                                                                <button key={b.id} onClick={() => quickFillBranch(b)}
                                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-zinc-800 transition-all text-left first:rounded-t-2xl last:rounded-b-2xl">
                                                                    <span className="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">{b.id.toUpperCase()}</span>
                                                                    <span className="text-xs font-bold text-white">{b.label}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                    {/* divider */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="flex-1 h-px bg-zinc-800" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">or enter manually</span>
                                        <div className="flex-1 h-px bg-zinc-800" />
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleLogin} className="space-y-3">
                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Email Address</label>
                                            <input
                                                type="email" value={email}
                                                onChange={e => { setEmail(e.target.value); setError(''); }}
                                                placeholder="email@sangem.com" required
                                                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPass ? 'text' : 'password'} value={password}
                                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                                    placeholder="••••••••" required
                                                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium text-sm"
                                                />
                                                <button type="button" onClick={() => setShowPass(s => !s)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
                                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {error && (
                                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2 px-4 py-3 bg-red-950/50 border border-red-800/40 rounded-2xl text-red-400 text-sm font-medium">
                                                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <button type="submit" disabled={loading}
                                            className="w-full py-3.5 rounded-2xl bg-primary text-white font-black text-sm tracking-wide hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-primary/20 mt-1">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                                            {loading ? 'Signing in…' : 'Sign In'}
                                        </button>
                                    </form>

                                    {/* hints */}
                                    <div className="mt-5 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">Access Info</div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Shield className="w-3.5 h-3.5 text-primary" /> Admin: admin@sangem.com / admin@123
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <ChefHat className="w-3.5 h-3.5 text-primary" /> Branch: Use the selector above to pick a branch
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <Truck className="w-3.5 h-3.5 text-primary" /> Delivery staff: Use your assigned credentials
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
