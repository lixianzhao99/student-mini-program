import { useState } from 'react';
import { useAppStore } from '../store';
import { MemoryGame } from '../games/MemoryGame';
import { MathGame } from '../games/MathGame';
import { ColorGame } from '../games/ColorGame';

const games = [
  {
    id: 'memory',
    title: '记忆配对',
    description: '翻牌配对，锻炼记忆力！',
    icon: '🎯',
    coinCost: 5,
    component: MemoryGame,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'math',
    title: '数学加法',
    description: '快速计算，提升算数能力！',
    icon: '🔢',
    coinCost: 5,
    component: MathGame,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'color',
    title: '颜色识别',
    description: '认识颜色，增强观察力！',
    icon: '🎨',
    coinCost: 5,
    component: ColorGame,
    color: 'from-purple-500 to-purple-600',
  },
];

export default function Games() {
  const { coins, addCoins } = useAppStore();
  const [activeGame, setActiveGame] = useState<typeof games[0] | null>(null);
  const [message, setMessage] = useState('');

  const startGame = (game: typeof games[0]) => {
    if (coins >= game.coinCost) {
      addCoins(-game.coinCost);
      setActiveGame(game);
      setMessage('');
    } else {
      setMessage('金币不足，快去兑换吧！');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  if (activeGame) {
    const GameComponent = activeGame.component;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="p-4 flex items-center justify-between mb-4">
          <button
            onClick={closeGame}
            className="bg-white px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all"
          >
            ← 返回
          </button>
          <div className="bg-white px-4 py-2 rounded-xl font-bold shadow-lg">
            💰 {coins}
          </div>
        </div>
        <GameComponent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">游戏中心</h1>
          <div className="bg-white px-4 py-2 rounded-xl font-bold shadow-lg">
            💰 {coins}
          </div>
        </div>

        {message && (
          <div className="bg-red-100 text-red-600 text-center py-3 rounded-xl mb-6 font-bold">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mr-4 shadow-md`}>
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{game.title}</h3>
                    <p className="text-gray-500">{game.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => startGame(game)}
                  disabled={coins < game.coinCost}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    coins >= game.coinCost
                      ? `bg-gradient-to-r ${game.color} text-white hover:shadow-lg hover:scale-105`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {game.coinCost} 💰 开始
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">游戏说明</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              完成任务可以获得星星
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              用星星可以兑换金币
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              用金币可以玩小游戏
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
