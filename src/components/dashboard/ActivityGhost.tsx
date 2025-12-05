import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/themeStore';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect, useState } from 'react';

export const ActivityGhost = () => {
  const { activityLevel } = useThemeStore();
  const { completedTasksStreak } = useDashboardStore();
  const { playComplete } = useSoundEffects();
  const [showGhost, setShowGhost] = useState(false);
  const [message, setMessage] = useState('');

  // Show ghost when completing multiple tasks
  useEffect(() => {
    if (completedTasksStreak >= 3) {
      setMessage('Well done, mortal...');
      setShowGhost(true);
      playComplete();
      
      const timeout = setTimeout(() => setShowGhost(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [completedTasksStreak, playComplete]);

  // Show eyes when idle too long
  useEffect(() => {
    if (activityLevel === 'idle') {
      const timeout = setTimeout(() => {
        setMessage('I see you...');
        setShowGhost(true);
        setTimeout(() => setShowGhost(false), 2000);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [activityLevel]);

  return (
    <AnimatePresence>
      {showGhost && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-20 right-10 z-30 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            {/* Simple ghost shape */}
            <svg viewBox="0 0 60 80" className="w-16 h-20">
              <defs>
                <filter id="ghostGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M30 5 C10 5 5 25 5 45 C5 65 5 75 15 75 L20 70 L30 75 L40 70 L45 75 C55 75 55 65 55 45 C55 25 50 5 30 5"
                fill="hsl(var(--nightmare-mist))"
                opacity="0.8"
                filter="url(#ghostGlow)"
                animate={{ 
                  d: [
                    "M30 5 C10 5 5 25 5 45 C5 65 5 75 15 75 L20 70 L30 75 L40 70 L45 75 C55 75 55 65 55 45 C55 25 50 5 30 5",
                    "M30 5 C10 5 5 25 5 45 C5 65 5 78 15 78 L22 70 L30 78 L38 70 L45 78 C55 78 55 65 55 45 C55 25 50 5 30 5",
                    "M30 5 C10 5 5 25 5 45 C5 65 5 75 15 75 L20 70 L30 75 L40 70 L45 75 C55 75 55 65 55 45 C55 25 50 5 30 5",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Eyes */}
              <circle cx="22" cy="35" r="4" fill="hsl(var(--nightmare-shadow))" />
              <circle cx="38" cy="35" r="4" fill="hsl(var(--nightmare-shadow))" />
              {/* Cute smile */}
              <path d="M25 50 Q30 55 35 50" stroke="hsl(var(--nightmare-shadow))" strokeWidth="2" fill="none" />
            </svg>
            
            {/* Message bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 px-3 py-1 bg-card/90 border border-border rounded-lg"
            >
              <p className="text-xs font-body text-muted-foreground italic">
                {message}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
