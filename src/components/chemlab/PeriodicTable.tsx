'use client';

import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allElements, Element, categoryColors } from '@/data/elements';
import { useChemLabStore } from '@/store/chemlab-store';
import { Atom, ChevronRight, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D viewer
const Element3DViewer = dynamic(() => import('./Element3DViewer'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <span className="text-cyan-400 text-sm">Loading 3D Viewer...</span>
      </div>
    </div>
  )
});

// Memoized element button to prevent unnecessary re-renders
const ElementButton = memo(function ElementButton({ 
  element, 
  onClick,
  isLowPerformanceMode 
}: { 
  element: Element; 
  onClick: () => void;
  isLowPerformanceMode: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const pos = useMemo(() => {
    const { atomicNumber, period, group } = element;
    
    if (atomicNumber >= 57 && atomicNumber <= 71) {
      return { col: atomicNumber - 54, row: 9 };
    }
    if (atomicNumber >= 89 && atomicNumber <= 103) {
      return { col: atomicNumber - 86, row: 10 };
    }
    return { col: group, row: period };
  }, [element]);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded p-1 transition-all duration-150 touch-manipulation"
      style={{
        gridColumn: pos.col,
        gridRow: pos.row,
        backgroundColor: element.categoryColor,
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        zIndex: isHovered ? 10 : 1,
        boxShadow: isHovered ? `0 0 12px ${element.categoryColor}` : 'none',
        transition: isLowPerformanceMode ? 'none' : 'transform 0.15s, box-shadow 0.15s'
      }}
    >
      <span className="absolute top-0 left-1 text-[7px] text-white/70 font-mono">
        {element.atomicNumber}
      </span>
      <div className="flex items-center justify-center h-full">
        <span className="text-sm font-bold text-white">
          {element.symbol}
        </span>
      </div>
    </button>
  );
});

export default function PeriodicTable() {
  const { selectedElement, setSelectedElement, isLowPerformanceMode } = useChemLabStore();
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get element by atomic number
  const selectedElementData = useMemo(() => {
    return allElements.find(e => e.atomicNumber === selectedElement);
  }, [selectedElement]);

  // Get hovered element data
  const hoveredElementData = useMemo(() => {
    return allElements.find(e => e.atomicNumber === hoveredElement);
  }, [hoveredElement]);

  // Filter elements based on search
  const filteredElements = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return allElements.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.symbol.toLowerCase().includes(query) ||
      e.atomicNumber.toString().includes(query)
    );
  }, [searchQuery]);

  // Category legend - memoized
  const categories = useMemo(() => [
    { name: 'Alkali Metals', key: 'alkali-metal', color: categoryColors['alkali-metal'] },
    { name: 'Alkaline Earth', key: 'alkaline-earth', color: categoryColors['alkaline-earth'] },
    { name: 'Transition Metals', key: 'transition-metal', color: categoryColors['transition-metal'] },
    { name: 'Post-Transition', key: 'post-transition', color: categoryColors['post-transition'] },
    { name: 'Metalloids', key: 'metalloid', color: categoryColors['metalloid'] },
    { name: 'Nonmetals', key: 'nonmetal', color: categoryColors['nonmetal'] },
    { name: 'Halogens', key: 'halogen', color: categoryColors['halogen'] },
    { name: 'Noble Gases', key: 'noble-gas', color: categoryColors['noble-gas'] },
    { name: 'Lanthanides', key: 'lanthanide', color: categoryColors['lanthanide'] },
    { name: 'Actinides', key: 'actinide', color: categoryColors['actinide'] },
  ], []);

  // Close 3D viewer
  const handleCloseViewer = useCallback(() => {
    setSelectedElement(null);
  }, [setSelectedElement]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedElement) {
        setSelectedElement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, setSelectedElement]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-cyan-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <h1 className="text-lg sm:text-xl font-bold text-white">Interactive Periodic Table</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 sm:w-64 px-3 sm:px-4 py-2 pl-8 sm:pl-10 bg-slate-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 text-sm"
            />
            <Atom className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Category Legend - Compact */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800/30">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-[10px] sm:text-xs text-slate-400">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 custom-scrollbar">
        {filteredElements ? (
          // Search Results View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredElements.map((element) => (
              <button
                key={element.atomicNumber}
                onClick={() => setSelectedElement(element.atomicNumber)}
                className="relative rounded-lg p-3 transition-all touch-manipulation border border-transparent hover:border-cyan-500/30"
                style={{ backgroundColor: `${element.categoryColor}20` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: element.categoryColor }}
                  >
                    {element.symbol}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{element.name}</p>
                    <p className="text-slate-400 text-xs">#{element.atomicNumber}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Periodic Table Grid View - No staggered animation
          <div className="relative mx-auto" style={{ maxWidth: '1200px' }}>
            <div 
              className="grid gap-1"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(28px, 1fr))',
                gridTemplateRows: 'repeat(10, minmax(28px, 1fr))'
              }}
            >
              {allElements.map((element) => (
                <ElementButton
                  key={element.atomicNumber}
                  element={element}
                  onClick={() => setSelectedElement(element.atomicNumber)}
                  isLowPerformanceMode={isLowPerformanceMode}
                />
              ))}
            </div>

            {/* Lanthanide/Actinide Labels */}
            <div className="absolute left-0 flex flex-col gap-1" style={{ top: '260px' }}>
              <div className="text-[8px] text-slate-400 px-1">57-71</div>
              <div className="text-[8px] text-slate-400 px-1">89-103</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info Panel (when element is hovered) */}
      <AnimatePresence>
        {hoveredElementData && !selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-800/95 border border-cyan-500/30 rounded-xl px-4 py-3 backdrop-blur-sm z-40"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg"
                style={{ 
                  backgroundColor: hoveredElementData.categoryColor,
                }}
              >
                {hoveredElementData.symbol}
              </div>
              <div>
                <p className="text-cyan-400 font-semibold text-sm">{hoveredElementData.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>#{hoveredElementData.atomicNumber}</span>
                  <span>•</span>
                  <span>{hoveredElementData.atomicMass} u</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to view hint */}
      <div className="flex-shrink-0 text-center py-2 text-slate-500 text-xs border-t border-cyan-500/10">
        Click any element to open the 3D Atomic Microscope View
      </div>

      {/* 3D Element Viewer Modal */}
      <AnimatePresence>
        {selectedElementData && (
          <Element3DViewer 
            element={selectedElementData} 
            onClose={handleCloseViewer} 
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
