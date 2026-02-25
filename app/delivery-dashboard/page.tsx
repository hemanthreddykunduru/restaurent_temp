'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck, LogOut, MapPin, Phone, Package, CheckCircle,
    Loader2, RefreshCcw, Clock, DollarSign, Navigation, User
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSession, clearSession, AuthUser } from '@/lib/auth';

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
    delivery_agent_id?: string;
    delivery_partner_id?: string;
    rider_id?: string;
    latitude?: number;
    longitude?: number;
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


interface Partner {
    id: string;
    name: string;
    phone_number: string;
    branch_id: string;
    status: string;
}

const BN: Record<string, string> = {
    br1: 'Banjara Hills', br2: 'Jubilee Hills',
    br3: 'Gachibowli', br4: 'Madhapur', br5: 'Kondapur'
};

const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-800/30',
    confirmed: 'bg-blue-900/40 text-blue-400 border-blue-800/30',
    preparing: 'bg-orange-900/40 text-orange-400 border-orange-800/30',
    ready: 'bg-purple-900/40 text-purple-400 border-purple-800/30',
    delivered: 'bg-green-900/40 text-green-400 border-green-800/30',
    cancelled: 'bg-red-900/40 text-red-400 border-red-800/30',
};

function cls(...c: (string | undefined | false)[]) { return c.filter(Boolean).join(' '); }

