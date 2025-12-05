import { create } from 'zustand';

interface SoundState {
  masterVolume: number;
  ambientVolume: number;
  effectsVolume: number;
  isMuted: boolean;
  ambientPlaying: boolean;
  
  // Actions
  setMasterVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  toggleMute: () => void;
  setAmbientPlaying: (playing: boolean) => void;
}

export const useSoundStore = create<SoundState>((set) => ({
  masterVolume: 0.5,
  ambientVolume: 0.3,
  effectsVolume: 0.6,
  isMuted: false,
  ambientPlaying: false,

  setMasterVolume: (volume) => set({ masterVolume: volume }),
  setAmbientVolume: (volume) => set({ ambientVolume: volume }),
  setEffectsVolume: (volume) => set({ effectsVolume: volume }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setAmbientPlaying: (playing) => set({ ambientPlaying: playing }),
}));
