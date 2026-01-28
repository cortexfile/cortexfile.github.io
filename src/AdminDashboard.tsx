import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Button } from '../components/UI';
import { Product } from '../types';
import { Package, Trash2, Plus, LogOut, Save, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    // New Product Form State
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: 'Utility',
        description: '',
        shortDescription: '',
        rating: 5.0,
        reviews: 0,
        image: 'https://picsum.photos/400/400',
        version: '1.0.0'
    });

    useEffect(() => {
        fetchProducts();
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/login');
        };
        checkUser();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error("Error fetching products:", error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.description) return;

        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) {
            alert('Error adding product: ' + error.message);
        } else {
            setIsAdding(false);
            fetchProducts(); // Refresh list
            // Reset form
            setNewProduct({
                name: '',
                price: 0,
                category: 'Utility',
                description: '',
                shortDescription: '',
                rating: 5.0,
                reviews: 0,
                image: 'https://picsum.photos/400/400',
                version: '1.0.0'
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Error deleting: ' + error.message);
        } else {
            fetchProducts();
        }
    };

    if (loading) return <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-cyber-black text-white font-sans p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-lg flex items-center justify-center font-bold">A</div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => setIsAdding(true)} variant="outline"><Plus size={18} className="mr-2" /> Add Product</Button>
                        <Button onClick={handleLogout} variant="ghost"><LogOut size={18} className="mr-2" /> Logout</Button>
                    </div>
                </div>

                {/* Add Product Modal */}
                {isAdding && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-cyber-card border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">New Product</h2>
                                <button onClick={() => setIsAdding(false)}><X className="text-gray-400 hover:text-white" /></button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                                    <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg p-3"
                                        value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price</label>
                                    <input type="number" className="w-full bg-black/30 border border-white/10 rounded-lg p-3"
                                        value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
                                        value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}>
                                        <option>Utility</option>
                                        <option>Security</option>
                                        <option>Design</option>
                                        <option>Gaming</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                                    <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg p-3"
                                        value={newProduct.shortDescription} onChange={e => setNewProduct({ ...newProduct, shortDescription: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Full Description</label>
                                    <textarea className="w-full bg-black/30 border border-white/10 rounded-lg p-3 h-32"
                                        value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm text-gray-400 mb-1">Image URL (Optional)</label>
                                    <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg p-3"
                                        value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                                </div>
                            </div>

                            <Button className="w-full" onClick={handleAddProduct}><Save size={18} className="mr-2" /> Save Product</Button>
                        </div>
                    </div>
                )}

                {/* Product List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex gap-4 hover:bg-white/10 transition-colors">
                            <img src={product.image} className="w-20 h-20 rounded-lg object-cover bg-black" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold">{product.name}</h3>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                </div>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-1">{product.shortDescription}</p>
                                <p className="font-mono text-cyber-neon mt-2">${product.price}</p>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && !loading && (
                        <div className="col-span-3 text-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                            <Package size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No products found in database.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
