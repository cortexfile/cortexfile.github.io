import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

function Hero3D() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={5} color="#ec4899" />

      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} scale={2.4}>
          {/* Standard Material - Guaranteed to work if WebGL is on */}
          <meshStandardMaterial
            color="#6366f1"
            roughness={0.3}
            metalness={0.8}
            emissive="#4338ca"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-pink-500 selection:text-white">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            CortexFile
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </div>
          <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all hover:scale-105 hover:shadow-glow">
            v1.0 Available
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background Layer */}
        <div className="absolute inset-0 z-0 opacity-80">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <Hero3D />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-4 px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold tracking-wide uppercase backdrop-blur-sm">
              ✨ The Future of Document Management
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight mb-8 drop-shadow-2xl">
              Stop Doing It <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-glow">
                Manually.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              The first AI-powered desktop tool that locally processes, renames, and organizes your email attachments. <span className="text-white font-medium">Zero cloud uploads.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
                Download for Windows
              </button>
              <button className="glass-panel px-8 py-4 rounded-2xl text-lg font-medium hover:bg-white/5 transition-all">
                View Logic on GitHub
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6 text-white">Cortex-Level Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-10 rounded-3xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 text-white">Privacy First</h3>
              <p className="text-gray-400">Your data never leaves your device.</p>
            </div>
            <div className="glass-panel p-10 rounded-3xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 text-white">OCR Engine</h3>
              <p className="text-gray-400">Extract text from images instantly.</p>
            </div>
            <div className="glass-panel p-10 rounded-3xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Sorting</h3>
              <p className="text-gray-400">Organize by content, date, or sender.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 bg-black/40 backdrop-blur-md">
        <p>© 2026 CortexFile.</p>
      </footer>
    </div>
  );
}

export default App;
