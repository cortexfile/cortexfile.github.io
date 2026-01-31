import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
    darkMode: boolean;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({ darkMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!canvasRef.current || error) return;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.position.z = 5;

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

            let animationFrameId: number;
            let mouseX = 0;
            let mouseY = 0;

            const handleMouseMove = (e: MouseEvent) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            };

            document.addEventListener('mousemove', handleMouseMove);

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
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
                cancelAnimationFrame(animationFrameId);
                renderer.dispose();
            };
        } catch (e) {
            console.error("Three.js initialization failed:", e);
            setError(true);
        }
    }, [darkMode, error]);

    if (error) return null;

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default ThreeBackground;
