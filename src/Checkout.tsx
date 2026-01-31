import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import Navbar from './components/Navbar';
import { Button } from '../components/UI';
import { ArrowLeft, CheckCircle, CreditCard, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from './components/LanguageContext';

const Checkout = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        address: '',
        city: '',
        zip: '',
    });
    const navigate = useNavigate();
    const { t, dir } = useLanguage();

    useEffect(() => {
        const savedCart = localStorage.getItem('cortex_cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            user_email: formData.email,
            products: cart,
            total: total,
            status: 'completed', // Auto-complete for instant access in this demo
            customer_details: formData,
        };

        const { error } = await supabase.from('orders').insert([orderData]);

        if (error) {
            alert('Error placing order: ' + error.message);
            setLoading(false);
        } else {
            localStorage.removeItem('cortex_cart');
            setCart([]);
            setCompleted(true);
            setLoading(false);
        }
    };

    if (completed) {
        return (
            <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center font-sans" dir={dir}>
                <ThreeBackground />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 glass-panel p-8 rounded-2xl max-w-md w-full text-center border border-green-500/30 shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{t('checkout.orderConfirmed')}</h1>
                    <p className="text-gray-400 mb-8">
                        {t('checkout.thankYou')}
                    </p>
                    <Link to="/">
                        <Button className="w-full justify-center">{t('checkout.returnToStore')}</Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cyber-black text-white font-sans overflow-x-hidden" dir={dir}>
            <ThreeBackground />
            <Navbar cartCount={cart.length} />

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className={dir === 'rtl' ? 'ml-2' : 'mr-2'} /> {t('checkout.backToStore')}
                </Link>

                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-cyber-primary" /> {t('checkout.title')}
                </h1>

                {cart.length === 0 ? (
                    <div className="glass-panel p-12 text-center rounded-2xl border border-white/10">
                        <p className="text-xl text-gray-400 mb-6">{t('checkout.emptyCart')}</p>
                        <Link to="/">
                            <Button>{t('checkout.browseProducts')}</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="glass-panel p-8 rounded-2xl border border-white/10 h-fit"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard size={20} /> {t('checkout.shippingPayment')}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{t('checkout.fullName')}</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{t('checkout.emailAddress')}</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">{t('checkout.address')}</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">{t('checkout.city')}</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">{t('checkout.zip')}</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                            value={formData.zip}
                                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10 mt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-gray-400">{t('checkout.totalAmount')}</span>
                                        <span className="text-3xl font-bold text-cyber-primary">${total}</span>
                                    </div>
                                    <Button className="w-full justify-center py-4 text-lg" disabled={loading}>
                                        {loading ? t('checkout.processing') : `${t('checkout.pay')} $${total}`}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="glass-panel p-8 rounded-2xl border border-white/10 h-fit"
                        >
                            <h2 className="text-2xl font-bold mb-6">{t('checkout.orderSummary')}</h2>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-white/5 p-3 rounded-lg">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-black" />
                                        <div className="flex-1">
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="text-sm text-gray-400">{item.category}</p>
                                        </div>
                                        <span className="font-bold text-cyber-primary">${item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkout;
