import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/themeStore';

export const RandomEventOverlay = () => {
  const { randomEventActive, randomEventType } = useThemeStore();

  return (
    <AnimatePresence>
      {randomEventActive && (
        <>
          {/* Shadow pass effect */}
          {randomEventType === 'shadow-pass' && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 0.3, 0.3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="fixed inset-y-0 w-32 bg-gradient-to-r from-transparent via-nightmare-shadow to-transparent pointer-events-none z-40"
              style={{ filter: 'blur(20px)' }}
            />
          )}

          {/* Flicker effect */}
          {randomEventType === 'flicker' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0, 0.1, 0, 0.2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="fixed inset-0 bg-nightmare-shadow pointer-events-none z-40"
            />
          )}

          {/* Eyes in darkness effect */}
          {randomEventType === 'whisper' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed top-1/4 right-10 pointer-events-none z-40"
            >
              <motion.div
                className="flex gap-4"
                animate={{ x: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: 1 }}
              >
                <motion.div
                  className="w-3 h-2 rounded-full bg-nightmare-blood"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: 2 }}
                />
                <motion.div
                  className="w-3 h-2 rounded-full bg-nightmare-blood"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: 2 }}
                />
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
