import { create } from 'zustand';

type TimeOfDay = 'day' | 'evening' | 'witching';
type ActivityLevel = 'idle' | 'active' | 'hyperactive';

interface ThemeState {
  timeOfDay: TimeOfDay;
  activityLevel: ActivityLevel;
  interactionCount: number;
  lastInteraction: number;
  randomEventActive: boolean;
  randomEventType: string | null;
  logoClickCount: number;
  jumpScareActive: boolean;
  
  // Actions
  updateTimeOfDay: () => void;
  recordInteraction: () => void;
  triggerRandomEvent: () => void;
  clearRandomEvent: () => void;
  incrementLogoClick: () => void;
  triggerJumpScare: () => void;
  clearJumpScare: () => void;
  checkIdleStatus: () => void;
}

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) return 'day';
  if (hour >= 18 || hour < 0) return 'evening';
  return 'witching'; // 0-6 AM
};

const randomEvents = [
  'flicker',
  'shadow-pass',
  'text-scramble',
  'footsteps',
  'whisper',
];

export const useThemeStore = create<ThemeState>((set, get) => ({
  timeOfDay: getTimeOfDay(),
  activityLevel: 'idle',
  interactionCount: 0,
  lastInteraction: Date.now(),
  randomEventActive: false,
  randomEventType: null,
  logoClickCount: 0,
  jumpScareActive: false,

  updateTimeOfDay: () => {
    set({ timeOfDay: getTimeOfDay() });
  },

  recordInteraction: () => {
    const count = get().interactionCount + 1;
    let activityLevel: ActivityLevel = 'idle';
    
    if (count > 20) activityLevel = 'hyperactive';
    else if (count > 5) activityLevel = 'active';
    
    set({
      interactionCount: count,
      lastInteraction: Date.now(),
      activityLevel,
    });
  },

  triggerRandomEvent: () => {
    const eventType = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    set({ randomEventActive: true, randomEventType: eventType });
    
    setTimeout(() => {
      get().clearRandomEvent();
    }, 3000);
  },

  clearRandomEvent: () => {
    set({ randomEventActive: false, randomEventType: null });
  },

  incrementLogoClick: () => {
    const newCount = get().logoClickCount + 1;
    set({ logoClickCount: newCount });
    
    if (newCount >= 3) {
      get().triggerJumpScare();
      set({ logoClickCount: 0 });
    }
  },

  triggerJumpScare: () => {
    set({ jumpScareActive: true });
    setTimeout(() => {
      get().clearJumpScare();
    }, 800);
  },

  clearJumpScare: () => {
    set({ jumpScareActive: false });
  },

  checkIdleStatus: () => {
    const timeSinceLastInteraction = Date.now() - get().lastInteraction;
    if (timeSinceLastInteraction > 30000) { // 30 seconds
      set({ activityLevel: 'idle' });
    }
  },
}));
