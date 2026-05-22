'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Atom, FlaskConical, Award, Sparkles } from 'lucide-react';
import { useChemLabStore } from '@/store/chemlab-store';

export default function AboutSection() {
  const { isLowPerformanceMode } = useChemLabStore();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Skip mouse tracking in low performance mode
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

  // Memoize floating elements to prevent re-creation
  const floatingElements = useMemo(() => [
    { emoji: '🧪', left: 10, top: 20 },
    { emoji: '⚗️', left: 80, top: 30 },
    { emoji: '🔬', left: 50, top: 70 },
  ], []);

  const features = useMemo(() => [
    { icon: FlaskConical, label: 'Virtual Lab' },
    { icon: Atom, label: '118 Elements' },
    { icon: Award, label: 'Education' },
    { icon: Heart, label: 'Made with Love' }
  ], []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 overflow-hidden">
      {/* Simplified Background */}
      {!isLowPerformanceMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Reduced floating elements from 15 to 5 */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: `${10 + i * 20}%`,
                y: `${10 + i * 15}%`,
              }}
              animate={{
                y: [null, `${5 + i * 10}%`, `${10 + i * 15}%`],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Atom 
                size={30 + i * 10} 
                className="text-cyan-400/15"
              />
            </motion.div>
          ))}

          {/* Reduced glowing orbs from 8 to 2 */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{
                width: 200,
                height: 200,
                background: `radial-gradient(circle, ${i === 0 ? 'rgba(0,255,255,0.15)' : 'rgba(0,255,136,0.15)'} 0%, transparent 70%)`,
                left: `${mousePosition.x + (i - 1) * 20}%`,
                top: `${mousePosition.y + (i - 1) * 20}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32">
            {!isLowPerformanceMode && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <Atom className="w-full h-full text-cyan-400/40" />
              </motion.div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <FlaskConical className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 mb-6">
          ChemLab
        </h1>

        <p className="text-cyan-200/80 text-lg sm:text-xl mb-10 text-center max-w-2xl">
          Virtual Chemistry Laboratory for Schools, Teachers & Students
        </p>

        {/* About Card */}
        <div className="relative max-w-2xl w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl" />
          <div className="relative bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-6 sm:p-10">
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <div className="w-2 h-2 rounded-full bg-pink-400" />
            </div>

            <Sparkles className="absolute top-6 right-6 text-yellow-400/40 w-5 h-5" />

            {/* Main Text */}
            <p className="text-lg sm:text-2xl text-slate-200 text-center mb-6">
              This website is made by
            </p>

            {/* Author Name */}
            <div className="relative text-center mb-6">
              <h2 className="relative text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                MR NATIK
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-cyan-300/80 text-center mb-6">
              Web.ai Co-owner
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-700/30"
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  <span className="text-xs sm:text-sm text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              <Heart className="w-4 h-4 text-pink-400" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            </div>

            {/* Footer Text */}
            <p className="text-sm text-slate-400 text-center">
              Designed for smart boards, classrooms, and students worldwide.
              <br />
              Optimized for all devices and performance levels.
            </p>
          </div>
        </div>

        {/* Floating Elements - Reduced */}
        {!isLowPerformanceMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingElements.map((item, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl sm:text-3xl opacity-15"
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.1, 0.25, 0.1]
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
