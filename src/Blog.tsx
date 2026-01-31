import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import Navbar from './components/Navbar';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from './components/LanguageContext';

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    created_at: string;
}

const Blog = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const { t, dir } = useLanguage();

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (data) setPosts(data);
            setLoading(false);
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-cyber-black text-white selection:bg-cyber-primary selection:text-white font-sans overflow-x-hidden" dir={dir}>
            <ThreeBackground />

            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-600">
                        {t('blog.title')} <span className="text-cyber-primary">{t('blog.titleHighlight')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('blog.subtitle')}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold mb-2">{t('blog.noPosts')}</h3>
                        <p className="text-gray-400">{t('blog.checkBack')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-cyber-card border border-white/10 rounded-2xl overflow-hidden hover:border-cyber-primary/50 transition-colors"
                            >
                                <div className="aspect-video bg-gray-900 overflow-hidden">
                                    {post.cover_image ? (
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-cyber-primary/10">
                                            <span className="text-cyber-primary text-4xl font-bold opacity-20">CF</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> 5 {t('blog.minRead')}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-cyber-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <Link
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-cyber-primary hover:text-cyber-accent font-medium transition-colors"
                                    >
                                        {t('blog.readArticle')} <ArrowRight size={18} className={`${dir === 'rtl' ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
