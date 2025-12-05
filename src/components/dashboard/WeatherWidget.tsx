import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudLightning, Moon, Skull, Wind, Droplets, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';

const weatherIcons = {
  foggy: Cloud,
  stormy: CloudLightning,
  cloudy: Cloud,
  moonlit: Moon,
  haunted: Skull,
};

const moonPhaseEmoji = {
  new: '🌑',
  waxing: '🌓',
  full: '🌕',
  waning: '🌗',
};

export const WeatherWidget = () => {
  const { weather, updateWeather } = useDashboardStore();
  const { playClick, playThunder, playHover } = useSoundEffects();

  const WeatherIcon = weatherIcons[weather.condition];

  const handleRefresh = () => {
    playClick();
    updateWeather();
  };

  // Play thunder sound for stormy weather
  useEffect(() => {
    if (weather.condition === 'stormy') {
      const timeout = setTimeout(playThunder, 1000);
      return () => clearTimeout(timeout);
    }
  }, [weather.condition, playThunder]);

  const getConditionDescription = () => {
    const descriptions = {
      foggy: 'Dense fog rolls through the streets...',
      stormy: 'Thunder echoes from the beyond...',
      cloudy: 'Dark clouds gather ominously...',
      moonlit: 'The pale moon watches over all...',
      haunted: 'Spirits stir in the air...',
    };
    return descriptions[weather.condition];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative bg-card rounded-lg border border-border p-4 md:p-6 overflow-hidden"
    >
      {/* Fog overlay for foggy weather */}
      {weather.condition === 'foggy' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-nightmare-mist/10 to-transparent pointer-events-none"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}

      {/* Lightning flash for stormy */}
      {weather.condition === 'stormy' && (
        <motion.div
          className="absolute inset-0 bg-white/5 pointer-events-none"
          animate={{ opacity: [0, 0, 0.3, 0, 0, 0, 0.2, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg md:text-xl text-foreground">Cursed Weather</h2>
        <motion.button
          onClick={handleRefresh}
          onMouseEnter={() => playHover()}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="p-2 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main weather display */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={weather.condition === 'stormy' ? { 
            scale: [1, 1.1, 1],
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
          } : {
            y: [0, -5, 0],
          }}
          transition={{ duration: weather.condition === 'stormy' ? 0.3 : 3, repeat: Infinity }}
          className="p-4 rounded-full bg-nightmare-purple/30 border border-nightmare-blood/30"
        >
          <WeatherIcon className="w-10 h-10 md:w-12 md:h-12 text-nightmare-glow" />
        </motion.div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-heading text-foreground">{weather.temperature}</span>
            <span className="text-xl text-muted-foreground">°C</span>
          </div>
          <p className="text-sm text-muted-foreground font-body capitalize">{weather.condition}</p>
        </div>
      </div>

      {/* Description */}
      <motion.p
        key={weather.condition}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground font-body italic mb-4"
      >
        {getConditionDescription()}
      </motion.p>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Moon phase */}
        <div className="flex flex-col items-center p-2 rounded-md bg-secondary/30 border border-border">
          <span className="text-2xl mb-1">{moonPhaseEmoji[weather.moonPhase]}</span>
          <span className="text-xs text-muted-foreground capitalize">{weather.moonPhase}</span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col items-center p-2 rounded-md bg-secondary/30 border border-border">
          <Droplets className="w-5 h-5 text-nightmare-mist mb-1" />
          <span className="text-sm text-foreground">{weather.humidity}%</span>
          <span className="text-xs text-muted-foreground">Humidity</span>
        </div>

        {/* Wind */}
        <div className="flex flex-col items-center p-2 rounded-md bg-secondary/30 border border-border">
          <Wind className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-sm text-foreground">{weather.windSpeed}</span>
          <span className="text-xs text-muted-foreground">km/h</span>
        </div>
      </div>

      {/* Moon glow effect for moonlit */}
      {weather.moonPhase === 'full' && (
        <motion.div
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-nightmare-mist/20"
          animate={{ 
            boxShadow: ['0 0 10px hsl(270 30% 70% / 0.3)', '0 0 30px hsl(270 30% 70% / 0.5)', '0 0 10px hsl(270 30% 70% / 0.3)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};
