import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/dashboard/Header';
import { TaskWidget } from '@/components/dashboard/TaskWidget';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { NewsWidget } from '@/components/dashboard/NewsWidget';
import { JumpScare } from '@/components/dashboard/JumpScare';
import { RandomEventOverlay } from '@/components/dashboard/RandomEventOverlay';
import { ActivityGhost } from '@/components/dashboard/ActivityGhost';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

const Index = () => {
  const { timeOfDay, handleInteraction, getThemeClasses } = useDynamicTheme();

  useEffect(() => {
    const handleClick = () => handleInteraction();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleInteraction]);

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden ${getThemeClasses()}`}>
      {/* Background gradient */}
      <div className={`fixed inset-0 pointer-events-none transition-all duration-1000 ${
        timeOfDay === 'witching' 
          ? 'bg-gradient-to-b from-nightmare-shadow via-nightmare-purple/20 to-nightmare-shadow' 
          : 'bg-gradient-to-b from-nightmare-shadow via-nightmare-purple/10 to-nightmare-shadow'
      }`} />

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-nightmare-mist/30 rounded-full"
            initial={{ x: Math.random() * 1000, y: 800 }}
            animate={{ y: -20, x: `+=${Math.sin(i) * 100}` }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: i * 2, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container max-w-7xl mx-auto px-4 py-6 md:py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8 text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground text-glow mb-2">Welcome to the Darkness</h2>
            <p className="text-muted-foreground font-body text-sm md:text-base">
              {timeOfDay === 'witching' ? 'The veil between worlds is thin...' : 'Shadows lurk in every corner.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2"><TaskWidget /></div>
            <div className="md:col-span-1"><WeatherWidget /></div>
            <div className="md:col-span-1 lg:row-span-2"><NewsWidget /></div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="text-center text-xs text-muted-foreground/50 mt-8 font-body">
            Tip: Click the skull logo three times... if you dare 💀
          </motion.p>
        </main>
      </div>

      <JumpScare />
      <RandomEventOverlay />
      <ActivityGhost />

      <div className="fixed inset-0 pointer-events-none z-20" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--nightmare-shadow) / 0.6) 100%)' }} />
    </div>
  );
};

export default Index;
