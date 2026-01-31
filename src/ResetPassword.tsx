import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Button } from '../components/UI';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from './components/LanguageContext';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, dir } = useLanguage();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setError(t('resetPassword.invalidLink'));
            }
        });
    }, [t]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
        } else {
            setMessage(t('resetPassword.success'));
            setTimeout(() => navigate('/login'), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans text-white" dir={dir}>
            <ThreeBackground />
            <div className="relative z-10 w-full max-w-md p-8 bg-cyber-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyber-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-cyber-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">{t('resetPassword.title')}</h1>
                    <p className="text-gray-400 text-sm mt-2">{t('resetPassword.subtitle')}</p>
                </div>

                {message && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6 text-center flex items-center justify-center gap-2">
                        <CheckCircle size={18} />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                {!message && (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">{t('resetPassword.newPassword')}</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button className="w-full justify-center" disabled={loading}>
                            {loading ? t('resetPassword.updating') : t('resetPassword.updatePassword')}
                        </Button>
                    </form>
                )}
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                        {t('resetPassword.backToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
