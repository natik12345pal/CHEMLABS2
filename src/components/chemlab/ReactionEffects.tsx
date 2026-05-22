'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  type: 'bubble' | 'spark' | 'smoke' | 'fire';
}

export default function ReactionEffects() {
  const { isMixing, mixProgress, reactionResult, isLowPerformanceMode } = useChemLabStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shouldClearRef = useRef(false);

  // Update clear flag when mixing state changes
  useEffect(() => {
    shouldClearRef.current = !isMixing || isLowPerformanceMode;
  }, [isMixing, isLowPerformanceMode]);

  // Generate particles during mixing
  useEffect(() => {
    if (shouldClearRef.current) {
      // Use requestAnimationFrame to avoid synchronous setState
      const frameId = requestAnimationFrame(() => {
        setParticles([]);
      });
      return () => cancelAnimationFrame(frameId);
    }

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const count = 5;
      
      for (let i = 0; i < count; i++) {
        const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
        const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;
        
        const particle: Particle = {
          id: Date.now() + Math.random() * 1000,
          x: centerX + (Math.random() - 0.5) * 100,
          y: centerY + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 8 + 4,
          color: '#00ffff',
          opacity: 1,
          type: 'bubble'
        };

        // Different particle types based on reaction
        if (reactionResult?.reaction) {
          const reaction = reactionResult.reaction;
          if (reaction.animationType === 'explosion' || reaction.animationType === 'fire') {
            particle.type = 'fire';
            particle.color = ['#ff4500', '#ff6b35', '#ffd700'][Math.floor(Math.random() * 3)];
          } else if (reaction.animationType === 'smoke') {
            particle.type = 'smoke';
            particle.size = Math.random() * 20 + 15;
            particle.color = 'rgba(200, 200, 200, 0.3)';
          }
        }

        newParticles.push(particle);
      }

      setParticles(prev => [...prev.slice(-50), ...newParticles]);
    };

    const interval = setInterval(generateParticles, 150);
    return () => clearInterval(interval);
  }, [isMixing, isLowPerformanceMode, reactionResult, shouldClearRef]);

  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles(prev => prev.filter(p => p.opacity > 0.1));
    }, 50);
    return () => clearInterval(cleanup);
  }, []);

  if (isLowPerformanceMode && isMixing) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: 1, 
              scale: 1 
            }}
            animate={{ 
              x: particle.x + particle.vx * 20,
              y: particle.y + particle.vy * 20,
              opacity: 0,
              scale: particle.type === 'smoke' ? 2 : 1
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: particle.type === 'fire'
                ? `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`
                : particle.type === 'smoke'
                ? `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`
                : `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
              boxShadow: particle.type === 'fire'
                ? `0 0 ${particle.size}px ${particle.color}`
                : 'none'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Heat Distortion Effect */}
      {isMixing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(transparent 0%, rgba(255,100,0,0.05) 50%, transparent 100%)',
            backgroundSize: '100% 10px',
          }}
        />
      )}
    </div>
  );
}
