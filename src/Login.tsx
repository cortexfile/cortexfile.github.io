import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';
import { Shield, Lock } from 'lucide-react';
import ThreeBackground from '../components/ThreeBackground';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/admin');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative font-sans text-white">
            <ThreeBackground />
            <div className="relative z-10 w-full max-w-md p-8 bg-cyber-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyber-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-cyber-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Portal</h1>
                    <p className="text-gray-400 text-sm">Restricted Access Only</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                            placeholder="admin@cortexfile.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <Button className="w-full justify-center" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Enter System'} <Lock size={16} className="ml-2" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
