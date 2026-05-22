'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';
import { FlaskConical, Sparkles } from 'lucide-react';

export default function MixButton() {
  const { pendingReaction, isMixing, mixProgress, startMixing, isLowPerformanceMode } = useChemLabStore();

  if (!pendingReaction || isMixing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
      >
        <motion.button
          onClick={startMixing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
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
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
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
          Click to start the reaction
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

// Mixing Progress Overlay
export function MixingProgress() {
  const { isMixing, mixProgress } = useChemLabStore();

  if (!isMixing) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
    >
      <div className="text-center">
        {/* Mixing Animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <FlaskConical className="w-full h-full text-cyan-400" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${mixProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-cyan-300 mt-2 font-mono">
            Mixing... {Math.round(mixProgress)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
