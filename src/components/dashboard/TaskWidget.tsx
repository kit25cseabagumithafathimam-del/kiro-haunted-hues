import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const TaskWidget = () => {
  const [newTask, setNewTask] = useState('');
  const { tasks, addTask, toggleTask, deleteTask } = useDashboardStore();
  const { playClick, playComplete, playHover } = useSoundEffects();

  const handleAddTask = () => {
    if (newTask.trim()) {
      playClick();
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleToggle = (id: string, completed: boolean) => {
    if (!completed) {
      playComplete();
    } else {
      playClick();
    }
    toggleTask(id);
  };

  const handleDelete = (id: string) => {
    playClick();
    deleteTask(id);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const allCompleted = tasks.length > 0 && completedCount === tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative bg-card rounded-lg border border-border p-4 md:p-6 overflow-hidden"
    >
      {/* Glow effect when all completed */}
      {allCompleted && (
        <motion.div
          className="absolute inset-0 bg-nightmare-glow/10 pointer-events-none"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Cobweb decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-muted-foreground">
          <path d="M100 0 L100 100 L0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 0 L50 50 L100 100" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M100 0 L25 75 L100 100" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Skull className="w-6 h-6 text-nightmare-blood" />
        </motion.div>
        <h2 className="font-heading text-lg md:text-xl text-foreground">Haunted Tasks</h2>
        <span className="ml-auto text-sm text-muted-foreground font-body">
          {completedCount}/{tasks.length}
        </span>
      </div>

      {/* Add task input */}
      <div className="flex gap-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add a dark deed..."
          className="flex-1 bg-input border-border focus:border-nightmare-blood/50 font-body"
        />
        <Button
          onClick={handleAddTask}
          onMouseEnter={() => playHover()}
          className="bg-nightmare-blood/80 hover:bg-nightmare-blood text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center gap-3 p-3 rounded-md border transition-all ${
                task.completed 
                  ? 'bg-muted/30 border-muted text-muted-foreground' 
                  : 'bg-secondary/30 border-border hover:border-nightmare-blood/30'
              }`}
            >
              <motion.button
                onClick={() => handleToggle(task.id, task.completed)}
                onMouseEnter={() => playHover()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-nightmare-glow" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-nightmare-blood" />
                )}
              </motion.button>
              
              <span className={`flex-1 font-body text-sm ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </span>

              {/* Blood drip effect on completed */}
              {task.completed && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-transparent via-nightmare-blood/50 to-transparent"
                />
              )}

              <motion.button
                onClick={() => handleDelete(task.id)}
                onMouseEnter={() => playHover()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-8 text-sm">
            No tasks yet... the spirits await your commands
          </p>
        )}
      </div>
    </motion.div>
  );
};
