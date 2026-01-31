import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCart, Search, Star, Download, Shield, Lock, Zap, Code, Gamepad2, Wrench, Sparkles, ChevronDown, Check, X, Menu, CreditCard, Bitcoin, MessageCircle, Play, Eye, Heart, TrendingUp, Cpu, Monitor, Globe } from 'lucide-react';
import { supabase } from './supabaseClient';
import { Product } from '../types';
import Navbar from './components/Navbar'; // Restored Navbar
import ThreeBackground from './components/ThreeBackground'; // New isolated component
import { useLanguage } from './components/LanguageContext'; // Restored Language Context

// Extended Product type for UI-specific fields not in DB
interface UIProduct extends Product {
  trending?: boolean;
}

const Store = () => {
  const { t, dir } = useLanguage(); // Use localized strings and direction
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<UIProduct | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Real data state
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  // Check WebGL availability once
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLAvailable(false);
      }
    } catch (e) {
      setWebGLAvailable(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cortex_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cortex_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');

      if (error) throw error;

      if (data) {
        const mappedProducts: UIProduct[] = data.map(p => ({
          ...p,
          features: p.features || ['Premium Feature', '24/7 Support', 'Instant Download'],
          trending: Math.random() > 0.7,
          rating: p.rating || 5.0,
          reviews: p.reviews || 0,
          downloads: p.downloads || 0
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: t('store.all'), icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'gaming', name: t('categories.gaming'), icon: Gamepad2, color: 'from-red-500 to-orange-500' },
    { id: 'utility', name: t('categories.utility'), icon: Wrench, color: 'from-blue-500 to-cyan-500' },
    { id: 'apps', name: t('categories.design'), icon: Code, color: 'from-green-500 to-emerald-500' }
  ];

  // Note: Testimonials and FAQs should ideally come from translation files or DB too
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Software Developer',
      avatar: '👨💻',
      rating: 5,
      text: 'Quantum Code Editor completely transformed my workflow. The AI predictions are scarily accurate!'
    },
    {
      name: 'Sarah Martinez',
      role: 'Game Streamer',
      avatar: '👩🎨',
      rating: 5,
      text: 'StreamPro is hands down the best broadcasting software. My stream quality improved dramatically!'
    },
    {
      name: 'David Kim',
      role: 'Cybersecurity Expert',
      avatar: '🛡️',
      rating: 5,
      text: 'CyberVault gives me peace of mind. The encryption is top-tier and UI is beautiful.'
    }
  ];

  // Fallback static faqs (mock) if not in language file, using simple logic or restoring from t()
  const faqs = [1, 2, 3, 4, 5]; // Using IDs to map to t(`faq.q${i}`)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product: UIProduct) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      let productCat = 'other';
      if (product.category === 'Utility' || product.category === 'Security') productCat = 'utility';
      if (product.category === 'Gaming') productCat = 'gaming';
      if (product.category === 'Design') productCat = 'apps';

      const matchesCategory = selectedCategory === 'all' || productCat === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500 overflow-hidden relative`} dir={dir}>

      {/* Background Logic */}
      {webGLAvailable ? (
        <ThreeBackground darkMode={darkMode} />
      ) : (
        <div className={`fixed inset-0 pointer-events-none z-0 bg-gradient-to-br ${darkMode ? 'from-gray-900 via-purple-900/20 to-gray-900' : 'from-gray-50 via-purple-100 to-white'} animate-pulse-slow`}>
          {/* CSS-only decorative blobs as fallback */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10">

        {/* Restored Navbar */}
        <Navbar
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          onOpenCart={() => setShowCart(true)}
        />

        {/* Shopping Cart Sidebar (Custom implementation based on restored logic) */}
        <div className={`fixed ${dir === 'rtl' ? 'left-0' : 'right-0'} top-0 h-full w-96 z-50 backdrop-blur-2xl transform transition-transform duration-500 ${showCart ? 'translate-x-0' : (dir === 'rtl' ? '-translate-x-full' : 'translate-x-full')}`}
          style={{
            background: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderLeft: dir === 'rtl' ? 'none' : '1px solid rgba(139, 92, 246, 0.2)',
            borderRight: dir === 'rtl' ? '1px solid rgba(139, 92, 246, 0.2)' : 'none'
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('cart.title')}</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-purple-500 hover:bg-opacity-20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12 opacity-60">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>{t('cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:border-purple-500"
                      style={{
                        background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                        borderColor: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
                          {item.image.includes('http') ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{item.image}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{item.name}</h3>
                          <p className="text-sm opacity-60">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-purple-500 bg-opacity-20 hover:bg-opacity-30 transition-all"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-purple-500 bg-opacity-20 hover:bg-opacity-30 transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>{t('cart.total')}:</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => { setCheckoutStep(1); setShowCart(false); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  {t('cart.checkout')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30">
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🚀 New Release: Quantum Code Editor Pro 2026
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                    {t('hero.title').split(' ')[0]}
                  </span>
                  <br />
                  <span className="text-white">{t('hero.title').split(' ').slice(1).join(' ')}</span>
                </h1>

                <p className="text-xl opacity-80 leading-relaxed">
                  {t('hero.subtitle')}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    {t('hero.explore')}
                  </button>
                  <button className="px-8 py-4 rounded-2xl backdrop-blur-xl border border-purple-500/30 font-semibold hover:bg-purple-500/10 transition-all duration-300">
                    {t('hero.demo')}
                  </button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">~500K</div>
                    <div className="text-sm opacity-60">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">4.9★</div>
                    <div className="text-sm opacity-60">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
                    <div className="text-sm opacity-60">Support</div>
                  </div>
                </div>
              </div>

              {/* 3D Hero Element Fallback */}
              <div className="relative">
                {webGLAvailable ? (
                  <div className="w-full h-96 rounded-3xl bg-purple-500/5 flex items-center justify-center">
                    {/* Complex 3D scene would typically go here, simplified to a placeholder or simpler canvas if needed */}
                    <div className="animate-float">
                      <Zap size={200} className="text-purple-500/50" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse flex items-center justify-center">
                    <Star size={120} className="text-white/20 animate-spin-slow" />
                  </div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent rounded-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-105 ${isActive ? 'border-purple-500 shadow-2xl shadow-purple-500/30' : 'border-purple-500/20 hover:border-purple-500/40'
                      }`}
                    style={{
                      background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 mx-auto`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-center">{category.name}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section id="products" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {t('store.digitalArsenal')}
                </span>
              </h2>
              <p className="text-xl opacity-60">{t('store.premiumTools')}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full h-64 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-20 opacity-50">
                  <p className="text-xl">{t('common.searchPlaceholder')}</p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 hover:border-purple-500 cursor-pointer transform hover:scale-105 hover:rotate-1"
                    style={{
                      background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)',
                      borderColor: 'rgba(139, 92, 246, 0.2)',
                      animationDelay: `${index * 100}ms`
                    }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.trending && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold flex items-center gap-1 animate-bounce">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </div>
                    )}

                    <div className="h-48 mb-4 overflow-hidden rounded-xl flex items-center justify-center bg-gray-800/50">
                      {product.image.includes('http') ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <span className="text-6xl">{product.image}</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>

                    <p className="opacity-60 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{product.rating}</span>
                      <span className="text-sm opacity-50">({product.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm opacity-60">
                      <Download className="w-4 h-4" />
                      <span>{(product.downloads / 1000).toFixed(0)}K downloads</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        ${product.price}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                      >
                        {t('cart.add')}
                      </button>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Features / Why Choose Us */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Why Choose CortexFile?
                </span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: t('hero.secureGuard'), desc: 'Military-grade encryption and verified software', color: 'from-blue-500 to-cyan-500' },
                { icon: Zap, title: t('hero.instantDelivery'), desc: 'Download immediately after purchase', color: 'from-purple-500 to-pink-500' },
                { icon: Monitor, title: t('features.cloudSync'), desc: 'Free updates and priority support forever', color: 'from-green-500 to-emerald-500' }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-8 rounded-3xl backdrop-blur-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 transform hover:scale-105"
                    style={{
                      background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="opacity-60">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {t('testimonials.title')}
                </span>
              </h2>
            </div>

            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-1000 ${index === currentTestimonial ? 'opacity-100 transform scale-100' : 'opacity-0 absolute inset-0 transform scale-95 pointer-events-none'
                    }`}
                >
                  <div className="p-8 rounded-3xl backdrop-blur-xl border border-purple-500/20"
                    style={{
                      background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-bold text-xl">{testimonial.name}</h4>
                        <p className="opacity-60">{testimonial.role}</p>
                      </div>
                      <div className="ml-auto flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg leading-relaxed opacity-80">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-purple-500 w-8' : 'bg-purple-500/30'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  {t('faq.title')}
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faqIndex) => (
                <div
                  key={faqIndex}
                  className="rounded-2xl backdrop-blur-xl border border-purple-500/20 overflow-hidden transition-all duration-300"
                  style={{
                    background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faqIndex ? null : faqIndex)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="font-semibold text-lg">{t(`faq.q${faqIndex}`)}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedFaq === faqIndex ? 'transform rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${expandedFaq === faqIndex ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-6 pb-6 opacity-60 text-sm md:text-base">{t(`faq.a${faqIndex}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">{t('newsletter.title')}</h2>
                <p className="text-xl mb-8 opacity-90">{t('newsletter.desc')}</p>

                {newsletterSuccess ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-2xl font-semibold animate-bounce">
                    <Check className="w-5 h-5" />
                    Success!
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t('newsletter.placeholder')}
                      required
                      className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 rounded-2xl bg-white text-purple-600 font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      {t('newsletter.subscribe')}
                    </button>
                  </form>
                )}
              </div>

              {/* Animated background elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-purple-500/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">CortexFile</span>
                </div>
                <p className="opacity-60 text-sm">{t('footer.desc')}</p>
              </div>

              <div>
                <h4 className="font-bold mb-4">{t('nav.products')}</h4>
                <ul className="space-y-2 text-sm opacity-60">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Gaming Tools</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Development</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Applications</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">{t('footer.support')}</h4>
                <ul className="space-y-2 text-sm opacity-60">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">{t('footer.contactUs')}</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Refund Policy</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">License Terms</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">{t('footer.paymentMethods')}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="px-3 py-2 rounded-lg bg-purple-500/20 text-xs font-semibold flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Cards
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-purple-500/20 text-xs font-semibold flex items-center gap-1">
                    <Bitcoin className="w-4 h-4" />
                    Crypto
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-colors">
                    𝕏
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-colors">
                    in
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 flex items-center justify-center transition-colors">
                    ▶
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm opacity-60">{t('footer.copyright')}</p>
              <div className="flex items-center gap-4 text-sm opacity-60">
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Chat Button */}
        <button className={`fixed bottom-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform duration-300 z-40 animate-bounce`}>
          <MessageCircle className="w-8 h-8 text-white" />
        </button>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl" onClick={() => setSelectedProduct(null)}>
            <div
              className="max-w-2xl w-full p-8 rounded-3xl backdrop-blur-2xl border border-purple-500/30 transform scale-100 animate-fade-in"
              style={{
                background: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="text-6xl text-center w-24 h-24 bg-gray-800/50 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedProduct.image.includes('http') ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedProduct.image
                  )}
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
              <p className="text-lg opacity-80 mb-6">{selectedProduct.description}</p>

              <div className="mb-6">
                <h3 className="font-bold mb-3">{t('nav.features')}:</h3>
                <ul className="space-y-2">
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ${selectedProduct.price}
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  {t('cart.add')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Store;
