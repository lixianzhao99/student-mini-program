import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Rewards from './pages/Rewards';
import Games from './pages/Games';
import Profile from './pages/Profile';

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
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
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
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/games" element={<Games />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
