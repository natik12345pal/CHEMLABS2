'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Atom, FlaskConical, Award, Sparkles } from 'lucide-react';
import { useChemLabStore } from '@/store/chemlab-store';

export default function AboutSection() {
  const { isLowPerformanceMode } = useChemLabStore();

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
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      {/* Simple Background - No blur effects for smart board compatibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,200,200,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,200,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Background Effects - Only if not low performance */}
      {!isLowPerformanceMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Atoms - Reduced count */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: `${20 + i * 30}%`, y: `${20 + i * 15}%` }}
              animate={{
                y: [null, `${15 + i * 10}%`, `${20 + i * 15}%`],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Atom size={40 + i * 10} className="text-cyan-400/15" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative w-28 h-28 sm:w-36 sm:h-36">
            {!isLowPerformanceMode && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <Atom className="w-full h-full text-cyan-400/25" />
              </motion.div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500 flex items-center justify-center">
                <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 text-slate-900" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title - Solid color, no gradient text for better compatibility */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-cyan-400 mb-4"
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

        {/* About Card - Simplified for smart boards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-2xl w-full"
        >
          {/* Card Content - No backdrop-blur for smart board compatibility */}
          <div className="relative bg-slate-800 rounded-2xl border border-cyan-500/30 p-6 sm:p-10">
            {/* Decorative Header - Simple solid color */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500 rounded-t-2xl" />

            {/* Corner Decorations - No shadows */}
            <div className="absolute top-4 left-4 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
            </div>

            <Sparkles className="absolute top-5 right-5 text-yellow-400/50 w-5 h-5" />

            {/* Main Text */}
            <p className="text-xl sm:text-2xl text-slate-200 text-center mb-6 mt-4">
              This website is made by
            </p>

            {/* Author Name - Simple gradient, no animation */}
            <div className="relative text-center mb-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                MR NATIK
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
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:border-cyan-500/50 transition-colors"
                >
                  <item.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs sm:text-sm text-slate-300 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-slate-600" />
              <Heart className="w-5 h-5 text-pink-400" />
              <div className="flex-1 h-px bg-slate-600" />
            </div>

            {/* Footer Text */}
            <p className="text-sm text-slate-400 text-center leading-relaxed">
              Designed for smart boards, classrooms, and students worldwide.
              <br />
              <span className="text-cyan-400">Optimized for all devices and performance levels.</span>
            </p>
          </div>
        </motion.div>

        {/* Floating Emojis */}
        {!isLowPerformanceMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingElements.map((item, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl sm:text-4xl opacity-15"
                style={{ left: `${item.left}%`, top: `${item.top}%` }}
                animate={{ y: [0, -15, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
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
