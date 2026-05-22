'use client';

import { useEffect, useState } from 'react';
import { useChemLabStore } from '@/store/chemlab-store';

export default function LoadingScreen() {
  const { setLoading } = useChemLabStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth loading progress
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 150);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* Floating Glow Orbs - CSS only */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        
        {/* Animated Flask Icon */}
        <div className="relative mb-6">
          {/* Glow effect behind flask */}
          <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full scale-150" />
          
          {/* Flask with float animation */}
          <div className="relative animate-[float_3s_ease-in-out_infinite]">
            <svg viewBox="0 0 100 120" className="w-28 h-32 sm:w-32 sm:h-36">
              {/* Flask Body */}
              <path
                d="M30,30 L30,55 L15,100 Q15,115 50,115 Q85,115 85,100 L70,55 L70,30"
                fill="rgba(0, 255, 255, 0.1)"
                stroke="url(#flaskGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Flask Neck */}
              <rect x="30" y="15" width="40" height="18" rx="3" fill="rgba(0, 255, 255, 0.1)" stroke="url(#flaskGradient)" strokeWidth="2" />
              {/* Flask Rim */}
              <ellipse cx="50" cy="15" rx="22" ry="4" fill="rgba(0, 255, 255, 0.15)" stroke="url(#flaskGradient)" strokeWidth="1.5" />
              
              {/* Liquid with wave effect */}
              <ellipse
                cx="50"
                cy="95"
                rx="30"
                ry="18"
                fill="url(#liquidGradient)"
                className="animate-[wave_2s_ease-in-out_infinite]"
              />
              
              {/* Bubbles */}
              <circle cx="38" cy="90" r="3" fill="rgba(0, 255, 255, 0.6)" className="animate-[bubble_2s_ease-in-out_infinite]" />
              <circle cx="55" cy="85" r="2" fill="rgba(0, 255, 255, 0.5)" className="animate-[bubble_2s_ease-in-out_0.3s_infinite]" />
              <circle cx="45" cy="100" r="2.5" fill="rgba(0, 255, 255, 0.4)" className="animate-[bubble_2s_ease-in-out_0.6s_infinite]" />
              
              <defs>
                <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ffff" />
                  <stop offset="100%" stopColor="#00ff88" />
                </linearGradient>
                <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0, 255, 255, 0.7)" />
                  <stop offset="100%" stopColor="rgba(0, 150, 255, 0.5)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Title with gradient */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-400">
            ChemLab
          </span>
        </h1>

        <p className="text-cyan-200/60 text-sm sm:text-base mb-8 tracking-wide">
          Virtual Chemistry Laboratory
        </p>

        {/* Loading Progress Container */}
        <div className="w-56 sm:w-72">
          {/* Progress Track */}
          <div className="relative h-1.5 bg-slate-700/60 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/30">
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
            
            {/* Progress Fill */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Text */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-cyan-400/50 text-xs font-medium tracking-wide">Loading</span>
            <span className="text-cyan-400 font-mono text-sm font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Element Grid */}
        <div className="flex gap-2 mt-8">
          {[
            { symbol: 'H', color: '#00ffff' },
            { symbol: 'O', color: '#00ffff' },
            { symbol: 'C', color: '#00ff88' },
            { symbol: 'N', color: '#00ff88' },
            { symbol: 'Na', color: '#ff88ff' },
            { symbol: 'Fe', color: '#ff88ff' },
          ].map((el, i) => (
            <div
              key={el.symbol}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-transform duration-300 hover:scale-110 border"
              style={{
                color: el.color,
                borderColor: `${el.color}50`,
                backgroundColor: `${el.color}15`,
              }}
            >
              {el.symbol}
            </div>
          ))}
        </div>

        {/* Loading Dots */}
        <div className="flex gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              style={{
                animation: `dotBounce 1s ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bubble {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-8px) scale(1.1); opacity: 1; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.02); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
