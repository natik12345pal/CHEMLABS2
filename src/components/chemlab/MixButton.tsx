'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';
import { FlaskConical, Sparkles, Flame, Droplets, Wind } from 'lucide-react';

export default function MixButton() {
  const { pendingReaction, isMixing, startMixing, isLowPerformanceMode } = useChemLabStore();

  if (!pendingReaction || isMixing) return null;

  // Get reaction type icon
  const getReactionIcon = () => {
    switch (pendingReaction.animationType) {
      case 'fire':
      case 'explosion':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'bubbles':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'smoke':
        return <Wind className="w-5 h-5 text-gray-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-36 left-1/2 -translate-x-1/2 z-40"
      >
        <motion.button
          onClick={startMixing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Outer Glow Ring */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Pulsing Background */}
          {!isLowPerformanceMode && (
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)',
                  '0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(0, 255, 255, 0.5)',
                  '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)',
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Button Content */}
          <div className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 text-slate-900 font-bold text-lg sm:text-xl overflow-hidden touch-manipulation min-h-[60px]">
            {/* Shimmer Effect */}
            {!isLowPerformanceMode && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}

            {/* Flask Icon */}
            <motion.div
              animate={isLowPerformanceMode ? {} : {
                rotate: [0, -15, 15, -15, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <FlaskConical className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.div>

            {/* Text */}
            <span className="relative z-10 flex items-center gap-2">
              MIX
              {getReactionIcon()}
            </span>
          </div>

          {/* Particle Effects */}
          {!isLowPerformanceMode && (
            <>
              {['top', 'left', 'right', 'bottom'].map((pos, i) => (
                <motion.div
                  key={pos}
                  className="absolute w-2 h-2 rounded-full bg-cyan-400"
                  style={{
                    ...(pos === 'top' && { top: -8, left: '50%' }),
                    ...(pos === 'bottom' && { bottom: -8, left: '50%' }),
                    ...(pos === 'left' && { left: -8, top: '50%' }),
                    ...(pos === 'right' && { right: -8, top: '50%' }),
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                  }}
                  animate={{
                    scale: [0.5, 1, 0.5],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}
        </motion.button>

        {/* Hint Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-cyan-300/70 text-sm mt-3"
        >
          Tap to start reaction
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

// Mixing Progress Overlay - Shows real-time reaction animation
export function MixingProgress() {
  const { isMixing, mixProgress, pendingReaction } = useChemLabStore();

  if (!isMixing) return null;

  // Get reaction color for animation
  const reactionColor = pendingReaction?.colorChange?.to || 'rgba(0, 255, 255, 0.5)';
  const reactionType = pendingReaction?.animationType || 'color-change';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-slate-900/60" />

      <div className="relative text-center">
        {/* Reaction Animation Container */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          {/* Central Flask */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: [0, -5, 5, -5, 5, 0],
              scale: [1, 1.02, 0.98, 1.02, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FlaskConical 
              className="w-24 h-24"
              style={{ color: reactionColor.replace('rgba', 'rgb').replace(/,[\d.]+\)/, ')') }}
            />
          </motion.div>

          {/* Bubbles Animation */}
          {reactionType === 'bubbles' && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 6 + Math.random() * 8,
                    height: 6 + Math.random() * 8,
                    backgroundColor: reactionColor,
                    left: `${30 + Math.random() * 40}%`,
                    bottom: '20%',
                    boxShadow: `0 0 8px ${reactionColor}`,
                  }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: -80 - Math.random() * 40,
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </>
          )}

          {/* Fire Animation */}
          {(reactionType === 'fire' || reactionType === 'explosion') && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 10 + Math.random() * 15,
                    height: 15 + Math.random() * 20,
                    background: `linear-gradient(to top, #ff4500, #ffd700, transparent)`,
                    left: `${35 + Math.random() * 30}%`,
                    bottom: '30%',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    filter: 'blur(1px)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.2, 0.8, 1],
                    opacity: [0, 1, 0.8, 0],
                    y: [-10, -30 - Math.random() * 20],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: Math.random() * 0.3,
                  }}
                />
              ))}
            </>
          )}

          {/* Smoke Animation */}
          {reactionType === 'smoke' && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gray-400/60"
                  style={{
                    width: 20 + Math.random() * 20,
                    height: 20 + Math.random() * 20,
                    left: `${35 + Math.random() * 30}%`,
                    bottom: '40%',
                    filter: 'blur(4px)',
                  }}
                  initial={{ scale: 0, opacity: 0, y: 0 }}
                  animate={{
                    scale: [0, 2, 3],
                    opacity: [0, 0.6, 0],
                    y: -60,
                    x: (Math.random() - 0.5) * 40,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </>
          )}

          {/* Color Change Sparkles */}
          {reactionType === 'color-change' && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: reactionColor,
                    borderRadius: '50%',
                    left: `${25 + Math.random() * 50}%`,
                    top: `${25 + Math.random() * 50}%`,
                    boxShadow: `0 0 10px ${reactionColor}`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </>
          )}

          {/* Sparkle effects around */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400 opacity-80" />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-64 mx-auto px-4">
          <div className="h-4 bg-slate-700/80 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #00CED1, ${reactionColor})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${mixProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          
          {/* Progress percentage */}
          <motion.p 
            className="text-white mt-3 font-mono text-lg font-bold"
            style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}
          >
            {Math.round(mixProgress)}%
          </motion.p>
          
          {/* Reaction type label */}
          <p className="text-cyan-300/80 text-sm mt-1">
            {reactionType === 'bubbles' && 'Generating gas...'}
            {reactionType === 'fire' && 'Exothermic reaction...'}
            {reactionType === 'explosion' && 'Violent reaction!'}
            {reactionType === 'smoke' && 'Releasing vapor...'}
            {reactionType === 'color-change' && 'Color transition...'}
            {reactionType === 'precipitate' && 'Forming precipitate...'}
            {reactionType === 'fizz' && 'Effervescence...'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
