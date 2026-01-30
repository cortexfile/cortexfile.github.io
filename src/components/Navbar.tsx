import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';

interface NavbarProps {
    cartCount?: number;
    onOpenCart?: () => void;
    onOpenMobileMenu?: () => void;
}

const Navbar = ({ cartCount = 0, onOpenCart, onOpenMobileMenu }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        C
                    </div>
                    <a href="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 block">
                        Cortex<span className="text-cyber-primary">File</span>
                    </a>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {['Products', 'Features', 'Testimonials'].map((item) => (
                        <a key={item} href={`/#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest hover:neon-text">
                            {item}
                        </a>
                    ))}
                    <a href="/blog" className="text-gray-400 hover:text-white transition-colors text-sm font-medium uppercase tracking-widest hover:neon-text">
                        Blog
                    </a>
                </div>

                <div className="flex items-center gap-4">
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
