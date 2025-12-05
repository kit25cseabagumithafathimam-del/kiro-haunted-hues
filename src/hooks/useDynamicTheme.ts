import { useEffect, useCallback } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { useSoundEffects } from './useSoundEffects';

export const useDynamicTheme = () => {
  const {
    timeOfDay,
    activityLevel,
    randomEventActive,
    randomEventType,
    updateTimeOfDay,
    recordInteraction,
    triggerRandomEvent,
    checkIdleStatus,
    jumpScareActive,
  } = useThemeStore();
  
  const { playWhisper, playFootsteps, playThunder } = useSoundEffects();

  // Update time of day every minute
  useEffect(() => {
    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, [updateTimeOfDay]);

  // Check idle status every 10 seconds
  useEffect(() => {
    const interval = setInterval(checkIdleStatus, 10000);
    return () => clearInterval(interval);
  }, [checkIdleStatus]);

  // Random events every 2-5 minutes
  useEffect(() => {
    const scheduleNextEvent = () => {
      const delay = Math.random() * 180000 + 120000; // 2-5 minutes
      return setTimeout(() => {
        triggerRandomEvent();
        scheduleNextEvent();
      }, delay);
    };
    
    const timeout = scheduleNextEvent();
    return () => clearTimeout(timeout);
  }, [triggerRandomEvent]);

  // Play sounds for random events
  useEffect(() => {
    if (randomEventActive && randomEventType) {
      switch (randomEventType) {
        case 'whisper':
          playWhisper();
          break;
        case 'footsteps':
          playFootsteps();
          break;
        case 'flicker':
          playThunder();
          break;
      }
    }
  }, [randomEventActive, randomEventType, playWhisper, playFootsteps, playThunder]);

  const handleInteraction = useCallback(() => {
    recordInteraction();
  }, [recordInteraction]);

  // Theme classes based on current state
  const getThemeClasses = useCallback(() => {
    const classes: string[] = [];

    // Time-based classes
    if (timeOfDay === 'witching') {
      classes.push('animate-screen-flicker');
    }

    // Activity-based classes
    if (activityLevel === 'idle') {
      classes.push('opacity-90');
    }

    // Random event classes
    if (randomEventActive) {
      switch (randomEventType) {
        case 'flicker':
          classes.push('animate-flicker');
          break;
        case 'shadow-pass':
          classes.push('animate-float-shadow');
          break;
      }
    }

    return classes.join(' ');
  }, [timeOfDay, activityLevel, randomEventActive, randomEventType]);

  return {
    timeOfDay,
    activityLevel,
    randomEventActive,
    randomEventType,
    jumpScareActive,
    handleInteraction,
    getThemeClasses,
  };
};
