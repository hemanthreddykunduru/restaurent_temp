'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ShoppingBag, UtensilsCrossed, Truck, MessageSquare, LogOut,
    Star, Plus, Pencil, Trash2, X, Check, Loader2, Search, RefreshCcw,
    Phone, ChefHat, DollarSign, Clock, Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSession, clearSession, AuthUser } from '@/lib/auth';

type Tab = 'overview' | 'orders' | 'dishes' | 'delivery' | 'feedback';

interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    delivery_address: string;
    branch_id: string;
    total_amount: number;
    payment_method: string;
    current_stage?: string;
    order_status?: string;
    status?: string;
    stage?: string;
    items: any;
    delivery_partner_id?: string;
    delivery_agent_id?: string;
    rider_id?: string;
}

function getStatus(o: Order): string {
    return o.order_status || o.current_stage || o.status || o.stage || 'pending';
}
function getPartnerId(o: Order) {
    return o.delivery_partner_id || o.delivery_agent_id || o.rider_id;
}


function safeParseItems(items: any): any[] {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
        try {
            const parsed = JSON.parse(items);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            console.error('Failed to parse items:', e);
            return [];
        }
    }
    return [];
}

interface Dish { id: number; dish_id: number; branch_id: string; name: string; price: number; image_url: string; description: string; category: string; cuisine: string; dietary_type: string; rating: number; prep_time: number; }
interface Partner { id: string; name: string; phone_number: string; branch_id: string; status: string; }
interface Feedback { id: number; order_number: string; customer_name: string; feedback_type: string; rating: number; message: string; branch_id: string; created_at: string; featured?: boolean; }

const BN: Record<string, string> = { br1: 'Banjara Hills', br2: 'Jubilee Hills', br3: 'Gachibowli', br4: 'Madhapur', br5: 'Kondapur' };
const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
const CATEGORIES = ['Starters', 'Main Course', 'Biryani', 'Breads', 'Desserts', 'Beverages'];

function cls(...c: (string | undefined | false)[]) { return c.filter(Boolean).join(' '); }

function Pill({ text }: { text: string }) {
    const m: Record<string, string> = { pending: 'bg-yellow-900/40 text-yellow-400', confirmed: 'bg-blue-900/40 text-blue-400', preparing: 'bg-orange-900/40 text-orange-400', ready: 'bg-purple-900/40 text-purple-400', delivered: 'bg-green-900/40 text-green-400', cancelled: 'bg-red-900/40 text-red-400', active: 'bg-green-900/40 text-green-400', on_delivery: 'bg-blue-900/40 text-blue-400', inactive: 'bg-zinc-800 text-zinc-500' };
    return <span className={cls('px-2.5 py-1 rounded-full text-[10px] font-black uppercase', m[text] || 'bg-zinc-800 text-zinc-400')}>{text.replace('_', ' ')}</span>;
}
function Field({ label, value, onChange, type = 'text', disabled = false }: { label: string; value: any; onChange: (v: any) => void; type?: string; disabled?: boolean }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">{label}</label>
            <input type={type} value={value || ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} disabled={disabled}
                className={cls('w-full px-4 py-3 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40', disabled && 'opacity-40 cursor-not-allowed')} />
        </div>
    );
}
function Sel({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: { v: string; l: string }[] }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">{label}</label>
            <select value={value || ''} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
        </div>
    );
}

