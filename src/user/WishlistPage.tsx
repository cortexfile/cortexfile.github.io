import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Product } from '../../types';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../components/Toast';

const WishlistPage: React.FC = () => {
    const { showToast } = useToast();
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch wishlist items with product details
        // Note: This assumes a foreign key relationship or manual join. 
        // If products are in JSON or separate table, we might need a join. 
        // Based on previous files, 'products' table exists.
        const { data, error } = await supabase
            .from('wishlist')
            .select(`
                product_id,
                products (*)
            `)
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Error fetching wishlist:', error);
        } else {
            // Map the nested result to Product array
            const products = data?.map((item: any) => item.products) || [];
            setWishlistItems(products);
        }
        setLoading(false);
    };

    const handleAddToCart = (product: Product) => {
        // Logic to add to cart - reusing strict local storage logic might be needed
        // For now, simpler to dispatch a custom event or use a context if available.
        // Or we can just show a toast since cart state is in Store.tsx.
        // A better approach is to pass this handler or context. 
        // For now, let's implement a direct local storage update + event dispatch
        const savedCart = localStorage.getItem('cart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        const existingItem = cartItems.find((item: any) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        window.dispatchEvent(new Event('cartUpdated')); // trigger update in Store
        showToast('Added to cart successfully!', 'success');
    };

    if (loading) {
        return <div className="text-white text-center py-10">Loading wishlist...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <Heart className="text-red-500" size={32} />
                <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                    <Heart size={48} className="mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-white mb-2">No items yet</h3>
                    <p className="text-gray-400">Save items you love to verify them here later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
