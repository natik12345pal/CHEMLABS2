'use client';

import { useEffect, useState } from 'react';
import { useChemLabStore } from '@/store/chemlab-store';

export default function LoadingScreen() {
  const { setLoading } = useChemLabStore();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'complete'>('loading');

  useEffect(() => {
    // Smooth loading progress with realistic feel
    const steps = [15, 35, 55, 75, 90, 100];
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProgress(steps[stepIndex]);
        stepIndex++;
      }
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setPhase('complete');
        setTimeout(() => setLoading(false), 300);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-[pulse_4s_ease-in-out_infinite]"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 60%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-[pulse_4s_ease-in-out_infinite_0.5s]"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 60%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-[pulse_5s_ease-in-out_infinite_1s]"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)',
            filter: 'blur(80px)'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Flask Animation */}
        <div className="relative mb-8">
          {/* Glow Ring */}
          <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-2xl animate-pulse" />
          
          {/* Flask Container */}
          <div className="relative animate-[float_3s_ease-in-out_infinite]">
            <svg viewBox="0 0 120 150" className="w-32 h-36 sm:w-40 sm:h-44">
              <defs>
                {/* Gradients */}
                <linearGradient id="flaskStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="liquidFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(34,211,238,0.8)" />
                  <stop offset="50%" stopColor="rgba(6,182,212,0.6)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0.5)" />
                </linearGradient>
                <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(34,211,238,0.4)" />
                </linearGradient>
                {/* Glow Filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Flask Body */}
              <path
                d="M35,35 L35,65 L18,120 Q18,138 60,138 Q102,138 102,120 L85,65 L85,35"
                fill="rgba(15,23,42,0.5)"
                stroke="url(#flaskStroke)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
              
              {/* Flask Neck */}
              <rect x="35" y="18" width="50" height="22" rx="4" fill="rgba(15,23,42,0.5)" stroke="url(#flaskStroke)" strokeWidth="2.5" />
              
              {/* Flask Rim */}
              <ellipse cx="60" cy="18" rx="28" ry="5" fill="rgba(15,23,42,0.5)" stroke="url(#flaskStroke)" strokeWidth="2" />
              
              {/* Liquid */}
              <ellipse
                cx="60"
                cy="110"
                rx="38"
                ry="25"
                fill="url(#liquidFill)"
                className="animate-[liquidWave_2s_ease-in-out_infinite]"
              />
              
              {/* Liquid Surface Highlight */}
              <ellipse
                cx="60"
                cy="88"
                rx="35"
                ry="8"
                fill="rgba(34,211,238,0.3)"
                className="animate-[liquidWave_2.5s_ease-in-out_infinite]"
              />
              
              {/* Bubbles */}
              <circle cx="45" cy="105" r="4" fill="url(#bubbleGrad)" className="animate-[bubble_2s_ease-in-out_infinite]" />
              <circle cx="70" cy="98" r="3" fill="url(#bubbleGrad)" className="animate-[bubble_2s_ease-in-out_infinite_0.3s]" />
              <circle cx="55" cy="115" r="3.5" fill="url(#bubbleGrad)" className="animate-[bubble_2s_ease-in-out_infinite_0.6s]" />
              <circle cx="75" cy="108" r="2.5" fill="url(#bubbleGrad)" className="animate-[bubble_2s_ease-in-out_infinite_0.9s]" />
              <circle cx="40" cy="95" r="2" fill="url(#bubbleGrad)" className="animate-[bubble_2s_ease-in-out_infinite_1.2s]" />
              
              {/* Glass Reflection */}
              <path
                d="M40,45 Q42,80 30,110"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-3 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300">
              ChemLab
            </span>
          </h1>
          <p className="text-cyan-200/60 text-base sm:text-lg tracking-wide font-light">
            Virtual Chemistry Laboratory
          </p>
        </div>

        {/* Progress Section */}
        <div className="w-60 sm:w-80 mb-8">
          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40 shadow-inner">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_linear_infinite]" />
            
            {/* Progress Fill */}
            <div 
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #22d3ee, #10b981)',
                boxShadow: '0 0 20px rgba(34,211,238,0.5)'
              }}
            />
          </div>
          
          {/* Progress Info */}
          <div className="flex justify-between items-center mt-3">
            <span className="text-cyan-400/50 text-xs font-medium tracking-widest uppercase">
              {phase === 'complete' ? 'Ready' : 'Loading'}
            </span>
            <span className="text-cyan-300 font-mono text-sm font-semibold tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* Element Symbols */}
        <div className="flex gap-2 sm:gap-3">
          {[
            { symbol: 'H', number: 1, color: 'cyan' },
            { symbol: 'He', number: 2, color: 'purple' },
            { symbol: 'C', number: 6, color: 'emerald' },
            { symbol: 'N', number: 7, color: 'teal' },
            { symbol: 'O', number: 8, color: 'rose' },
            { symbol: 'Fe', number: 26, color: 'amber' },
          ].map((el, i) => (
            <div
              key={el.symbol}
              className="relative group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div 
                className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg flex flex-col items-center justify-center border transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
                style={{
                  borderColor: `var(--${el.color}-500)40`,
                  backgroundColor: `var(--${el.color}-500)10`,
                  color: `var(--${el.color}-400)`,
                }}
              >
                <span className="text-sm sm:text-base font-bold">{el.symbol}</span>
                <span className="text-[8px] sm:text-[10px] opacity-50">{el.number}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              style={{
                animation: `dotPulse 1.2s ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bubble {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-12px) scale(1.2); opacity: 1; }
        }
        @keyframes liquidWave {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          50% { transform: scaleX(1.02) scaleY(0.98); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