export default function BranchDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [branchId, setBranchId] = useState('');
    const [tab, setTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    // Branch names: load admin-set overrides
    const [branchNames, setBranchNames] = useState<Record<string, string>>({ ...BN });

    useEffect(() => {
        const s = getSession();
        if (!s || s.role !== 'branch') { router.replace('/'); return; }
        setUser(s);
        setBranchId(s.branch_id || '');
        const saved = localStorage.getItem('sangem_branch_names');
        if (saved) setBranchNames(JSON.parse(saved));
    }, []);

    const loadAll = useCallback(async () => {
        if (!supabase || !branchId) return;
        setLoading(true);
        const [o, d, p, f] = await Promise.all([
            supabase.from('orders').select('*').eq('branch_id', branchId).order('created_at', { ascending: false }).limit(200),
            supabase.from('dishes').select('*').eq('branch_id', branchId).order('dish_id'),
            supabase.from('delivery_partners').select('*').eq('branch_id', branchId).order('name'),
            supabase.from('feedback').select('*').eq('branch_id', branchId).order('created_at', { ascending: false }),
        ]);

        console.log('--- BRANCH_SYNC_DEBUG (' + branchId + ') ---');
        console.log('Orders Data Status:', o.error ? 'ERROR' : 'OK');
        if (o.error) console.error('ORDERS_FETCH_ERROR:', o.error);
        console.log('Total Orders Recieved:', o.data?.length || 0);
        if (o.data && o.data.length > 0) {
            console.log('Sample Order Data:', o.data[0]);
        }

        if (o.data) setOrders(o.data);
        if (d.data) setDishes(d.data);
        if (p.data) setPartners(p.data);
        if (f.data) setFeedback(f.data);
        setLoading(false);
    }, [branchId]);


    useEffect(() => { if (branchId) loadAll(); }, [branchId, loadAll]);

    const logout = () => { clearSession(); router.push('/'); };
    const branchLabel = branchNames[branchId] || branchId;

    const navTabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => getStatus(o) === 'pending').length },
        { id: 'dishes', label: 'My Dishes', icon: UtensilsCrossed, badge: dishes.length },

        { id: 'delivery', label: 'Delivery', icon: Truck, badge: partners.length },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: feedback.length },
    ];

    if (!user) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            <aside className="w-60 shrink-0 bg-black/80 border-r border-white/5 flex flex-col fixed h-full z-20">
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-white font-black text-base italic">S</span>
                    </div>
                    <div><div className="font-black text-sm">SANGEM</div><div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Branch Portal</div></div>
                </div>
                <div className="px-4 py-3 border-b border-white/5">
                    <div className="px-3 py-2.5 rounded-2xl bg-white/5">
                        <div className="flex items-center gap-1.5 mb-1"><ChefHat className="w-3.5 h-3.5 text-primary" /><span className="text-[9px] font-black uppercase text-primary">{branchLabel}</span></div>
                        <div className="text-xs font-bold text-white truncate">{user.email}</div>
                        <div className="text-[9px] text-zinc-600 uppercase font-black">{branchId}</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {navTabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={cls('w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                                tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white hover:bg-white/5')}>
                            <t.icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1 text-left">{t.label}</span>
                            {!!t.badge && <span className={cls('text-[9px] font-black px-1.5 py-0.5 rounded-full', tab === t.id ? 'bg-white/20' : 'bg-primary/20 text-primary')}>{t.badge}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-white/5">
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:text-red-400 hover:bg-red-900/10 transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-60 overflow-auto">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">{navTabs.find(t => t.id === tab)?.label}</h1>
                            <p className="text-zinc-500 text-sm font-medium mt-0.5">{branchLabel} · Branch Dashboard</p>
                        </div>
                        <button onClick={loadAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-sm font-bold transition-all">
                            <RefreshCcw className="w-4 h-4" /> Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-40"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                                {tab === 'overview' && <BranchOverview orders={orders} dishes={dishes} partners={partners} feedback={feedback} />}
                                {tab === 'orders' && <BranchOrders orders={orders} partners={partners} onRefresh={loadAll} />}
                                {tab === 'dishes' && <BranchDishesTab dishes={dishes} branchId={branchId} onRefresh={loadAll} />}
                                {tab === 'delivery' && <BranchDelivery partners={partners} branchId={branchId} onRefresh={loadAll} />}
                                {tab === 'feedback' && <BranchFeedbackTab feedback={feedback} />}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}

/* ── OVERVIEW ── */
function BranchOverview({ orders, dishes, partners, feedback }: { orders: Order[]; dishes: Dish[]; partners: Partner[]; feedback: Feedback[] }) {
    const rev = orders.reduce((s, o) => s + Number(o.total_amount), 0);
    const pending = orders.filter(o => getStatus(o) === 'pending').length;

    const avgR = feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : '—';
    const activeP = partners.filter(p => p.status === 'active').length;

    // Bar chart – last 7 days
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now); d.setDate(d.getDate() - (6 - i));
        return { label: d.toLocaleDateString('en-IN', { weekday: 'short' }), date: d.toISOString().split('T')[0] };
    });
    const dayCounts = days.map(({ date }) => orders.filter(o => o.created_at?.startsWith(date)).length);
    const maxDay = Math.max(...dayCounts, 1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: ShoppingBag, label: 'Orders', val: orders.length, sub: `${pending} pending`, c: 'blue' },
                    { icon: DollarSign, label: 'Revenue', val: `₹${(rev / 1000).toFixed(1)}K`, c: 'green' },
                    { icon: Star, label: 'Avg Rating', val: avgR, sub: `${feedback.length} reviews`, c: 'yellow' },
                    { icon: Truck, label: 'Active Riders', val: activeP, sub: `of ${partners.length}`, c: 'purple' },
                ].map(({ icon: I, label, val, sub, c }) => (
                    <div key={label} className={`rounded-3xl p-5 border bg-${c}-950/40 border-${c}-800/30 text-${c}-400 relative overflow-hidden`}>
                        <I className="w-5 h-5 mb-2 opacity-80" />
                        <div className="text-3xl font-black">{val}</div>
                        <div className="text-sm font-bold opacity-70 mt-0.5">{label}</div>
                        {sub && <div className="text-xs opacity-40">{sub}</div>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 7-day chart */}
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-5">Orders — Last 7 Days</h3>
                    <div className="flex items-end gap-2 h-28">
                        {dayCounts.map((c, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[9px] font-black text-white">{c || ''}</span>
                                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((c / maxDay) * 100, 4)}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary min-h-[4px]" />
                                <span className="text-[9px] font-black text-zinc-500">{days[i].label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent orders */}
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-5">Recent Orders</h3>
                    <div className="space-y-2.5">
                        {orders.slice(0, 5).map(o => (
                            <div key={o.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/60">
                                <div>
                                    <div className="text-sm font-bold">{o.customer_name}</div>
                                    <div className="text-xs text-zinc-500">{o.customer_phone}</div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-primary font-black text-sm">₹{Number(o.total_amount).toLocaleString()}</span>
                                    <Pill text={getStatus(o)} />
                                </div>

                            </div>
                        ))}
                        {orders.length === 0 && <div className="text-center py-8 text-zinc-600 text-sm">No orders yet</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── ORDERS ── */
function BranchOrders({ orders, partners, onRefresh }: { orders: Order[]; partners: Partner[]; onRefresh: () => void }) {
    const [q, setQ] = useState('');
    const [sf, setSf] = useState('all');
    const [busy, setBusy] = useState<string | null>(null);

    const filtered = orders.filter(o => {
        const mq = o.customer_name.toLowerCase().includes(q.toLowerCase()) || o.customer_phone?.includes(q);
        const ms = sf === 'all' || getStatus(o) === sf;
        return mq && ms;
    });


    const updateStatus = async (id: string, status: string) => {
        if (!supabase) return; setBusy(id);
        // Sync all status field variants
        await supabase.from('orders').update({
            order_status: status,
            current_stage: status,
            status: status,
            stage: status
        }).eq('id', id);
        await onRefresh(); setBusy(null);
    };
    const assignPartner = async (orderId: string, pid: string) => {
        if (!supabase || !pid) return; setBusy(orderId);
        // Update all status and partner ID variants
        await supabase.from('orders').update({
            delivery_partner_id: pid,
            delivery_agent_id: pid,
            rider_id: pid,
            order_status: 'confirmed',
            current_stage: 'confirmed',
            status: 'confirmed',
            stage: 'confirmed'
        }).eq('id', orderId);
        await supabase.from('delivery_partners').update({ status: 'on_delivery' }).eq('id', pid);
        await onRefresh(); setBusy(null);
    };


    const active = partners.filter(p => p.status === 'active');

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-52">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or phone…" className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-medium placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <select value={sf} onChange={e => setSf(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Status</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="space-y-3">
                {filtered.map(order => (
                    <div key={order.id} className="bg-zinc-900 rounded-3xl border border-white/5 p-5 hover:border-primary/20 transition-all">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-52">
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className="font-black text-base">{order.customer_name}</span>
                                    <Pill text={getStatus(order)} />
                                </div>
                                <div className="flex flex-wrap gap-3 text-sm text-zinc-400 mb-2">
                                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{order.customer_phone}</span>
                                    <span className="text-primary font-black">₹{Number(order.total_amount).toLocaleString()}</span>
                                    <span className="text-zinc-600 text-xs">{order.payment_method}</span>
                                </div>
                                <div className="text-xs text-zinc-500 mb-2">{order.delivery_address}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {safeParseItems(order.items).slice(0, 5).map((it: any, i: number) => (
                                        <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-bold">{it.name || it.id} ×{it.quantity || 1}</span>
                                    ))}
                                    {safeParseItems(order.items).length > 5 && <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 text-[10px] font-bold">+{safeParseItems(order.items).length - 5}</span>}
                                </div>
                                <div className="text-[10px] text-zinc-600 mt-2">{new Date(order.created_at).toLocaleString('en-IN')}</div>

                            </div>
                            <div className="flex flex-col gap-2.5 min-w-44">
                                <div>
                                    <label className="block text-[9px] font-black uppercase text-zinc-500 mb-1">Update Status</label>
                                    <select value={getStatus(order)} onChange={e => updateStatus(order.id, e.target.value)} disabled={busy === order.id}
                                        className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 border border-white/10 text-white focus:outline-none cursor-pointer">
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase text-zinc-500 mb-1">Assign Rider ({active.length} free)</label>
                                    <select value={getPartnerId(order) || ''} onChange={e => assignPartner(order.id, e.target.value)} disabled={busy === order.id}
                                        className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 border border-white/10 text-white focus:outline-none cursor-pointer">
                                        <option value="">Pick rider…</option>
                                        {active.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>

                                {busy === order.id && <div className="flex items-center gap-1.5 text-xs text-primary font-bold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Updating…</div>}
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="text-center py-20 text-zinc-600 font-medium">No orders found</div>}
            </div>
        </div>
    );
}

/* ── DISHES ── */
function BranchDishesTab({ dishes, branchId, onRefresh }: { dishes: Dish[]; branchId: string; onRefresh: () => void }) {
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('all');
    const [editing, setEditing] = useState<Dish | null>(null);
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [delId, setDelId] = useState<number | null>(null);

    const cats = [...new Set(dishes.map(d => d.category))].filter(Boolean).sort();
    const filtered = dishes.filter(d => {
        const mq = d.name.toLowerCase().includes(q.toLowerCase()) || d.description?.toLowerCase().includes(q.toLowerCase());
        const mc = cat === 'all' || d.category === cat;
        return mq && mc;
    });

    const save = async (form: Partial<Dish>) => {
        if (!supabase) return; setSaving(true);
        if (form.id) {
            // Branch cannot edit price — strip it
            const { price, ...rest } = form;
            await supabase.from('dishes').update({ name: rest.name, description: rest.description, category: rest.category, cuisine: rest.cuisine, dietary_type: rest.dietary_type, image_url: rest.image_url, prep_time: rest.prep_time, rating: rest.rating }).eq('id', form.id);
        } else {
            const maxId = dishes.reduce((m, d) => Math.max(m, d.dish_id), 0);
            await supabase.from('dishes').insert({ ...form, branch_id: branchId, dish_id: maxId + 1 });
        }
        await onRefresh(); setSaving(false); setEditing(null); setAdding(false);
    };
    const del = async (id: number) => {
        if (!supabase || !confirm('Delete this dish?')) return; setDelId(id);
        await supabase.from('dishes').delete().eq('id', id);
        await onRefresh(); setDelId(null);
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-52">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search dishes…" className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-medium placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <select value={cat} onChange={e => setCat(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Categories</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-orange-700 transition-all shadow-lg shadow-primary/20 ml-auto">
                    <Plus className="w-4 h-4" /> Add Dish
                </button>
            </div>
            <div className="text-xs text-zinc-500 font-bold">{filtered.length} dishes · Price editing is admin-only</div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(d => (
                    <div key={d.id} className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
                        <div className="relative h-48 bg-zinc-800 overflow-hidden">
                            {d.image_url
                                ? <img src={d.image_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                : <div className="w-full h-full flex items-center justify-center"><UtensilsCrossed className="w-10 h-10 text-zinc-700" /></div>
                            }
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditing(d)} className="w-8 h-8 rounded-xl bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => del(d.id)} className="w-8 h-8 rounded-xl bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all">
                                    {delId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="font-black text-white text-base leading-tight">{d.name}</div>
                                <div className="text-white/60 text-xs mt-0.5">{d.cuisine}</div>
                            </div>
                            <div className="absolute bottom-3 right-3">
                                <span className="text-primary font-black text-lg bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-lg">₹{d.price}</span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col gap-2">
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{d.description || 'No description'}</p>
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                <span className={cls('px-2 py-0.5 rounded-md text-[9px] font-black uppercase', d.dietary_type?.toLowerCase().includes('non') ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400')}>{d.dietary_type}</span>
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-zinc-800 text-zinc-400">{d.category}</span>
                                <span className="ml-auto flex items-center gap-1 text-xs font-black"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{d.rating}</span>
                                <span className="flex items-center gap-1 text-xs text-zinc-500"><Clock className="w-3 h-3" />{d.prep_time}m</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(editing || adding) && (
                <DishModal dish={editing} onSave={save} onClose={() => { setEditing(null); setAdding(false); }} saving={saving} />
            )}
        </div>
    );
}

function DishModal({ dish, onSave, onClose, saving }: { dish: Dish | null; onSave: (d: Partial<Dish>) => void; onClose: () => void; saving: boolean }) {
    const [f, setF] = useState<Partial<Dish>>(dish || { dietary_type: 'Veg', category: 'Main Course', cuisine: 'Indian', rating: 4.5, prep_time: 20, price: 0 });
    const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-[2rem] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-black">{dish ? 'Edit Dish' : 'Add Dish'}</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><X className="w-4 h-4" /></button>
                    </div>
                    {!dish && <p className="text-xs text-primary font-bold mb-4 bg-primary/10 px-3 py-2 rounded-xl">Note: Price can only be set when adding a new dish. Price editing requires admin access.</p>}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2"><Field label="Name" value={f.name} onChange={v => set('name', v)} /></div>
                        {/* Price only editable when adding, not editing (branch can't change price) */}
                        <Field label={`Price ₹${dish ? ' (admin-only, locked)' : ' (set once)'}`} value={f.price} onChange={v => set('price', v)} type="number" disabled={!!dish} />
                        <Field label="Prep Time (min)" value={f.prep_time} onChange={v => set('prep_time', v)} type="number" />
                        <Field label="Rating" value={f.rating} onChange={v => set('rating', v)} type="number" />
                        <Sel label="Category" value={f.category || ''} onChange={v => set('category', v)} opts={CATEGORIES.map(c => ({ v: c, l: c }))} />
                        <Sel label="Dietary" value={f.dietary_type || ''} onChange={v => set('dietary_type', v)} opts={['Veg', 'Non-Veg'].map(v => ({ v, l: v }))} />
                        <div className="col-span-2"><Field label="Cuisine" value={f.cuisine} onChange={v => set('cuisine', v)} /></div>
                        <div className="col-span-2"><Field label="Description" value={f.description} onChange={v => set('description', v)} /></div>
                        <div className="col-span-2"><Field label="Image URL" value={f.image_url} onChange={v => set('image_url', v)} /></div>
                    </div>
                    <div className="flex gap-3 mt-5">
                        <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-400 font-bold hover:bg-zinc-700 transition-all">Cancel</button>
                        <button onClick={() => onSave(f)} disabled={saving} className="flex-1 py-3 rounded-2xl bg-primary text-white font-black hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

/* ── DELIVERY ── */
function BranchDelivery({ partners, branchId, onRefresh }: { partners: Partner[]; branchId: string; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', phone_number: '' });
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [editP, setEditP] = useState<Partner | null>(null);
    const [editForm, setEditForm] = useState({ name: '', phone_number: '' });
    const [editSaving, setEditSaving] = useState(false);

    const add = async () => {
        if (!supabase || !form.name || !form.phone_number) return; setSaving(true);
        await supabase.from('delivery_partners').insert({ ...form, branch_id: branchId, status: 'active' });
        await onRefresh(); setSaving(false); setShowAdd(false); setForm({ name: '', phone_number: '' });
    };
    const updateStatus = async (id: string, status: string) => {
        if (!supabase) return; setBusy(id);
        await supabase.from('delivery_partners').update({ status }).eq('id', id);
        await onRefresh(); setBusy(null);
    };
    const del = async (id: string) => {
        if (!supabase || !confirm('Remove partner?')) return; setBusy(id);
        await supabase.from('delivery_partners').delete().eq('id', id);
        await onRefresh(); setBusy(null);
    };
    const saveEdit = async () => {
        if (!supabase || !editP) return; setEditSaving(true);
        await supabase.from('delivery_partners').update({ name: editForm.name, phone_number: editForm.phone_number }).eq('id', editP.id);
        await onRefresh(); setEditSaving(false); setEditP(null);
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(s => !s)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-orange-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Rider
                </button>
            </div>
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900 rounded-3xl border border-white/10 p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field label="Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
                            <Field label="Phone" value={form.phone_number} onChange={v => setForm(p => ({ ...p, phone_number: v }))} />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-sm">Cancel</button>
                            <button onClick={add} disabled={saving} className="px-5 py-2.5 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{saving ? 'Adding…' : 'Add Rider'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {partners.map(p => (
                    <div key={p.id} className="bg-zinc-900 rounded-3xl border border-white/5 p-5 hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between mb-3">
                            <div className={cls('w-11 h-11 rounded-2xl flex items-center justify-center border', p.status === 'active' ? 'bg-green-950/50 border-green-800/30' : p.status === 'on_delivery' ? 'bg-blue-950/50 border-blue-800/30' : 'bg-zinc-800 border-zinc-700')}>
                                <Truck className={cls('w-5 h-5', p.status === 'active' ? 'text-green-400' : p.status === 'on_delivery' ? 'text-blue-400' : 'text-zinc-500')} />
                            </div>
                            <div className="flex gap-1.5">
                                <button onClick={() => { setEditP(p); setEditForm({ name: p.name, phone_number: p.phone_number }); }} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => del(p.id)} className="w-8 h-8 rounded-xl bg-red-900/20 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-all">
                                    {busy === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                        <div className="font-black text-white">{p.name}</div>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-1"><Phone className="w-3.5 h-3.5" />{p.phone_number}</div>
                        <div className="mt-3">
                            <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs font-black bg-zinc-800 border border-white/10 text-white focus:outline-none cursor-pointer uppercase">
                                {['active', 'on_delivery', 'inactive'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                    </div>
                ))}
                {partners.length === 0 && <div className="col-span-3 text-center py-16 text-zinc-600 font-medium">No delivery riders yet. Add one!</div>}
            </div>

            {editP && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-3xl border border-white/10 w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-base">Edit Rider</h3>
                            <button onClick={() => setEditP(null)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <Field label="Name" value={editForm.name} onChange={v => setEditForm(p => ({ ...p, name: v }))} />
                            <Field label="Phone" value={editForm.phone_number} onChange={v => setEditForm(p => ({ ...p, phone_number: v }))} />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setEditP(null)} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-400 font-bold">Cancel</button>
                            <button onClick={saveEdit} disabled={editSaving} className="flex-1 py-3 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-2">
                                {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{editSaving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

/* ── FEEDBACK ── */
function BranchFeedbackTab({ feedback }: { feedback: Feedback[] }) {
    const [minR, setMinR] = useState(0);
    const [type, setType] = useState('all');
    const [featured, setFeatured] = useState<Set<number>>(() => {
        try { const s = localStorage.getItem('sangem_featured_feedback'); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
    });

    const toggleFeatured = (id: number) => {
        setFeatured(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            localStorage.setItem('sangem_featured_feedback', JSON.stringify([...n]));
            return n;
        });
    };

    const types = [...new Set(feedback.map(f => f.feedback_type))].filter(Boolean);
    const filtered = feedback.filter(f => f.rating >= minR && (type === 'all' || f.feedback_type === type));
    const avgR = feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : '—';

    return (
        <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-5">
                    <div className="text-3xl font-black text-yellow-400">{avgR}</div>
                    <div className="text-sm font-bold text-zinc-400 mt-1">Avg Rating</div>
                </div>
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-5">
                    <div className="text-3xl font-black">{feedback.length}</div>
                    <div className="text-sm font-bold text-zinc-400 mt-1">Total Reviews</div>
                </div>
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-5">
                    <div className="text-3xl font-black text-green-400">{feedback.filter(f => f.rating >= 4).length}</div>
                    <div className="text-sm font-bold text-zinc-400 mt-1">Positive (4–5★)</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <select value={minR} onChange={e => setMinR(Number(e.target.value))} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    {[0, 3, 4, 5].map(r => <option key={r} value={r}>{r === 0 ? 'All Ratings' : `${r}+ Stars`}</option>)}
                </select>
                <select value={type} onChange={e => setType(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="text-xs text-zinc-500 font-bold">{filtered.length} reviews · ⭐ = Featured on your branch page</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(f => (
                    <div key={f.id} className={cls('bg-zinc-900 rounded-3xl border p-5 transition-all', featured.has(f.id) ? 'border-primary/50 bg-primary/5' : 'border-white/5 hover:border-primary/20')}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="font-black text-sm">{f.customer_name || 'Anonymous'}</div>
                                <div className="text-xs text-zinc-500">Order #{f.order_number}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cls('w-3.5 h-3.5', i < f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700')} />)}</div>
                                <button onClick={() => toggleFeatured(f.id)} title="Feature on branch page"
                                    className={cls('w-7 h-7 rounded-lg flex items-center justify-center transition-all', featured.has(f.id) ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500 hover:text-yellow-400')}>
                                    <Star className={cls('w-3.5 h-3.5', featured.has(f.id) && 'fill-white')} />
                                </button>
                            </div>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{f.message}</p>
                        <div className="mt-3 flex justify-between">
                            <span className="text-[9px] font-black uppercase text-zinc-600">{f.feedback_type}</span>
                            <span className="text-[9px] text-zinc-600">{new Date(f.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-zinc-600 font-medium">No feedback yet</div>}
            </div>
        </div>
    );
}
