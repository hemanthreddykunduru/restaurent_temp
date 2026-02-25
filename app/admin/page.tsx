'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ShoppingBag, UtensilsCrossed, Building2, Truck,
    MessageSquare, LogOut, Star, Plus, Pencil, Trash2, X, Check,
    Loader2, Search, RefreshCcw, Phone, Shield, Clock, ChefHat, DollarSign, Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSession, clearSession, AuthUser } from '@/lib/auth';

type Tab = 'overview' | 'orders' | 'dishes' | 'branches' | 'delivery' | 'feedback';

interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
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
interface Profile { id: string; email: string; password: string; role: string; branch_id: string | null; created_at: string; }
interface Partner { id: string; name: string; phone_number: string; branch_id: string; status: string; }
interface Feedback { id: number; order_number: string; customer_name: string; feedback_type: string; rating: number; message: string; branch_id: string; created_at: string; }

const BN: Record<string, string> = { br1: 'Banjara Hills', br2: 'Jubilee Hills', br3: 'Gachibowli', br4: 'Madhapur', br5: 'Kondapur' };
const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
const CATEGORIES = ['Starters', 'Main Course', 'Biryani', 'Breads', 'Desserts', 'Beverages'];

function cls(...c: (string | undefined | false)[]) { return c.filter(Boolean).join(' '); }

function Pill({ text }: { text: string }) {
    const map: Record<string, string> = { pending: 'bg-yellow-900/40 text-yellow-400', confirmed: 'bg-blue-900/40 text-blue-400', preparing: 'bg-orange-900/40 text-orange-400', ready: 'bg-purple-900/40 text-purple-400', delivered: 'bg-green-900/40 text-green-400', cancelled: 'bg-red-900/40 text-red-400', active: 'bg-green-900/40 text-green-400', on_delivery: 'bg-blue-900/40 text-blue-400', inactive: 'bg-zinc-800 text-zinc-500' };
    return <span className={cls('px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider', map[text] || 'bg-zinc-800 text-zinc-400')}>{text.replace('_', ' ')}</span>;
}

