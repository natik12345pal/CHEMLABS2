// ChemLab Store - Central state management using Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chemical } from '@/data/chemicals';
import { BeakerType } from '@/data/beakers';
import { Reaction } from '@/data/reactions';

export interface WorkspaceBeaker {
  id: string;
  beakerType: BeakerType;
  position: { x: number; y: number };
  contents: {
    chemical: Chemical;
    quantity: number;
    temperature: number;
  }[];
  isHeating: boolean;
  fillLevel: number;
  isAnimating: boolean;
  isCentered: boolean;
}

export interface ReactionResult {
  reaction: Reaction;
  timestamp: number;
  beakerId: string;
}

export interface LabState {
  // UI State
  activeSection: 'lab' | 'periodic-table' | 'about';
  isLoading: boolean;
  loadingProgress: number;
  isDarkMode: boolean;
  isLowPerformanceMode: boolean;
  isSoundEnabled: boolean;
  isFullscreen: boolean;
  isPaused: boolean;
  zoomLevel: number;
  
  // Lab Workspace State
  workspaceBeakers: WorkspaceBeaker[];
  selectedBeaker: string | null;
  selectedChemical: Chemical | null;
  isDragging: boolean;
  dragItem: { type: 'beaker' | 'chemical'; data: BeakerType | Chemical } | null;
  
  // Reaction State
  pendingReaction: Reaction | null;
  isMixing: boolean;
  mixProgress: number;
  reactionResult: ReactionResult | null;
  showReactionPanel: boolean;
  isPanelMinimized: boolean;
  
  // Settings
  temperature: number;
  experimentName: string;
  
  // Achievements
  achievements: string[];
  showAchievement: string | null;
  
  // Element viewer
  selectedElement: number | null;
  
  // Actions
  setActiveSection: (section: 'lab' | 'periodic-table' | 'about') => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  toggleDarkMode: () => void;
  toggleLowPerformanceMode: () => void;
  toggleSound: () => void;
  toggleFullscreen: () => void;
  togglePause: () => void;
  setZoomLevel: (level: number) => void;
  
  // Lab Actions
  addBeakerToWorkspace: (beaker: BeakerType, workspaceSize: { width: number; height: number }) => void;
  removeBeakerFromWorkspace: (id: string) => void;
  selectBeaker: (id: string | null) => void;
  selectChemical: (chemical: Chemical | null) => void;
  addChemicalToBeaker: (beakerId: string, chemical: Chemical, quantity: number) => void;
  setBeakerHeating: (beakerId: string, heating: boolean) => void;
  centerBeaker: (beakerId: string, workspaceSize: { width: number; height: number }) => void;
  setBeakerAnimating: (beakerId: string, animating: boolean) => void;
  
  // Reaction Actions
  checkForReaction: () => void;
  startMixing: () => void;
  setMixProgress: (progress: number) => void;
  completeMixing: () => void;
  dismissReactionResult: () => void;
  togglePanelMinimize: () => void;
  clearPendingReaction: () => void;
  
  // Experiment Actions
  resetExperiment: () => void;
  saveExperiment: () => void;
  setTemperature: (temp: number) => void;
  setExperimentName: (name: string) => void;
  
  // Achievement Actions
  unlockAchievement: (id: string) => void;
  clearAchievement: () => void;
  
  // Element Actions
  setSelectedElement: (atomicNumber: number | null) => void;
}

