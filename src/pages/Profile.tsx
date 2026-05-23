import { useState } from 'react';
import { useAppStore } from '../store';

export default function Profile() {
  const {
    stars, coins, tasks, achievements, exchangeRecords, todayGamePlays,
    currentRole, setCurrentRole, familyCode, generateFamilyCode, joinFamily,
    addFamilyMember, gameSettings, setGameSettings, resetData
  } = useAppStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [newMember, setNewMember] = useState({ name: '', role: 'child' as 'parent' | 'child' });

  const isParent = currentRole === 'parent';
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  const handleGenerateCode = () => {
    generateFamilyCode();
  };

  const handleJoinFamily = () => {
    if (joinCode.length === 6) {
      joinFamily(joinCode.toUpperCase());
      setJoinCode('');
      alert('加入成功！');
    }
  };

  const handleAddMember = () => {
    if (newMember.name) {
      addFamilyMember(newMember);
      setNewMember({ name: '', role: 'child' });
    }
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    alert('数据已重置！');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">个人中心</h1>

      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl text-white mr-4 shadow-md">
            {isParent ? '👨' : '👦'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isParent ? '家长' : '小朋友'}
            </h2>
            <p className="text-gray-500">
              {isParent ? '管理任务和奖励设置' : '完成更多任务获得奖励！'}
            </p>
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

      {isParent && (
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">家长设置</h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl font-bold text-left flex items-center justify-between"
            >
              <span>⚙️ 游戏和兑换设置</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setShowFamily(true)}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-xl font-bold text-left flex items-center justify-between"
            >
              <span>👨‍👩‍👧 家庭管理</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-xl font-bold text-left flex items-center justify-between"
            >
              <span>🗑️ 重置所有数据</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

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
            <div className="space-y-2 max-h-48 overflow-y-auto">
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
          <h3 className="text-lg font-bold text-gray-700 mb-3">游戏记录</h3>
          {todayGamePlays.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              今日暂无游戏记录
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todayGamePlays.map((play) => (
                <div
                  key={play.id}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🎮</span>
                    <span className="font-medium text-gray-800">{play.gameName}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(play.playedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">游戏和兑换设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  每次游戏消耗金币
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={gameSettings.coinsPerPlay}
                  onChange={(e) => setGameSettings({ coinsPerPlay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  每日游戏次数限制
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={gameSettings.dailyLimit}
                  onChange={(e) => setGameSettings({ dailyLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  游戏时间限制（分钟）
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={gameSettings.timeLimit}
                  onChange={(e) => setGameSettings({ timeLimit: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {showFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">家庭管理</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  家庭邀请码
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={familyCode || '暂无'}
                    readOnly
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-center font-bold text-lg"
                  />
                  <button
                    onClick={handleGenerateCode}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
                  >
                    生成
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  分享邀请码给家庭成员，他们可以加入同一个家庭
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  加入已有家庭
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="输入邀请码"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 text-center font-bold text-lg"
                  />
                  <button
                    onClick={handleJoinFamily}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600"
                  >
                    加入
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  添加家庭成员
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="成员名称"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'parent' | 'child' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500"
                  >
                    <option value="child">👦 小朋友</option>
                    <option value="parent">👨 家长</option>
                  </select>
                  <button
                    onClick={handleAddMember}
                    disabled={!newMember.name}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 disabled:opacity-50"
                  >
                    添加成员
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowFamily(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ 确认重置</h2>
            <p className="text-gray-700 mb-6">
              确定要重置所有数据吗？这将删除所有任务、星星、金币和游戏记录，此操作不可撤销！
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
