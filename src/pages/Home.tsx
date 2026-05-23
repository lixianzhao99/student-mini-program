import { Link } from 'react-router-dom';
import { useAppStore } from '../store';

export default function Home() {
  const { stars, coins, tasks, completeTask } = useAppStore();
  const recentTasks = tasks.slice(0, 3);

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'homework': return '📚';
      case 'housework': return '🧹';
      case 'behavior': return '😊';
      default: return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">我的奖励</h1>
          <p className="text-gray-600">完成任务，赢取奖励！</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold">{stars}</div>
            <div className="text-sm opacity-90">星星</div>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold">{coins}</div>
            <div className="text-sm opacity-90">金币</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            to="/tasks"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <div className="text-4xl mb-2">📋</div>
            <div className="font-bold">任务中心</div>
          </Link>
          <Link
            to="/rewards"
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <div className="text-4xl mb-2">🎁</div>
            <div className="font-bold">奖励兑换</div>
          </Link>
          <Link
            to="/games"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <div className="text-4xl mb-2">🎮</div>
            <div className="font-bold">小游戏</div>
          </Link>
          <Link
            to="/profile"
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-2xl p-6 text-center shadow-lg transition-all hover:scale-105"
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="font-bold">我的</div>
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">最近任务</h2>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-4 shadow-md transition-all ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{getTypeEmoji(task.type)}</span>
                    <div>
                      <div className="font-bold text-gray-800">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500">{task.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500 font-bold mr-3">
                      +{task.rewardStars}⭐
                    </span>
                    {!task.completed ? (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-all"
                      >
                        完成
                      </button>
                    ) : (
                      <span className="text-green-500 font-bold text-sm">✅ 已完成</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
