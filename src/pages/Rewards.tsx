import { useState } from 'react';
import { useAppStore } from '../store';

export default function Rewards() {
  const { stars, coins, exchangeRate, setExchangeRate, exchangeStarsToCoins, exchangeRecords, currentRole } = useAppStore();
  const [exchangeAmount, setExchangeAmount] = useState(5);
  const [message, setMessage] = useState('');
  const [showRateModal, setShowRateModal] = useState(false);
  const [newRate, setNewRate] = useState(exchangeRate);

  const isParent = currentRole === 'parent';

  const handleExchange = () => {
    if (stars >= exchangeAmount) {
      const success = exchangeStarsToCoins(exchangeAmount);
      if (success) {
        setMessage('兑换成功！');
        setTimeout(() => setMessage(''), 2000);
      }
    } else {
      setMessage('星星不足');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleSetRate = () => {
    if (newRate > 0 && newRate <= 10) {
      setExchangeRate(newRate);
      setShowRateModal(false);
      setMessage(`兑换比例已更新为 1:${newRate}`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const coinsToReceive = Math.floor(exchangeAmount * exchangeRate);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">奖励商城</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-3xl font-bold">{stars}</div>
          <div className="text-sm opacity-90">我的星星</div>
        </div>
        <div className="bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-3xl font-bold">{coins}</div>
          <div className="text-sm opacity-90">我的金币</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">兑换金币</h2>
          {isParent && (
            <button
              onClick={() => setShowRateModal(true)}
              className="text-blue-500 text-sm font-bold hover:text-blue-700"
            >
              ⚙️ 设置兑换比例
            </button>
          )}
        </div>
        
        <div className="text-gray-600 mb-6">
          <p className="mb-2">当前兑换比例：<span className="font-bold text-blue-600">1 星星 = {exchangeRate} 金币</span></p>
          <p className="text-sm">用金币可以去游戏中心玩小游戏哦！</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">选择兑换数量</label>
          <div className="flex items-center gap-4 mb-4">
            {[1, 5, 10, 20, 50].map((amount) => (
              <button
                key={amount}
                onClick={() => setExchangeAmount(amount)}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  exchangeAmount === amount
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {amount} ⭐
              </button>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl text-center mb-6">
            <div className="text-lg font-bold text-gray-800 mb-2">
              {exchangeAmount} ⭐
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ↓
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {coinsToReceive} 💰
            </div>
          </div>
        </div>

        {message && (
          <div className={`text-center text-lg font-bold mb-4 ${
            message.includes('成功') || message.includes('更新') ? 'text-green-500' : 'text-red-500'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleExchange}
          disabled={stars < exchangeAmount}
          className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
            stars >= exchangeAmount
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {stars < exchangeAmount ? '星星不足' : '立即兑换'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">兑换记录</h2>
        {exchangeRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>暂无兑换记录</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {exchangeRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🔄</span>
                  <div>
                    <div className="font-bold text-gray-800">
                      {record.starsUsed} ⭐ → {record.coinsEarned} 💰
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className="text-green-500 font-bold">✅</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">设置兑换比例</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  每颗星星兑换金币数
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={newRate}
                  onChange={(e) => setNewRate(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 text-center text-2xl font-bold"
                />
                <p className="text-sm text-gray-500 mt-2">
                  范围：0.5 - 10 金币/星星
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>示例：</strong>如果设置为 2，则 1 颗星星可以兑换 2 金币
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRateModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSetRate}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                >
                  保存设置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
