'use client';

import { useEffect, useMemo, Suspense } from 'react';
import { useChemLabStore } from '@/store/chemlab-store';

// Direct imports for faster loading
import Navigation from '@/components/chemlab/Navigation';
import LabWorkspace from '@/components/chemlab/LabWorkspace';
import PeriodicTable from '@/components/chemlab/PeriodicTable';
import AboutSection from '@/components/chemlab/AboutSection';
import LoadingScreen from '@/components/chemlab/LoadingScreen';

export default function Home() {
  const { 
    isLoading, 
    isDarkMode, 
    activeSection,
    isLowPerformanceMode
  } = useChemLabStore();

  // Apply dark/light mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Apply performance mode
  useEffect(() => {
    document.documentElement.classList.toggle('low-performance', isLowPerformanceMode);
  }, [isLowPerformanceMode]);

  // Memoize sections to prevent re-renders
  const sections = useMemo(() => ({
    lab: <LabWorkspace />,
    'periodic-table': <PeriodicTable />,
    about: <AboutSection />
  }), []);

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}

      {/* Main App */}
      {!isLoading && (
        <div className="flex flex-col min-h-screen">
          {/* Navigation */}
          <Navigation />

          {/* Main Content Area - Instant switching */}
          <div className="flex-1 pt-16 sm:pt-16">
            <Suspense fallback={null}>
              {activeSection === 'lab' && (
                <div className="h-[calc(100vh-4rem)]">
                  {sections.lab}
                </div>
              )}
              
              {activeSection === 'periodic-table' && (
                <div className="h-[calc(100vh-4rem)]">
                  {sections['periodic-table']}
                </div>
              )}
              
              {activeSection === 'about' && (
                <div>
                  {sections.about}
                </div>
              )}
            </Suspense>
          </div>

          {/* Footer */}
          <footer className="bg-slate-800/50 border-t border-cyan-500/20 py-3 px-4 text-center mt-auto">
            <p className="text-sm text-slate-400">
              ChemLab - Virtual Chemistry Laboratory | Made by{' '}
              <span className="text-cyan-400 font-semibold">MR NATIK</span>
            </p>
          </footer>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.5); }

        .low-performance * { animation-duration: 0s !important; transition-duration: 0s !important; }
        .low-performance .animate-pulse, .low-performance .animate-bounce, .low-performance .animate-spin { animation: none !important; }

        .glass { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
        .touch-manipulation { touch-action: manipulation; min-height: 44px; min-width: 44px; }

        /* Prevent context menu on interactive elements for smart boards */
        .touch-manipulation, .select-none {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }

        /* Pour button specific - extra protection */
        button[data-pour="true"] {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          touch-action: manipulation !important;
        }

        @media (max-width: 640px) { html { font-size: 14px; } }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
