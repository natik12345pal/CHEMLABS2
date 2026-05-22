'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';
import dynamic from 'next/dynamic';
import { useSoundEffects } from '@/components/chemlab/SoundEffects';

// Dynamic imports for better performance
const LoadingScreen = dynamic(() => import('@/components/chemlab/LoadingScreen'), { ssr: false });
const Navigation = dynamic(() => import('@/components/chemlab/Navigation'), { ssr: false });
const LabWorkspace = dynamic(() => import('@/components/chemlab/LabWorkspace'), { ssr: false });
const PeriodicTable = dynamic(() => import('@/components/chemlab/PeriodicTable'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/chemlab/AboutSection'), { ssr: false });

export default function Home() {
  const { 
    isLoading, 
    setLoading, 
    isDarkMode, 
    activeSection,
    isLowPerformanceMode
  } = useChemLabStore();
  
  // Initialize sound effects
  useSoundEffects();

  // Initialize app
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setLoading]);

  // Apply dark/light mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply performance mode
  useEffect(() => {
    if (isLowPerformanceMode) {
      document.documentElement.classList.add('low-performance');
    } else {
      document.documentElement.classList.remove('low-performance');
    }
  }, [isLowPerformanceMode]);

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Main App */}
      {!isLoading && (
        <div className="flex flex-col min-h-screen">
          {/* Navigation */}
          <Navigation />

          {/* Main Content Area */}
          <div className="flex-1 pt-16 sm:pt-16">
            <AnimatePresence mode="wait">
              {activeSection === 'lab' && (
                <motion.div
                  key="lab"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-[calc(100vh-4rem)]"
                >
                  <LabWorkspace />
                </motion.div>
              )}

              {activeSection === 'periodic-table' && (
                <motion.div
                  key="periodic-table"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-[calc(100vh-4rem)]"
                >
                  <PeriodicTable />
                </motion.div>
              )}

              {activeSection === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AboutSection />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="bg-slate-800/50 border-t border-cyan-500/20 py-4 px-4 text-center mt-auto">
            <p className="text-sm text-slate-400">
              ChemLab - Virtual Chemistry Laboratory | Made by{' '}
              <span className="text-cyan-400 font-semibold">MR NATIK</span>
            </p>
          </footer>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.5);
        }

        /* Low Performance Mode Styles */
        .low-performance * {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
        .low-performance .animate-pulse,
        .low-performance .animate-bounce,
        .low-performance .animate-spin {
          animation: none !important;
        }

        /* Glassmorphism Effect */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Neon Glow */
        .neon-cyan {
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
                      0 0 20px rgba(0, 255, 255, 0.3),
                      0 0 30px rgba(0, 255, 255, 0.2);
        }

        /* Touch-friendly Buttons */
        .touch-manipulation {
          touch-action: manipulation;
          min-height: 44px;
          min-width: 44px;
        }

        /* Responsive Text */
        @media (max-width: 640px) {
          html {
            font-size: 14px;
          }
        }

        /* Smooth Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* Performance Optimizations */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
