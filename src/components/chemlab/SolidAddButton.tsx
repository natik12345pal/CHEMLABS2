'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chemical } from '@/data/chemicals';
import { WorkspaceBeaker } from '@/store/chemlab-store';
import { Plus, Beaker } from 'lucide-react';

interface SolidAddButtonProps {
  selectedBeaker: WorkspaceBeaker | null;
  selectedChemical: Chemical | null;
  onAddChemical: (beakerId: string, chemical: Chemical, quantity: number) => void;
  isMixing: boolean;
  quantity: number;
}

export default function SolidAddButton({
  selectedBeaker,
  selectedChemical,
  onAddChemical,
  isMixing,
  quantity
}: SolidAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Check if the selected chemical is a solid
  const isSolid = selectedChemical?.state === 'solid';

  // Calculate position above beaker
  const buttonPosition = selectedBeaker ? {
    x: selectedBeaker.position.x + selectedBeaker.beakerType.width / 2,
    y: Math.max(60, selectedBeaker.position.y - 50)
  } : null;

  const handleAddSolid = useCallback(() => {
    if (!selectedBeaker || !selectedChemical || isMixing || !isSolid) return;

    setIsAdding(true);
    onAddChemical(selectedBeaker.id, selectedChemical, quantity);

    // Brief animation
    setTimeout(() => setIsAdding(false), 300);
  }, [selectedBeaker, selectedChemical, isMixing, isSolid, quantity, onAddChemical]);

  // Don't render if no beaker, no chemical, or chemical can flow
  if (!selectedBeaker || !selectedChemical || !isSolid) {
    return null;
  }

  return (
    <motion.div
      className="absolute z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: buttonPosition?.x ? buttonPosition.x - 60 : 0,
        top: buttonPosition?.y || 60
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <motion.button
        onClick={handleAddSolid}
        disabled={isMixing || isAdding}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all touch-manipulation select-none ${
          isAdding
            ? 'bg-emerald-400 text-slate-900 scale-95'
            : 'bg-emerald-500/90 hover:bg-emerald-500 text-white shadow-emerald-500/30'
        }`}
        style={{
          WebkitTouchCallout: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}
        whileTap={{ scale: 0.95 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Plus size={20} className={isAdding ? 'animate-spin' : ''} />
        <div className="flex flex-col items-start">
          <span className="text-sm">Add {selectedChemical.formula}</span>
          <span className="text-xs opacity-80">{quantity} mL solid</span>
        </div>
      </motion.button>
      
      {/* Solid indicator */}
      <div className="text-center mt-2">
        <motion.div 
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
          style={{ 
            backgroundColor: selectedChemical.color + '40',
            color: selectedChemical.color
          }}
        >
          <Beaker size={12} />
          <span>Solid particles</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
