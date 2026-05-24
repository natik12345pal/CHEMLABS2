'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplosionOverlayProps {
  isActive: boolean;
  onComplete: () => void;
  position?: { x: number; y: number };
}

// Glass shard particle
function GlassShard({ delay, angle, distance }: { delay: number; angle: number; distance: number }) {
  const endX = Math.cos(angle * Math.PI / 180) * distance;
  const endY = Math.sin(angle * Math.PI / 180) * distance;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute"
      style={{
        width: 6 + Math.random() * 10,
        height: 3 + Math.random() * 6,
        backgroundColor: 'rgba(200, 230, 255, 0.8)',
        boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
        borderRadius: '1px',
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
      animate={{
        x: endX,
        y: endY,
        rotate: rotation + 720,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 0.6 + Math.random() * 0.3,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

// Shock wave effect
function ShockWave({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border-2 border-white/50"
      initial={{ width: 10, height: 10, opacity: 0.6 }}
      animate={{
        width: 250,
        height: 250,
        opacity: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

// Flash effect
function FlashEffect() {
  return (
    <motion.div
      className="absolute inset-0 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0] }}
      transition={{ duration: 0.2, times: [0, 0.2, 1] }}
    />
  );
}

export default function ExplosionOverlay({ isActive, onComplete }: ExplosionOverlayProps) {
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowExplosion(true);

      // Play glass breaking sound effect
      try {
        const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        
        // Create noise for glass breaking sound
        const bufferSize = audioContext.sampleRate * 0.3;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          // White noise with decay
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        
        const noise = audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        noise.start();
        noise.stop(audioContext.currentTime + 0.3);
      } catch {
        // Audio not supported
      }

      // Complete after animation
      const timer = setTimeout(() => {
        setShowExplosion(false);
        onComplete();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!showExplosion) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Center point */}
        <div className="relative flex items-center justify-center">
          {/* Flash */}
          <FlashEffect />

          {/* Shock waves */}
          <ShockWave delay={0} />
          <ShockWave delay={0.05} />

          {/* Glass shards - explode outward */}
          {Array.from({ length: 20 }).map((_, i) => (
            <GlassShard
              key={i}
              delay={0.02 + Math.random() * 0.05}
              angle={(i / 20) * 360 + Math.random() * 20}
              distance={60 + Math.random() * 100}
            />
          ))}

          {/* Spark particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full"
              style={{
                boxShadow: '0 0 4px #fff',
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 150,
                y: (Math.random() - 0.5) * 150,
                opacity: 0,
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.2,
                delay: Math.random() * 0.05,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
