'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceBeaker } from '@/store/chemlab-store';
import { Chemical } from '@/data/chemicals';
import { Trash2, Info, Droplets, X, Beaker } from 'lucide-react';

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
}

// Floating mini-menu for hold interactions
function FloatingMenu({ 
  position, 
  onClose, 
  onInfo, 
  onRemove,
  onAddChemical,
  hasChemical 
}: { 
  position: { x: number; y: number };
  onClose: () => void;
  onInfo: () => void;
  onRemove: () => void;
  onAddChemical?: () => void;
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
        {/* Add Chemical Button */}
        {hasChemical && onAddChemical && (
          <button
            onClick={() => { onAddChemical(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/20 text-emerald-400 transition-colors touch-manipulation"
          >
            <Droplets size={20} />
            <span className="font-medium">Add Chemical</span>
          </button>
        )}
        
        {/* Info Button */}
        <button
          onClick={() => { onInfo(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/20 text-cyan-400 transition-colors touch-manipulation"
        >
          <Info size={20} />
          <span className="font-medium">Info</span>
        </button>
        
        {/* Remove Button */}
        <button
          onClick={() => { onRemove(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400 transition-colors touch-manipulation"
        >
          <Trash2 size={20} />
          <span className="font-medium">Remove</span>
        </button>
        
        {/* Close Button */}
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

export default function BeakerComponent({
  beaker,
  isSelected,
  onSelect,
  onRemove,
  onAddChemical,
  selectedChemical,
  quantity,
  workspaceSize,
  isMixing
}: BeakerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [liquidWave, setLiquidWave] = useState(0);
  
  // Long press detection
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Animate liquid wave effect
  useEffect(() => {
    if (beaker.fillLevel > 0 && !isMixing) {
      const interval = setInterval(() => {
        setLiquidWave(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [beaker.fillLevel, isMixing]);

  // Handle touch/mouse start
  const handleInteractionStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    isLongPress.current = false;
    
    // Get position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartPos.current = { x: clientX, y: clientY };
    
    // Start long press timer (500ms)
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      // Show floating menu
      setMenuPosition({ x: clientX, y: clientY });
      setShowMenu(true);
    }, 500);
  }, []);

  // Handle touch/mouse end
  const handleInteractionEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // If it wasn't a long press, select the beaker
    if (!isLongPress.current && !showMenu) {
      onSelect();
    }
  }, [onSelect, showMenu]);

  // Handle touch move (cancel long press if moved)
  const handleInteractionMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer.current) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = Math.abs(clientX - touchStartPos.current.x);
      const deltaY = Math.abs(clientY - touchStartPos.current.y);
      
      // Cancel long press if moved more than 10px
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer.current);
        isLongPress.current = false;
      }
    }
  }, []);

  // Calculate liquid color based on contents
  const getLiquidColor = () => {
    if (beaker.contents.length === 0) return 'transparent';
    const colors = beaker.contents.map(c => c.chemical.liquidColor);
    if (colors.length === 1) return colors[0];
    return colors[colors.length - 1];
  };

  const fillPercent = beaker.fillLevel;
  const liquidHeight = (fillPercent / 100) * beaker.beakerType.liquidArea.height;

  const { width, height } = beaker.beakerType;

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ scale: 0, opacity: 0, x: workspaceSize.width / 2, y: workspaceSize.height / 2 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: beaker.position.x,
          y: beaker.position.y
        }}
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
        {/* Beaker SVG - Clean, no extra borders */}
        <div 
          className="relative"
          style={{ width, height }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            style={{ 
              filter: isSelected 
                ? 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.5))'
                : 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
            }}
          >
            <defs>
              {/* Glass Gradient */}
              <linearGradient id={`glassGradient-${beaker.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.03)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>

              {/* Liquid Gradient */}
              <linearGradient id={`liquidGradient-${beaker.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={getLiquidColor()} stopOpacity="0.9" />
                <stop offset="100%" stopColor={getLiquidColor()} stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Glass Container - Clean */}
            <path
              d={beaker.beakerType.svgPath}
              fill={`url(#glassGradient-${beaker.id})`}
              stroke={isSelected ? 'rgba(0, 255, 255, 0.7)' : 'rgba(200, 220, 255, 0.4)'}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            
            {/* Liquid */}
            {fillPercent > 0 && (
              <motion.g>
                <motion.rect
                  x={beaker.beakerType.liquidArea.x}
                  y={beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - liquidHeight}
                  width={beaker.beakerType.liquidArea.width}
                  height={liquidHeight}
                  fill={`url(#liquidGradient-${beaker.id})`}
                  rx="2"
                  initial={{ height: 0 }}
                  animate={{ height: liquidHeight }}
                  transition={{ duration: 0.5 }}
                />

                {/* Liquid Surface Wave */}
                {!isMixing && (
                  <motion.ellipse
                    cx={beaker.beakerType.liquidArea.x + beaker.beakerType.liquidArea.width / 2}
                    cy={beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - liquidHeight + 2}
                    rx={beaker.beakerType.liquidArea.width / 2 - 2}
                    ry="3"
                    fill={getLiquidColor()}
                    animate={{
                      rx: [
                        beaker.beakerType.liquidArea.width / 2 - 2,
                        beaker.beakerType.liquidArea.width / 2 - 4,
                        beaker.beakerType.liquidArea.width / 2 - 2
                      ],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Mixing Animation */}
                {isMixing && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.circle
                        key={i}
                        cx={beaker.beakerType.liquidArea.x + 10 + (i * (beaker.beakerType.liquidArea.width - 20) / 5)}
                        r={2 + Math.random() * 2}
                        fill="rgba(255, 255, 255, 0.6)"
                        initial={{ cy: beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - liquidHeight + 5 }}
                        animate={{
                          cy: [
                            beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - liquidHeight + 5,
                            beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - 10,
                            beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - liquidHeight + 5
                          ]
                        }}
                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </>
                )}
              </motion.g>
            )}

            {/* Glass Shine */}
            <path
              d={beaker.beakerType.svgPath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="3 10"
            />

            {/* Measurement Marks */}
            <g fill="rgba(0, 255, 255, 0.4)" fontSize="6">
              {[25, 50, 75].map((mark) => {
                if (mark > (beaker.beakerType.capacity / 100) * 100) return null;
                const y = beaker.beakerType.liquidArea.y + beaker.beakerType.liquidArea.height - (mark / 100) * beaker.beakerType.liquidArea.height;
                return (
                  <g key={mark}>
                    <line
                      x1={beaker.beakerType.liquidArea.x}
                      y1={y}
                      x2={beaker.beakerType.liquidArea.x + 5}
                      y2={y}
                      stroke="rgba(0, 255, 255, 0.25)"
                      strokeWidth="1"
                    />
                    <text
                      x={beaker.beakerType.liquidArea.x - 2}
                      y={y + 2}
                      textAnchor="end"
                      fontSize="5"
                      fill="rgba(0, 255, 255, 0.4)"
                    >
                      {Math.round(mark * beaker.beakerType.capacity / 100)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Simple Label */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
          <span className="text-[10px] text-cyan-400/80 font-medium">
            {beaker.beakerType.name}
          </span>
        </div>
      </motion.div>

      {/* Floating Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            
            {/* Menu */}
            <FloatingMenu
              position={menuPosition}
              onClose={() => setShowMenu(false)}
              onInfo={() => setShowInfo(true)}
              onRemove={onRemove}
              onAddChemical={selectedChemical ? () => onAddChemical(selectedChemical, quantity) : undefined}
              hasChemical={!!selectedChemical}
            />
          </>
        )}
      </AnimatePresence>

      {/* Info Popup */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowInfo(false)}
            />
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
              
              <button
                onClick={() => setShowInfo(false)}
                className="mt-4 w-full py-2 rounded-lg bg-cyan-500/20 text-cyan-400 font-medium hover:bg-cyan-500/30 transition-colors touch-manipulation"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
