import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  timestamp: Date;
  isRead: boolean;
}

interface WeatherData {
  temperature: number;
  condition: 'foggy' | 'stormy' | 'cloudy' | 'moonlit' | 'haunted';
  moonPhase: 'new' | 'waxing' | 'full' | 'waning';
  humidity: number;
  windSpeed: number;
}

interface DashboardState {
  tasks: Task[];
  news: NewsItem[];
  weather: WeatherData;
  completedTasksStreak: number;
  
  // Task actions
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // News actions
  markNewsRead: (id: string) => void;
  
  // Weather actions
  updateWeather: () => void;
}

const hauntedHeadlines: Omit<NewsItem, 'id' | 'timestamp' | 'isRead'>[] = [
  { title: "Strange Lights Spotted Over Abandoned Cemetery", category: "Paranormal" },
  { title: "Local Mansion Reports Third Ghostly Sighting This Week", category: "Local" },
  { title: "Scientists Baffled by Unexplained Temperature Drops", category: "Science" },
  { title: "Ancient Tome Discovered in Forgotten Crypt", category: "Discovery" },
  { title: "Midnight Howling Disturbs Peaceful Neighborhood", category: "Local" },
  { title: "Blood Moon Eclipse Predicted for Tonight", category: "Astronomy" },
  { title: "Whispers Heard in Empty Theater After Midnight", category: "Paranormal" },
  { title: "Fog Bank Refuses to Lift for Third Consecutive Day", category: "Weather" },
];

const generateWeather = (): WeatherData => {
  const conditions: WeatherData['condition'][] = ['foggy', 'stormy', 'cloudy', 'moonlit', 'haunted'];
  const phases: WeatherData['moonPhase'][] = ['new', 'waxing', 'full', 'waning'];
  
  return {
    temperature: Math.floor(Math.random() * 15) + 5, // 5-20°C, always cold
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    moonPhase: phases[Math.floor(Math.random() * phases.length)],
    humidity: Math.floor(Math.random() * 40) + 60, // 60-100%
    windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35 km/h
  };
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  tasks: [
    { id: '1', title: 'Investigate the old manor', completed: false, createdAt: new Date() },
    { id: '2', title: 'Gather ingredients for the ritual', completed: false, createdAt: new Date() },
    { id: '3', title: 'Decipher the ancient manuscript', completed: true, createdAt: new Date() },
  ],
  
  news: hauntedHeadlines.slice(0, 5).map((item, index) => ({
    ...item,
    id: `news-${index}`,
    timestamp: new Date(Date.now() - index * 3600000),
    isRead: false,
  })),
  
  weather: generateWeather(),
  completedTasksStreak: 0,

  addTask: (title) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date(),
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  toggleTask: (id) => {
    set((state) => {
      const tasks = state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      const completedCount = tasks.filter(t => t.completed).length;
      const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);
      
      return {
        tasks,
        completedTasksStreak: allCompleted ? state.completedTasksStreak + 1 : completedCount,
      };
    });
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  markNewsRead: (id) => {
    set((state) => ({
      news: state.news.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      ),
    }));
  },

  updateWeather: () => {
    set({ weather: generateWeather() });
  },
}));
