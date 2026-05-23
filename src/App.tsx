import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Rewards from './pages/Rewards';
import Games from './pages/Games';
import Profile from './pages/Profile';
import { useAppStore } from './store';

function TopNav() {
  const { currentRole, setCurrentRole, stars, coins } = useAppStore();
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">🎓 成长乐园</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="opacity-80">⭐ {stars}</span>
            <span className="mx-2">|</span>
            <span>💰 {coins}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentRole('parent')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
            currentRole === 'parent'
              ? 'bg-white text-purple-600 shadow-md'
              : 'bg-purple-400 hover:bg-purple-300'
          }`}
        >
          👨 家长模式
        </button>
        <button
          onClick={() => setCurrentRole('child')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
            currentRole === 'child'
              ? 'bg-white text-blue-600 shadow-md'
              : 'bg-blue-400 hover:bg-blue-300'
          }`}
        >
          👦 小朋友模式
        </button>
      </div>
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: '首页' },
    { path: '/tasks', icon: '📋', label: '任务' },
    { path: '/rewards', icon: '🎁', label: '兑换' },
    { path: '/games', icon: '🎮', label: '游戏' },
    { path: '/profile', icon: '👤', label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-bold">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <TopNav />
        <div className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/games" element={<Games />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}
