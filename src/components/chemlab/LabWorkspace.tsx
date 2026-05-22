'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChemLabStore } from '@/store/chemlab-store';
import { chemicals, Chemical } from '@/data/chemicals';
import { beakerTypes } from '@/data/beakers';
import { 
  FlaskConical, 
  Thermometer,
  Play,
  Pause,
  X,
  Sparkles,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import BeakerComponent from './BeakerComponent';
import MixButton, { MixingProgress } from './MixButton';
import ReactionDetailsPanel from './ReactionDetailsPanel';
import { useSoundEffects } from './SoundEffects';

export default function LabWorkspace() {
  const {
    workspaceBeakers,
    selectedBeaker,
    selectBeaker,
    selectChemical,
    selectedChemical,
    addBeakerToWorkspace,
    removeBeakerFromWorkspace,
    addChemicalToBeaker,
    temperature,
    setTemperature,
    isPaused,
    togglePause,
    isLowPerformanceMode,
    isMixing,
    pendingReaction
  } = useChemLabStore();

  const { playPour } = useSoundEffects();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 800, height: 600 });
  const [showChemicalPanel, setShowChemicalPanel] = useState(true);
  const [showBeakerPanel, setShowBeakerPanel] = useState(true);
  const [quantity, setQuantity] = useState(10);

  // Update workspace size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (workspaceRef.current) {
        const rect = workspaceRef.current.getBoundingClientRect();
        setWorkspaceSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle adding beaker
  const handleAddBeaker = useCallback((beakerType: typeof beakerTypes[0]) => {
    addBeakerToWorkspace(beakerType, workspaceSize);
  }, [addBeakerToWorkspace, workspaceSize]);

  // Handle adding chemical with sound
  const handleAddChemical = useCallback((beakerId: string, chemical: Chemical, qty: number) => {
    addChemicalToBeaker(beakerId, chemical, qty);
    playPour();
  }, [addChemicalToBeaker, playPour]);

  // Chemical categories
  const chemicalCategories = [
    { name: 'Acids', filter: (c: Chemical) => c.type === 'acid', color: 'from-red-500 to-orange-500' },
    { name: 'Bases', filter: (c: Chemical) => c.type === 'base', color: 'from-blue-500 to-cyan-500' },
    { name: 'Salts', filter: (c: Chemical) => c.type === 'salt', color: 'from-gray-400 to-gray-500' },
    { name: 'Metals', filter: (c: Chemical) => c.type === 'metal', color: 'from-slate-400 to-zinc-500' },
    { name: 'Indicators', filter: (c: Chemical) => c.type === 'indicator', color: 'from-pink-500 to-purple-500' },
    { name: 'Solvents', filter: (c: Chemical) => c.type === 'solvent', color: 'from-cyan-400 to-blue-400' },
  ];

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Equipment */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`bg-slate-800/60 backdrop-blur-sm border-r border-cyan-500/20 flex flex-col transition-all duration-300 ${
          showBeakerPanel ? 'w-44 lg:w-52' : 'w-12'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setShowBeakerPanel(!showBeakerPanel)}
          className="p-3 border-b border-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/10 transition-colors touch-manipulation"
        >
          {showBeakerPanel ? (
            <ChevronLeft size={20} className="text-cyan-400" />
          ) : (
            <Menu size={20} className="text-cyan-400" />
          )}
        </button>

        {showBeakerPanel && (
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            <p className="text-xs text-slate-400 px-1 mb-2">Tap to add equipment</p>
            {beakerTypes.map((beaker) => (
              <motion.button
                key={beaker.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddBeaker(beaker)}
                className="w-full p-2.5 rounded-xl bg-slate-700/40 hover:bg-cyan-500/20 border border-transparent hover:border-cyan-500/30 transition-all text-left touch-manipulation"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{beaker.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-200 font-medium truncate">{beaker.name}</p>
                    <p className="text-[10px] text-slate-500">{beaker.capacity}mL</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Workspace Area */}
        <div
          ref={workspaceRef}
          className="flex-1 relative overflow-hidden"
        >
          {/* Clean Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Subtle Grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Lab Table Surface */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-800/50 to-transparent pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-700/30 border-t border-slate-600/20" />
          </div>

          {/* Beakers */}
          <AnimatePresence>
            {workspaceBeakers.map((beaker) => (
              <BeakerComponent
                key={beaker.id}
                beaker={beaker}
                isSelected={selectedBeaker === beaker.id}
                onSelect={() => selectBeaker(beaker.id)}
                onRemove={() => removeBeakerFromWorkspace(beaker.id)}
                onAddChemical={(chemical, qty) => handleAddChemical(beaker.id, chemical, qty)}
                selectedChemical={selectedChemical}
                quantity={quantity}
                workspaceSize={workspaceSize}
                isMixing={isMixing}
              />
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {workspaceBeakers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center text-slate-400 max-w-sm px-6">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mb-4"
                >
                  <FlaskConical size={56} className="mx-auto text-cyan-500/30" />
                </motion.div>
                <p className="text-lg font-medium text-slate-300">Lab Ready</p>
                <p className="text-sm mt-2 text-slate-500">
                  Add equipment from the left panel to start experimenting
                </p>
              </div>
            </motion.div>
          )}

          {/* Quick Fill Button - Shows when chemical selected and beaker is selected */}
          <AnimatePresence>
            {selectedChemical && selectedBeaker && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={() => handleAddChemical(selectedBeaker, selectedChemical, quantity)}
                disabled={isMixing}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/90 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Droplets size={20} />
                <span>Add {selectedChemical.formula} ({quantity}mL)</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Pending Reaction Indicator */}
          {pendingReaction && !isMixing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-sm"
            >
              <span className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                Ready to mix!
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="h-14 bg-slate-800/60 backdrop-blur-sm border-t border-cyan-500/20 flex items-center justify-between px-4">
          {/* Temperature */}
          <div className="flex items-center gap-2">
            <Thermometer size={18} className="text-cyan-400" />
            <input
              type="range"
              min="-50"
              max="200"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-20 sm:w-28 h-1.5 accent-cyan-400 touch-manipulation"
            />
            <span className="text-sm text-cyan-400 font-mono w-14">{temperature}°C</span>
          </div>

          {/* Pause */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={togglePause}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors touch-manipulation ${
              isPaused
                ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
            }`}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
            <span className="hidden sm:inline text-sm font-medium">
              {isPaused ? 'Resume' : 'Pause'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Right Sidebar - Chemicals */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`bg-slate-800/60 backdrop-blur-sm border-l border-cyan-500/20 flex flex-col transition-all duration-300 ${
          showChemicalPanel ? 'w-52 lg:w-60' : 'w-12'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setShowChemicalPanel(!showChemicalPanel)}
          className="p-3 border-b border-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/10 transition-colors touch-manipulation"
        >
          {showChemicalPanel ? (
            <ChevronRight size={20} className="text-cyan-400" />
          ) : (
            <Menu size={20} className="text-cyan-400" />
          )}
        </button>

        {showChemicalPanel && (
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {/* Quantity Selector */}
            <div className="mb-3 p-2.5 bg-slate-700/30 rounded-xl">
              <label className="text-[10px] text-slate-400 block mb-1.5">Amount (mL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="flex-1 h-1.5 accent-cyan-400 touch-manipulation"
                />
                <span className="text-sm text-cyan-400 font-mono w-10 text-right">{quantity}</span>
              </div>
            </div>

            {/* Chemical Categories */}
            {chemicalCategories.map((category) => {
              const categoryChemicals = chemicals.filter(category.filter);
              if (categoryChemicals.length === 0) return null;

              return (
                <div key={category.name} className="mb-3">
                  <h4 className={`text-[10px] font-semibold mb-1.5 px-1 uppercase tracking-wider bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-1">
                    {categoryChemicals.map((chemical) => (
                      <motion.button
                        key={chemical.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectChemical(selectedChemical?.id === chemical.id ? null : chemical)}
                        className={`p-2 rounded-xl border transition-all text-left touch-manipulation ${
                          selectedChemical?.id === chemical.id
                            ? 'bg-cyan-500/25 border-cyan-400/60 shadow-sm shadow-cyan-500/20'
                            : 'bg-slate-700/30 border-transparent hover:border-cyan-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-sm">{chemical.icon}</span>
                          <span className="text-[11px] text-slate-200 font-medium truncate">{chemical.formula}</span>
                        </div>
                        {/* Hazard dot */}
                        <div className={`h-1 w-4 rounded-full mt-1 ${
                          chemical.hazard === 'dangerous' ? 'bg-red-500' :
                          chemical.hazard === 'caution' ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`} />
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Chemical Quick View */}
        {showChemicalPanel && selectedChemical && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border-t border-cyan-500/20 bg-slate-900/60"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedChemical.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-cyan-300 font-medium text-sm truncate">{selectedChemical.name}</p>
                <p className="text-xs text-slate-400">{selectedChemical.formula}</p>
              </div>
              <button
                onClick={() => selectChemical(null)}
                className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 transition-colors touch-manipulation"
              >
                <X size={14} />
              </button>
            </div>
            {selectedBeaker && (
              <p className="text-[10px] text-emerald-400 mt-2 text-center">
                Tap "Add" button to fill beaker
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Mix Button */}
      <MixButton />

      {/* Mixing Progress */}
      <MixingProgress />

      {/* Reaction Details */}
      <ReactionDetailsPanel />
    </div>
  );
}
