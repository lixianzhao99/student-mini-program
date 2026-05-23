import { useAppStore } from '../store';

export default function Profile() {
  const { stars, coins, tasks, achievements, exchangeRecords } = useAppStore();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">我的</h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl text-white mr-4 shadow-md">
              👦
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">小朋友</h2>
              <p className="text-gray-500">加油，你是最棒的！</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-3xl font-bold text-yellow-600">{stars}</div>
              <div className="text-sm text-gray-600">星星</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-3xl font-bold text-amber-600">{coins}</div>
              <div className="text-sm text-gray-600">金币</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{completedTasks}/{totalTasks}</div>
              <div className="text-sm text-gray-600">完成任务</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 成就</h2>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`text-center p-4 rounded-xl transition-all ${
                  achievement.unlockedAt
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-sm font-bold text-gray-800">{achievement.title}</div>
                {achievement.unlockedAt && (
                  <div className="text-xs text-green-600 mt-1">已解锁</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📜 历史记录</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 mb-3">任务完成</h3>
            {tasks.filter(t => t.completed).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                暂无完成的任务
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.filter(t => t.completed).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">
                        {task.type === 'homework' ? '📚' : task.type === 'housework' ? '🧹' : '😊'}
                      </span>
                      <span className="font-medium text-gray-800">{task.title}</span>
                    </div>
                    <span className="text-green-600 font-bold">+{task.rewardStars} ⭐</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-3">兑换记录</h3>
            {exchangeRecords.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                暂无兑换记录
              </div>
            ) : (
              <div className="space-y-2">
                {exchangeRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">🔄</span>
                      <span className="font-medium text-gray-800">
                        {record.starsUsed} ⭐ → {record.coinsEarned} 💰
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
