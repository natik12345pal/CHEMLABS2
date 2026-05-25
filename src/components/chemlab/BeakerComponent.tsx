'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
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
  mixProgress?: number;
  reactionColor?: string;
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
        {hasChemical && onAddChemical && (
          <button
            onClick={() => { onAddChemical(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-500/20 text-emerald-400 transition-colors touch-manipulation"
          >
            <Droplets size={20} />
            <span className="font-medium">Add Chemical</span>
          </button>
        )}
        
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
  mixProgress = 0,
  reactionColor
}: BeakerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [bubblePositions, setBubblePositions] = useState<number[]>([]);
  
  // Long press detection
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // Generate bubbles during mixing
  useEffect(() => {
    if (isMixing) {
      const interval = setInterval(() => {
        setBubblePositions(prev => {
          const newPositions = [...prev, Math.random() * 100];
          return newPositions.slice(-15); // Limit bubbles for performance
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setBubblePositions([]);
    }
  }, [isMixing]);

  // Handle touch/mouse start
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

  // Handle touch/mouse end
  const handleInteractionEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    if (!isLongPress.current && !showMenu) {
      onSelect();
    }
  }, [onSelect, showMenu]);

  // Handle touch move
  const handleInteractionMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (longPressTimer.current) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = Math.abs(clientX - touchStartPos.current.x);
      const deltaY = Math.abs(clientY - touchStartPos.current.y);
      
      if (deltaX > 10 || deltaY > 10) {
        clearTimeout(longPressTimer.current);
        isLongPress.current = false;
      }
    }
  }, []);

  // Separate contents into liquids and solids
  const { liquids, solids } = useMemo(() => {
    const liquids = beaker.contents.filter(c => c.chemical.state === 'liquid' || (c.chemical.state === 'gas' && c.chemical.id !== 'cl2'));
    const solids = beaker.contents.filter(c => c.chemical.state === 'solid');
    return { liquids, solids };
  }, [beaker.contents]);

  // Calculate volumes
  const totalLiquidVolume = useMemo(() => liquids.reduce((sum, c) => sum + c.quantity, 0), [liquids]);
  const totalSolidVolume = useMemo(() => solids.reduce((sum, c) => sum + c.quantity, 0), [solids]);

  const { width, height, liquidArea, capacity } = beaker.beakerType;
  const liquidHeight = (totalLiquidVolume / capacity) * liquidArea.height;
  const solidHeight = Math.min(20, (totalSolidVolume / capacity) * liquidArea.height * 2);

  // Sort liquids by density
  const sortedLiquids = useMemo(() => [...liquids].sort((a, b) => b.chemical.density - a.chemical.density), [liquids]);

  // Helper function to extract rgba from linear-gradient or use as-is
  const extractRgbaColor = (colorStr: string): { r: number; g: number; b: number; a: number } | null => {
    // Try to match direct rgba first
    const rgbaMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]),
        g: parseInt(rgbaMatch[2]),
        b: parseInt(rgbaMatch[3]),
        a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
      };
    }
    
    // Try to extract from linear-gradient (get all colors)
    const gradientColors = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g);
    if (gradientColors && gradientColors.length > 0) {
      // Use the middle/average color
      const midIndex = Math.floor(gradientColors.length / 2);
      const match = gradientColors[midIndex].match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
          a: parseFloat(match[4])
        };
      }
    }
    
    // Fallback: try to find any rgba in the string
    const anyRgba = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (anyRgba) {
      return {
        r: parseInt(anyRgba[1]),
        g: parseInt(anyRgba[2]),
        b: parseInt(anyRgba[3]),
        a: anyRgba[4] ? parseFloat(anyRgba[4]) : 1
      };
    }
    
    return null;
  };

  // Get solid color for SVG fill (SVG doesn't support CSS gradients in fill)
  const getSolidColor = (colorStr: string): string => {
    const rgba = extractRgbaColor(colorStr);
    if (rgba) {
      return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    }
    return 'rgba(200, 230, 240, 0.5)';
  };

  // Get gradient colors for SVG gradient definition
  const getGradientColors = (colorStr: string): { top: string; mid: string; bottom: string } => {
    const colors = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g);
    if (colors && colors.length >= 3) {
      return { top: colors[0], mid: colors[1], bottom: colors[2] };
    }
    if (colors && colors.length === 2) {
      return { top: colors[0], mid: colors[0], bottom: colors[1] };
    }
    if (colors && colors.length === 1) {
      return { top: colors[0], mid: colors[0], bottom: colors[0] };
    }
    const solid = getSolidColor(colorStr);
    return { top: solid, mid: solid, bottom: solid };
  };

  // Calculate blended color during mixing
  const blendedColor = useMemo(() => {
    if (liquids.length === 0) return null;
    if (reactionColor) return reactionColor;
    
    // Single chemical - extract solid color for SVG
    if (liquids.length === 1) return getSolidColor(liquids[0].chemical.liquidColor);
    
    // For mixing, blend colors using extracted rgba values
    let r = 0, g = 0, b = 0, a = 0;
    let validColors = 0;
    
    liquids.forEach(content => {
      const color = content.chemical.liquidColor;
      const rgba = extractRgbaColor(color);
      if (rgba) {
        r += rgba.r * content.quantity;
        g += rgba.g * content.quantity;
        b += rgba.b * content.quantity;
        a += rgba.a * content.quantity;
        validColors++;
      }
    });
    
    if (validColors === 0) return 'rgba(200, 230, 240, 0.5)';
    
    const total = totalLiquidVolume;
    return `rgba(${Math.round(r/total)}, ${Math.round(g/total)}, ${Math.round(b/total)}, ${(a/total).toFixed(2)})`;
  }, [liquids, totalLiquidVolume, reactionColor]);

  // Get gradient colors for single liquid (for more realistic look)
  const liquidGradientColors = useMemo(() => {
    if (liquids.length === 1 && !reactionColor) {
      return getGradientColors(liquids[0].chemical.liquidColor);
    }
    return null;
  }, [liquids, reactionColor]);

  const fillPercent = beaker.fillLevel;

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
        {/* Realistic 3D Beaker */}
        <div 
          className="relative"
          style={{ width, height }}
        >
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            style={{ 
              filter: isSelected 
                ? 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.6)) drop-shadow(0 8px 32px rgba(0,0,0,0.3))'
                : 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))'
            }}
          >
            <defs>
              {/* Realistic Glass Gradient */}
              <linearGradient id={`glassGradient-${beaker.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="15%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="85%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
              </linearGradient>
              
              {/* Glass Edge Highlight */}
              <linearGradient id={`glassEdge-${beaker.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
              </linearGradient>

              {/* Dynamic Liquid Color Gradient - for single liquids with realistic depth */}
              {liquidGradientColors && (
                <linearGradient id={`chemGradient-${beaker.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={liquidGradientColors.top} />
                  <stop offset="50%" stopColor={liquidGradientColors.mid} />
                  <stop offset="100%" stopColor={liquidGradientColors.bottom} />
                </linearGradient>
              )}

              {/* Liquid Gradient for depth overlay */}
              <linearGradient id={`liquidGradient-${beaker.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
              </linearGradient>

              {/* Water surface reflection */}
              <linearGradient id={`waterSurface-${beaker.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              
              {/* Clip path for liquid */}
              <clipPath id={`liquidClip-${beaker.id}`}>
                <rect 
                  x={liquidArea.x} 
                  y={liquidArea.y} 
                  width={liquidArea.width} 
                  height={liquidArea.height} 
                />
              </clipPath>
            </defs>

            {/* Glass Container - Main body */}
            <path
              d={beaker.beakerType.svgPath}
              fill={`url(#glassGradient-${beaker.id})`}
              stroke={`url(#glassEdge-${beaker.id})`}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            
            {/* Solids - Render at bottom as particles */}
            {solids.length > 0 && (
              <g>
                <rect
                  x={liquidArea.x + 2}
                  y={liquidArea.y + liquidArea.height - solidHeight}
                  width={liquidArea.width - 4}
                  height={solidHeight}
                  fill="rgba(180, 180, 180, 0.4)"
                  rx="2"
                />
                {solids.map((solid, solidIndex) => {
                  const particleCount = Math.min(12, Math.ceil(solid.quantity / 5));
                  return Array.from({ length: particleCount }, (_, pIndex) => (
                    <motion.circle
                      key={`${solidIndex}-${pIndex}`}
                      cx={liquidArea.x + 5 + (pIndex % 4) * ((liquidArea.width - 10) / 4) + Math.random() * 5}
                      cy={liquidArea.y + liquidArea.height - solidHeight / 2 - Math.random() * (solidHeight / 2)}
                      r={2 + Math.random() * 2}
                      fill={solid.chemical.color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      transition={{ duration: 0.5, delay: pIndex * 0.05 }}
                    />
                  ));
                })}
              </g>
            )}
            
            {/* Liquids - Realistic rendering with depth */}
            {liquids.length > 0 && (
              <g clipPath={`url(#liquidClip-${beaker.id})`}>
                {/* Main liquid body - use gradient for single liquid, solid for mixed */}
                <motion.rect
                  x={liquidArea.x}
                  y={liquidArea.y + liquidArea.height - liquidHeight}
                  width={liquidArea.width}
                  height={liquidHeight}
                  fill={liquidGradientColors 
                    ? `url(#chemGradient-${beaker.id})` 
                    : (blendedColor || 'rgba(200, 230, 240, 0.5)')}
                  initial={{ height: 0, y: liquidArea.y + liquidArea.height }}
                  animate={{ 
                    height: liquidHeight, 
                    y: liquidArea.y + liquidArea.height - liquidHeight,
                  }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Liquid depth overlay */}
                <motion.rect
                  x={liquidArea.x}
                  y={liquidArea.y + liquidArea.height - liquidHeight}
                  width={liquidArea.width}
                  height={liquidHeight}
                  fill={`url(#liquidGradient-${beaker.id})`}
                  initial={{ height: 0 }}
                  animate={{ height: liquidHeight }}
                  transition={{ duration: 0.5 }}
                />

                {/* Water surface - natural shimmer */}
                {liquidHeight > 5 && (
                  <motion.ellipse
                    cx={liquidArea.x + liquidArea.width / 2}
                    cy={liquidArea.y + liquidArea.height - liquidHeight + 2}
                    rx={liquidArea.width / 2 - 3}
                    ry="4"
                    fill={`url(#waterSurface-${beaker.id})`}
                    animate={{
                      rx: [liquidArea.width / 2 - 3, liquidArea.width / 2 - 5, liquidArea.width / 2 - 3],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Mixing bubbles */}
                {isMixing && bubblePositions.map((pos, i) => (
                  <motion.circle
                    key={`bubble-${i}`}
                    cx={liquidArea.x + 10 + (pos % 80)}
                    cy={liquidArea.y + liquidArea.height - liquidHeight + 10 + (pos % 30)}
                    r={2 + Math.random() * 3}
                    fill="rgba(255, 255, 255, 0.6)"
                    initial={{ 
                      cy: liquidArea.y + liquidArea.height - 5,
                      opacity: 0.8 
                    }}
                    animate={{ 
                      cy: liquidArea.y + liquidArea.height - liquidHeight + 5,
                      opacity: 0 
                    }}
                    transition={{ duration: 0.8 + Math.random() * 0.4 }}
                  />
                ))}

                {/* Mixing swirl effect */}
                {isMixing && (
                  <g>
                    {[...Array(5)].map((_, i) => (
                      <motion.ellipse
                        key={`swirl-${i}`}
                        cx={liquidArea.x + liquidArea.width / 2}
                        cy={liquidArea.y + liquidArea.height - liquidHeight / 2}
                        rx={liquidArea.width / 3}
                        ry={liquidHeight / 4}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1.5"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: 'linear',
                          delay: i * 0.2 
                        }}
                        style={{ transformOrigin: 'center' }}
                      />
                    ))}
                  </g>
                )}
              </g>
            )}

            {/* Glass Shine - Left side */}
            <path
              d={`M ${liquidArea.x + 3} ${liquidArea.y + 10} L ${liquidArea.x + 6} ${liquidArea.y + liquidArea.height - 10}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Glass Shine - Right side subtle */}
            <path
              d={`M ${liquidArea.x + liquidArea.width - 5} ${liquidArea.y + 20} L ${liquidArea.x + liquidArea.width - 8} ${liquidArea.y + liquidArea.height - 20}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Measurement Marks */}
            <g fill="rgba(0, 200, 200, 0.5)" fontSize="6">
              {[25, 50, 75].map((mark) => {
                if (mark > (capacity / 100) * 100) return null;
                const y = liquidArea.y + liquidArea.height - (mark / 100) * liquidArea.height;
                return (
                  <g key={mark}>
                    <line
                      x1={liquidArea.x}
                      y1={y}
                      x2={liquidArea.x + 8}
                      y2={y}
                      stroke="rgba(0, 200, 200, 0.35)"
                      strokeWidth="1"
                    />
                    <text
                      x={liquidArea.x - 3}
                      y={y + 2}
                      textAnchor="end"
                      fontSize="5"
                      fill="rgba(0, 200, 200, 0.5)"
                    >
                      {Math.round(mark * capacity / 100)}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Label */}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            
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
                  <span className="text-cyan-400 font-mono">{capacity} mL</span>
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
