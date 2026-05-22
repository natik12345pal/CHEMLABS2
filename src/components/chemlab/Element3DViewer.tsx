'use client';

import { Suspense, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Ring, Float, Stars, Html, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, 
  Move, Info, ChevronDown, ChevronUp, Atom, Zap, Beaker
} from 'lucide-react';
import { Element, allElements } from '@/data/elements';
import { useChemLabStore } from '@/store/chemlab-store';

interface Element3DViewerProps {
  element: Element;
  onClose: () => void;
}

// Parse electron configuration to get electron shell data
function parseElectronShells(atomicNumber: number): number[] {
  // Standard electron shell filling order
  const shellCapacities = [2, 8, 18, 32, 32, 18, 8];
  const shells: number[] = [];
  let remaining = atomicNumber;
  
  for (let i = 0; i < shellCapacities.length && remaining > 0; i++) {
    const electronsInShell = Math.min(remaining, shellCapacities[i]);
    shells.push(electronsInShell);
    remaining -= electronsInShell;
  }
  
  return shells;
}

// Get element color based on category with enhanced colors
function getElementColor(category: string): string {
  const colors: Record<string, string> = {
    'alkali-metal': '#ff6b6b',
    'alkaline-earth': '#ffa94d',
    'transition-metal': '#ffd43b',
    'post-transition': '#69db7c',
    'metalloid': '#4dabf7',
    'nonmetal': '#748ffc',
    'halogen': '#da77f2',
    'noble-gas': '#f783ac',
    'lanthanide': '#20c997',
    'actinide': '#38d9a9',
    'unknown': '#868e96'
  };
  return colors[category] || '#00ffff';
}

