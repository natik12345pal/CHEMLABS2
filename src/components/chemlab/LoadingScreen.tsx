'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';

// Static predetermined values
const MOLECULE_POSITIONS = [
  { x: 10, y: 25 },
  { x: 25, y: 40 },
  { x: 40, y: 20 },
  { x: 55, y: 45 },
  { x: 70, y: 30 },
  { x: 85, y: 35 },
];

// Reduced bubbles for better performance
const BUBBLE_CONFIGS = [
  { cx: 35, delay: 0, duration: 1.4, size: 3 },
  { cx: 55, delay: 0.15, duration: 1.5, size: 4 },
  { cx: 75, delay: 0.3, duration: 1.3, size: 2.5 },
  { cx: 45, delay: 0.45, duration: 1.6, size: 3.5 },
  { cx: 65, delay: 0.6, duration: 1.4, size: 2.5 },
  { cx: 50, delay: 0.2, duration: 1.5, size: 3 },
];

export default function LoadingScreen() {
  const { setLoading, isLowPerformanceMode } = useChemLabStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast progress - no initial delay
    let current = 0;
    const interval = setInterval(() => {
      current += 18 + Math.random() * 12;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        // Minimal delay after complete
        setTimeout(() => setLoading(false), 150);
      } else {
        setProgress(Math.min(98, current));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Glow Effects - No animation delay */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.12) 0%, transparent 50%)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 50%)',
          filter: 'blur(60px)',
          animationDelay: '0.5s'
        }}
      />

      {/* Floating Molecules - Only if not low performance */}
      {!isLowPerformanceMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {MOLECULE_POSITIONS.map((mol, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: `${mol.x}%`, y: `${mol.y}%`, opacity: 0.15 }}
              animate={{ 
                y: [`${mol.y}%`, `${mol.y - 15}%`, `${mol.y}%`],
                opacity: [0.15, 0.25, 0.15]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: i * 0.2 
              }}
            >
              <svg width="36" height="36" viewBox="0 0 40 40" className="text-cyan-400/20">
                <circle cx="20" cy="20" r="7" fill="currentColor" />
                <circle cx="10" cy="12" r="3.5" fill="currentColor" opacity="0.6" />
                <circle cx="30" cy="12" r="3.5" fill="currentColor" opacity="0.6" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content - No entrance animation delay */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        
        {/* Beaker */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-5"
        >
          {/* Glow */}
          <div 
            className="absolute inset-0 -m-8 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 60%)',
              filter: 'blur(30px)'
            }}
          />

          {/* Beaker SVG */}
          <svg viewBox="0 0 160 200" className="w-32 h-40 sm:w-40 sm:h-48">
            <defs>
              <linearGradient id="lg-glass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
              <linearGradient id="lg-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,255,255,0.85)" />
                <stop offset="100%" stopColor="rgba(0,180,180,0.5)" />
              </linearGradient>
              <linearGradient id="lg-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="lg-bubble" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                <stop offset="100%" stopColor="rgba(0,255,255,0.4)" />
              </linearGradient>
              <clipPath id="clip-beaker">
                <path d="M35,50 L35,100 L15,180 Q15,195 80,195 Q145,195 145,180 L125,100 L125,50 Z" />
              </clipPath>
            </defs>

            {/* Beaker Body */}
            <path
              d="M35,50 L35,100 L15,180 Q15,195 80,195 Q145,195 145,180 L125,100 L125,50"
              fill="url(#lg-glass)"
              stroke="url(#lg-stroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect x="35" y="25" width="90" height="30" rx="4" fill="url(#lg-glass)" stroke="url(#lg-stroke)" strokeWidth="2" />
            <ellipse cx="80" cy="25" rx="48" ry="7" fill="url(#lg-glass)" stroke="url(#lg-stroke)" strokeWidth="1.5" />
            <path d="M125,50 Q133,45 130,37 L125,25" fill="none" stroke="url(#lg-stroke)" strokeWidth="2" strokeLinecap="round" />

            {/* Liquid */}
            <g clipPath="url(#clip-beaker)">
              <motion.rect
                x="10"
                width="140"
                fill="url(#lg-liquid)"
                initial={{ y: 195, height: 0 }}
                animate={{ y: 195 - (progress * 1.3), height: progress * 1.3 }}
                transition={{ duration: 0.15 }}
              />
              
              {progress > 5 && (
                <motion.ellipse
                  cx="80"
                  rx="58"
                  ry="7"
                  fill="rgba(0,255,255,0.5)"
                  animate={{
                    cy: 195 - (progress * 1.3) + 4,
                    rx: [56, 60, 56]
                  }}
                  transition={{ 
                    cy: { duration: 0.15 },
                    rx: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                  }}
                />
              )}

              {/* Bubbles - Reduced count */}
              {progress > 10 && BUBBLE_CONFIGS.map((b, i) => (
                <motion.circle
                  key={i}
                  cx={b.cx}
                  r={b.size}
                  fill="url(#lg-bubble)"
                  animate={{
                    cy: [185, 90, 55],
                    opacity: [0, 0.7, 0]
                  }}
                  transition={{
                    duration: b.duration,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: b.delay
                  }}
                />
              ))}
            </g>

            {/* Measurement Lines */}
            {[50, 100, 150].map((ml) => {
              const y = 180 - (ml / 200) * 130;
              return (
                <g key={ml}>
                  <line x1="18" y1={y} x2="26" y2={y} stroke="rgba(0,255,255,0.25)" strokeWidth="1" />
                  <text x="10" y={y + 3} fontSize="6" fill="rgba(0,255,255,0.35)" textAnchor="end">{ml}</text>
                </g>
              );
            })}

            {/* Reflection */}
            <path d="M42,55 Q44,90 35,140" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Steam */}
          {progress > 50 && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-300/30"
                  animate={{ y: [-3, -15], opacity: [0.5, 0], scale: [1, 1.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-5"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-1.5 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">
              ChemLab
            </span>
          </h1>
          <p className="text-cyan-200/60 text-sm">Virtual Chemistry Laboratory</p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-52 sm:w-64 mb-5"
        >
          <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #22d3ee, #10b981)', boxShadow: '0 0 10px rgba(0,255,255,0.4)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-cyan-400/50 text-[10px] uppercase tracking-wider">
              {progress >= 100 ? 'Ready' : 'Loading'}
            </span>
            <span className="text-cyan-300 font-mono text-xs">{Math.round(progress)}%</span>
          </div>
        </motion.div>

        {/* Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex gap-2"
        >
          {[
            { s: 'H', n: 1, c: '#22d3ee' },
            { s: 'C', n: 6, c: '#10b981' },
            { s: 'N', n: 7, c: '#8b5cf6' },
            { s: 'O', n: 8, c: '#f43f5e' },
            { s: 'Na', n: 11, c: '#f59e0b' },
          ].map((el) => (
            <div
              key={el.s}
              className="w-9 h-11 rounded-lg flex flex-col items-center justify-center border"
              style={{ borderColor: `${el.c}40`, backgroundColor: `${el.c}10`, color: el.c }}
            >
              <span className="text-sm font-bold">{el.s}</span>
              <span className="text-[7px] opacity-50">{el.n}</span>
            </div>
          ))}
        </motion.div>

        {/* Dots */}
        <div className="flex gap-1.5 mt-5">
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: d }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
