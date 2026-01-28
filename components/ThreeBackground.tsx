import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points in a sphere
const generateParticles = (count: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 50; // Radius
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    
    // Convert to cartesian
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

const ParticleField = () => {
  const ref = useRef<any>(null);
  
  const particles = useMemo(() => generateParticles(2000), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

const ThreeBackground = () => {
  const [webGLAvailable] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  });

  if (!webGLAvailable) {
    return (
      <div className="canvas-container pointer-events-none bg-cyber-black">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 via-transparent to-cyber-accent/5 opacity-50" />
      </div>
    );
  }

  return (
    <div className="canvas-container pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{ powerPreference: "high-performance", alpha: true }}
      >
        <fog attach="fog" args={['#0a0a12', 10, 60]} />
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;