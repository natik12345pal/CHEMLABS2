'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allElements, Element, categoryColors } from '@/data/elements';
import { useChemLabStore } from '@/store/chemlab-store';
import { Atom, Zap, Beaker, Thermometer, X, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D viewer to avoid SSR issues
const Element3DViewer = dynamic(() => import('./Element3DViewer'), { 
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 bg-slate-900/95 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <span className="text-cyan-400 text-sm">Loading 3D Viewer...</span>
      </div>
    </div>
  )
});

export default function PeriodicTable() {
  const { selectedElement, setSelectedElement, isLowPerformanceMode } = useChemLabStore();
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Periodic table layout configuration
  const getGridPosition = useCallback((element: Element): { col: number; row: number } => {
    const { atomicNumber, period, group } = element;
    
    // Handle lanthanides (57-71)
    if (atomicNumber >= 57 && atomicNumber <= 71) {
      return { col: atomicNumber - 54, row: 9 };
    }
    
    // Handle actinides (89-103)
    if (atomicNumber >= 89 && atomicNumber <= 103) {
      return { col: atomicNumber - 86, row: 10 };
    }
    
    return { col: group, row: period };
  }, []);

  // Get element by atomic number
  const selectedElementData = useMemo(() => {
    return allElements.find(e => e.atomicNumber === selectedElement);
  }, [selectedElement]);

  // Filter elements based on search
  const filteredElements = useMemo(() => {
    if (!searchQuery) return allElements;
    const query = searchQuery.toLowerCase();
    return allElements.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.symbol.toLowerCase().includes(query) ||
      e.atomicNumber.toString().includes(query)
    );
  }, [searchQuery]);

  // Category legend
  const categories = [
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
  ];

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
      <div className="flex-shrink-0 p-4 border-b border-cyan-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Atom className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Interactive Periodic Table</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-64 px-4 py-2 pl-10 bg-slate-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <Atom className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Category Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/30">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-xs text-slate-400">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {searchQuery ? (
          // Search Results View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredElements.map((element) => (
              <motion.button
                key={element.atomicNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedElement(element.atomicNumber)}
                className="relative rounded-lg p-3 transition-all touch-manipulation border border-transparent hover:border-cyan-500/30"
                style={{
                  backgroundColor: `${element.categoryColor}20`,
                }}
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
              </motion.button>
            ))}
          </div>
        ) : (
          // Periodic Table Grid View
          <div className="relative mx-auto" style={{ maxWidth: '1200px' }}>
            {/* Grid Container */}
            <div 
              className="grid gap-1"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(32px, 1fr))',
                gridTemplateRows: 'repeat(10, minmax(32px, 1fr))'
              }}
            >
              {allElements.map((element) => {
                const pos = getGridPosition(element);
                const isSelected = selectedElement === element.atomicNumber;
                const isHovered = hoveredElement === element.atomicNumber;
                
                return (
                  <motion.button
                    key={element.atomicNumber}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: isLowPerformanceMode ? 0 : element.atomicNumber * 0.003 }}
                    onClick={() => setSelectedElement(element.atomicNumber)}
                    onMouseEnter={() => setHoveredElement(element.atomicNumber)}
                    onMouseLeave={() => setHoveredElement(null)}
                    className="relative rounded p-1 transition-all touch-manipulation group"
                    style={{
                      gridColumn: pos.col,
                      gridRow: pos.row,
                      backgroundColor: isLowPerformanceMode 
                        ? element.categoryColor 
                        : `${element.categoryColor}dd`,
                      transform: isHovered || isSelected ? 'scale(1.2)' : 'scale(1)',
                      zIndex: isHovered || isSelected ? 10 : 1,
                      boxShadow: isSelected 
                        ? `0 0 20px ${element.categoryColor}, inset 0 0 10px rgba(255,255,255,0.2)`
                        : isHovered 
                          ? `0 0 15px ${element.categoryColor}`
                          : 'none'
                    }}
                  >
                    {/* Atomic Number */}
                    <span className="absolute top-0 left-1 text-[7px] text-white/70 font-mono">
                      {element.atomicNumber}
                    </span>
                    
                    {/* Symbol */}
                    <div className="flex items-center justify-center h-full">
                      <span className="text-sm sm:text-base font-bold text-white">
                        {element.symbol}
                      </span>
                    </div>
                    
                    {/* Hover tooltip */}
                    {isHovered && !selectedElement && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                        <div className="bg-slate-800/95 border border-cyan-500/30 rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
                          <p className="text-cyan-400 font-semibold text-sm">{element.name}</p>
                          <p className="text-slate-400 text-xs">{element.atomicMass} u</p>
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Lanthanide/Actinide Labels */}
            <div className="absolute left-0 flex flex-col gap-1" style={{ top: '275px' }}>
              <div className="text-[9px] text-slate-400 writing-mode-vertical px-1">57-71</div>
              <div className="text-[9px] text-slate-400 writing-mode-vertical px-1">89-103</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Info Panel (when element is hovered) */}
      <AnimatePresence>
        {hoveredElement && !selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-800/95 border border-cyan-500/30 rounded-xl px-4 py-3 backdrop-blur-sm z-40"
          >
            {(() => {
              const el = allElements.find(e => e.atomicNumber === hoveredElement);
              if (!el) return null;
              return (
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ 
                      backgroundColor: el.categoryColor,
                      boxShadow: `0 0 20px ${el.categoryColor}50`
                    }}
                  >
                    {el.symbol}
                  </div>
                  <div>
                    <p className="text-cyan-400 font-semibold">{el.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>#{el.atomicNumber}</span>
                      <span>•</span>
                      <span>{el.atomicMass} u</span>
                      <span>•</span>
                      <span className="capitalize">{el.category.replace('-', ' ')}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 max-w-xs truncate">{el.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cyan-400" />
                </div>
              );
            })()}
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
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
