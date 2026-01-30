import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingCart, Search, Menu, X, Star, Download, Shield, Zap,
  Cpu, ChevronRight, Github, Twitter, Linkedin, Monitor,
  Smartphone, Globe, CheckCircle, CreditCard, Box
} from 'lucide-react';
import { MOCK_PRODUCTS, TESTIMONIALS } from '../constants';
import { Product, CartItem, SortOption } from '../types';
import ThreeBackground from '../components/ThreeBackground';
import { Button, Badge, SectionTitle } from '../components/UI';

// --- Sub-Components (Defined here for file constraint) ---

import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useToast } from './components/Toast';

// 2. Product Card
import ProductCard from './components/ProductCard';

// 3. Cart Drawer
const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onCheckout }: any) => {
  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cyber-black border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="text-cyber-primary" /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <Box size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty.</p>
                  <Button variant="outline" className="mt-4" onClick={onClose}>Continue Shopping</Button>
                </div>
              ) : (
                cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400 font-mono">${item.price}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                        <span className="text-sm">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                        <button onClick={() => onRemove(item.id)} className="ml-auto text-xs text-red-400 hover:text-red-300">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-cyber-dark">
              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-cyber-neon font-mono">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" disabled={cartItems.length === 0} onClick={onCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 4. Hero Section
interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  hero_image: string;
}

const Hero = ({ settings, isLoading }: { settings: SiteSettings | null; isLoading: boolean }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyber-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyber-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div style={{ y: y1 }} className="space-y-6">

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            {(settings?.hero_title || 'Execute Your Potential').split(' ').slice(0, -1).join(' ')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon via-white to-cyber-primary animate-pulse-slow">
              {(settings?.hero_title || 'Execute Your Potential').split(' ').slice(-1)[0]}
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
            {settings?.hero_subtitle || 'The world\'s most advanced marketplace for high-performance EXE tools, System utilities, and developer assets. Optimized for the future.'}
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              {settings?.hero_button_text || 'Explore Store'} <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-white/5">
            {[
              { icon: Zap, label: "Instant Delivery" },
              { icon: Shield, label: "Secure Guard" },
              { icon: Cpu, label: "High Performance" }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-gray-400">
                <Icon size={20} className="text-cyber-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: y2 }} className="hidden md:block relative">
          <div className="relative z-10 w-full h-[600px] rounded-2xl border border-white/10 glass-panel shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary/20 to-transparent opacity-50" />
            {!isLoading && (
              <img
                src={settings?.hero_image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop'}
                alt="Dashboard Preview"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
            )}
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center bg-cyber-dark">
                <div className="w-12 h-12 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Holographic UI Elements */}
            <div className="absolute top-10 right-10 p-4 glass-panel rounded-xl animate-float">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-green-400">SYSTEM OPTIMAL</span>
              </div>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-cyber-neon" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 5. Checkout Modal (Simplified Simulation)
const CheckoutModal = ({ isOpen, onClose, cartItems, onComplete }: any) => {
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-cyber-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1 w-12 rounded-full transition-colors ${step >= i ? 'bg-cyber-primary' : 'bg-gray-700'}`} />
              ))}
            </div>
            <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Account Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none" />
                <input type="text" placeholder="Last Name" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none" />
              <Button className="w-full" onClick={() => setStep(2)}>Continue to Payment</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Secure Payment</h2>
              <div className="p-4 bg-cyber-primary/10 border border-cyber-primary/20 rounded-lg flex items-center gap-3">
                <Shield className="text-cyber-primary" />
                <span className="text-sm text-cyber-primary">256-bit SSL Encrypted Connection</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border border-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/5">
                  <div className="w-4 h-4 rounded-full border-2 border-cyber-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-cyber-primary" />
                  </div>
                  <CreditCard />
                  <span className="font-bold">Credit Card</span>
                </div>
                <div className="flex items-center gap-4 border border-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/5 opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                  <span>Crypto (ETH/BTC)</span>
                </div>
              </div>
              <Button className="w-full" onClick={handlePay} isLoading={processing}>
                {processing ? 'Processing Transaction...' : `Pay Now`}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Purchase Successful!</h2>
              <p className="text-gray-400 mb-8">Your license keys have been sent to your email.</p>
              <div className="bg-black/30 p-4 rounded-lg mb-8 font-mono text-sm text-cyber-neon border border-white/10 border-dashed">
                KEY: XXXX-XXXX-XXXX-XXXX
              </div>
              <Button onClick={() => { onComplete(); onClose(); }}>Download Software</Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---

const Store = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchSiteSettings();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cortex_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cortex_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchSiteSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single();
    if (data) setSiteSettings(data);
    setSettingsLoading(false);
  };
  // ... existing code ...


  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      const mappedData = data.map(p => ({
        ...p,
        fileUrl: p.file_url
      }));
      setProducts(mappedData);
    } else {
      // Fallback to mock if DB is empty or error (optional, but good for demo)
      setProducts(MOCK_PRODUCTS);
    }
    setLoading(false);
  };
  // ... (rest of logic)

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('search') || '');

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find((item: CartItem) => item.id === product.id);
      if (exists) {
        return prev.map((item: CartItem) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter((item: CartItem) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map((item: CartItem) => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // Filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen font-sans text-white relative selection:bg-cyber-primary selection:text-white">
      <ThreeBackground />

      <Navbar
        cartCount={cart.reduce((a: number, b: CartItem) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="space-y-32 pb-32">
        <Hero settings={siteSettings} isLoading={settingsLoading} />

        {/* Featured / Products Section */}
        <section id="products" className="container mx-auto px-6">
          <SectionTitle
            title={searchQuery ? `Results: "${searchQuery}"` : "Digital Arsenal"}
            subtitle={searchQuery ? "Found products matching your search" : "Premium Tools"}
          />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-cyber-primary text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:border-cyber-primary focus:outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6">
          <div className="glass-panel rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-primary/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
              {[
                { title: 'Global CDN', desc: 'Downloads served from 120+ edge locations for max speed.', icon: Globe },
                { title: 'Auto-Updates', desc: 'Software stays current with silent background patching.', icon: Download },
                { title: 'Cloud Sync', desc: 'Your settings and licenses sync across all your devices.', icon: Monitor },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 text-cyber-neon shadow-lg">
                    <f.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="container mx-auto px-6">
          <SectionTitle title="User Protocols" subtitle="Reviews" />
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className="bg-cyber-card border border-white/5 p-8 rounded-2xl relative">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-cyber-primary" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-cyber-primary">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 italic">"{t.content}"</p>
                <div className="flex gap-1 mt-4 text-yellow-500">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-cyber-primary to-cyber-accent rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Join the Developer Network</h2>
              <p className="text-white/80">Get exclusive access to beta releases and discount codes dropped directly to your inbox.</p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input type="email" placeholder="enter_email_address.exe" className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none" />
                <button className="bg-white text-cyber-primary font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-cyber-black py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-500">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">Cortex<span className="text-cyber-primary">File</span></div>
            <p>Advanced digital distribution platform designed for the next generation of creators.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyber-primary">Browse All</a></li>
              <li><a href="#" className="hover:text-cyber-primary">Sell Software</a></li>
              <li><a href="#" className="hover:text-cyber-primary">API Access</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-cyber-primary">Documentation</a></li>
              <li><a href="#" className="hover:text-cyber-primary">Status Page</a></li>
              <li><a href="#" className="hover:text-cyber-primary">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex gap-4">
              <Github className="hover:text-white cursor-pointer" />
              <Twitter className="hover:text-white cursor-pointer" />
              <Linkedin className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-white/5">
          <p>© 2026 CortexFile Inc. All systems operational.</p>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => { setIsCartOpen(false); navigate('/checkout'); }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onComplete={clearCart}
      />
    </div>
  );
};

export default Store;