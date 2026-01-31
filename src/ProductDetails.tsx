import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Product } from '../types';
import { Button, Badge } from '../components/UI';
import { ShoppingCart, ArrowLeft, Star, Shield, Zap, CheckCircle, Download } from 'lucide-react';
import { useLanguage } from './components/LanguageContext';

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, dir } = useLanguage();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProduct(id);
    }, [id]);

    const fetchProduct = async (productId: string) => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
        } else {
            const mappedProduct = {
                ...data,
                fileUrl: data.file_url
            };
            setProduct(mappedProduct);
        }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center">{t('productDetails.loading')}</div>;
    if (!product) return <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center">{t('productDetails.notFound')}</div>;

    return (
        <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-cyber-primary selection:text-white pb-20" dir={dir}>
            <div className="p-6">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className={dir === 'rtl' ? 'ml-2' : 'mr-2'} size={20} /> {t('productDetails.backToStore')}
                </button>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyber-primary/20 blur-[80px] rounded-full pointer-events-none" />
                    <img
                        src={product.image}
                        alt={product.name}
                        className="relative z-10 w-full rounded-2xl border border-white/10 shadow-2xl shadow-cyber-primary/20 hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="space-y-8">
                    <div>
                        <Badge className="mb-4">{product.category}</Badge>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center text-yellow-400">
                                <Star size={16} fill="currentColor" />
                                <span className="ml-1 text-white font-bold">{product.rating}</span>
                                <span className="mx-1">/</span>
                                <span>5.0</span>
                            </div>
                            <span>•</span>
                            <span>{product.reviews} {t('productDetails.reviews')}</span>
                            <span>•</span>
                            <span>v{product.version || '1.0.0'}</span>
                        </div>
                    </div>

                    <div className="text-3xl font-mono font-bold text-cyber-neon border-b border-white/10 pb-6">
                        ${product.price}
                    </div>

                    <p className="text-lg text-gray-300 leading-relaxed">
                        {product.description || product.shortDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Zap, label: t('productDetails.instantDownload') },
                            { icon: Shield, label: t('productDetails.virusVerified') },
                            { icon: CheckCircle, label: t('productDetails.lifetimeLicense') },
                            { icon: Download, label: t('productDetails.premiumSupport') }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <feature.icon size={20} className={`text-cyber-primary ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`} />
                                <span className="text-sm font-medium">{feature.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 flex gap-4">
                        {product.fileUrl ? (
                            <Button size="lg" className="flex-1" onClick={() => window.open(product.fileUrl, '_blank')}>
                                <Download className={dir === 'rtl' ? 'ml-2' : 'mr-2'} size={20} /> {t('productDetails.downloadNow')}
                            </Button>
                        ) : (
                            <Button size="lg" className="flex-1">
                                <ShoppingCart className={dir === 'rtl' ? 'ml-2' : 'mr-2'} size={20} /> {t('productDetails.addToCart')}
                            </Button>
                        )}
                        <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                            {t('productDetails.continueShopping')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
