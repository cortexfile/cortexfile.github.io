import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Star, Download, Shield, Lock, Zap, Code, Gamepad2, Wrench, Sparkles, ChevronDown, Check, X, Menu, CreditCard, Bitcoin, MessageCircle, Play, Eye, Heart, TrendingUp } from 'lucide-react';
import * as THREE from 'three';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const canvasRef = useRef(null);
  const heroCanvasRef = useRef(null);

  // Products data
  const products = [
    {
      id: 1,
      name: 'Email Attachment Organizer',
      category: 'tools',
      price: 29.99,
      image: '🚀',
      rating: 4.9,
      reviews: 2847,
      downloads: 125000,
      description: 'Automate your document workflow securely. Local processing, built-in OCR, and zero cloud dependency.',
      features: ['Local Privacy', 'Smart OCR', 'Auto-Sort', 'Zero Cloud Uploads'],
      trending: true
    },
    {
      id: 2,
      name: 'Neural Game Optimizer',
      category: 'games',
      price: 79.99,
      image: '🎮',
      rating: 4.8,
      reviews: 5621,
      downloads: 340000,
      description: 'AI-driven game performance optimizer for maximum FPS',
      features: ['Auto-optimization', 'FPS Booster', 'RAM Management', 'GPU Acceleration'],
      trending: true
    },
    {
      id: 3,
      name: 'CyberVault Security Suite',
      category: 'tools',
      price: 199.99,
      image: '🔐',
      rating: 5.0,
      reviews: 1923,
      downloads: 89000,
      description: 'Military-grade encryption and security management system',
      features: ['256-bit Encryption', 'Password Manager', 'VPN Integration', 'Biometric Auth'],
      trending: false
    },
    {
      id: 4,
      name: 'HyperDesign Studio',
      category: 'apps',
      price: 249.99,
      image: '🎨',
      rating: 4.9,
      reviews: 3412,
      downloads: 156000,
      description: 'Professional design suite with AI-powered creativity tools',
      features: ['Vector Graphics', 'AI Image Gen', '3D Modeling', 'Animation Tools'],
      trending: true
    },
    {
      id: 5,
      name: 'StreamPro Broadcasting',
      category: 'apps',
      price: 129.99,
      image: '📡',
      rating: 4.7,
      reviews: 4567,
      downloads: 278000,
      description: 'Professional streaming software with AI scene detection',
      features: ['Multi-platform', 'AI Filters', '4K Streaming', 'Chat Integration'],
      trending: false
    },
    {
      id: 6,
      name: 'DataForge Analytics',
      category: 'tools',
      price: 299.99,
      image: '📊',
      rating: 4.9,
      reviews: 1834,
      downloads: 67000,
      description: 'Advanced data analytics and visualization platform',
      features: ['Real-time Analytics', 'Custom Dashboards', 'ML Predictions', 'API Integration'],
      trending: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'games', name: 'Gaming', icon: Gamepad2, color: 'from-red-500 to-orange-500' },
    { id: 'tools', name: 'Tools', icon: Wrench, color: 'from-blue-500 to-cyan-500' },
    { id: 'apps', name: 'Applications', icon: Code, color: 'from-green-500 to-emerald-500' }
  ];

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

  const faqs = [
    {
      question: 'How do I receive my software after purchase?',
      answer: 'Instantly! After payment confirmation, you\'ll receive a download link and license key via email within 60 seconds.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, cryptocurrency (Bitcoin, Ethereum), and wire transfers for enterprise orders.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, contact support for a full refund.'
    },
    {
      question: 'Can I use the software on multiple devices?',
      answer: 'Most licenses allow installation on up to 3 devices. Enterprise licenses offer unlimited installations.'
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Absolutely! 24/7 priority support via email, live chat, and community forums for all customers.'
    }
  ];

  // Three.js particle background
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: darkMode ? 0x8b5cf6 : 0x3b82f6,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x = mouseY * 0.00005;
      particlesMesh.rotation.y = mouseX * 0.00005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [darkMode]);

  // Hero 3D animation
  useEffect(() => {
    if (!heroCanvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvasRef.current, alpha: true, antialias: true });

    renderer.setSize(800, 400);
    camera.position.z = 5;

    // Create geometric shapes
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.7,
      roughness: 0.2,
      wireframe: false
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const animate = () => {
      requestAnimationFrame(animate);

      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  // Testimonial carousel auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product) => {
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

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500 overflow-hidden relative`}>
      {/* Animated particle background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-opacity-80" style={{
          background: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center transform group-hover:rotate-180 transition-transform duration-700">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    CortexFile
                  </h1>
                  <p className="text-xs opacity-60">Premium Software Store</p>
                </div>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl mx-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-50" />
                  <input
                    type="text"
                    placeholder="Search for software..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{
                      background: darkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                      borderColor: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-110"
                  style={{
                    background: darkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>

                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative p-3 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-110"
                  style={{
                    background: darkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Shopping Cart Sidebar */}
        <div className={`fixed right-0 top-0 h-full w-96 z-50 backdrop-blur-2xl transform transition-transform duration-500 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}
          style={{
            background: darkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderLeft: '1px solid rgba(139, 92, 246, 0.2)'
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-purple-500 hover:bg-opacity-20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12 opacity-60">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Your cart is empty</p>
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
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
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
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => { setCheckoutStep(1); setShowCart(false); }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Proceed to Checkout
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
                    🚀 New Release: Email Attachment Organizer
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                    Intelligent Software
                  </span>
                  <br />
                  <span className={darkMode ? "text-white" : "text-gray-900"}>For Efficiency</span>
                </h1>

                <p className="text-xl opacity-80 leading-relaxed">
                  Discover CortexFile's local AI tools. Secure, fast, and private software built for the modern workflow.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 font-bold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Browse Products
                  </button>
                  <button className="px-8 py-4 rounded-2xl backdrop-blur-xl border border-purple-500/30 font-semibold hover:bg-purple-500/10 transition-all duration-300">
                    See Features
                  </button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</div>
                    <div className="text-sm opacity-60">Downloads</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">4.9★</div>
                    <div className="text-sm opacity-60">Rating</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100%</div>
                    <div className="text-sm opacity-60">Private</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <canvas ref={heroCanvasRef} className="w-full h-96 rounded-3xl" />
                <div className={`absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-t ${darkMode ? 'from-gray-900' : 'from-gray-50'} via-transparent to-transparent`} />
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
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
                  Featured Products
                </span>
              </h2>
              <p className="text-xl opacity-60">Handpicked premium software for professionals</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
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

                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {product.image}
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
                      Add to Cart
                    </button>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  What Customers Say
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

        {/* Pricing/Features */}
        <section className="py-20 px-6">
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
                { icon: Shield, title: 'Secure & Safe', desc: 'Military-grade encryption and verified software', color: 'from-blue-500 to-cyan-500' },
                { icon: Zap, title: 'Instant Delivery', desc: 'Download immediately after purchase', color: 'from-purple-500 to-pink-500' },
                { icon: Lock, title: 'Lifetime Updates', desc: 'Free updates and priority support forever', color: 'from-green-500 to-emerald-500' }
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

        {/* FAQ */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl backdrop-blur-xl border border-purple-500/20 overflow-hidden transition-all duration-300"
                  style={{
                    background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-purple-500/5 transition-colors"
                  >
                    <span className="font-semibold text-lg">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedFaq === index ? 'transform rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${expandedFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-6 pb-6 opacity-60">{faq.answer}</p>
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
                <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
                <p className="text-xl mb-8 opacity-90">Get exclusive deals and new releases delivered to your inbox</p>

                {newsletterSuccess ? (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-2xl font-semibold animate-bounce">
                    <Check className="w-5 h-5" />
                    Successfully subscribed!
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-4 max-w-md mx-auto">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 rounded-2xl bg-white text-purple-600 font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      Subscribe
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
                <p className="opacity-60 text-sm">Premium software marketplace for professionals and creators worldwide.</p>
              </div>

              <div>
                <h4 className="font-bold mb-4">Products</h4>
                <ul className="space-y-2 text-sm opacity-60">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Gaming Tools</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Development</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Applications</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Security</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-sm opacity-60">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Refund Policy</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">License Terms</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Payment Methods</h4>
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
              <p className="text-sm opacity-60">© 2026 CortexFile. All rights reserved.</p>
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
        <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-110 transition-transform duration-300 z-40 animate-bounce">
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
                <div className="text-6xl">{selectedProduct.image}</div>
                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
              <p className="text-lg opacity-80 mb-6">{selectedProduct.description}</p>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Key Features:</h3>
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
                  Add to Cart
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
      `}</style>
    </div>
  );
};

export default App;
