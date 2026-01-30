import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
    totalProducts: number;
    totalTestimonials: number;
    totalFeatures: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalTestimonials: 0, totalFeatures: 0 });
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch counts
            const [productsRes, testimonialsRes, featuresRes] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('testimonials').select('*', { count: 'exact', head: true }),
                supabase.from('features').select('*', { count: 'exact', head: true }),
            ]);

            setStats({
                totalProducts: productsRes.count || 0,
                totalTestimonials: testimonialsRes.count || 0,
                totalFeatures: featuresRes.count || 0,
            });

            // Fetch recent products
            const { data: products } = await supabase
                .from('products')
                .select('id, name, price, image, category')
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentProducts(products || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-cyber-card border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            <span>{Math.abs(trend)}% from last month</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-gradient-to-br from-cyber-primary to-indigo-600"
                />
                <StatCard
                    title="Testimonials"
                    value={stats.totalTestimonials}
                    icon={Users}
                    color="bg-gradient-to-br from-cyber-accent to-pink-600"
                />
                <StatCard
                    title="Features"
                    value={stats.totalFeatures}
                    icon={TrendingUp}
                    color="bg-gradient-to-br from-emerald-500 to-green-600"
                />
                <StatCard
                    title="Revenue"
                    value="$0"
                    icon={DollarSign}
                    color="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </div>

            {/* Recent Products */}
            <div className="bg-cyber-card border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Recent Products</h2>
                    <Link
                        to="/admin/products"
                        className="text-cyber-primary hover:text-cyber-accent text-sm font-medium transition-colors"
                    >
                        View All →
                    </Link>
                </div>

                {recentProducts.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No products yet. Add your first product!</p>
                        <Link
                            to="/admin/products"
                            className="inline-block mt-4 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary/80 transition-colors"
                        >
                            Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {recentProducts.map((product) => (
                            <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-black"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-400">{product.category}</p>
                                </div>
                                <span className="font-mono text-cyber-neon">
                                    ${product.price === 0 ? 'FREE' : product.price}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    to="/admin/products"
                    className="bg-gradient-to-br from-cyber-primary/20 to-cyber-primary/5 border border-cyber-primary/20 rounded-2xl p-6 hover:border-cyber-primary/40 transition-colors group"
                >
                    <Package className="text-cyber-primary mb-3" size={32} />
                    <h3 className="font-bold text-white group-hover:text-cyber-primary transition-colors">Manage Products</h3>
                    <p className="text-sm text-gray-400 mt-1">Add, edit or remove products</p>
                </Link>

                <Link
                    to="/admin/appearance"
                    className="bg-gradient-to-br from-cyber-accent/20 to-cyber-accent/5 border border-cyber-accent/20 rounded-2xl p-6 hover:border-cyber-accent/40 transition-colors group"
                >
                    <TrendingUp className="text-cyber-accent mb-3" size={32} />
                    <h3 className="font-bold text-white group-hover:text-cyber-accent transition-colors">Customize Appearance</h3>
                    <p className="text-sm text-gray-400 mt-1">Edit hero, colors & branding</p>
                </Link>

                <Link
                    to="/admin/testimonials"
                    className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors group"
                >
                    <Users className="text-emerald-500 mb-3" size={32} />
                    <h3 className="font-bold text-white group-hover:text-emerald-500 transition-colors">Manage Reviews</h3>
                    <p className="text-sm text-gray-400 mt-1">Add customer testimonials</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
