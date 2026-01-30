import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { Plus, Edit, Trash2, Globe, Eye, Image as ImageIcon, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    published: boolean;
    created_at: string;
}

const BlogPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<Post>>({});
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);

        const postData = {
            ...currentPost,
            slug: currentPost.slug || currentPost.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        };

        let error;
        if (currentPost.id) {
            const { error: updateError } = await supabase.from('posts').update(postData).eq('id', currentPost.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase.from('posts').insert([postData]);
            error = insertError;
        }

        if (!error) {
            setIsEditing(false);
            fetchPosts();
            setCurrentPost({});
        } else {
            alert('Error saving post: ' + error.message);
        }
        setSaveLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        await supabase.from('posts').delete().eq('id', id);
        fetchPosts();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('blog-images').upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath);
        setCurrentPost({ ...currentPost, cover_image: publicUrl });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Blog Manager
                </h1>
                <Button onClick={() => { setCurrentPost({}); setIsEditing(true); }}>
                    <Plus size={18} className="mr-2" /> New Post
                </Button>
            </div>

            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel p-6 rounded-xl border border-white/10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Edit size={20} className="text-cyber-primary" />
                                {currentPost.id ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                type="button"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentPost.title || ''}
                                        onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={currentPost.slug || ''}
                                        onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none h-20"
                                    value={currentPost.excerpt || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Content (Markdown supported)</label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none h-64 font-mono text-sm"
                                    required
                                    value={currentPost.content || ''}
                                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentPost.cover_image || ''}
                                            onChange={(e) => setCurrentPost({ ...currentPost, cover_image: e.target.value })}
                                            className="flex-1 bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                            placeholder="Image URL"
                                        />
                                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 flex items-center justify-center transition-colors">
                                            <ImageIcon size={20} className="text-gray-400" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                                <div className="w-40">
                                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPost({ ...currentPost, published: !currentPost.published })}
                                        className={`w-full p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${currentPost.published
                                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                            : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                                            }`}
                                    >
                                        {currentPost.published ? <Globe size={18} /> : <Eye size={18} />}
                                        {currentPost.published ? 'Published' : 'Draft'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Button variant="outline" onClick={() => setIsEditing(false)} type="button">
                                    Cancel
                                </Button>
                                <Button disabled={saveLoading}>
                                    <Save size={18} className="mr-2" />
                                    {saveLoading ? 'Saving...' : 'Save Post'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                        <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Posts Yet</h3>
                        <p className="text-gray-400">Create your first blog post to get started.</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="glass-panel p-6 rounded-xl border border-white/10 flex items-center justify-between group hover:border-cyber-primary/50 transition-colors">
                            <div className="flex items-center gap-4">
                                {post.cover_image && (
                                    <img src={post.cover_image} alt={post.title} className="w-16 h-16 object-cover rounded-lg" />
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyber-primary transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span className={`px-2 py-0.5 rounded text-xs ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setCurrentPost(post); setIsEditing(true); }}
                                    className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogPage;
