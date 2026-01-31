import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useToast } from './components/Toast';
import Navbar from './components/Navbar';
import SectionTitle from './components/SectionTitle';
import { useLanguage } from './components/LanguageContext';

const Contact = () => {
    const { showToast } = useToast();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic rate limiting check (client-side simulation)
            const lastSent = localStorage.getItem(`last_msg_${formData.email}`);
            if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
                throw new Error('Please wait a minute before sending another message.');
            }

            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            localStorage.setItem(`last_msg_${formData.email}`, Date.now().toString());
            showToast(t('contact.success'), 'success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error: any) {
            console.error('Error sending message:', error);
            showToast(error.message || 'Failed to send message', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black text-white relative overflow-hidden">
            <Navbar />
            <div className="container mx-auto px-6 py-32 relative z-10">
                <SectionTitle title={t('contact.title')} subtitle={t('contact.subtitle')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-primary/10 rounded-full blur-3xl group-hover:bg-cyber-primary/20 transition-colors" />
                            <h3 className="text-2xl font-bold mb-6 text-white">{t('contact.infoTitle')}</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="w-10 h-10 rounded-lg bg-cyber-primary/10 flex items-center justify-center text-cyber-primary">
                                        <Mail size={20} />
                                    </div>
                                    <span>support@cortexfile.io</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-300">
                                    <div className="w-10 h-10 rounded-lg bg-cyber-accent/10 flex items-center justify-center text-cyber-accent">
                                        <MapPin size={20} />
                                    </div>
                                    <span>Global Digital Headquarters</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.name')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all"
                                    placeholder={t('contact.yourName')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.email')}</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all"
                                    placeholder={t('contact.yourEmail')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('contact.message')}</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all resize-none"
                                    placeholder={t('contact.howHelp')}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    t('contact.sending')
                                ) : (
                                    <>
                                        {t('contact.send')}
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
