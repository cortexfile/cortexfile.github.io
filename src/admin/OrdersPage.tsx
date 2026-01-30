import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Order {
    id: string;
    user_email: string;
    products: any[];
    total: number;
    status: string;
    customer_details: any;
    created_at: string;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchOrders();
        } else {
            alert('Error updating status');
        }
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
                Orders Management
            </h1>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Orders Yet</h3>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="glass-panel p-6 rounded-xl border border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-white">{order.customer_details?.fullName || 'Guest'}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                        <span className="font-mono">{order.user_email}</span>
                                        <span>•</span>
                                        <span>{new Date(order.created_at).toLocaleString()}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-cyber-primary">${order.total}</p>
                                    <p className="text-xs text-gray-400">Order ID: {order.id.slice(0, 8)}...</p>
                                </div>
                            </div>

                            <div className="bg-black/20 rounded-lg p-4 mb-4">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Items ({order.products?.length || 0})</h4>
                                <div className="space-y-2">
                                    {order.products?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{item.name}</span>
                                            <span className="text-white">${item.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                {order.status === 'pending' && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50"
                                            onClick={() => updateStatus(order.id, 'completed')}
                                        >
                                            <CheckCircle size={16} className="mr-2" /> Mark Completed
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/50"
                                            onClick={() => updateStatus(order.id, 'cancelled')}
                                        >
                                            <XCircle size={16} className="mr-2" /> Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
