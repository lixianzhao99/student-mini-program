import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'parent' | 'child';

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

type GameSetting = {
  coinsPerPlay: number;
  dailyLimit: number;
  timeLimit: number;
};

type FamilyMember = {
  id: string;
  name: string;
  role: Role;
  avatar: string;
};

type GamePlayRecord = {
  id: string;
  gameId: string;
  gameName: string;
  playedAt: Date;
};

interface AppState {
  // 用户角色
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  
  // 星星和金币
  stars: number;
  coins: number;
  addStars: (amount: number) => void;
  addCoins: (amount: number) => void;
  
  // 兑换设置（家长设置）
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  exchangeStarsToCoins: (starsAmount: number) => boolean;
  
  // 兑换记录
  exchangeRecords: ExchangeRecord[];
  
  // 任务管理
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  
  // 游戏设置（家长设置）
  gameSettings: GameSetting;
  setGameSettings: (settings: Partial<GameSetting>) => void;
  
  // 今日游戏记录
  todayGamePlays: GamePlayRecord[];
  addGamePlay: (gameId: string, gameName: string) => boolean;
  getTodayPlayCount: () => number;
  
  // 成就
  achievements: Achievement[];
  
  // 家庭管理
  familyMembers: FamilyMember[];
  familyCode: string;
  generateFamilyCode: () => void;
  joinFamily: (code: string) => boolean;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  
  // 重置数据
  resetData: () => void;
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

const initialGameSettings: GameSetting = {
  coinsPerPlay: 5,
  dailyLimit: 5,
  timeLimit: 30,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始角色为小朋友
      currentRole: 'child',
      setCurrentRole: (role) => set({ currentRole: role }),

      stars: 5,
      coins: 0,
      
      addStars: (amount) => set((state) => ({ stars: state.stars + amount })),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),

      // 兑换设置，默认1:1
      exchangeRate: 1,
      setExchangeRate: (rate) => set({ exchangeRate: rate }),

      exchangeStarsToCoins: (starsAmount) => {
        const state = get();
        if (state.stars >= starsAmount) {
          const coinsEarned = Math.floor(starsAmount * state.exchangeRate);
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

      exchangeRecords: [],

      tasks: initialTasks,

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

      completeTask: (taskId) => {
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

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      },

      // 游戏设置
      gameSettings: initialGameSettings,
      setGameSettings: (settings) =>
        set((state) => ({
          gameSettings: { ...state.gameSettings, ...settings },
        })),

      todayGamePlays: [],

      addGamePlay: (gameId, gameName) => {
        const state = get();
        const todayCount = state.getTodayPlayCount();
        
        if (todayCount >= state.gameSettings.dailyLimit) {
          return false;
        }
        
        if (state.coins < state.gameSettings.coinsPerPlay) {
          return false;
        }
        
        set((s) => ({
          coins: s.coins - s.gameSettings.coinsPerPlay,
          todayGamePlays: [
            {
              id: Date.now().toString(),
              gameId,
              gameName,
              playedAt: new Date(),
            },
            ...s.todayGamePlays,
          ],
        }));
        return true;
      },

      getTodayPlayCount: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.todayGamePlays.filter(
          (play) => new Date(play.playedAt).toDateString() === today
        ).length;
      },

      achievements: initialAchievements,

      // 家庭管理
      familyMembers: [
        {
          id: 'parent-1',
          name: '爸爸',
          role: 'parent',
          avatar: '👨',
        },
        {
          id: 'child-1',
          name: '小朋友',
          role: 'child',
          avatar: '👦',
        },
      ],
      
      familyCode: '',
      
      generateFamilyCode: () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        set({ familyCode: code });
      },
      
      joinFamily: (code) => {
        if (code && code.length === 6) {
          set({ familyCode: code });
          return true;
        }
        return false;
      },
      
      addFamilyMember: (member) => {
        set((state) => ({
          familyMembers: [
            ...state.familyMembers,
            {
              ...member,
              id: Date.now().toString(),
            },
          ],
        }));
      },

      resetData: () =>
        set({
          stars: 5,
          coins: 0,
          tasks: initialTasks,
          exchangeRecords: [],
          achievements: initialAchievements,
          gameSettings: initialGameSettings,
          todayGamePlays: [],
        }),
    }),
    {
      name: 'student-mini-program-storage',
    }
  )
);
