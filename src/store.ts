import { create } from 'zustand';

type Task = {
  id: string;
  title: string;
  description?: string;
  type: 'homework' | 'housework' | 'behavior';
  rewardStars: number;
  completed: boolean;
  createdAt: Date;
};

type ExchangeRecord = {
  id: string;
  starsUsed: number;
  coinsEarned: number;
  createdAt: Date;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
};

interface AppState {
  stars: number;
  coins: number;
  tasks: Task[];
  exchangeRecords: ExchangeRecord[];
  achievements: Achievement[];
  addStars: (amount: number) => void;
  addCoins: (amount: number) => void;
  exchangeStarsToCoins: (starsAmount: number) => boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  completeTask: (taskId: string) => void;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: '完成数学作业',
    description: '完成课本第15页的练习题',
    type: 'homework',
    rewardStars: 3,
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: '整理房间',
    description: '把玩具和书本整理好',
    type: 'housework',
    rewardStars: 2,
    completed: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: '主动打招呼',
    description: '见到长辈主动问好',
    type: 'behavior',
    rewardStars: 1,
    completed: false,
    createdAt: new Date(),
  },
];

const initialAchievements: Achievement[] = [
  {
    id: '1',
    title: '新手入门',
    description: '完成第一个任务',
    icon: '🌟',
  },
  {
    id: '2',
    title: '星星收集者',
    description: '累计获得10颗星星',
    icon: '⭐',
  },
  {
    id: '3',
    title: '游戏达人',
    description: '玩过3个小游戏',
    icon: '🎮',
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  stars: 5,
  coins: 0,
  tasks: initialTasks,
  exchangeRecords: [],
  achievements: initialAchievements,

  addStars: (amount: number) => set((state) => ({ stars: state.stars + amount })),

  addCoins: (amount: number) => set((state) => ({ coins: state.coins + amount })),

  exchangeStarsToCoins: (starsAmount: number) => {
    const state = get();
    if (state.stars >= starsAmount) {
      const coinsEarned = starsAmount;
      set((s) => ({
        stars: s.stars - starsAmount,
        coins: s.coins + coinsEarned,
        exchangeRecords: [
          {
            id: Date.now().toString(),
            starsUsed: starsAmount,
            coinsEarned,
            createdAt: new Date(),
          },
          ...s.exchangeRecords,
        ],
      }));
      return true;
    }
    return false;
  },

  addTask: (task) =>
    set((state) => ({
      tasks: [
        {
          ...task,
          id: Date.now().toString(),
          completed: false,
          createdAt: new Date(),
        },
        ...state.tasks,
      ],
    })),

  completeTask: (taskId: string) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      set((s) => ({
        tasks: s.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: true } : t
        ),
        stars: s.stars + task.rewardStars,
      }));
    }
  },
}));
