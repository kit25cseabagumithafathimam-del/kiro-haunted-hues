import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/themeStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useEffect } from 'react';

export const JumpScare = () => {
  const { jumpScareActive } = useThemeStore();
  const { playJumpscare } = useSoundEffects();

  useEffect(() => {
    if (jumpScareActive) {
      playJumpscare();
    }
  }, [jumpScareActive, playJumpscare]);

  return (
    <AnimatePresence>
      {jumpScareActive && (
        <motion.div
          initial={{ opacity: 0, scale: 3 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-nightmare-shadow/90 pointer-events-none"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [10, -10, 5, -5, 0] }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Ghost face SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-48 h-48 md:w-64 md:h-64"
            >
              {/* Ghost body */}
              <motion.path
                d="M50 10 C20 10 10 40 10 60 C10 80 10 90 20 90 L30 80 L40 90 L50 80 L60 90 L70 80 L80 90 C90 90 90 80 90 60 C90 40 80 10 50 10"
                fill="hsl(var(--nightmare-mist))"
                animate={{ 
                  fill: ['hsl(270 30% 70%)', 'hsl(0 70% 50%)', 'hsl(270 30% 70%)']
                }}
                transition={{ duration: 0.4, repeat: 2 }}
              />
              {/* Eyes */}
              <motion.ellipse
                cx="35"
                cy="45"
                rx="8"
                ry="12"
                fill="hsl(var(--nightmare-shadow))"
                animate={{ ry: [12, 15, 12] }}
                transition={{ duration: 0.2, repeat: 3 }}
              />
              <motion.ellipse
                cx="65"
                cy="45"
                rx="8"
                ry="12"
                fill="hsl(var(--nightmare-shadow))"
                animate={{ ry: [12, 15, 12] }}
                transition={{ duration: 0.2, repeat: 3 }}
              />
              {/* Mouth */}
              <motion.ellipse
                cx="50"
                cy="70"
                rx="15"
                ry="10"
                fill="hsl(var(--nightmare-shadow))"
                animate={{ ry: [10, 15, 10] }}
                transition={{ duration: 0.2, repeat: 3 }}
              />
            </svg>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-2xl text-nightmare-blood mt-4 text-glow"
            >
              BOO!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
