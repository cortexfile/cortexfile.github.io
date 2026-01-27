import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

function FloatingCube() {
  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
      <mesh rotation={[0, 0.5, 0]}>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshNormalMaterial wireframe={true} />
      </mesh>
      <mesh>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.8} roughness={0.1} metalness={0.8} />
      </mesh>
    </Float>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-accent selection:text-dark">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CortexFile
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-accent transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-accent transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
          </div>
          <button className="bg-primary hover:bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
            Download v1.0
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 6] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <FloatingCube />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={2} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Stop Downloading <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                Email Attachments
              </span> Manually
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Automate your document workflow securely. Local processing, built-in OCR, and zero cloud dependency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-indigo-500/40 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <span>Download for Windows</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
              <button className="glass-panel text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/10 transition-colors">
                View GitHub Repo
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-dark relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400">Everything you need to organize your digital life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Local Privacy", icon: "🛡️", desc: "No cloud uploads. All processing happens 100% on your machine." },
              { title: "Smart OCR", icon: "👁️", desc: "Extract text from scanned PDFs and images automatically." },
              { title: "Auto-Sort", icon: "📂", desc: "Organize files into folders by Sender, Date, or Type." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-panel p-8 rounded-2xl hover:border-accent/50 transition-colors"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-black/40 text-center text-gray-500">
        <p>© 2026 CortexFile. Open Source Software.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>

    </div>
  );
}

export default App;
