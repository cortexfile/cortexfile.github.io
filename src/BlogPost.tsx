import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link, useParams } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (data) setPost(data);
            setLoading(false);
        };

        fetchPost();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-black text-white">
            <div className="w-12 h-12 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-black text-white">
            <h1 className="text-4xl font-bold mb-4">Post not found</h1>
            <Link to="/blog" className="text-cyber-primary hover:text-cyber-accent">Back to Blog</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-cyber-black text-white font-sans overflow-x-hidden">
            <ThreeBackground />

            {/* Minimal Header */}
            <div className="fixed top-0 w-full z-50 py-6 px-6 bg-cyber-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/blog" className="flex items-center text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} className="mr-2" /> Back to Blog
                    </Link>
                    <Link to="/" className="text-xl font-bold tracking-tighter">
                        Cortex<span className="text-cyber-primary">File</span>
                    </Link>
                </div>
            </div>

            <article className="relative z-10 pt-32 pb-20">
                {/* Hero */}
                <div className="container mx-auto px-6 mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
                            <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2"><User size={16} /> Admin</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
                            {post.title}
                        </h1>
                    </motion.div>
                </div>

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="container mx-auto px-6 mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-5xl mx-auto"
                        >
                            <img src={post.cover_image} alt={post.title} className="w-full max-h-[600px] object-cover" />
                        </motion.div>
                    </div>
                )}

                {/* Content */}
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto glass-panel p-8 md:p-12 rounded-2xl border border-white/10 prose prose-invert prose-lg prose-headings:text-white prose-a:text-cyber-primary hover:prose-a:text-cyber-accent">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                        <div className="text-gray-400">
                            Share this article:
                        </div>
                        <div className="flex gap-4">
                            <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-white">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
