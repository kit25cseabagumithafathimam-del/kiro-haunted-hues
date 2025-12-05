import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Clock, Eye, Ghost } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useThemeStore } from '@/stores/themeStore';
import { formatDistanceToNow } from 'date-fns';

const categoryColors: Record<string, string> = {
  Paranormal: 'bg-nightmare-blood/30 text-red-300 border-nightmare-blood/50',
  Local: 'bg-nightmare-purple/30 text-purple-300 border-nightmare-glow/30',
  Science: 'bg-emerald-900/30 text-emerald-300 border-emerald-700/30',
  Discovery: 'bg-amber-900/30 text-amber-300 border-amber-700/30',
  Astronomy: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/30',
  Weather: 'bg-cyan-900/30 text-cyan-300 border-cyan-700/30',
};

export const NewsWidget = () => {
  const { news, markNewsRead } = useDashboardStore();
  const { randomEventActive, randomEventType } = useThemeStore();
  const { playClick, playNotification, playHover } = useSoundEffects();

  const handleReadNews = (id: string, isRead: boolean) => {
    if (!isRead) {
      playNotification();
    } else {
      playClick();
    }
    markNewsRead(id);
  };

  const getScrambledText = (text: string) => {
    if (randomEventActive && randomEventType === 'text-scramble') {
      const chars = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛈᛇᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';
      return text.split('').map((char, i) => 
        Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : char
      ).join('');
    }
    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative bg-card rounded-lg border border-border p-4 md:p-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotateY: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Newspaper className="w-6 h-6 text-nightmare-glow" />
        </motion.div>
        <h2 className="font-heading text-lg md:text-xl text-foreground">Dark Chronicles</h2>
        
        {/* Ghost indicator for random event */}
        <AnimatePresence>
          {randomEventActive && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ml-auto"
            >
              <Ghost className="w-5 h-5 text-nightmare-mist animate-ghost-float" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* News list */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {news.map((item, index) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleReadNews(item.id, item.isRead)}
              onMouseEnter={() => playHover()}
              className={`group relative p-3 rounded-md border cursor-pointer transition-all ${
                item.isRead
                  ? 'bg-muted/20 border-border opacity-60'
                  : 'bg-secondary/30 border-border hover:border-nightmare-blood/30 hover:bg-secondary/50'
              }`}
            >
              {/* Unread indicator */}
              {!item.isRead && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-nightmare-blood rounded-r-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Category badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-xs rounded-full border ${categoryColors[item.category] || 'bg-secondary text-secondary-foreground border-border'}`}>
                  {item.category}
                </span>
                {item.isRead && <Eye className="w-3 h-3 text-muted-foreground" />}
              </div>

              {/* Title with possible scramble effect */}
              <motion.h3
                className={`font-body text-sm leading-snug ${item.isRead ? 'text-muted-foreground' : 'text-foreground'} ${
                  randomEventActive && randomEventType === 'text-scramble' ? 'animate-flicker' : ''
                }`}
              >
                {getScrambledText(item.title)}
              </motion.h3>

              {/* Timestamp */}
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
              </div>

              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'radial-gradient(circle at center, hsl(var(--nightmare-blood) / 0.1) 0%, transparent 70%)',
                }}
              />
            </motion.article>
          ))}
        </AnimatePresence>

        {news.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-8 text-sm">
            The chronicles are silent... for now
          </p>
        )}
      </div>

      {/* Flickering candle decoration */}
      <motion.div
        className="absolute bottom-2 right-2 w-2 h-4 bg-gradient-to-t from-nightmare-blood/60 to-amber-500/60 rounded-full"
        animate={{ 
          height: ['16px', '14px', '18px', '15px'],
          opacity: [0.8, 1, 0.7, 0.9]
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </motion.div>
  );
};
