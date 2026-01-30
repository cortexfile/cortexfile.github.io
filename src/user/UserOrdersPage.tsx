import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                My Orders
            </h1>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading your history...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                    <p className="text-gray-400">You haven't purchased any tools yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel rounded-xl border border-white/10 overflow-hidden"
                        >
                            <div
                                className="p-6 flex flex-col md:flex-row items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${getStatusColor(order.status)}`}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white flex items-center gap-3">
                                            Order #{order.id.slice(0, 8)}
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                            <Clock size={12} />
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between">
                                    <div className="text-right">
                                        <span className="block text-xs text-gray-500">Total Amount</span>
                                        <span className="text-xl font-bold text-cyber-primary">${order.total}</span>
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedOrder === order.id && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="overflow-hidden bg-black/20 border-t border-white/5"
                                    >
                                        <div className="p-6 space-y-4">
                                            <h4 className="text-sm font-bold text-gray-300">Purchased Items</h4>
                                            <div className="space-y-3">
                                                {order.products?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded bg-black object-cover" />
                                                            <span className="text-sm font-medium text-gray-300">{item.name}</span>
                                                        </div>
                                                        <span className="text-white font-mono">${item.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                {order.status === 'completed' && (
                                                    <button className="text-sm text-cyber-primary hover:text-cyber-neon hover:underline">
                                                        Download Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrdersPage;