export const useChemLabStore = create<LabState>()(
  persist(
    (set, get) => ({
      // Initial State
      activeSection: 'lab',
      isLoading: true,
      loadingProgress: 0,
      isDarkMode: true,
      isLowPerformanceMode: false,
      isSoundEnabled: true,
      isFullscreen: false,
      isPaused: false,
      zoomLevel: 100,
      
      workspaceBeakers: [],
      selectedBeaker: null,
      selectedChemical: null,
      isDragging: false,
      dragItem: null,
      
      pendingReaction: null,
      isMixing: false,
      mixProgress: 0,
      reactionResult: null,
      showReactionPanel: false,
      isPanelMinimized: false,
      
      temperature: 25,
      experimentName: 'Untitled Experiment',
      
      achievements: [],
      showAchievement: null,
      
      selectedElement: null,
      
      // UI Actions
      setActiveSection: (section) => set({ activeSection: section }),
      setLoading: (loading) => set({ isLoading: loading }),
      setLoadingProgress: (progress) => set({ loadingProgress: progress }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleLowPerformanceMode: () => set((state) => ({ isLowPerformanceMode: !state.isLowPerformanceMode })),
      toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
      toggleFullscreen: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
          set({ isFullscreen: true });
        } else {
          document.exitFullscreen();
          set({ isFullscreen: false });
        }
      },
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      setZoomLevel: (level) => set({ zoomLevel: Math.max(50, Math.min(200, level)) }),
      
      // Lab Actions
      addBeakerToWorkspace: (beakerType, workspaceSize) => {
        const newBeaker: WorkspaceBeaker = {
          id: `beaker-${Date.now()}`,
          beakerType,
          position: { x: -100, y: -100 }, // Start off-screen
          contents: [],
          isHeating: false,
          fillLevel: 0,
          isAnimating: true,
          isCentered: false
        };
        
        set((state) => ({
          workspaceBeakers: [...state.workspaceBeakers, newBeaker],
          selectedBeaker: newBeaker.id
        }));
        
        // Animate to center after a short delay
        setTimeout(() => {
          get().centerBeaker(newBeaker.id, workspaceSize);
        }, 100);
      },
      
      centerBeaker: (beakerId, workspaceSize) => {
        const beaker = get().workspaceBeakers.find(b => b.id === beakerId);
        if (!beaker) return;
        
        const centerX = (workspaceSize.width - beaker.beakerType.width) / 2;
        const centerY = (workspaceSize.height - beaker.beakerType.height) / 2 - 40;
        
        set((state) => ({
          workspaceBeakers: state.workspaceBeakers.map((b) =>
            b.id === beakerId
              ? { ...b, position: { x: centerX, y: centerY }, isCentered: true, isAnimating: false }
              : b
          )
        }));
      },
      
      removeBeakerFromWorkspace: (id) => set((state) => ({
        workspaceBeakers: state.workspaceBeakers.filter((b) => b.id !== id),
        selectedBeaker: state.selectedBeaker === id ? null : state.selectedBeaker,
        pendingReaction: null
      })),
      
      selectBeaker: (id) => set({ selectedBeaker: id }),
      
      selectChemical: (chemical) => set({ selectedChemical: chemical }),
      
      setBeakerAnimating: (beakerId, animating) => set((state) => ({
        workspaceBeakers: state.workspaceBeakers.map((b) =>
          b.id === beakerId ? { ...b, isAnimating: animating } : b
        )
      })),
      
      addChemicalToBeaker: (beakerId, chemical, quantity) => {
        const state = get();
        const beaker = state.workspaceBeakers.find((b) => b.id === beakerId);
        if (!beaker) return;
        
        const existingContent = beaker.contents.find((c) => c.chemical.id === chemical.id);
        let newContents: WorkspaceBeaker['contents'];
        
        if (existingContent) {
          newContents = beaker.contents.map((c) =>
            c.chemical.id === chemical.id
              ? { ...c, quantity: c.quantity + quantity }
              : c
          );
        } else {
          newContents = [...beaker.contents, { chemical, quantity, temperature: state.temperature }];
        }
        
        const totalQuantity = newContents.reduce((sum, c) => sum + c.quantity, 0);
        const fillLevel = Math.min(100, (totalQuantity / beaker.beakerType.capacity) * 100);
        
        set({
          workspaceBeakers: state.workspaceBeakers.map((b) =>
            b.id === beakerId
              ? { ...b, contents: newContents, fillLevel }
              : b
          )
        });
        
        // Check for reaction after adding chemical
        get().checkForReaction();
      },
      
      setBeakerHeating: (beakerId, heating) => set((state) => ({
        workspaceBeakers: state.workspaceBeakers.map((b) =>
          b.id === beakerId ? { ...b, isHeating: heating } : b
        )
      })),
      
      // Reaction Actions
      checkForReaction: () => {
        const state = get();
        const selectedBeakerData = state.workspaceBeakers.find(b => b.id === state.selectedBeaker);
        
        if (!selectedBeakerData || selectedBeakerData.contents.length < 2) {
          set({ pendingReaction: null });
          return;
        }
        
        // Import findReaction dynamically to avoid circular dependency
        import('@/data/reactions').then(({ findReaction }) => {
          const chemicals = selectedBeakerData.contents.map(c => c.chemical.id);
          
          // Check all pairs of chemicals
          for (let i = 0; i < chemicals.length; i++) {
            for (let j = i + 1; j < chemicals.length; j++) {
              const reaction = findReaction(chemicals[i], chemicals[j]);
              if (reaction) {
                set({ pendingReaction: reaction });
                return;
              }
            }
          }
          
          set({ pendingReaction: null });
        });
      },
      
      startMixing: () => {
        const state = get();
        if (!state.pendingReaction || !state.selectedBeaker) return;
        
        set({ isMixing: true, mixProgress: 0 });
        
        // Animate mix progress
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const animateProgress = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(100, (elapsed / duration) * 100);
          
          set({ mixProgress: progress });
          
          if (progress < 100) {
            requestAnimationFrame(animateProgress);
          } else {
            get().completeMixing();
          }
        };
        
        requestAnimationFrame(animateProgress);
      },
      
      completeMixing: () => {
        const state = get();
        if (!state.pendingReaction || !state.selectedBeaker) return;
        
        const result: ReactionResult = {
          reaction: state.pendingReaction,
          timestamp: Date.now(),
          beakerId: state.selectedBeaker
        };
        
        set({
          isMixing: false,
          mixProgress: 100,
          pendingReaction: null,
          reactionResult: result,
          showReactionPanel: true,
          isPanelMinimized: false
        });
        
        // Unlock achievement
        get().unlockAchievement('first-reaction');
      },
      
      dismissReactionResult: () => set({
        reactionResult: null,
        showReactionPanel: false
      }),
      
      togglePanelMinimize: () => set((state) => ({
        isPanelMinimized: !state.isPanelMinimized
      })),
      
      clearPendingReaction: () => set({ pendingReaction: null }),
      
      // Drag Actions - simplified since equipment stays fixed
      startDrag: () => set({ isDragging: false, dragItem: null }),
      stopDrag: () => set({ isDragging: false, dragItem: null }),
      
      // Experiment Actions
      resetExperiment: () => set({
        workspaceBeakers: [],
        selectedBeaker: null,
        selectedChemical: null,
        pendingReaction: null,
        isMixing: false,
        mixProgress: 0,
        reactionResult: null,
        showReactionPanel: false,
        temperature: 25
      }),
      
      saveExperiment: () => {
        const state = get();
        const experimentData = {
          name: state.experimentName,
          beakers: state.workspaceBeakers,
          timestamp: new Date().toISOString()
        };
        const saved = localStorage.getItem('chemlab-experiments');
        const experiments = saved ? JSON.parse(saved) : [];
        experiments.push(experimentData);
        localStorage.setItem('chemlab-experiments', JSON.stringify(experiments));
      },
      
      setTemperature: (temp) => set({ temperature: temp }),
      setExperimentName: (name) => set({ experimentName: name }),
      
      // Achievement Actions
      unlockAchievement: (id) => set((state) => {
        if (state.achievements.includes(id)) return state;
        return {
          achievements: [...state.achievements, id],
          showAchievement: id
        };
      }),
      
      clearAchievement: () => set({ showAchievement: null }),
      
      // Element Actions
      setSelectedElement: (atomicNumber) => set({ selectedElement: atomicNumber })
    }),
    {
      name: 'chemlab-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isLowPerformanceMode: state.isLowPerformanceMode,
        isSoundEnabled: state.isSoundEnabled,
        achievements: state.achievements
      })
    }
  )
);