// Nucleus Component - Protons and Neutrons
function Nucleus({ color, atomicNumber, isLowPerf }: { color: string; atomicNumber: number; isLowPerf: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particleCount = isLowPerf ? 10 : Math.min(atomicNumber, 30);
  
  // Create random positions for nucleus particles
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 0.3;
      pos.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ]);
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    if (meshRef.current && !isLowPerf) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main glowing nucleus */}
      <Sphere args={[0.4, isLowPerf ? 16 : 32, isLowPerf ? 16 : 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Inner glow */}
      {!isLowPerf && (
        <Sphere args={[0.45, 16, 16]}>
          <MeshDistortMaterial
            color={color}
            transparent
            opacity={0.3}
            distort={0.2}
            speed={2}
          />
        </Sphere>
      )}
      
      {/* Nucleon particles */}
      {!isLowPerf && positions.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#ff4444' : '#4488ff'}
            emissive={i % 2 === 0 ? '#ff4444' : '#4488ff'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

// Electron Shell Component
function ElectronShell({ 
  radius, 
  electronCount, 
  shellIndex, 
  color, 
  isLowPerf,
  autoRotate
}: { 
  radius: number; 
  electronCount: number; 
  shellIndex: number;
  color: string;
  isLowPerf: boolean;
  autoRotate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const speed = 0.3 + shellIndex * 0.1;
  
  useFrame((state) => {
    if (groupRef.current && autoRotate && !isLowPerf) {
      groupRef.current.rotation.y += speed * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + shellIndex) * 0.2;
    }
  });

  // Distribute electrons evenly on the shell
  const electronPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < electronCount; i++) {
      const angle = (i / electronCount) * Math.PI * 2;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  }, [electronCount, radius]);

  return (
    <group ref={groupRef}>
      {/* Orbital ring */}
      <Ring args={[radius - 0.02, radius + 0.02, isLowPerf ? 32 : 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Electrons */}
      {electronPositions.map((pos, i) => (
        <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <group position={pos}>
            {/* Electron sphere */}
            <Sphere args={[0.08, isLowPerf ? 8 : 16, isLowPerf ? 8 : 16]}>
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={1}
                transparent
                opacity={0.9}
              />
            </Sphere>
            
            {/* Electron glow */}
            {!isLowPerf && (
              <Sphere args={[0.12, 8, 8]}>
                <meshBasicMaterial
                  color="#00ffff"
                  transparent
                  opacity={0.3}
                />
              </Sphere>
            )}
            
            {/* Electron trail */}
            {!isLowPerf && i % 2 === 0 && (
              <mesh position={[-0.1, 0, 0]}>
                <sphereGeometry args={[0.04, 4, 4]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
              </mesh>
            )}
          </group>
        </Float>
      ))}
    </group>
  );
}

// Floating Particles Effect
function FloatingParticles({ color, isLowPerf }: { color: string; isLowPerf: boolean }) {
  if (isLowPerf) return null;
  
  return (
    <Sparkles
      count={50}
      scale={4}
      size={2}
      speed={0.4}
      color={color}
      opacity={0.6}
    />
  );
}

// Main Atom Model Component
function AtomModel({ 
  element, 
  isLowPerf, 
  autoRotate 
}: { 
  element: Element; 
  isLowPerf: boolean;
  autoRotate: boolean;
}) {
  const shells = parseElectronShells(element.atomicNumber);
  const color = getElementColor(element.category);
  const baseRadius = 1;
  const shellSpacing = 0.6;
  
  return (
    <group>
      {/* Stars background */}
      {!isLowPerf && <Stars radius={50} depth={50} count={500} factor={3} saturation={0} fade speed={1} />}
      
      {/* Floating particles */}
      <FloatingParticles color={color} isLowPerf={isLowPerf} />
      
      {/* Nucleus */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Nucleus color={color} atomicNumber={element.atomicNumber} isLowPerf={isLowPerf} />
      </Float>
      
      {/* Electron Shells */}
      {shells.map((electrons, index) => (
        <ElectronShell
          key={index}
          radius={baseRadius + index * shellSpacing}
          electronCount={electrons}
          shellIndex={index}
          color={color}
          isLowPerf={isLowPerf}
          autoRotate={autoRotate}
        />
      ))}
      
      {/* Element Symbol Label */}
      <Html position={[0, -2.5, 0]} center>
        <div className="flex flex-col items-center pointer-events-none">
          <span 
            className="text-4xl font-bold drop-shadow-lg"
            style={{ color: color, textShadow: `0 0 20px ${color}` }}
          >
            {element.symbol}
          </span>
          <span className="text-white/70 text-sm mt-1">{element.name}</span>
        </div>
      </Html>
    </group>
  );
}

// Camera Controller for zoom
function CameraController({ zoom }: { zoom: number }) {
  useThree(({ camera }) => {
    // Update camera position based on zoom
    const targetZ = 8 - zoom * 0.05;
    camera.position.z = targetZ;
  });
  
  return null;
}

// Loading Fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <span className="text-cyan-400 text-sm">Loading 3D Model...</span>
      </div>
    </div>
  );
}

// Main Component
export default function Element3DViewer({ element, onClose }: Element3DViewerProps) {
  const { isLowPerformanceMode } = useChemLabStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [isInfoMinimized, setIsInfoMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 100));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 0));
  const handleReset = () => {
    setZoom(0);
    setAutoRotate(true);
  };
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);
  
  // Handle double tap for auto-rotate toggle
  const handleDoubleClick = () => setAutoRotate(prev => !prev);
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md"
      ref={containerRef}
    >
      {/* Microscope Frame */}
      <div className="absolute inset-4 sm:inset-8 rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        {/* Top microscope UI bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-slate-900 via-cyan-900/30 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-3">
            <Atom className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-mono text-sm">
              MICROSCOPE VIEW - {element.name.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 pt-12 pb-4" onDoubleClick={handleDoubleClick}>
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              dpr={isLowPerformanceMode ? 0.5 : 1.5}
              gl={{ antialias: !isLowPerformanceMode, alpha: true }}
            >
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color={getElementColor(element.category)} />
              
              <AtomModel element={element} isLowPerf={isLowPerformanceMode} autoRotate={autoRotate} />
              
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={3}
                maxDistance={15}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
              />
              
              <CameraController zoom={zoom} />
            </Canvas>
          </Suspense>
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-xl p-2 border border-cyan-500/20">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-400 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          
          <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-200"
              style={{ width: `${zoom}%` }}
            />
          </div>
          
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-400 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          
          <div className="w-px h-6 bg-slate-600 mx-1" />
          
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg hover:bg-cyan-500/20 transition-colors ${autoRotate ? 'text-cyan-400' : 'text-slate-400'}`}
            title="Reset View"
          >
            <RotateCcw size={18} />
          </button>
          
          <button
            onClick={() => setAutoRotate(prev => !prev)}
            className={`p-2 rounded-lg transition-colors ${autoRotate ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-cyan-500/20 text-slate-400'}`}
            title="Auto Rotate"
          >
            <Move size={18} />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-400 transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          
          <button
            onClick={() => setShowInfo(prev => !prev)}
            className={`p-2 rounded-lg transition-colors ${showInfo ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-cyan-500/20 text-slate-400'}`}
            title="Toggle Info Panel"
          >
            <Info size={18} />
          </button>
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-20 left-4 text-cyan-400/60 font-mono text-xs">
          ZOOM: {(100 + zoom).toFixed(0)}%
        </div>

        {/* Auto-rotate indicator */}
        <div className="absolute bottom-20 right-4 text-cyan-400/60 font-mono text-xs flex items-center gap-1">
          {autoRotate && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
          {autoRotate ? 'AUTO-ROTATE ON' : 'AUTO-ROTATE OFF'}
        </div>

        {/* Educational Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`absolute right-4 top-16 w-72 bg-slate-800/90 backdrop-blur-md rounded-xl border border-cyan-500/20 overflow-hidden transition-all duration-300 ${isInfoMinimized ? 'h-10' : 'max-h-[calc(100vh-120px)]'}`}
            >
              {/* Panel Header */}
              <div 
                className="flex items-center justify-between p-3 border-b border-cyan-500/20 cursor-pointer hover:bg-slate-700/30"
                onClick={() => setIsInfoMinimized(prev => !prev)}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-semibold text-sm">Element Data</span>
                </div>
                {isInfoMinimized ? <ChevronDown size={16} className="text-cyan-400" /> : <ChevronUp size={16} className="text-cyan-400" />}
              </div>
              
              {/* Panel Content */}
              {!isInfoMinimized && (
                <div className="p-3 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
                  {/* Element Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                      style={{ 
                        backgroundColor: getElementColor(element.category),
                        boxShadow: `0 0 20px ${getElementColor(element.category)}50`
                      }}
                    >
                      {element.symbol}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{element.name}</h3>
                      <p className="text-slate-400 text-sm capitalize">{element.category.replace('-', ' ')}</p>
                    </div>
                  </div>
                  
                  {/* Properties Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-[10px] text-slate-500 uppercase">Atomic Number</p>
                      <p className="text-cyan-400 font-mono text-lg">{element.atomicNumber}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-[10px] text-slate-500 uppercase">Atomic Mass</p>
                      <p className="text-cyan-400 font-mono text-lg">{element.atomicMass}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-[10px] text-slate-500 uppercase">State (25°C)</p>
                      <p className="text-cyan-400 capitalize">{element.state}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-2">
                      <p className="text-[10px] text-slate-500 uppercase">Block</p>
                      <p className="text-cyan-400 uppercase">{element.block}-block</p>
                    </div>
                  </div>
                  
                  {/* Electron Configuration */}
                  <div className="bg-slate-700/50 rounded-lg p-2 mb-3">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Electron Configuration</p>
                    <p className="text-cyan-400 font-mono text-sm">{element.electronConfiguration}</p>
                  </div>
                  
                  {/* Temperature Info */}
                  {(element.meltingPoint !== null || element.boilingPoint !== null) && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {element.meltingPoint !== null && (
                        <div className="bg-slate-700/50 rounded-lg p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Melting Point</p>
                          <p className="text-orange-400 font-mono text-sm">{element.meltingPoint}°C</p>
                        </div>
                      )}
                      {element.boilingPoint !== null && (
                        <div className="bg-slate-700/50 rounded-lg p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Boiling Point</p>
                          <p className="text-red-400 font-mono text-sm">{element.boilingPoint}°C</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Description */}
                  <div className="bg-slate-700/50 rounded-lg p-2 mb-3">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Description</p>
                    <p className="text-slate-300 text-xs leading-relaxed">{element.description}</p>
                  </div>
                  
                  {/* Uses */}
                  {element.uses && element.uses.length > 0 && (
                    <div className="bg-slate-700/50 rounded-lg p-2 mb-3">
                      <p className="text-[10px] text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Beaker className="w-3 h-3" /> Common Uses
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {element.uses.map((use, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-cyan-500/20 rounded text-[10px] text-cyan-300"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Fun Fact */}
                  {element.funFact && (
                    <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-lg p-2 border border-cyan-500/20">
                      <p className="text-[10px] text-cyan-400 mb-1 flex items-center gap-1">
                        💡 Fun Fact
                      </p>
                      <p className="text-slate-300 text-xs leading-relaxed">{element.funFact}</p>
                    </div>
                  )}
                  
                  {/* Discovery Info */}
                  <div className="mt-3 pt-3 border-t border-slate-700 text-center">
                    <p className="text-[10px] text-slate-500">
                      Discovered: {element.discoveryYear} by {element.discoverer}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interaction hints */}
        <div className="absolute top-16 left-4 text-slate-500 text-xs space-y-1">
          <p>• Drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Double-tap: toggle rotation</p>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </motion.div>
  );
}
