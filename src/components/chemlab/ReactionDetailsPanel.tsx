'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';
import { 
  X, 
  Minimize2, 
  Maximize2, 
  Thermometer, 
  Palette, 
  AlertTriangle,
  Beaker,
  Lightbulb,
  BookOpen
} from 'lucide-react';

export default function ReactionDetailsPanel() {
  const { 
    reactionResult, 
    showReactionPanel, 
    isPanelMinimized,
    dismissReactionResult, 
    togglePanelMinimize,
    isLowPerformanceMode 
  } = useChemLabStore();

  if (!reactionResult || !showReactionPanel) return null;

  const { reaction } = reactionResult;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: isPanelMinimized ? 'calc(100% - 60px)' : 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] bg-gradient-to-t from-slate-900 via-slate-800 to-slate-800 border-t border-cyan-500/30 rounded-t-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center"
            >
              <Beaker className="w-5 h-5 text-slate-900" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-cyan-400">Reaction Complete!</h3>
              <p className="text-xs text-slate-400">{reaction.type.replace('-', ' ')} reaction</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePanelMinimize}
              className="p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-400 transition-colors touch-manipulation"
            >
              {isPanelMinimized ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
            </button>
            <button
              onClick={dismissReactionResult}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors touch-manipulation"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content - Hidden when minimized */}
        {!isPanelMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-y-auto max-h-[calc(70vh-80px)] p-4 custom-scrollbar"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Chemical Equation */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-cyan-900/20 border border-cyan-500/20">
                <h4 className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                  <Beaker size={16} className="text-cyan-400" />
                  Balanced Equation
                </h4>
                <p className="text-xl sm:text-2xl font-mono text-cyan-300 text-center py-2">
                  {reaction.equation}
                </p>
              </div>

              {/* Reaction Type */}
              <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                <h4 className="text-sm text-slate-400 mb-2">Reaction Type</h4>
                <p className="text-cyan-300 font-semibold capitalize">
                  {reaction.type.replace('-', ' ')}
                </p>
              </div>

              {/* Products */}
              <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                <h4 className="text-sm text-slate-400 mb-2">Products Formed</h4>
                <p className="text-emerald-300 font-semibold">
                  {reaction.products}
                </p>
              </div>

              {/* Color Change */}
              {reaction.colorChange && (
                <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <h4 className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                    <Palette size={16} className="text-pink-400" />
                    Color Change
                  </h4>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border border-white/20" 
                      style={{ backgroundColor: reaction.colorChange.from }}
                    />
                    <span className="text-slate-400">→</span>
                    <div 
                      className="w-8 h-8 rounded-full border border-white/20" 
                      style={{ backgroundColor: reaction.colorChange.to }}
                    />
                  </div>
                </div>
              )}

              {/* Temperature Change */}
              {reaction.temperatureChange && (
                <div className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                  <h4 className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                    <Thermometer size={16} className="text-orange-400" />
                    Temperature Change
                  </h4>
                  <p className={`font-semibold ${reaction.temperatureChange === 'exothermic' ? 'text-orange-400' : 'text-blue-400'}`}>
                    {reaction.temperatureChange === 'exothermic' ? '🔥 Heat Released' : '❄️ Heat Absorbed'}
                  </p>
                </div>
              )}

              {/* Educational Explanation */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-cyan-900/20 to-emerald-900/20 border border-cyan-500/20">
                <h4 className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                  <BookOpen size={16} className="text-cyan-400" />
                  Educational Explanation
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {reaction.educationalNotes}
                </p>
              </div>

              {/* Safety Warning */}
              {reaction.safetyWarning && (
                <div className="sm:col-span-2 p-4 rounded-xl bg-red-900/20 border border-red-500/30">
                  <h4 className="text-sm text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Safety Information
                  </h4>
                  <p className="text-red-300">
                    {reaction.safetyWarning}
                  </p>
                </div>
              )}

              {/* Real-life Uses */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20">
                <h4 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                  <Lightbulb size={16} className="text-yellow-400" />
                  Real-life Applications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getReactionUses(reaction.type).map((use, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-cyan-300"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-4 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={dismissReactionResult}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-900 font-bold touch-manipulation"
              >
                Continue Experimenting
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Get real-life uses based on reaction type
function getReactionUses(type: string): string[] {
  const uses: Record<string, string[]> = {
    'neutralization': ['Antacid tablets', 'Soil treatment', 'Industrial waste treatment', 'Baking'],
    'combustion': ['Fuel engines', 'Power plants', 'Heating systems', 'Rocket propulsion'],
    'displacement': ['Metal extraction', 'Batteries', 'Corrosion prevention', 'Electroplating'],
    'precipitation': ['Water purification', 'Chemical analysis', 'Pigment production', 'Mining'],
    'gas-evolution': ['Baking powder', 'Fire extinguishers', 'Carbonated drinks', 'Welding'],
    'redox': ['Batteries', 'Photography', 'Metabolism', 'Corrosion protection'],
    'synthesis': ['Fertilizer production', 'Plastic manufacturing', 'Pharmaceutical synthesis'],
    'decomposition': ['Metal refining', 'Food preservation', 'Explosives', 'Waste treatment']
  };
  
  return uses[type] || ['Industrial chemistry', 'Laboratory analysis', 'Educational demonstrations'];
}