function Field({ label, value, onChange, type = 'text', disabled = false }: { label: string; value: any; onChange: (v: any) => void; type?: string; disabled?: boolean }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">{label}</label>
            <input type={type} value={value || ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} disabled={disabled}
                className={cls('w-full px-4 py-3 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all', disabled && 'opacity-40 cursor-not-allowed')} />
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

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [tab, setTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [branches, setBranches] = useState<Profile[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    // local branch name overrides (stored in localStorage)
    const [branchNames, setBranchNames] = useState<Record<string, string>>({ ...BN });

    useEffect(() => {
        const s = getSession();
        if (!s || s.role !== 'admin') { router.replace('/'); return; }
        setUser(s);
        const saved = localStorage.getItem('sangem_branch_names');
        if (saved) setBranchNames(JSON.parse(saved));
        loadAll();
    }, []);

    const loadAll = useCallback(async () => {
        if (!supabase) { setLoading(false); return; }
        setLoading(true);
        try {
            const [o, d, b, p, f] = await Promise.all([
                supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(500),
                supabase.from('dishes').select('*').order('branch_id').order('dish_id'),
                supabase.from('profiles').select('*').eq('role', 'branch').order('branch_id'),
                supabase.from('delivery_partners').select('*').order('name'),
                supabase.from('feedback').select('*').order('created_at', { ascending: false }),
            ]);

            console.log('--- ADMIN_SYNC_DEBUG ---');
            console.log('Orders Data Status:', o.error ? 'ERROR' : 'OK');
            if (o.error) console.error('ORDERS_FETCH_ERROR:', o.error);
            console.log('Total Orders Recieved:', o.data?.length || 0);
            if (o.data && o.data.length > 0) {
                console.log('Sample Order Data:', o.data[0]);
            }

            setOrders(o.data || []); setDishes(d.data || []); setBranches(b.data || []);
            setPartners(p.data || []); setFeedback(f.data || []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, []);


    const saveBranchName = (id: string, name: string) => {
        const updated = { ...branchNames, [id]: name };
        setBranchNames(updated);
        localStorage.setItem('sangem_branch_names', JSON.stringify(updated));
    };

    const logout = () => { clearSession(); router.push('/'); };

    const navTabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => getStatus(o) === 'pending').length },
        { id: 'dishes', label: 'Dishes', icon: UtensilsCrossed, badge: dishes.length },
        { id: 'branches', label: 'Branches', icon: Building2, badge: branches.length },
        { id: 'delivery', label: 'Delivery', icon: Truck, badge: partners.length },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: feedback.length },

    ];

    if (!user) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-60 shrink-0 bg-black/80 border-r border-white/5 flex flex-col fixed h-full z-20">
                <div className="p-5 border-b border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="text-white font-black text-base italic">S</span>
                    </div>
                    <div><div className="font-black text-sm">SANGEM</div><div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Admin Panel</div></div>
                </div>
                <div className="px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5">
                        <Shield className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0"><div className="text-xs font-black text-white truncate">{user.email?.split('@')[0]}</div><div className="text-[9px] text-primary font-black uppercase">Administrator</div></div>
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

            {/* Main */}
            <main className="flex-1 ml-60 overflow-auto">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">{navTabs.find(t => t.id === tab)?.label}</h1>
                            <p className="text-zinc-500 text-sm font-medium mt-0.5">Sangem Hotels · Admin</p>
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
                                {tab === 'overview' && <Overview orders={orders} dishes={dishes} partners={partners} feedback={feedback} branchNames={branchNames} />}
                                {tab === 'orders' && <Orders orders={orders} partners={partners} branchNames={branchNames} onRefresh={loadAll} />}
                                {tab === 'dishes' && <DishesTab dishes={dishes} branchNames={branchNames} onRefresh={loadAll} canEditPrice />}
                                {tab === 'branches' && <BranchesTab branches={branches} branchNames={branchNames} onSaveName={saveBranchName} onRefresh={loadAll} />}
                                {tab === 'delivery' && <DeliveryTab partners={partners} branchNames={branchNames} onRefresh={loadAll} />}
                                {tab === 'feedback' && <FeedbackTab feedback={feedback} branchNames={branchNames} />}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}

/* ── OVERVIEW ── */
function Overview({ orders, dishes, partners, feedback, branchNames }: { orders: Order[]; dishes: Dish[]; partners: Partner[]; feedback: Feedback[]; branchNames: Record<string, string> }) {
    const rev = orders.reduce((s, o) => s + Number(o.total_amount), 0);
    const pending = orders.filter(o => getStatus(o) === 'pending').length;
    const avgR = feedback.length ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : '—';
    const brRev: Record<string, number> = {};
    orders.forEach(o => { brRev[o.branch_id] = (brRev[o.branch_id] || 0) + Number(o.total_amount); });

    const maxR = Math.max(...Object.values(brRev), 1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: ShoppingBag, label: 'Total Orders', val: orders.length, sub: `${pending} pending`, c: 'blue' },
                    { icon: DollarSign, label: 'Revenue', val: `₹${(rev / 1000).toFixed(1)}K`, sub: 'All branches', c: 'green' },
                    { icon: UtensilsCrossed, label: 'Dishes', val: dishes.length, sub: `${Object.keys(brRev).length} branches`, c: 'orange' },
                    { icon: Star, label: 'Avg Rating', val: avgR, sub: `${feedback.length} reviews`, c: 'yellow' },
                ].map(({ icon: I, label, val, sub, c }) => (
                    <div key={label} className={`rounded-3xl p-6 border bg-${c}-950/40 border-${c}-800/30 text-${c}-400 relative overflow-hidden`}>
                        <I className="w-6 h-6 mb-3 opacity-80" />
                        <div className="text-3xl font-black">{val}</div>
                        <div className="text-sm font-bold opacity-70 mt-1">{label}</div>
                        <div className="text-xs opacity-40 mt-0.5">{sub}</div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-5">Revenue by Branch</h3>
                    <div className="space-y-4">
                        {Object.entries(brRev).sort(([, a], [, b]) => b - a).map(([id, r]) => (
                            <div key={id}>
                                <div className="flex justify-between text-sm font-bold mb-1.5">
                                    <span>{branchNames[id] || id}</span><span className="text-primary">₹{Number(r).toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(r / maxR) * 100}%` }} transition={{ duration: 0.7 }} className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-900 rounded-3xl border border-white/5 p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-5">Recent Orders</h3>
                    <div className="space-y-2.5">
                        {orders.slice(0, 7).map(o => (
                            <div key={o.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/60">
                                <div>
                                    <div className="text-sm font-bold">{o.customer_name}</div>
                                    <div className="text-xs text-zinc-500">{branchNames[o.branch_id] || o.branch_id}</div>
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
function Orders({ orders, partners, branchNames, onRefresh }: { orders: Order[]; partners: Partner[]; branchNames: Record<string, string>; onRefresh: () => void }) {
    const [q, setQ] = useState('');
    const [sf, setSf] = useState('all');
    const [bf, setBf] = useState('all');
    const [busy, setBusy] = useState<string | null>(null);

    const filtered = orders.filter(o => {
        const mq = o.customer_name.toLowerCase().includes(q.toLowerCase()) || o.customer_phone?.includes(q);
        const ms = sf === 'all' || getStatus(o) === sf;
        const mb = bf === 'all' || o.branch_id === bf;
        return mq && ms && mb;
    });

    const updateStatus = async (id: string, status: string) => {
        if (!supabase) return; setBusy(id);
        // Map all variants to ensure database sync regardless of schema
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
        // Update all variants including status to confirmed
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


    const branchIds = [...new Set(orders.map(o => o.branch_id))];

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
                <select value={bf} onChange={e => setBf(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Branches</option>
                    {branchIds.map(id => <option key={id} value={id}>{branchNames[id] || id}</option>)}
                </select>
            </div>

            <div className="text-xs text-zinc-500 font-bold">{filtered.length} orders</div>

            <div className="space-y-3">
                {filtered.map(order => {
                    const bp = partners.filter(p => p.branch_id === order.branch_id && p.status === 'active');
                    return (
                        <div key={order.id} className="bg-zinc-900 rounded-3xl border border-white/5 p-5 hover:border-primary/20 transition-all">
                            <div className="flex flex-wrap gap-4 items-start">
                                <div className="flex-1 min-w-56">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <span className="font-black text-base">{order.customer_name}</span>
                                        <Pill text={getStatus(order)} />
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-sm text-zinc-400 mb-2">
                                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{order.customer_phone}</span>
                                        <span className="text-primary font-black">₹{Number(order.total_amount).toLocaleString()}</span>
                                        <span className="text-zinc-500">{branchNames[order.branch_id] || order.branch_id}</span>
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
                                <div className="flex flex-col gap-2 min-w-44">
                                    <div>
                                        <label className="block text-[9px] font-black uppercase text-zinc-500 mb-1">Status</label>
                                        <select value={order.current_stage} onChange={e => updateStatus(order.id, e.target.value)} disabled={busy === order.id}
                                            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 border border-white/10 text-white focus:outline-none cursor-pointer">
                                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black uppercase text-zinc-500 mb-1">Assign Rider ({bp.length} available)</label>
                                        <select onChange={e => assignPartner(order.id, e.target.value)} disabled={busy === order.id} defaultValue=""
                                            className="w-full px-3 py-2 rounded-xl text-xs font-bold bg-zinc-800 border border-white/10 text-white focus:outline-none cursor-pointer">
                                            <option value="">Choose rider…</option>
                                            {bp.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    {busy === order.id && <div className="flex items-center gap-1.5 text-xs text-primary font-bold"><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</div>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && <div className="text-center py-20 text-zinc-600 font-medium">No orders found</div>}
            </div>
        </div>
    );
}

/* ── DISHES ── */
function DishesTab({ dishes, branchNames, onRefresh, canEditPrice }: { dishes: Dish[]; branchNames: Record<string, string>; onRefresh: () => void; canEditPrice: boolean }) {
    const [q, setQ] = useState('');
    const [bf, setBf] = useState('all');
    const [cat, setCat] = useState('all');
    const [editing, setEditing] = useState<Dish | null>(null);
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [delId, setDelId] = useState<number | null>(null);

    const cats = [...new Set(dishes.map(d => d.category))].filter(Boolean).sort();
    const filtered = dishes.filter(d => {
        const mq = d.name.toLowerCase().includes(q.toLowerCase()) || d.description?.toLowerCase().includes(q.toLowerCase());
        const mb = bf === 'all' || d.branch_id === bf;
        const mc = cat === 'all' || d.category === cat;
        return mq && mb && mc;
    });

    const save = async (form: Partial<Dish>) => {
        if (!supabase) return; setSaving(true);
        const { id, ...rest } = form;
        if (id) {
            await supabase.from('dishes').update(canEditPrice ? rest : { ...rest, price: editing?.price }).eq('id', id);
        } else {
            const brDishes = dishes.filter(d => d.branch_id === form.branch_id);
            const maxId = brDishes.reduce((m, d) => Math.max(m, d.dish_id), 0);
            await supabase.from('dishes').insert({ ...rest, dish_id: maxId + 1 });
        }
        await onRefresh(); setSaving(false); setEditing(null); setAdding(false);
    };

    const del = async (id: number) => {
        if (!supabase || !confirm('Delete this dish?')) return; setDelId(id);
        await supabase.from('dishes').delete().eq('id', id);
        await onRefresh(); setDelId(null);
    };

    const branchIds = [...new Set(dishes.map(d => d.branch_id))];

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-52">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search dishes…" className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-medium placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <select value={bf} onChange={e => setBf(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Branches</option>
                    {branchIds.map(id => <option key={id} value={id}>{branchNames[id] || id}</option>)}
                </select>
                <select value={cat} onChange={e => setCat(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Categories</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-orange-700 transition-all shadow-lg shadow-primary/20 ml-auto">
                    <Plus className="w-4 h-4" /> Add Dish
                </button>
            </div>

            <div className="text-xs text-zinc-500 font-bold">{filtered.length} dishes</div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(d => (
                    <div key={d.id} className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden group hover:border-primary/30 transition-all flex flex-col">
                        <div className="relative h-48 bg-zinc-800 overflow-hidden">
                            {d.image_url
                                ? <img src={d.image_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                : <div className="w-full h-full flex items-center justify-center"><UtensilsCrossed className="w-10 h-10 text-zinc-700" /></div>
                            }
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute top-3 left-3"><span className="px-2 py-1 rounded-lg bg-black/60 text-[9px] font-black uppercase text-white/70 backdrop-blur-sm">{branchNames[d.branch_id] || d.branch_id}</span></div>
                            <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditing(d)} className="w-8 h-8 rounded-xl bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => del(d.id)} className="w-8 h-8 rounded-xl bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all">
                                    {delId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="font-black text-white leading-tight text-base">{d.name}</div>
                                <div className="text-white/60 text-xs mt-0.5">{d.cuisine}</div>
                            </div>
                            <div className="absolute bottom-3 right-3">
                                <span className="text-primary font-black text-lg bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-lg">₹{d.price}</span>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col gap-2">
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{d.description || '—'}</p>
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
                <DishModal dish={editing} onSave={save} onClose={() => { setEditing(null); setAdding(false); }} saving={saving} canEditPrice={canEditPrice} branchNames={branchNames} branchIds={branchIds} />
            )}
        </div>
    );
}

function DishModal({ dish, onSave, onClose, saving, canEditPrice, branchNames, branchIds }: { dish: Dish | null; onSave: (d: Partial<Dish>) => void; onClose: () => void; saving: boolean; canEditPrice: boolean; branchNames: Record<string, string>; branchIds: string[] }) {
    const [f, setF] = useState<Partial<Dish>>(dish || { branch_id: branchIds[0] || 'br1', dietary_type: 'Veg', category: 'Main Course', cuisine: 'Indian', rating: 4.5, prep_time: 20, price: 0 });
    const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-[2rem] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-black">{dish ? 'Edit Dish' : 'Add Dish'}</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2"><Field label="Name" value={f.name} onChange={v => set('name', v)} /></div>
                        <Field label={`Price ₹${!canEditPrice ? ' (locked)' : ''}`} value={f.price} onChange={v => set('price', v)} type="number" disabled={!canEditPrice} />
                        <Field label="Prep Time (min)" value={f.prep_time} onChange={v => set('prep_time', v)} type="number" />
                        <Field label="Rating" value={f.rating} onChange={v => set('rating', v)} type="number" />
                        <Sel label="Category" value={f.category || ''} onChange={v => set('category', v)} opts={CATEGORIES.map(c => ({ v: c, l: c }))} />
                        <Sel label="Dietary" value={f.dietary_type || ''} onChange={v => set('dietary_type', v)} opts={['Veg', 'Non-Veg'].map(v => ({ v, l: v }))} />
                        <Sel label="Branch" value={f.branch_id || ''} onChange={v => set('branch_id', v)} opts={branchIds.map(id => ({ v: id, l: branchNames[id] || id }))} />
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

/* ── BRANCHES ── */
function BranchesTab({ branches, branchNames, onSaveName, onRefresh }: { branches: Profile[]; branchNames: Record<string, string>; onSaveName: (id: string, name: string) => void; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ email: '', password: '', branch_id: '' });
    const [saving, setSaving] = useState(false);
    const [delId, setDelId] = useState<string | null>(null);
    const [editNameId, setEditNameId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');
    const [editProfile, setEditProfile] = useState<Profile | null>(null);
    const [epForm, setEpForm] = useState({ email: '', password: '' });
    const [epSaving, setEpSaving] = useState(false);

    const add = async () => {
        if (!supabase || !form.email || !form.password || !form.branch_id) return;
        setSaving(true);
        await supabase.from('profiles').insert({ ...form, role: 'branch' });
        await onRefresh(); setSaving(false); setShowAdd(false); setForm({ email: '', password: '', branch_id: '' });
    };
    const del = async (id: string) => {
        if (!supabase || !confirm('Delete this branch user?')) return; setDelId(id);
        await supabase.from('profiles').delete().eq('id', id);
        await onRefresh(); setDelId(null);
    };
    const saveProfile = async () => {
        if (!supabase || !editProfile) return; setEpSaving(true);
        await supabase.from('profiles').update({ email: epForm.email, password: epForm.password }).eq('id', editProfile.id);
        await onRefresh(); setEpSaving(false); setEditProfile(null);
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(s => !s)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-orange-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Branch User
                </button>
            </div>
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900 rounded-3xl border border-white/10 p-5">
                        <h3 className="text-sm font-black mb-4">New Branch Login</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Field label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
                            <Field label="Password" value={form.password} onChange={v => setForm(p => ({ ...p, password: v }))} />
                            <Field label="Branch ID" value={form.branch_id} onChange={v => setForm(p => ({ ...p, branch_id: v }))} />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-sm">Cancel</button>
                            <button onClick={add} disabled={saving} className="px-5 py-2.5 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{saving ? 'Adding…' : 'Add'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {branches.map(b => (
                    <div key={b.id} className="bg-zinc-900 rounded-3xl border border-white/5 p-5 hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex gap-1.5">
                                <button onClick={() => { setEditProfile(b); setEpForm({ email: b.email, password: b.password }); }} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => del(b.id)} className="w-8 h-8 rounded-xl bg-red-900/20 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-all">
                                    {delId === b.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                        {/* Editable branch name */}
                        <div className="mb-2">
                            {editNameId === b.branch_id ? (
                                <div className="flex gap-2 items-center">
                                    <input value={tempName} onChange={e => setTempName(e.target.value)} className="flex-1 px-2 py-1 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm font-black focus:outline-none focus:ring-1 focus:ring-primary/50" />
                                    <button onClick={() => { onSaveName(b.branch_id!, tempName); setEditNameId(null); }} className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></button>
                                    <button onClick={() => setEditNameId(null)} className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center"><X className="w-3.5 h-3.5 text-zinc-300" /></button>
                                </div>
                            ) : (
                                <button onClick={() => { setEditNameId(b.branch_id!); setTempName(branchNames[b.branch_id!] || ''); }} className="group flex items-center gap-1.5">
                                    <span className="text-xs font-black uppercase tracking-widest text-primary">{branchNames[b.branch_id!] || b.branch_id}</span>
                                    <Pencil className="w-3 h-3 text-zinc-600 group-hover:text-primary transition-colors" />
                                </button>
                            )}
                        </div>
                        <div className="font-bold text-sm text-white">{b.email}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">ID: {b.branch_id}</div>
                    </div>
                ))}
            </div>

            {editProfile && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-3xl border border-white/10 w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-base">Edit Branch Credentials</h3>
                            <button onClick={() => setEditProfile(null)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <Field label="Email" value={epForm.email} onChange={v => setEpForm(p => ({ ...p, email: v }))} />
                            <Field label="Password" value={epForm.password} onChange={v => setEpForm(p => ({ ...p, password: v }))} />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setEditProfile(null)} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-400 font-bold">Cancel</button>
                            <button onClick={saveProfile} disabled={epSaving} className="flex-1 py-3 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-2">
                                {epSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{epSaving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

/* ── DELIVERY ── */
function DeliveryTab({ partners, branchNames, onRefresh }: { partners: Partner[]; branchNames: Record<string, string>; onRefresh: () => void }) {
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', phone_number: '', branch_id: 'br1' });
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState<string | null>(null);
    const [loginModal, setLoginModal] = useState<Partner | null>(null);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginSaving, setLoginSaving] = useState(false);

    const add = async () => {
        if (!supabase || !form.name || !form.phone_number) return; setSaving(true);
        await supabase.from('delivery_partners').insert({ ...form, status: 'active' });
        await onRefresh(); setSaving(false); setShowAdd(false); setForm({ name: '', phone_number: '', branch_id: 'br1' });
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
    const createLogin = async () => {
        if (!supabase || !loginModal || !loginForm.email || !loginForm.password) return;
        setLoginSaving(true);
        // Create a delivery profile and link it
        const { data: profile } = await supabase.from('profiles').insert({
            email: loginForm.email.trim().toLowerCase(),
            password: loginForm.password,
            role: 'delivery',
            branch_id: loginModal.branch_id,
        }).select().single();
        if (profile) {
            await supabase.from('delivery_partners').update({ profile_id: profile.id }).eq('id', loginModal.id);
        }
        setLoginSaving(false); setLoginModal(null); setLoginForm({ email: '', password: '' });
        await onRefresh();
    };

    const branchIds = [...new Set(partners.map(p => p.branch_id))];

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(s => !s)} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-orange-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Partner
                </button>
            </div>
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-zinc-900 rounded-3xl border border-white/10 p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Field label="Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} />
                            <Field label="Phone" value={form.phone_number} onChange={v => setForm(p => ({ ...p, phone_number: v }))} />
                            <Sel label="Branch" value={form.branch_id} onChange={v => setForm(p => ({ ...p, branch_id: v }))} opts={Object.entries(branchNames).map(([v, l]) => ({ v, l }))} />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-2xl bg-zinc-800 text-zinc-400 font-bold text-sm">Cancel</button>
                            <button onClick={add} disabled={saving} className="px-5 py-2.5 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}{saving ? 'Adding…' : 'Add'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {branchIds.map(bid => (
                <div key={bid}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">{branchNames[bid] || bid} ({partners.filter(p => p.branch_id === bid).length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {partners.filter(p => p.branch_id === bid).map(p => (
                            <div key={p.id} className="bg-zinc-900 rounded-2xl border border-white/5 p-4 hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={cls('w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
                                        p.status === 'active' ? 'bg-green-950/50 border-green-800/30' :
                                            p.status === 'on_delivery' ? 'bg-blue-950/50 border-blue-800/30' :
                                                'bg-zinc-800 border-zinc-700')}>
                                        <Truck className={cls('w-4 h-4', p.status === 'active' ? 'text-green-400' : p.status === 'on_delivery' ? 'text-blue-400' : 'text-zinc-500')} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm text-white truncate">{p.name}</div>
                                        <div className="text-xs text-zinc-500">{p.phone_number}</div>
                                    </div>
                                    <button onClick={() => del(p.id)} className="w-7 h-7 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-all">
                                        {busy === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)} className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-black bg-zinc-800 border border-white/10 text-white focus:outline-none cursor-pointer uppercase">
                                        {['active', 'on_delivery', 'inactive'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                    </select>
                                    <button onClick={() => { setLoginModal(p); setLoginForm({ email: '', password: '' }); }}
                                        className="px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase hover:bg-primary/20 transition-all">
                                        Login
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Create delivery login modal */}
            {loginModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 rounded-3xl border border-white/10 w-full max-w-sm p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-black text-base">Create Delivery Login</h3>
                            <button onClick={() => setLoginModal(null)} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
                        </div>
                        <p className="text-xs text-zinc-500 mb-4">Creating login for <span className="text-primary font-bold">{loginModal.name}</span></p>
                        <div className="space-y-3">
                            <Field label="Email" value={loginForm.email} onChange={v => setLoginForm(p => ({ ...p, email: v }))} />
                            <Field label="Password" value={loginForm.password} onChange={v => setLoginForm(p => ({ ...p, password: v }))} />
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setLoginModal(null)} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-400 font-bold">Cancel</button>
                            <button onClick={createLogin} disabled={loginSaving} className="flex-1 py-3 rounded-2xl bg-primary text-white font-black flex items-center justify-center gap-2">
                                {loginSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}{loginSaving ? 'Creating…' : 'Create'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}


/* ── FEEDBACK ── */
function FeedbackTab({ feedback, branchNames }: { feedback: Feedback[]; branchNames: Record<string, string> }) {
    const [bf, setBf] = useState('all');
    const [minR, setMinR] = useState(0);
    const filtered = feedback.filter(f => (bf === 'all' || f.branch_id === bf) && f.rating >= minR);
    const branchIds = [...new Set(feedback.map(f => f.branch_id))];
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
                <select value={bf} onChange={e => setBf(e.target.value)} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    <option value="all">All Branches</option>
                    {branchIds.map(id => <option key={id} value={id}>{branchNames[id] || id}</option>)}
                </select>
                <select value={minR} onChange={e => setMinR(Number(e.target.value))} className="px-4 py-2.5 rounded-2xl bg-zinc-800 border border-white/10 text-white text-sm font-bold focus:outline-none cursor-pointer">
                    {[0, 3, 4, 5].map(r => <option key={r} value={r}>{r === 0 ? 'All Ratings' : `${r}+ Stars`}</option>)}
                </select>
                <div className="text-xs text-zinc-500 font-bold self-center">{filtered.length} reviews</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(f => (
                    <div key={f.id} className="bg-zinc-900 rounded-3xl border border-white/5 p-5 hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="font-black text-sm">{f.customer_name || 'Anonymous'}</div>
                                <div className="text-xs text-zinc-500">Order #{f.order_number} · {branchNames[f.branch_id] || f.branch_id}</div>
                            </div>
                            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cls('w-3.5 h-3.5', i < f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700')} />)}</div>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{f.message}</p>
                        <div className="mt-3 flex justify-between">
                            <span className="text-[9px] font-black uppercase text-zinc-600">{f.feedback_type}</span>
                            <span className="text-[9px] text-zinc-600">{new Date(f.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-zinc-600 font-medium">No feedback found</div>}
            </div>
        </div>
    );
}
