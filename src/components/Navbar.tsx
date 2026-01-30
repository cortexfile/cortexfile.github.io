import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, User, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
    cartCount?: number;
    onOpenCart?: () => void;
    onOpenMobileMenu?: () => void;
}

const Navbar = ({ cartCount = 0, onOpenCart, onOpenMobileMenu }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        checkUser();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] flex-shrink-0">
                        C
                    </div>
                    <Link to="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 whitespace-nowrap">
                        Cortex<span className="text-cyber-primary">File</span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['Products', 'Features', 'Testimonials'].map((item) => (
                        <a key={item} href={`/#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest hover:neon-text">
                            {item}
                        </a>
                    ))}
                    <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest hover:neon-text">
                        Blog
                    </Link>
                </div>

                <div className="flex-1 max-w-md mx-8 hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-500 group-focus-within:text-cyber-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg leading-5 bg-black/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/80 focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary sm:text-sm transition-all duration-300"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `/?search=${e.currentTarget.value}`;
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <Link to="/user/profile" className="p-2 text-gray-400 hover:text-white transition-colors" title="My Account">
                            <User size={24} />
                        </Link>
                    ) : (
                        <Link to="/login" className="text-sm font-bold text-cyber-primary hover:text-cyber-neon tracking-widest uppercase">
                            Login
                        </Link>
                    )}

                    {onOpenCart && (
                        <button onClick={onOpenCart} className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-cyber-accent text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    )}
                    {onOpenMobileMenu && (
                        <button className="md:hidden p-2 text-gray-400" onClick={onOpenMobileMenu}>
                            <Menu size={24} />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
