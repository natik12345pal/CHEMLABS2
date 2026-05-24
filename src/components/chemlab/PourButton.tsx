'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chemical } from '@/data/chemicals';
import { WorkspaceBeaker } from '@/store/chemlab-store';
import { Droplets, Plus, Beaker } from 'lucide-react';

interface PourButtonProps {
  selectedBeaker: WorkspaceBeaker | null;
  selectedChemical: Chemical | null;
  onAddChemical: (beakerId: string, chemical: Chemical, quantity: number) => void;
  isMixing: boolean;
  quantity: number;
  onPouringChange?: (isPouring: boolean) => void;
}

export default function PourButton({
  selectedBeaker,
  selectedChemical,
  onAddChemical,
  isMixing,
  quantity,
  onPouringChange
}: PourButtonProps) {
  const [isPouring, setIsPouring] = useState(false);
  const [pourAmount, setPourAmount] = useState(0);
  const pourIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pourAccumulatorRef = useRef(0);
  const isPouringRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Determine if chemical is liquid/gas or solid
  const isLiquid = selectedChemical?.state === 'liquid' || selectedChemical?.state === 'gas';
  const isSolid = selectedChemical?.state === 'solid';

  // Sync ref with state and notify parent
  useEffect(() => {
    isPouringRef.current = isPouring;
    onPouringChange?.(isPouring);
  }, [isPouring, onPouringChange]);

  // Stop pouring function
  const stopPouring = useCallback(() => {
    isPouringRef.current = false;
    setIsPouring(false);
    setPourAmount(0);
    pourAccumulatorRef.current = 0;

    if (pourIntervalRef.current) {
      clearInterval(pourIntervalRef.current);
      pourIntervalRef.current = null;
    }
  }, []);

  // Start pouring function for liquids
  const startPouring = useCallback(() => {
    if (!selectedBeaker || !selectedChemical || isMixing || isPouringRef.current || !isLiquid) return;

    isPouringRef.current = true;
    setIsPouring(true);
    pourAccumulatorRef.current = 0;

    const pourRate = quantity / 20; // Smaller increments for smooth pouring

    // Add initial amount
    onAddChemical(selectedBeaker.id, selectedChemical, pourRate);
    pourAccumulatorRef.current += pourRate;
    setPourAmount(pourAccumulatorRef.current);

    // Continue pouring at intervals
    pourIntervalRef.current = setInterval(() => {
      if (!isPouringRef.current || pourAccumulatorRef.current >= quantity) {
        if (pourIntervalRef.current) {
          clearInterval(pourIntervalRef.current);
          pourIntervalRef.current = null;
        }
        isPouringRef.current = false;
        setIsPouring(false);
        setPourAmount(0);
        pourAccumulatorRef.current = 0;
        return;
      }

      onAddChemical(selectedBeaker.id, selectedChemical, pourRate);
      pourAccumulatorRef.current += pourRate;
      setPourAmount(Math.min(pourAccumulatorRef.current, quantity));
    }, 80);
  }, [selectedBeaker, selectedChemical, quantity, isMixing, isLiquid, onAddChemical]);

  // Add solid (one-time add)
  const addSolid = useCallback(() => {
    if (!selectedBeaker || !selectedChemical || isMixing || !isSolid) return;
    onAddChemical(selectedBeaker.id, selectedChemical, quantity);
  }, [selectedBeaker, selectedChemical, quantity, isMixing, isSolid, onAddChemical]);

  // Handle pointer events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture pointer to ensure we get the up event
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    
    if (isLiquid) {
      startPouring();
    } else if (isSolid) {
      addSolid();
    }
  }, [isLiquid, isSolid, startPouring, addSolid]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Release pointer capture
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (isLiquid) {
      stopPouring();
    }
  }, [isLiquid, stopPouring]);

  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    // Stop pouring if pointer is cancelled (e.g., context menu)
    if (isLiquid && isPouringRef.current) {
      stopPouring();
    }
  }, [isLiquid, stopPouring]);

  // Prevent context menu with multiple methods
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // Additional touch handling for smart boards
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Prevent default touch behaviors that might trigger context menu
    // But don't prevent the event itself so pointer events work
  }, []);

  // Handle lost pointer capture (for smart boards)
  const handleLostPointerCapture = useCallback((e: React.PointerEvent) => {
    if (isLiquid && isPouringRef.current) {
      stopPouring();
    }
  }, [isLiquid, stopPouring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPouringRef.current = false;
      if (pourIntervalRef.current) {
        clearInterval(pourIntervalRef.current);
      }
    };
  }, []);

  // Stop pouring when conditions change
  useEffect(() => {
    if ((isMixing || !selectedBeaker || !selectedChemical) && isPouringRef.current) {
      isPouringRef.current = false;
      if (pourIntervalRef.current) {
        clearInterval(pourIntervalRef.current);
        pourIntervalRef.current = null;
      }
      const timer = setTimeout(() => {
        setIsPouring(false);
        setPourAmount(0);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isMixing, selectedBeaker, selectedChemical]);

  // Don't render if no beaker or chemical selected
  if (!selectedBeaker || !selectedChemical) {
    return null;
  }

  // Get chemical color for styling
  const chemicalColor = selectedChemical.liquidColor || selectedChemical.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30"
    >
      <motion.button
        ref={buttonRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        disabled={isMixing}
        className={`relative flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all touch-manipulation select-none disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
          isPouring
            ? 'bg-cyan-400 text-slate-900 scale-105 border-cyan-300 shadow-cyan-400/40'
            : isSolid
              ? 'bg-emerald-500/90 text-white hover:bg-emerald-400 border-emerald-400/50 shadow-emerald-500/20'
              : 'bg-cyan-500/90 text-white hover:bg-cyan-400 border-cyan-400/50 shadow-cyan-500/20'
        }`}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Shimmer effect when pouring */}
        {isPouring && (
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* Icon */}
        {isLiquid ? (
          <Droplets className={`w-6 h-6 ${isPouring ? 'animate-pulse' : ''}`} />
        ) : (
          <Plus className="w-6 h-6" />
        )}

        {/* Text content */}
        <div className="flex flex-col items-start">
          <span className="font-bold">
            {isPouring ? 'Pouring...' : isSolid ? 'Add Solid' : 'Hold to Pour'}
          </span>
          <span className="text-xs opacity-80 font-normal">
            {selectedChemical.formula} • {isPouring ? `${Math.round(pourAmount)}/${quantity}` : quantity} mL
          </span>
        </div>

        {/* Chemical color indicator */}
        <div 
          className="w-4 h-4 rounded-full border-2 border-white/50"
          style={{ backgroundColor: chemicalColor }}
        />
      </motion.button>

      {/* Chemical type indicator */}
      <div className="text-center mt-2">
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{ 
            backgroundColor: selectedChemical.color + '30',
            color: selectedChemical.color 
          }}
        >
          {isLiquid ? (
            <>
              <Droplets size={12} />
              <span>Liquid</span>
            </>
          ) : (
            <>
              <Beaker size={12} />
              <span>Solid</span>
            </>
          )}
        </span>
      </div>

      {/* Hint text */}
      {!isPouring && isLiquid && (
        <p className="text-center text-slate-400 text-xs mt-2">
          Release to stop
        </p>
      )}
    </motion.div>
  );
}
