'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Atom, FlaskConical, Award, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Molecules */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0
            }}
            animate={{
              x: [null, `${Math.random() * 100}%`],
              y: [null, `${Math.random() * 100}%`],
              opacity: [0, 0.6, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            <Atom 
              size={40 + Math.random() * 40} 
              className="text-cyan-400/20"
            />
          </motion.div>
        ))}

        {/* Glowing Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 100 + Math.random() * 200,
              height: 100 + Math.random() * 200,
              background: `radial-gradient(circle, ${
                ['#00ffff', '#00ff88', '#ff00ff', '#ffd700'][i % 4]
              }20 0%, transparent 70%)`,
              left: `${mousePosition.x + (i - 4) * 10}%`,
              top: `${mousePosition.y + (i - 4) * 10}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}

        {/* Particle Network */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r="2"
              fill="#00ffff"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative w-32 h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <Atom className="w-full h-full text-cyan-400/50" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FlaskConical className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 mb-6"
        >
          ChemLab
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-cyan-200/80 text-xl sm:text-2xl mb-12 text-center max-w-2xl"
        >
          Virtual Chemistry Laboratory for Schools, Teachers & Students
        </motion.p>

        {/* About Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="relative max-w-2xl w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
          <div className="relative bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 sm:p-12">
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-cyan-400"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-2 h-2 rounded-full bg-pink-400"
              />
            </div>

            <Sparkles className="absolute top-6 right-6 text-yellow-400/50 w-6 h-6" />

            {/* Main Text */}
            <p className="text-xl sm:text-2xl text-slate-200 text-center mb-8">
              This website is made by
            </p>

            {/* Author Name with Glowing Animation */}
            <div className="relative text-center mb-8">
              <motion.div
                className="absolute inset-0 blur-2xl"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(0,255,255,0.5) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(255,0,255,0.5) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(0,255,255,0.5) 0%, transparent 70%)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <motion.h2
                className="relative text-4xl sm:text-5xl md:text-6xl font-bold"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4)',
                    '0 0 40px rgba(255,0,255,0.8), 0 0 80px rgba(255,0,255,0.4)',
                    '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  MR NATIK
                </span>
              </motion.h2>

              {/* Flash Animation */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    'linear-gradient(90deg, transparent, transparent)',
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    'linear-gradient(90deg, transparent, transparent)'
                  ],
                  backgroundSize: '200% 100%',
                  backgroundPosition: ['200% 0', '-200% 0', '-200% 0']
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            </div>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-cyan-300/80 text-center mb-8">
              Web.ai Co-owner
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: FlaskConical, label: 'Virtual Lab' },
                { icon: Atom, label: '118 Elements' },
                { icon: Award, label: 'Education' },
                { icon: Heart, label: 'Made with Love' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-700/30"
                >
                  <item.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-xs text-slate-300">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
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
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {['🧪', '⚗️', '🔬', '🧬', '💎', '⚗️'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl sm:text-4xl opacity-20"
              style={{
                left: `${10 + i * 16}%`,
                top: `${20 + (i % 3) * 30}%`
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
