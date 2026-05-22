'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';

export default function LoadingScreen() {
  const { loadingProgress, setLoading, setLoadingProgress } = useChemLabStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(Math.min(100, loadingProgress + Math.random() * 15));
    }, 200);

    const timeout = setTimeout(() => {
      setShowContent(true);
      setTimeout(() => setLoading(false), 500);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadingProgress, setLoading, setLoadingProgress]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 overflow-hidden"
      >
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Molecule SVGs */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0,
                scale: 0
              }}
              animate={{
                x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              <MoleculeSVG type={i % 4} />
            </motion.div>
          ))}
          
          {/* Floating Atoms */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`atom-${i}`}
              className="absolute w-4 h-4 rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  ['#00ffff', '#00ff88', '#ff00ff', '#ffff00'][i % 4]
                } 0%, transparent 70%)`,
                boxShadow: `0 0 20px ${
                  ['#00ffff', '#00ff88', '#ff00ff', '#ffff00'][i % 4]
                }`
              }}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                opacity: 0
              }}
              animate={{
                x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative">
              {/* Flask Icon */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-32 h-32 sm:w-40 sm:h-40 relative"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Flask Body */}
                  <motion.path
                    d="M35,20 L35,45 L20,80 Q20,95 50,95 Q80,95 80,80 L65,45 L65,20 Z"
                    fill="rgba(0, 255, 255, 0.2)"
                    stroke="url(#flaskGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  {/* Flask Neck */}
                  <motion.path
                    d="M35,20 L65,20"
                    fill="none"
                    stroke="url(#flaskGradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Liquid */}
                  <motion.ellipse
                    cx="50"
                    cy="75"
                    rx="25"
                    ry="15"
                    fill="url(#liquidGradient)"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ transformOrigin: 'center' }}
                  />
                  {/* Bubbles */}
                  {['bubble1', 'bubble2', 'bubble3'].map((id, i) => (
                    <motion.circle
                      key={id}
                      cx={35 + i * 15}
                      cy={75}
                      r={3 + i}
                      fill="rgba(0, 255, 255, 0.5)"
                      animate={{
                        cy: [75, 60, 75],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00ffff" />
                      <stop offset="100%" stopColor="#00ff88" />
                    </linearGradient>
                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0, 255, 255, 0.8)" />
                      <stop offset="100%" stopColor="rgba(0, 100, 255, 0.8)" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 mb-4"
          >
            ChemLab
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-cyan-200/80 text-lg sm:text-xl mb-8 text-center"
          >
            Virtual Chemistry Laboratory
          </motion.p>

          {/* Loading Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7 }}
            className="w-64 sm:w-80"
          >
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, loadingProgress)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-cyan-300 text-center mt-2 font-mono">
              {Math.round(Math.min(100, loadingProgress))}%
            </p>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-cyan-400/60 text-sm"
          >
            <span className="inline-flex items-center gap-2">
              Preparing experiments
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </span>
          </motion.div>

          {/* Chemistry Elements Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex gap-4 mt-8"
          >
            {['H', 'O', 'C', 'N', 'Na'].map((symbol, i) => (
              <motion.div
                key={symbol}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-cyan-300 border border-cyan-400/30 bg-cyan-900/20 backdrop-blur-sm"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Molecule SVG Component
function MoleculeSVG({ type }: { type: number }) {
  const colors = ['#00ffff', '#00ff88', '#ff00ff', '#ffff00'];
  const color = colors[type];
  
  if (type === 0) {
    // Water-like molecule
    return (
      <svg width="40" height="30" viewBox="0 0 40 30" className="opacity-50">
        <circle cx="20" cy="15" r="8" fill={color} />
        <circle cx="8" cy="8" r="5" fill="#ffffff" />
        <circle cx="32" cy="8" r="5" fill="#ffffff" />
        <line x1="15" y1="10" x2="10" y2="8" stroke={color} strokeWidth="2" />
        <line x1="25" y1="10" x2="30" y2="8" stroke={color} strokeWidth="2" />
      </svg>
    );
  } else if (type === 1) {
    // CO2-like molecule
    return (
      <svg width="50" height="20" viewBox="0 0 50 20" className="opacity-50">
        <circle cx="10" cy="10" r="6" fill="#ff4444" />
        <circle cx="25" cy="10" r="8" fill={color} />
        <circle cx="40" cy="10" r="6" fill="#ff4444" />
        <line x1="16" y1="10" x2="17" y2="10" stroke={color} strokeWidth="2" />
        <line x1="33" y1="10" x2="34" y2="10" stroke={color} strokeWidth="2" />
      </svg>
    );
  } else if (type === 2) {
    // Benzene ring
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-50">
        <polygon
          points="20,5 35,15 35,30 20,40 5,30 5,15"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <circle cx="20" cy="22" r="8" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2,2" />
      </svg>
    );
  } else {
    // DNA helix segment
    return (
      <svg width="30" height="50" viewBox="0 0 30 50" className="opacity-50">
        <path d="M5,0 Q25,15 5,25 Q-15,35 5,50" fill="none" stroke={color} strokeWidth="2" />
        <path d="M25,0 Q5,15 25,25 Q45,35 25,50" fill="none" stroke="#ff00ff" strokeWidth="2" />
        <line x1="10" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="1" />
        <line x1="5" y1="25" x2="25" y2="25" stroke="#ffffff" strokeWidth="1" />
        <line x1="10" y1="38" x2="20" y2="38" stroke="#ffffff" strokeWidth="1" />
      </svg>
    );
  }
}
