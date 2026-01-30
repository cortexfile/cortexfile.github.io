import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Product } from '../../types';
import {
    Plus, Trash2, Edit2, Save, X, Search, Package,
    Image as ImageIcon, Upload, ExternalLink
} from 'lucide-react';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const emptyProduct: Partial<Product> = {
        name: '',
        price: 0,
        category: 'Utility',
        description: '',
        shortDescription: '',
        rating: 5.0,
        reviews: 0,
        image: 'https://picsum.photos/400/400',
        version: '1.0.0',
        downloadSize: '100 MB',
        fileUrl: '',
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data) {
            const mapped = data.map((p: any) => ({ ...p, fileUrl: p.file_url }));
            setProducts(mapped);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editingProduct?.name || !editingProduct?.description) {
            alert('Please fill in required fields');
            return;
        }

        const dbProduct = {
            name: editingProduct.name,
            price: editingProduct.price || 0,
            category: editingProduct.category,
            description: editingProduct.description,
            shortDescription: editingProduct.shortDescription,
            rating: editingProduct.rating || 5,
            reviews: editingProduct.reviews || 0,
            image: editingProduct.image,
            version: editingProduct.version || '1.0.0',
            downloadSize: editingProduct.downloadSize || '100 MB',
            file_url: editingProduct.fileUrl,
        };

        let error;
        if (editingProduct.id) {
            // Update
            const result = await supabase.from('products').update(dbProduct).eq('id', editingProduct.id);
            error = result.error;
        } else {
            // Insert
            const result = await supabase.from('products').insert([dbProduct]);
            error = result.error;
        }

        if (error) {
            alert('Error saving: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Error deleting: ' + error.message);
        } else {
            fetchProducts();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploadingImage(true);
        try {
            const file = e.target.files[0];
            const fileName = `img_${Date.now()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('product-files').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('product-files').getPublicUrl(fileName);
            setEditingProduct({ ...editingProduct, image: data.publicUrl });
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        try {
            const file = e.target.files[0];
            const fileName = `file_${Date.now()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage.from('product-files').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('product-files').getPublicUrl(fileName);
            setEditingProduct({ ...editingProduct, fileUrl: data.publicUrl });
        } catch (err: any) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAddModal = () => {
        setEditingProduct({ ...emptyProduct });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct({ ...product });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Products</h1>
                    <p className="text-gray-400">Manage your digital products</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus size={18} className="mr-2" /> Add Product
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-cyber-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyber-primary focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-cyber-primary border-t-transparent rounded-full" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
                    <Package size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No products found</p>
                    <Button className="mt-4" onClick={openAddModal}>
                        <Plus size={18} className="mr-2" /> Add Your First Product
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-cyber-card border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors group"
                        >
                            <div className="relative h-48 bg-black/50">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="p-2 bg-cyber-primary rounded-lg hover:bg-cyber-primary/80 transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <span className="absolute top-3 right-3 px-2 py-1 bg-cyber-primary/80 text-xs rounded-full">
                                    {product.category}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-white truncate">{product.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{product.shortDescription}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="font-mono text-cyber-neon text-lg">
                                        ${product.price === 0 ? 'FREE' : product.price}
                                    </span>
                                    {product.fileUrl && (
                                        <a
                                            href={product.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-cyber-primary"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && editingProduct && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-cyber-card border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingProduct.id ? 'Edit Product' : 'New Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                    value={editingProduct.name || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                />
                            </div>

                            {/* Price & Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        value={editingProduct.price || 0}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        value={editingProduct.category || 'Utility'}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                                    >
                                        <option>Utility</option>
                                        <option>Security</option>
                                        <option>Design</option>
                                        <option>Gaming</option>
                                    </select>
                                </div>
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                    value={editingProduct.shortDescription || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                                />
                            </div>

                            {/* Full Description */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Description *</label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none h-24"
                                    value={editingProduct.description || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Product Image</label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Image URL"
                                        className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        value={editingProduct.image || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                    />
                                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-colors">
                                        <ImageIcon size={16} />
                                        {uploadingImage ? '...' : 'Upload'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                                    </label>
                                </div>
                                {editingProduct.image && (
                                    <img src={editingProduct.image} alt="Preview" className="w-20 h-20 mt-2 rounded-lg object-cover border border-white/10" />
                                )}
                            </div>

                            {/* File Upload */}
                            <div className="border-t border-white/10 pt-4">
                                <label className="block text-sm text-cyber-neon mb-2 font-bold">
                                    Digital Product File (.exe / .zip)
                                </label>
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="File URL or paste external link"
                                        className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-cyber-neon focus:border-cyber-primary focus:outline-none"
                                        value={editingProduct.fileUrl || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, fileUrl: e.target.value })}
                                    />
                                    <label className="cursor-pointer bg-cyber-primary hover:bg-cyber-primary/80 text-white px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-colors">
                                        <Upload size={16} />
                                        {uploading ? '...' : 'Upload'}
                                        <input type="file" accept=".exe,.zip,.rar,.msi" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10">
                            <Button className="w-full" onClick={handleSave}>
                                <Save size={18} className="mr-2" /> Save Product
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
