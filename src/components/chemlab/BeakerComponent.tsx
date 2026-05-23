'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceBeaker, useChemLabStore } from '@/store/chemlab-store';
import { Chemical } from '@/data/chemicals';
import { Trash2, Info, Droplets, X, Beaker, Plus } from 'lucide-react';

interface BeakerComponentProps {
  beaker: WorkspaceBeaker;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onAddChemical: (chemical: Chemical, quantity: number) => void;
  selectedChemical: Chemical | null;
  quantity: number;
  workspaceSize: { width: number; height: number };
  isMixing: boolean;
  isExploding?: boolean;
}

// Floating mini-menu
function FloatingMenu({ 
  position, 
  onClose, 
  onInfo, 
  onRemove,
  hasChemical
}: { 
  position: { x: number; y: number };
  onClose: () => void;
  onInfo: () => void;
  onRemove: () => void;
  hasChemical: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="fixed z-50 bg-slate-800/95 backdrop-blur-md rounded-xl border border-cyan-500/30 shadow-2xl overflow-hidden"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-1">
        <button
          onClick={() => { onInfo(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/20 text-cyan-400 transition-colors touch-manipulation"
        >
          <Info size={20} />
          <span className="font-medium">Info</span>
        </button>
        <button
          onClick={() => { onRemove(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400 transition-colors touch-manipulation"
        >
          <Trash2 size={20} />
          <span className="font-medium">Remove</span>
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 hover:bg-slate-700/50 text-slate-400 border-t border-slate-700 transition-colors touch-manipulation"
        >
          <X size={16} />
          <span className="text-sm">Close</span>
        </button>
      </div>
    </motion.div>
  );
}

// Glass Shatter Effect Component
function GlassShatter() {
  const shards = [
    { x: -40, y: -30, rotation: -45, delay: 0 },
    { x: 30, y: -40, rotation: 30, delay: 0.05 },
    { x: -50, y: 20, rotation: 60, delay: 0.1 },
    { x: 40, y: 30, rotation: -20, delay: 0.15 },
    { x: 0, y: -50, rotation: 90, delay: 0.05 },
    { x: -30, y: 50, rotation: -60, delay: 0.1 },
    { x: 50, y: 0, rotation: 45, delay: 0.15 },
    { x: 20, y: 60, rotation: 15, delay: 0.2 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {shards.map((shard, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: shard.x * 3,
            y: shard.y * 3 + 100,
            rotate: shard.rotation * 3,
            opacity: 0
          }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: shard.delay }}
          className="absolute w-6 h-8 bg-gradient-to-br from-white/40 to-cyan-200/30"
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            backdropFilter: 'blur(2px)'
          }}
        />
      ))}
      {/* Explosion flash */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute w-24 h-24 rounded-full"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,255,200,0.95) 0%, rgba(255,165,0,0.9) 40%, transparent 70%)',
        }}
      />
    </div>
  );
}

// Tap/Dispenser Component - properly centered above any container
function TapDispenser({ 
  chemical, 
  isPouring
}: { 
  chemical: Chemical;
  isPouring: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute left-1/2 -translate-x-1/2 -top-28 z-30 pointer-events-none"
    >
      {/* Dispenser/Tap SVG */}
      <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto block">
        <defs>
          <linearGradient id="tapMetalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="50%" stopColor="#888" />
            <stop offset="100%" stopColor="#555" />
          </linearGradient>
          <linearGradient id="liquidReservoirGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={chemical.liquidColor} />
            <stop offset="100%" stopColor={chemical.color} />
          </linearGradient>
        </defs>
        
        {/* Reservoir container */}
        <rect x="15" y="5" width="50" height="40" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(200,220,255,0.3)" strokeWidth="1.5" />
        
        {/* Liquid in reservoir */}
        <rect x="17" y="15" width="46" height="28" rx="2" fill="url(#liquidReservoirGradient)" opacity="0.85" />
        
        {/* Tap spout */}
        <rect x="35" y="45" width="10" height="25" rx="2" fill="url(#tapMetalGradient)" />
        
        {/* Tap nozzle */}
        <path d="M32,70 L48,70 L44,85 L36,85 Z" fill="url(#tapMetalGradient)" />
        
        {/* Tap handle */}
        <rect x="55" y="35" width="20" height="8" rx="2" fill="#444" />
        <circle cx="65" cy="39" r="4" fill="#666" />
      </svg>

      {/* Pouring Stream */}
      {isPouring && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 60, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute left-1/2 -translate-x-1/2 w-2.5 origin-top"
          style={{ 
            top: '85px',
            background: chemical.isTransparent 
              ? `linear-gradient(to bottom, ${chemical.liquidColor}, ${chemical.liquidColor})`
              : `linear-gradient(to bottom, ${chemical.liquidColor}, ${chemical.color})`,
            borderRadius: '0 0 6px 6px',
            boxShadow: `0 0 12px ${chemical.color}50`
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, 45, 60],
                scaleY: [1, 1, 0.3],
                opacity: [1, 0.7, 0]
              }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.12 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-4 rounded-full"
              style={{ backgroundColor: chemical.color }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// Solid Material Drop Animation
function SolidDropAnimation({ 
  chemical,
  onComplete 
}: { 
  chemical: Chemical;
  onComplete: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: -30, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeIn' }}
      className="absolute left-1/2 -translate-x-1/2 -top-10 z-30 pointer-events-none"
    >
      <div 
        className="w-5 h-5 rounded-sm shadow-lg"
        style={{ 
          backgroundColor: chemical.color,
          boxShadow: `0 2px 6px ${chemical.color}80`
        }}
      >
        <div className="w-full h-1/3 bg-white/25 rounded-t-sm" />
      </div>
    </motion.div>
  );
}

// Add Button for Solid Materials
function AddSolidButton({
  chemical,
  onAdd,
  isDisabled
}: {
  chemical: Chemical;
  onAdd: () => void;
  isDisabled: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onAdd}
      disabled={isDisabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500/90 hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Plus size={18} />
      <span>Add {chemical.formula}</span>
    </motion.button>
  );
}

// Pour Button for Liquids (hold to pour)
function PourLiquidButton({
  chemical,
  onPourStart,
  onPourEnd,
  isDisabled,
  isPouring
}: {
  chemical: Chemical;
  onPourStart: () => void;
  onPourEnd: () => void;
  isDisabled: boolean;
  isPouring: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileTap={{ scale: 0.95 }}
      onMouseDown={onPourStart}
      onMouseUp={onPourEnd}
      onMouseLeave={onPourEnd}
      onTouchStart={onPourStart}
      onTouchEnd={onPourEnd}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold shadow-lg transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${
        isPouring 
          ? 'bg-cyan-400 text-slate-900 shadow-cyan-400/50' 
          : 'bg-cyan-500/90 hover:bg-cyan-500 text-white shadow-cyan-500/30'
      }`}
    >
      <Droplets size={18} className={isPouring ? 'animate-pulse' : ''} />
      <span>{isPouring ? 'Pouring...' : `Hold to pour ${chemical.formula}`}</span>
    </motion.button>
  );
}

export default function BeakerComponent({
  beaker,
  isSelected,
  onSelect,
  onRemove,
  onAddChemical,
  selectedChemical,
  quantity,
  workspaceSize,
  isMixing,
  isExploding = false
}: BeakerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isPouring, setIsPouring] = useState(false);
  const [showSolidDrop, setShowSolidDrop] = useState(false);

  // Performance mode for low-end devices
  const isLowPerformanceMode = useChemLabStore((state) => state.isLowPerformanceMode);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const pourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if chemical is liquid or solid
  const isLiquidChemical = selectedChemical?.state === 'liquid' ||
    (selectedChemical?.state === 'gas' && selectedChemical?.id !== 'cl2');

  const isSolidChemical = selectedChemical?.state === 'solid' ||
    selectedChemical?.type === 'metal' ||
    (selectedChemical?.type === 'metal' && selectedChemical?.state !== 'liquid');

  // Calculate layered liquid colors - sorted by density (heaviest at bottom)
  // Memoized for performance
  const liquidLayers = useMemo(() => {
    if (beaker.contents.length === 0) return [];

    // Sort by density (heaviest/most dense at bottom)
    const sortedContents = [...beaker.contents].sort((a, b) =>
      b.chemical.density - a.chemical.density
    );

    const totalQuantity = sortedContents.reduce((sum, c) => sum + c.quantity, 0);
    if (totalQuantity === 0) return [];

    const totalHeight = (beaker.fillLevel / 100) * beaker.beakerType.liquidArea.height;
    let currentY = 0;

    return sortedContents.map((content) => {
      const layerHeight = (content.quantity / totalQuantity) * totalHeight;
      const layer = {
        chemical: content.chemical,
        height: layerHeight,
        y: currentY,
        color: content.chemical.liquidColor,
        solidColor: content.chemical.color,
        quantity: content.quantity
      };
      currentY += layerHeight;
      return layer;
    });
  }, [beaker.contents, beaker.fillLevel, beaker.beakerType.liquidArea.height]);

  // Legacy function for backward compatibility
  const getLiquidColor = useCallback(() => {
    if (beaker.contents.length === 0) return 'transparent';
    const colors = beaker.contents.map(c => c.chemical.liquidColor);
    if (colors.length === 1) return colors[0];
    return colors[colors.length - 1];
  }, [beaker.contents]);

  // Handle continuous pouring for liquids
  const handlePourStart = useCallback(() => {
    if (!selectedChemical || !isLiquidChemical) return;
    
    setIsPouring(true);
    onAddChemical(selectedChemical, Math.max(1, quantity / 10));
    
    pourIntervalRef.current = setInterval(() => {
      onAddChemical(selectedChemical!, Math.max(1, quantity / 10));
    }, 100);
  }, [selectedChemical, isLiquidChemical, onAddChemical, quantity]);

  const handlePourEnd = useCallback(() => {
    setIsPouring(false);
    if (pourIntervalRef.current) {
      clearInterval(pourIntervalRef.current);
      pourIntervalRef.current = null;
    }
  }, []);

  // Handle solid drop
  const handleSolidAdd = useCallback(() => {
    if (!selectedChemical) return;
    setShowSolidDrop(true);
    onAddChemical(selectedChemical, quantity);
  }, [selectedChemical, onAddChemical, quantity]);

  const handleSolidDropComplete = useCallback(() => {
    setShowSolidDrop(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pourIntervalRef.current) {
        clearInterval(pourIntervalRef.current);
      }
    };
  }, []);

  // Long press handlers for menu
  const handleInteractionStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    isLongPress.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartPos.current = { x: clientX, y: clientY };
    
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setMenuPosition({ x: clientX, y: clientY });
      setShowMenu(true);
    }, 500);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (!isLongPress.current && !showMenu) onSelect();
  }, [onSelect, showMenu]);

  const handleInteractionMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer.current) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      if (Math.abs(clientX - touchStartPos.current.x) > 10 || Math.abs(clientY - touchStartPos.current.y) > 10) {
        clearTimeout(longPressTimer.current);
        isLongPress.current = false;
      }
    }
  }, []);

  const fillPercent = beaker.fillLevel;
  const liquidHeight = (fillPercent / 100) * beaker.beakerType.liquidArea.height;
  const { width, height } = beaker.beakerType;

  // If exploding, show explosion effect
  if (isExploding) {
    return (
      <motion.div
        className="absolute z-20"
        style={{ left: beaker.position.x, top: beaker.position.y }}
      >
        <div style={{ width, height, position: 'relative' }}>
          <GlassShatter />
        </div>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.3 }}
          onAnimationComplete={onRemove}
        />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ scale: 0, opacity: 0, x: workspaceSize.width / 2, y: workspaceSize.height / 2 }}
        animate={{ scale: 1, opacity: 1, x: beaker.position.x, y: beaker.position.y }}
        exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute cursor-pointer select-none z-10"
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onTouchMove={handleInteractionMove}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseMove={handleInteractionMove}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Main container - proper positioning context for all children */}
        <div className="relative" style={{ width, height }}>
          
          {/* Tap Dispenser - centered above container */}
          <AnimatePresence>
            {isPouring && selectedChemical && isLiquidChemical && (
              <TapDispenser chemical={selectedChemical} isPouring={isPouring} />
            )}
          </AnimatePresence>

          {/* Solid Drop Animation */}
          <AnimatePresence>
            {showSolidDrop && selectedChemical && (
              <SolidDropAnimation chemical={selectedChemical} onComplete={handleSolidDropComplete} />
            )}
          </AnimatePresence>

          {/* Glass Beaker/Container SVG */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block"
            style={{ 
              width, 
              height,
              filter: isSelected 
                ? 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))'
                : 'drop-shadow(0 10px 25px rgba(0,0,0,0.4))'
            }}
          >
            <defs>
              <linearGradient id={`glassLeft-${beaker.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
              <linearGradient id={`glassRight-${beaker.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
              <pattern id={`reflection-${beaker.id}`} patternUnits="userSpaceOnUse" width="10" height="10">
                <rect width="10" height="10" fill="transparent" />
                <rect x="0" y="0" width="2" height="100%" fill="rgba(255,255,255,0.08)" />
              </pattern>
              <clipPath id={`liquidClip-${beaker.id}`}>
                <path d={beaker.beakerType.svgPath} />
              </clipPath>
            </defs>

            {/* Glass Body */}
            <g>
              <path
                d={beaker.beakerType.svgPath}
                fill={`url(#glassLeft-${beaker.id})`}
                stroke={isSelected ? 'rgba(0, 255, 255, 0.8)' : 'rgba(180, 200, 220, 0.5)'}
                strokeWidth={isSelected ? 3 : 2}
                strokeLinecap="round"
              />
              <path
                d={beaker.beakerType.svgPath}
                fill={`url(#reflection-${beaker.id})`}
              />
              <path
                d={beaker.beakerType.svgPath}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="5,15"
              />
            </g>

            {/* Liquid - Layered by density (heaviest at bottom) */}
            {fillPercent > 0 && (() => {
              const layers = liquidLayers;
              const baseY = beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height;
              const totalLiquidHeight = (fillPercent / 100) * beaker.beakerType.liquidArea.height;

              return (
                <g clipPath={`url(#liquidClip-${beaker.id})`}>
                  {/* Render each layer from bottom to top */}
                  {layers.map((layer, index) => (
                    <g key={`${layer.chemical.id}-${index}`}>
                      {/* Layer body */}
                      <rect
                        x={beaker.beakerType.liquidArea.x}
                        y={baseY - layer.y - layer.height}
                        width={beaker.beakerType.liquidArea.width}
                        height={Math.max(1, layer.height)}
                        fill={layer.color}
                        style={{ transition: isLowPerformanceMode ? 'none' : 'height 0.3s ease-out' }}
                      />
                      {/* Layer top surface highlight */}
                      {index === layers.length - 1 && (
                        <ellipse
                          cx={beaker.beakerType.liquidArea.x + beaker.beakerType.liquidArea.width / 2}
                          cy={baseY - totalLiquidHeight + 3}
                          rx={beaker.beakerType.liquidArea.width / 2 - 1}
                          ry="4"
                          fill={layer.color}
                          opacity="0.9"
                        />
                      )}
                      {/* Layer divider line (subtle) */}
                      {index > 0 && layer.height > 2 && (
                        <line
                          x1={beaker.beakerType.liquidArea.x + 2}
                          y1={baseY - layer.y}
                          x2={beaker.beakerType.liquidArea.x + beaker.beakerType.liquidArea.width - 2}
                          y2={baseY - layer.y}
                          stroke="rgba(255,255,255,0.15)"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  ))}

                  {/* Top surface shine */}
                  {layers.length > 0 && !isMixing && !isLowPerformanceMode && (
                    <ellipse
                      cx={beaker.beakerType.liquidArea.x + beaker.beakerType.liquidArea.width / 2}
                      cy={baseY - totalLiquidHeight + 3}
                      rx={beaker.beakerType.liquidArea.width / 2 - 2}
                      ry="2"
                      fill="rgba(255,255,255,0.25)"
                    />
                  )}

                  {/* Mixing bubbles */}
                  {isMixing && [...Array(3)].map((_, i) => (
                    <circle
                      key={i}
                      cx={beaker.beakerType.liquidArea.x + 15 + i * 20}
                      r={2}
                      fill="rgba(255,255,255,0.5)"
                      opacity="0.6"
                    />
                  ))}
                </g>
              );
            })()}

            {/* Glass shine */}
            <path
              d={`M${beaker.beakerType.liquidArea.x + 5},10 Q${beaker.beakerType.liquidArea.x + 5},${height/2} ${beaker.beakerType.liquidArea.x + 3},${height - 10}`}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={`M${width - 15},15 L${width - 15},${height - 15}`}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Measurement marks */}
            <g stroke="rgba(0,255,255,0.3)" strokeWidth="1" fontSize="7" fill="rgba(0,255,255,0.5)">
              {[25, 50, 75].map((mark) => {
                const y = beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - (mark / 100) * beaker.beakerType.liquidArea.height;
                return (
                  <g key={mark}>
                    <line x1="5" y1={y} x2="15" y2={y} />
                    <text x="3" y={y + 3} textAnchor="end" fontSize="6">{Math.round(mark * beaker.beakerType.capacity / 100)}</text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Label */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
            <span className="text-[10px] text-cyan-400/80 font-medium">{beaker.beakerType.name}</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons - Fixed position */}
      <AnimatePresence>
        {selectedChemical && isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
          >
            {isLiquidChemical ? (
              <PourLiquidButton
                chemical={selectedChemical}
                onPourStart={handlePourStart}
                onPourEnd={handlePourEnd}
                isDisabled={isMixing}
                isPouring={isPouring}
              />
            ) : (
              <AddSolidButton
                chemical={selectedChemical}
                onAdd={handleSolidAdd}
                isDisabled={isMixing}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <FloatingMenu
              position={menuPosition}
              onClose={() => setShowMenu(false)}
              onInfo={() => setShowInfo(true)}
              onRemove={onRemove}
              hasChemical={!!selectedChemical}
            />
          </>
        )}
      </AnimatePresence>

      {/* Info Popup */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowInfo(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-72 p-4 rounded-2xl bg-slate-800/95 border border-cyan-500/30 backdrop-blur-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-cyan-400 font-bold">{beaker.beakerType.name}</h4>
                  <p className="text-xs text-slate-400 capitalize">{beaker.beakerType.type}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Capacity:</span>
                  <span className="text-cyan-400 font-mono">{beaker.beakerType.capacity} mL</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Fill Level:</span>
                  <span className="text-cyan-400 font-mono">{Math.round(fillPercent)}%</span>
                </div>
              </div>
              {beaker.contents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <p className="text-xs text-cyan-400 mb-2">Contents:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {beaker.contents.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 flex items-center gap-1">
                          <span>{c.chemical.icon}</span>
                          {c.chemical.formula}
                        </span>
                        <span className="text-slate-400 font-mono">{Math.round(c.quantity)} mL</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => setShowInfo(false)} className="mt-4 w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-400 font-medium hover:bg-cyan-500/30 transition-colors touch-manipulation">Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