export default function DeliveryDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [partner, setPartner] = useState<Partner | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<string | null>(null);
    const [view, setView] = useState<'pending' | 'done'>('pending');

    useEffect(() => {
        const s = getSession();
        if (!s || s.role !== 'delivery') { router.replace('/'); return; }
        setUser(s);
    }, []);

    const loadData = useCallback(async () => {
        if (!supabase || !user) return;
        setLoading(true);

        // Find delivery partner record linked to this profile
        const { data: pData } = await supabase
            .from('delivery_partners')
            .select('*')
            .eq('profile_id', user.id)
            .single();

        let pid = '';
        if (!pData) {
            // fallback: find by branch + name match stored in session
            const { data: pData2 } = await supabase
                .from('delivery_partners')
                .select('*')
                .eq('branch_id', user.branch_id || '')
                .limit(1)
                .single();
            if (pData2) { setPartner(pData2); pid = pData2.id; }
        } else {
            setPartner(pData); pid = pData.id;
        }

        if (pid) {
            // Catch all possible variant fields for rider mapping
            const { data: oData, error } = await supabase
                .from('orders')
                .select('*')
                .or(`delivery_agent_id.eq.${pid},delivery_partner_id.eq.${pid},rider_id.eq.${pid}`)
                .order('created_at', { ascending: false });

            console.log('--- DELIVERY_SYNC_DEBUG (' + pid + ') ---');
            if (error) console.error('ORDERS_FETCH_ERROR:', error);
            console.log('Total Orders Recieved:', oData?.length || 0);
            if (oData && oData.length > 0) {
                console.log('Sample Order Data:', oData[0]);
            }

            setOrders(oData || []);
        }

        setLoading(false);

    }, [user]);

    useEffect(() => { if (user) loadData(); }, [user, loadData]);

    const markDelivered = async (orderId: string) => {
        if (!supabase || !partner) return;
        setBusy(orderId);
        // Sync all status field variants
        await supabase.from('orders').update({
            order_status: 'delivered',
            current_stage: 'delivered',
            status: 'delivered',
            stage: 'delivered'
        }).eq('id', orderId);
        // Set partner back to active
        await supabase.from('delivery_partners').update({ status: 'active' }).eq('id', partner.id);
        await loadData();
        setBusy(null);
    };



    const logout = () => { clearSession(); router.push('/'); };

    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(getStatus(o)));
    const doneOrders = orders.filter(o => ['delivered', 'cancelled'].includes(getStatus(o)));

    const shown = view === 'pending' ? activeOrders : doneOrders;
    const todayEarnings = doneOrders
        .filter(o => getStatus(o) === 'delivered' && o.created_at?.startsWith(new Date().toISOString().split('T')[0]))
        .reduce((s, o) => s + Number(o.total_amount), 0);


    if (!user) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="bg-black/80 border-b border-white/5 sticky top-0 z-10 backdrop-blur-xl">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="font-black text-sm leading-tight">{partner?.name || user.email?.split('@')[0]}</div>
                            <div className="text-[9px] font-black uppercase text-primary">{BN[partner?.branch_id || ''] || 'Delivery Partner'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={loadData} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                        <button onClick={logout} className="w-9 h-9 rounded-xl bg-red-900/20 border border-red-800/20 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-all">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-900 rounded-3xl border border-white/5 p-4 text-center">
                        <div className="text-2xl font-black text-primary">{activeOrders.length}</div>
                        <div className="text-[9px] font-black uppercase text-zinc-500 mt-0.5">Active</div>
                    </div>
                    <div className="bg-zinc-900 rounded-3xl border border-white/5 p-4 text-center">
                        <div className="text-2xl font-black text-green-400">{doneOrders.filter(o => getStatus(o) === 'delivered').length}</div>
                        <div className="text-[9px] font-black uppercase text-zinc-500 mt-0.5">Delivered</div>
                    </div>

                    <div className="bg-zinc-900 rounded-3xl border border-green-800/20 p-4 text-center bg-green-950/30">
                        <div className="text-2xl font-black text-green-400">₹{(todayEarnings / 1000).toFixed(1)}K</div>
                        <div className="text-[9px] font-black uppercase text-zinc-500 mt-0.5">Today COD</div>
                    </div>
                </div>

                {/* Partner status */}
                {partner && (
                    <div className={cls(
                        'rounded-3xl border p-4 flex items-center gap-3',
                        partner.status === 'active' ? 'bg-green-950/30 border-green-800/30' :
                            partner.status === 'on_delivery' ? 'bg-blue-950/30 border-blue-800/30' :
                                'bg-zinc-900 border-white/5'
                    )}>
                        <div className={cls(
                            'w-3 h-3 rounded-full animate-pulse',
                            partner.status === 'active' ? 'bg-green-400' :
                                partner.status === 'on_delivery' ? 'bg-blue-400' : 'bg-zinc-500'
                        )} />
                        <span className={cls(
                            'text-sm font-black uppercase tracking-widest',
                            partner.status === 'active' ? 'text-green-400' :
                                partner.status === 'on_delivery' ? 'text-blue-400' : 'text-zinc-400'
                        )}>
                            {partner.status === 'active' ? 'Available — Ready for orders' :
                                partner.status === 'on_delivery' ? 'On Delivery' : 'Inactive'}
                        </span>
                    </div>
                )}

                {/* Tab switcher */}
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                    {(['pending', 'done'] as const).map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className={cls(
                                'flex-1 py-2.5 rounded-xl text-sm font-black transition-all',
                                view === v ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white'
                            )}>
                            {v === 'pending' ? `Active (${activeOrders.length})` : `Done (${doneOrders.length})`}
                        </button>
                    ))}
                </div>

                {/* Order list */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                            {shown.map(order => (
                                <motion.div key={order.id} layout className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden hover:border-primary/20 transition-all">
                                    {/* Status bar */}
                                    <div className={cls('px-5 py-2 border-b flex items-center justify-between', STATUS_COLOR[getStatus(order)] || 'border-white/5')}>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{getStatus(order)}</span>
                                        <span className="text-[10px] text-current opacity-60">{new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>


                                    <div className="p-5 space-y-4">
                                        {/* Customer */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-black text-base">{order.customer_name}</div>
                                                <a href={`tel:${order.customer_phone}`}
                                                    className="flex items-center gap-1.5 text-sm text-primary font-bold mt-0.5 hover:underline">
                                                    <Phone className="w-3.5 h-3.5" />{order.customer_phone}
                                                </a>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-primary">₹{Number(order.total_amount).toLocaleString()}</div>
                                                <div className={cls(
                                                    'text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-0.5',
                                                    order.payment_method?.toLowerCase().includes('cash') ? 'bg-green-900/40 text-green-400' : 'bg-blue-900/40 text-blue-400'
                                                )}>{order.payment_method}</div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="flex gap-2.5 p-3 rounded-2xl bg-zinc-800/60">
                                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="text-[9px] font-black uppercase text-zinc-500 mb-0.5">Delivery Address</div>
                                                <div className="text-sm font-bold text-white">{order.delivery_address}</div>
                                            </div>
                                            {order.latitude && order.longitude && (
                                                <a
                                                    href={`https://maps.google.com/?q=${order.latitude},${order.longitude}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:bg-orange-700 transition-all">
                                                    <Navigation className="w-4 h-4 text-white" />
                                                </a>
                                            )}
                                        </div>

                                        {/* Items */}
                                        <div>
                                            <div className="text-[9px] font-black uppercase text-zinc-500 mb-2">Order Items</div>
                                            <div className="space-y-1.5">
                                                {safeParseItems(order.items).map((item: any, i: number) => (

                                                    <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-zinc-800/40">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="w-3.5 h-3.5 text-zinc-500" />
                                                            <span className="text-sm font-bold">{item.name || `Item ${i + 1}`}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-black text-zinc-400">×{item.quantity || 1}</span>
                                                            {item.price && <span className="text-xs font-black text-primary">₹{Number(item.price) * (item.quantity || 1)}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment info box */}
                                        <div className={cls(
                                            'flex items-center justify-between p-4 rounded-2xl border',
                                            order.payment_method?.toLowerCase().includes('cash')
                                                ? 'bg-green-950/30 border-green-800/30'
                                                : 'bg-blue-950/30 border-blue-800/30'
                                        )}>
                                            <div>
                                                <div className="text-[9px] font-black uppercase text-zinc-500 mb-0.5">
                                                    {order.payment_method?.toLowerCase().includes('cash') ? '💵 Collect Cash' : '✅ Already Paid'}
                                                </div>
                                                <div className={cls(
                                                    'text-xl font-black',
                                                    order.payment_method?.toLowerCase().includes('cash') ? 'text-green-400' : 'text-blue-400'
                                                )}>
                                                    {order.payment_method?.toLowerCase().includes('cash') ? `₹${Number(order.total_amount).toLocaleString()}` : 'No Collection Needed'}
                                                </div>
                                            </div>
                                            <DollarSign className={cls('w-8 h-8 opacity-20',
                                                order.payment_method?.toLowerCase().includes('cash') ? 'text-green-400' : 'text-blue-400'
                                            )} />
                                        </div>

                                        {/* Action buttons */}
                                        {!['delivered', 'cancelled'].includes(getStatus(order)) && (
                                            <button
                                                onClick={() => markDelivered(order.id)}
                                                disabled={busy === order.id}
                                                className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 active:scale-95 disabled:opacity-60">
                                                {busy === order.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                                {busy === order.id ? 'Updating…' : 'Mark as Delivered'}
                                            </button>
                                        )}

                                        {getStatus(order) === 'delivered' && (
                                            <div className="py-3 rounded-2xl bg-green-900/20 border border-green-800/30 flex items-center justify-center gap-2 text-green-400 text-sm font-black">
                                                <CheckCircle className="w-4 h-4" /> Delivered Successfully
                                            </div>
                                        )}

                                    </div>
                                </motion.div>
                            ))}

                            {shown.length === 0 && (
                                <div className="text-center py-20">
                                    <Truck className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                                    <div className="text-zinc-500 font-bold">
                                        {view === 'pending' ? 'No active orders assigned to you.' : 'No completed orders yet.'}
                                    </div>
                                    <div className="text-zinc-600 text-sm mt-1">
                                        {view === 'pending' ? 'The branch will assign orders when ready.' : ''}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
