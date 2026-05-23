import { useState } from 'react';
import { useAppStore } from '../store';

export default function Rewards() {
  const { stars, coins, exchangeStarsToCoins, exchangeRecords } = useAppStore();
  const [exchangeAmount, setExchangeAmount] = useState(5);
  const [message, setMessage] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">奖励兑换</h1>

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
          <h2 className="text-xl font-bold text-gray-800 mb-4">兑换金币</h2>
          <div className="text-gray-600 mb-6">
            <p className="mb-2">兑换比例：1 星星 = 1 金币</p>
            <p>用金币可以去游戏中心玩小游戏哦！</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">兑换数量</label>
            <div className="flex items-center gap-4 mb-4">
              {[1, 5, 10, 20].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setExchangeAmount(amount)}
                  className={`px-5 py-2 rounded-xl font-bold transition-all ${
                    exchangeAmount === amount
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amount} ⭐
                </button>
              ))}
            </div>
            <div className="text-center text-2xl font-bold text-gray-800 mb-6">
              {exchangeAmount} ⭐ = {exchangeAmount} 💰
            </div>
          </div>

          {message && (
            <div className={`text-center text-lg font-bold mb-4 ${
              message.includes('成功') ? 'text-green-500' : 'text-red-500'
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
            立即兑换
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
            <div className="space-y-3">
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
      </div>
    </div>
  );
}
