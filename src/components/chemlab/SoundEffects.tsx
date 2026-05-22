'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useChemLabStore } from '@/store/chemlab-store';

// Simple audio context for generating sounds
class SoundGenerator {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.isInitialized = true;
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  playBubble(duration: number = 0.1) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400 + Math.random() * 200, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playPour(duration: number = 0.5) {
    if (!this.audioContext) return;
    
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1 * (1 - i / bufferSize);
    }
    
    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    
    source.start();
  }

  playMixing(duration: number = 2) {
    if (!this.audioContext) return;
    
    // Create a swirling/mixing sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    // Frequency modulation for swirling effect
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + duration / 2);
    oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    
    // Add bubbles during mixing
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.playBubble(0.05);
      }, i * 200);
    }
  }

  playSuccess() {
    if (!this.audioContext) return;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = this.audioContext!.currentTime + i * 0.1;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  playReactionComplete() {
    if (!this.audioContext) return;
    
    // Short success chime
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1760, this.audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }
}

const soundGenerator = new SoundGenerator();

export function useSoundEffects() {
  const { isSoundEnabled, isMixing, reactionResult } = useChemLabStore();
  const lastMixingRef = useRef(false);
  const lastResultRef = useRef<boolean>(false);

  // Initialize audio context on first user interaction
  useEffect(() => {
    const handleClick = () => {
      soundGenerator.init();
    };
    
    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Play mixing sound when mixing starts
  useEffect(() => {
    if (!isSoundEnabled) return;
    
    if (isMixing && !lastMixingRef.current) {
      soundGenerator.init();
      soundGenerator.playMixing(2);
    }
    
    lastMixingRef.current = isMixing;
  }, [isMixing, isSoundEnabled]);

  // Play success sound when reaction completes
  useEffect(() => {
    if (!isSoundEnabled) return;
    
    if (reactionResult && !lastResultRef.current) {
      soundGenerator.init();
      soundGenerator.playReactionComplete();
    }
    
    lastResultRef.current = !!reactionResult;
  }, [reactionResult, isSoundEnabled]);

  const playBubble = useCallback(() => {
    if (isSoundEnabled) {
      soundGenerator.init();
      soundGenerator.playBubble();
    }
  }, [isSoundEnabled]);

  const playPour = useCallback(() => {
    if (isSoundEnabled) {
      soundGenerator.init();
      soundGenerator.playPour();
    }
  }, [isSoundEnabled]);

  const playSuccess = useCallback(() => {
    if (isSoundEnabled) {
      soundGenerator.init();
      soundGenerator.playSuccess();
    }
  }, [isSoundEnabled]);

  return {
    playBubble,
    playPour,
    playSuccess
  };
}

export default function SoundEffectsProvider({ children }: { children: React.ReactNode }) {
  useSoundEffects();
  return <>{children}</>;
}
