import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Button } from '../components/UI';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for the password reset link.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans text-white">
            <ThreeBackground />
            <div className="relative z-10 w-full max-w-md p-8 bg-cyber-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="mb-6">
                    <Link to="/login" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyber-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-cyber-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-gray-400 text-sm mt-2">Enter your email to receive a recovery link.</p>
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

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    <Button className="w-full justify-center" disabled={loading}>
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
