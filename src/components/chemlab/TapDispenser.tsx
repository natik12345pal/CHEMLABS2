'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chemical } from '@/data/chemicals';
import { WorkspaceBeaker } from '@/store/chemlab-store';

interface TapDispenserProps {
  selectedBeaker: WorkspaceBeaker | null;
  selectedChemical: Chemical | null;
  isMixing: boolean;
  isPouring: boolean;
}

export default function TapDispenser({
  selectedBeaker,
  selectedChemical,
  isMixing,
  isPouring
}: TapDispenserProps) {
  // Check if the selected chemical can flow (liquid or gas)
  const canPour = useMemo(() => {
    if (!selectedChemical) return false;
    return selectedChemical.state === 'liquid' || selectedChemical.state === 'gas';
  }, [selectedChemical]);

  // Calculate tap position above the beaker
  const tapPosition = useMemo(() => {
    if (!selectedBeaker) {
      return null;
    }
    // Position tap centered above the beaker
    const beakerCenterX = selectedBeaker.position.x + selectedBeaker.beakerType.width / 2;
    const beakerTop = selectedBeaker.position.y;
    return {
      x: beakerCenterX,
      y: Math.max(10, beakerTop - 70) // 70px above beaker top
    };
  }, [selectedBeaker]);

  // Get chemical color for the stream
  const streamColor = useMemo(() => {
    if (!selectedChemical) return 'rgba(135, 206, 235, 0.6)';
    return selectedChemical.liquidColor || selectedChemical.color;
  }, [selectedChemical]);

  // Don't render if no beaker, no chemical, or chemical can't flow
  if (!selectedBeaker || !selectedChemical || !canPour || isMixing) {
    return null;
  }

  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: tapPosition?.x ? tapPosition.x - 40 : 0,
        top: tapPosition?.y || 10
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      {/* Tap/Faucet SVG */}
      <svg width="80" height="60" viewBox="0 0 80 60" className="drop-shadow-lg">
        {/* Pipe connection at top */}
        <rect x="35" y="0" width="10" height="12" fill="#4a5568" rx="2" />
        
        {/* Main faucet body */}
        <rect x="25" y="8" width="30" height="28" fill="#718096" rx="4" />
        <rect x="28" y="11" width="24" height="22" fill="#4a5568" rx="3" />
        
        {/* Inner detail */}
        <rect x="31" y="14" width="18" height="16" fill="#2d3748" rx="2" />
        
        {/* Spout */}
        <path d="M 35 36 L 35 48 L 40 56 L 45 48 L 45 36 Z" fill="#718096" />
        <ellipse cx="40" cy="36" rx="5" ry="3" fill="#4a5568" />
        <ellipse cx="40" cy="39" rx="4" ry="2" fill="#2d3748" />
        
        {/* Handle */}
        <motion.g
          animate={isPouring ? { rotate: [0, -30, 0] } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: '58px 20px' }}
        >
          <rect x="50" y="16" width="18" height="8" fill="#a0aec0" rx="4" />
          <circle cx="65" cy="20" r="5" fill="#cbd5e0" />
          <circle cx="65" cy="20" r="3" fill="#a0aec0" />
        </motion.g>
        
        {/* Chemical stream */}
        <AnimatePresence>
          {isPouring && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Main stream */}
              <motion.rect
                x="38"
                y="52"
                width="4"
                height="15"
                fill={streamColor}
                rx="2"
                animate={{
                  opacity: [0.6, 0.9, 0.6],
                  height: [15, 25, 15]
                }}
                transition={{ duration: 0.15, repeat: Infinity }}
              />
              {/* Droplets */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={39 + (i % 2) * 2}
                  r={1.5 + (i % 2)}
                  fill={streamColor}
                  initial={{ cy: 55, opacity: 0.8 }}
                  animate={{ 
                    cy: [55, 80, 110],
                    opacity: [0.8, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 0.4, 
                    repeat: Infinity, 
                    delay: i * 0.08,
                    ease: 'linear'
                  }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>
        
        {/* Highlights */}
        <rect x="26" y="10" width="10" height="2" fill="rgba(255,255,255,0.2)" rx="1" />
      </svg>
      
      {/* Chemical label */}
      <motion.div 
        className="text-center mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span 
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ 
            backgroundColor: selectedChemical.color + '40',
            color: selectedChemical.color
          }}
        >
          {selectedChemical.formula}
        </span>
      </motion.div>
    </motion.div>
  );
}
