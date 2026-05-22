'use client';

import { motion } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';
import { 
  FlaskConical, 
  Table, 
  Info, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ZoomIn, 
  ZoomOut,
  Gauge,
  RotateCcw
} from 'lucide-react';

export default function Navigation() {
  const {
    activeSection,
    setActiveSection,
    isDarkMode,
    toggleDarkMode,
    isSoundEnabled,
    toggleSound,
    toggleFullscreen,
    zoomLevel,
    setZoomLevel,
    isLowPerformanceMode,
    toggleLowPerformanceMode,
    resetExperiment
  } = useChemLabStore();

  const navItems = [
    { id: 'lab', label: 'Lab', icon: FlaskConical },
    { id: 'periodic-table', label: 'Elements', icon: Table },
    { id: 'about', label: 'About', icon: Info },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-slate-900 font-bold text-xl">⚗</span>
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              ChemLab
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 touch-manipulation ${
                    isActive 
                      ? 'text-cyan-400' 
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-cyan-500/20 rounded-lg border border-cyan-400/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Zoom Controls - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1 mr-2 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <button
                onClick={() => setZoomLevel(zoomLevel - 10)}
                className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs text-slate-400 min-w-[3rem] text-center font-mono">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(zoomLevel + 10)}
                className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetExperiment}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-orange-400 hover:border-orange-400/30 transition-colors touch-manipulation"
              title="Reset Experiment"
            >
              <RotateCcw size={18} />
            </motion.button>

            {/* Performance Mode */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLowPerformanceMode}
              className={`p-2 rounded-lg border transition-colors touch-manipulation ${
                isLowPerformanceMode
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-400'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-amber-400'
              }`}
              title={isLowPerformanceMode ? 'Low Performance Mode ON' : 'Low Performance Mode OFF'}
            >
              <Gauge size={18} />
            </motion.button>

            {/* Sound Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-cyan-300 transition-colors touch-manipulation"
              title={isSoundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-yellow-400 transition-colors touch-manipulation"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Fullscreen */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="hidden sm:block p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-emerald-400 transition-colors touch-manipulation"
              title="Toggle Fullscreen"
            >
              <Maximize size={18} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex items-center justify-center gap-2 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-all touch-manipulation ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30' 
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
