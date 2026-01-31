import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from '../../components/UI';
import { User, Mail, Shield, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../components/LanguageContext';

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { t, dir } = useLanguage();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    if (loading) return <div className="text-white">{t('profile.loading')}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8" dir={dir}>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {t('profile.title')}
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="md:col-span-1 glass-panel p-8 rounded-2xl border border-white/10 text-center space-y-6"
                >
                    <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 bg-cyber-primary/20 blur-xl rounded-full" />
                        <div className="relative w-full h-full bg-cyber-dark rounded-full border-2 border-cyber-primary flex items-center justify-center overflow-hidden">
                            <UserCircle size={64} className="text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">{t('profile.userAccount')}</h2>
                        <span className="inline-block px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs">
                            {t('profile.activeMember')}
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 glass-panel p-8 rounded-2xl border border-white/10"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Shield size={20} className="text-cyber-primary" />
                        {t('profile.accountSecurity')}
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">{t('profile.emailAddress')}</label>
                            <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
                                <Mail size={18} className="text-gray-500" />
                                <span className="text-white font-mono">{user?.email}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {t('profile.emailNote')}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">{t('profile.password')}</label>
                            <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                                <span className="text-gray-500">••••••••••••</span>
                                <Button size="sm" variant="outline" onClick={() => alert('Password reset link sent to your email!')}>
                                    {t('profile.resetPassword')}
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-sm text-gray-400">
                                {t('profile.userId')}: <span className="font-mono text-xs text-gray-600">{user?.id}</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
