import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Button, Badge } from '../../components/UI';
import { Product } from '../../types';
import { supabase } from '../supabaseClient';
import { useToast } from './Toast';
import { useLanguage } from './LanguageContext';

interface ProductCardProps {
    product: Product;
    onAddToCart: (p: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { t } = useLanguage();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkWishlist();
    }, [product.id]);

    const checkWishlist = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data } = await supabase
            .from('wishlist')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('product_id', product.id)
            .single();

        setIsWishlisted(!!data);
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/login');
            return;
        }

        if (isWishlisted) {
            await supabase
                .from('wishlist')
                .delete()
                .eq('user_id', session.user.id)
                .eq('product_id', product.id);
            setIsWishlisted(false);
            showToast('Removed from wishlist', 'info');
        } else {
            await supabase
                .from('wishlist')
                .insert([{ user_id: session.user.id, product_id: product.id }]);
            setIsWishlisted(true);
            showToast('Added to wishlist', 'success');
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            className="group relative glass-panel rounded-2xl p-4 overflow-hidden flex flex-col h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 to-cyber-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Image / Preview */}
            <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-cyber-dark">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-2 right-2 flex gap-2">
                    <Badge>{t(`categories.${product.category.toLowerCase()}`)}</Badge>
                </div>
                <div className="absolute top-2 left-2 z-20">
                    <button
                        onClick={toggleWishlist}
                        disabled={loading}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${isWishlisted ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-gray-400 hover:text-white'}`}
                    >
                        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/product/${product.id}`)}>{t('store.viewDetails')}</Button>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyber-neon transition-colors truncate pr-2">{product.name}</h3>
                    <div className="flex items-center text-yellow-400 text-xs shrink-0">
                        <Star size={12} fill="currentColor" />
                        <span className="ml-1 font-mono">{product.rating}</span>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{product.shortDescription}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-mono font-bold text-white">
                        ${product.price === 0 ? 'FREE' : product.price}
                    </span>
                    <Button size="sm" onClick={() => onAddToCart(product)}>
                        {t('store.addToCart')}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
