import { motion } from 'framer-motion';
import { Volume2, VolumeX, Settings, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useSoundStore } from '@/stores/soundStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import nightmareLogo from '@/assets/nightmare-logo.jpg';

export const Header = () => {
  const { timeOfDay, incrementLogoClick } = useThemeStore();
  const { isMuted, toggleMute } = useSoundStore();
  const { playClick, toggleAmbient, ambientPlaying } = useSoundEffects();

  const handleLogoClick = () => {
    playClick();
    incrementLogoClick();
  };

  const handleMuteToggle = () => {
    playClick();
    toggleMute();
  };

  const handleAmbientToggle = () => {
    playClick();
    toggleAmbient();
  };

  const getTimeIcon = () => {
    if (timeOfDay === 'day') return <Sun className="w-5 h-5" />;
    return <Moon className="w-5 h-5" />;
  };

  const getWitchingHourCountdown = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m until witching hour`;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full bg-gradient-to-r from-nightmare-shadow via-card to-nightmare-shadow border-b border-nightmare-blood/30 px-4 py-3 md:px-6"
    >
      {/* Mist overlay */}
      <div className="absolute inset-0 mist-overlay pointer-events-none" />
      
      <div className="relative flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo and Title */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.img
            src={nightmareLogo}
            alt="Nightmare Dashboard"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-nightmare-blood/50 glow-blood"
            animate={{ 
              boxShadow: [
                '0 0 10px hsl(0 70% 35% / 0.3)',
                '0 0 20px hsl(0 70% 35% / 0.5)',
                '0 0 10px hsl(0 70% 35% / 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="hidden sm:block">
            <h1 className="font-heading text-xl md:text-2xl text-foreground text-glow tracking-wider">
              Nightmare Dashboard
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              {timeOfDay === 'witching' ? '🌙 The witching hour is upon us...' : getWitchingHourCountdown()}
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Time indicator */}
          <motion.div 
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border"
            animate={timeOfDay === 'witching' ? { 
              boxShadow: ['0 0 5px hsl(0 70% 35% / 0.3)', '0 0 15px hsl(0 70% 35% / 0.5)', '0 0 5px hsl(0 70% 35% / 0.3)']
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {getTimeIcon()}
            <span className="text-sm font-body capitalize">{timeOfDay}</span>
          </motion.div>

          {/* Ambient sound toggle */}
          <motion.button
            onClick={handleAmbientToggle}
            className={`p-2 rounded-full transition-colors ${
              ambientPlaying ? 'bg-nightmare-blood/30 text-primary' : 'bg-secondary/50 text-muted-foreground'
            } border border-border hover:border-nightmare-blood/50`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={ambientPlaying ? 'Stop ambient sounds' : 'Play ambient sounds'}
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Mute toggle */}
          <motion.button
            onClick={handleMuteToggle}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-destructive/30 text-destructive' : 'bg-secondary/50 text-muted-foreground'
            } border border-border hover:border-nightmare-blood/50`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Decorative drip */}
      <div className="absolute bottom-0 left-1/4 w-1 h-4 bg-nightmare-blood/40 rounded-b-full animate-drip" />
      <div className="absolute bottom-0 right-1/3 w-1 h-3 bg-nightmare-blood/30 rounded-b-full animate-drip" style={{ animationDelay: '1s' }} />
    </motion.header>
  );
};
