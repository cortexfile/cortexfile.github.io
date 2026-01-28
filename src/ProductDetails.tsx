import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Product } from '../types';
import { Button, Badge } from '../components/UI';
import { ShoppingCart, ArrowLeft, Star, Shield, Zap, CheckCircle, Download } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
            // Map DB snake_case to frontend camelCase if needed
            const mappedProduct = {
                ...data,
                fileUrl: data.file_url // Ensure this property exists
            };
            setProduct(mappedProduct);
        }
        setLoading(false);
    };

    if (loading) return <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center">Product not found</div>;

    return (
        <div className="min-h-screen bg-cyber-black text-white font-sans selection:bg-cyber-primary selection:text-white pb-20">
            {/* Navbar Placeholder for Back Button */}
            <div className="p-6">
                <button onClick={() => navigate('/')} className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="mr-2" size={20} /> Back to Store
                </button>
            </div>

            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Image Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-cyber-primary/20 blur-[80px] rounded-full pointer-events-none" />
                    <img
                        src={product.image}
                        alt={product.name}
                        className="relative z-10 w-full rounded-2xl border border-white/10 shadow-2xl shadow-cyber-primary/20 hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Details Section */}
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
                            <span>{product.reviews} Reviews</span>
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
                            { icon: Zap, label: "Instant Download" },
                            { icon: Shield, label: "Virus Verified" },
                            { icon: CheckCircle, label: "Lifetime License" },
                            { icon: Download, label: "Premium Support" }
                        ].map((feature, idx) => (
                            <div key={idx} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                <feature.icon size={20} className="text-cyber-primary mr-3" />
                                <span className="text-sm font-medium">{feature.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 flex gap-4">
                        {product.fileUrl ? (
                            <Button size="lg" className="flex-1" onClick={() => window.open(product.fileUrl, '_blank')}>
                                <Download className="mr-2" size={20} /> Download Now
                            </Button>
                        ) : (
                            <Button size="lg" className="flex-1">
                                <ShoppingCart className="mr-2" size={20} /> Add to Cart
                            </Button>
                        )}
                        <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
