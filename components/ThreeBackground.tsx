import React, { useEffect, useRef } from 'react';

const ThreeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Resize canvas
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    // Particle interface
    interface ParticleData {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulsePhase: number;
      pulseSpeed: number;
    }

    let particles: ParticleData[] = [];

    // Create a particle - spread across entire screen
    const createParticle = (): ParticleData => {
      const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#00f3ff', '#a855f7', '#22d3ee', '#f472b6'];
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
    };

    // Update particle position
    const updateParticle = (p: ParticleData) => {
      // Gentle floating movement
      p.x += p.vx;
      p.y += p.vy;

      // Pulse effect
      p.pulsePhase += p.pulseSpeed;

      // Bounce off edges with padding
      const padding = 50;
      if (p.x < padding || p.x > width - padding) p.vx *= -1;
      if (p.y < padding || p.y > height - padding) p.vy *= -1;

      // Keep in bounds
      p.x = Math.max(padding, Math.min(width - padding, p.x));
      p.y = Math.max(padding, Math.min(height - padding, p.y));

      // Strong mouse interaction - repel particles
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;

      if (dist < maxDist && dist > 0) {
        const force = (maxDist - dist) / maxDist;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 8;
        p.y += Math.sin(angle) * force * 8;
      }
    };

    // Draw particle with glow
    const drawParticle = (p: ParticleData, time: number) => {
      const pulse = Math.sin(p.pulsePhase) * 0.3 + 1;
      const size = p.radius * pulse;

      // Outer glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 6);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(0.3, p.color + 'aa');
      gradient.addColorStop(0.6, p.color + '44');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 6, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Bright core
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // Initialize particles - more spread out
    const initParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor((width * height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    // Draw elegant connecting lines
    const drawConnections = () => {
      const maxDistance = 350; // Much longer connection distance

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            // Higher base opacity for visibility
            const opacity = (1 - distance / maxDistance) * 0.9;

            // Gradient line with vivid colors
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, particles[i].color);
            gradient.addColorStop(1, particles[j].color);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 2.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    // Draw mouse trail effect
    const drawMouseEffect = () => {
      if (mouseX < 0 || mouseY < 0) return;

      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
      gradient.addColorStop(0.5, 'rgba(217, 70, 239, 0.08)');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    let time = 0;

    // Animation loop
    const animate = () => {
      time += 0.016;

      // Clear canvas completely
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, width, height);

      // Draw ambient background gradient
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
      );
      bgGradient.addColorStop(0, 'rgba(99, 102, 241, 0.03)');
      bgGradient.addColorStop(0.5, 'rgba(217, 70, 239, 0.02)');
      bgGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw mouse effect
      drawMouseEffect();

      // Draw connections first (behind particles)
      drawConnections();

      // Update and draw particles
      particles.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle, time);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;