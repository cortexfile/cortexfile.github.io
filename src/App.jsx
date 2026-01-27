import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

function Hero3D() {
  return (
    <Suspense fallback={null}>
      {/* Liquid Metal Sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 100, 200]} scale={2.4}>
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.6} // High distortion for liquid effect
            speed={2} // Fast movement
            roughness={0.2}
            metalness={0.9} // Shiny metal look
            bumpScale={0.01}
          />
        </Sphere>
      </Float>

      {/* Ambient particles */}
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

      {/* Lighting for the "Product Studio" feel */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={5} color="#ec4899" /> {/* Pink Rim Light */}
      <Environment preset="city" />
    </Suspense>
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
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-cyan-400 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
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
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
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
              <button className="group relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-all hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12"></div>
                <span className="relative flex items-center gap-3">
                  Download for Windows
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </span>
              </button>

              <button className="glass-panel px-8 py-4 rounded-2xl text-lg font-medium hover:bg-white/5 transition-all flex items-center gap-2 group">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
              Cortex-Level Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We replaced the cloud with your own CPU. Faster, strictly private, and surprisingly powerful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Ironclad Privacy", icon: "🛡️", desc: "Your files never leave your device. All OCR and sorting happens locally in RAM.", gradient: "from-blue-500/20 to-cyan-500/20" },
              { title: "Smart OCR Engine", icon: "⚡", desc: "Recognizes text inside scanned PDFs and images instantly using Tesseract 5.0.", gradient: "from-purple-500/20 to-pink-500/20" },
              { title: "Context Sorting", icon: "🧠", desc: "Understands 'Invoice' vs 'Receipt'. Sorts by sender, date, or content type automatically.", gradient: "from-amber-500/20 to-orange-500/20" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className={`glass-panel p-10 rounded-3xl border border-white/5 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl hover:border-white/20 transition-all duration-300 group`}
              >
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/40 text-center text-gray-500 backdrop-blur-md">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">CortexFile</h3>
          <p>Automate your digital life.</p>
        </div>
        <p>© 2026 CortexFile. Open Source & Privacy First.</p>
      </footer>

    </div>
  );
}

export default App;
