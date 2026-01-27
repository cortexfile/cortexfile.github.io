import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, Download, ChevronRight, Menu, X, Shield, Cpu, Zap, Mail } from 'lucide-react';

// --- 3D Components ---
function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

// --- Main App Component ---
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const products = [
    {
      id: 1,
      name: "Email Attachment Organizer",
      price: 29.99,
      description: "Automate your document workflow locally. No cloud, 100% privacy.",
      features: ["Local Processing", "Smart OCR", "Auto-Sorting"],
      popular: true
    },
    {
      id: 2,
      name: "PDF Cortex Pro",
      price: 49.99,
      description: "Advanced PDF manipulation and data extraction tool.",
      features: ["Merge/Split", "Table Extraction", "Batch Processing"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
              CortexFile
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#products" className="hover:text-cyan-400 transition-colors">Products</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Canvas>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <AnimatedSphere />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-6">
              v2.0 Now Available
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Organize Files <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                At The Speed of Thought
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              AI-powered document processing that runs entirely on your device. Secure, fast, and intelligent.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#products" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                Get Started <ChevronRight size={20} />
              </a>
              <button className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
                <Download size={20} /> Download Demo
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Products Section */}
      <section id="products" className="py-24 relative bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Software Store</h2>
            <p className="text-slate-400">Professional tools for power users</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                className={`relative group bg-slate-800/50 backdrop-blur-sm border ${product.popular ? 'border-indigo-500/50' : 'border-white/10'} rounded-2xl p-8 overflow-hidden`}
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 bg-indigo-500 text-xs font-bold px-3 py-1 rounded-full">
                    BESTSELLER
                  </div>
                )}
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 text-2xl">
                  🚀
                </div>
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-slate-400 mb-6 min-h-[50px]">{product.description}</p>

                <ul className="mb-8 space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-3xl font-bold">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-white text-slate-900 hover:bg-cyan-500 hover:text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                  >
                    Add to Cart <ShoppingCart size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Zero Data Leaks", desc: "Your files never leave your machine. Air-gapped ready." },
              { icon: Zap, title: "Lightning Fast", desc: "Native C++ engine optimized for modern processors." },
              { icon: Mail, title: "Email Integration", desc: "Connects directly to Outlook and Thunderbird archives." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                <feature.icon className="w-10 h-10 text-cyan-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2026 CortexFile Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-slate-500 mt-20">
                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-slate-400">${item.price}</p>
                      </div>
                      <button
                        onClick={() => setCart(cart.filter((_, i) => i !== index))}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>Total</span>
                  <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
                <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-4 rounded-xl font-bold transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
