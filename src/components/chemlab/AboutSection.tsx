'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Atom, FlaskConical, Award, Sparkles } from 'lucide-react';
import { useChemLabStore } from '@/store/chemlab-store';

export default function AboutSection() {
  const { isLowPerformanceMode } = useChemLabStore();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isLowPerformanceMode) return;
    
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isLowPerformanceMode]);

  const floatingElements = useMemo(() => [
    { emoji: '🧪', left: 10, top: 20 },
    { emoji: '⚗️', left: 85, top: 25 },
    { emoji: '🔬', left: 50, top: 75 },
  ], []);

  const features = useMemo(() => [
    { icon: FlaskConical, label: 'Virtual Lab' },
    { icon: Atom, label: '118 Elements' },
    { icon: Award, label: 'Education' },
    { icon: Heart, label: 'Made with Love' }
  ], []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 overflow-hidden">
      {/* Background Effects */}
      {!isLowPerformanceMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Atoms */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: `${10 + i * 16}%`, y: `${10 + i * 12}%` }}
              animate={{ 
                y: [null, `${5 + i * 8}%`, `${10 + i * 12}%`],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Atom size={35 + i * 8} className="text-cyan-400/20" />
            </motion.div>
          ))}

          {/* Mouse-following Glow Orbs */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full blur-[100px] transition-all duration-700"
              style={{
                width: 300,
                height: 300,
                background: `radial-gradient(circle, ${i === 0 ? 'rgba(0,255,255,0.12)' : 'rgba(168,85,247,0.1)'} 0%, transparent 70%)`,
                left: `${mousePosition.x + (i - 0.5) * 15}%`,
                top: `${mousePosition.y + (i - 0.5) * 15}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Particle dots */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`dot-${i}`}
              className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${3 + Math.random() * 2}s infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36">
            {!isLowPerformanceMode && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <Atom className="w-full h-full text-cyan-400/30" />
              </motion.div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300 mb-4"
        >
          ChemLab
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-cyan-200/70 text-lg sm:text-xl mb-10 text-center max-w-xl"
        >
          Virtual Chemistry Laboratory for Schools, Teachers & Students
        </motion.p>

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-2xl w-full"
        >
          {/* Card Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-60" />
          
          {/* Card Content */}
          <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-6 sm:p-10 shadow-2xl shadow-cyan-500/5">
            {/* Decorative Header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-t-2xl" />
            
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-pink-400 shadow-sm shadow-pink-400/50" />
            </div>

            <Sparkles className="absolute top-5 right-5 text-yellow-400/50 w-5 h-5" />

            {/* Main Text */}
            <p className="text-xl sm:text-2xl text-slate-200 text-center mb-6 mt-4">
              This website is made by
            </p>

            {/* Author Name with Enhanced Glow */}
            <div className="relative text-center mb-6">
              {/* Animated Glow Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-16 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-2xl animate-pulse" />
              </div>
              
              {/* Name Text */}
              <h2 className="relative text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 animate-text-shimmer bg-[length:200%_auto]">
                  MR NATIK
                </span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-cyan-300/70 text-center mb-8">
              Web.ai Co-owner
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/40 border border-slate-600/30 hover:border-cyan-400/30 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              <Heart className="w-5 h-5 text-pink-400 fill-pink-400/30" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            </div>

            {/* Footer Text */}
            <p className="text-sm text-slate-400 text-center leading-relaxed">
              Designed for smart boards, classrooms, and students worldwide.
              <br />
              <span className="text-cyan-400/60">Optimized for all devices and performance levels.</span>
            </p>
          </div>
        </motion.div>

        {/* Floating Emojis */}
        {!isLowPerformanceMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingElements.map((item, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl sm:text-4xl opacity-20"
                style={{ left: `${item.left}%`, top: `${item.top}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes text-shimmer {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
        .animate-text-shimmer {
          animation: text-shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
