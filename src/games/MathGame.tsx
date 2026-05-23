import { useState, useEffect } from 'react';

export const MathGame = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const targetScore = 5;

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setMessage('');
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    if (answer === num1 + num2) {
      setScore((s) => {
        const newScore = s + 1;
        if (newScore >= targetScore) {
          setGameWon(true);
        }
        return newScore;
      });
      setMessage('答对了！');
      setTimeout(generateQuestion, 1000);
    } else {
      setMessage('再试一次！');
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameWon(false);
    generateQuestion();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">数学加法</h2>
        <p className="text-gray-600">得分：{score}/{targetScore}</p>
      </div>

      {gameWon ? (
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">太棒了！你赢了！</h3>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
          >
            再玩一次
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xs">
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
            <div className="text-6xl font-bold text-center text-gray-800 mb-6">
              {num1} + {num2} = ?
            </div>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full text-center text-3xl font-bold py-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
              placeholder="?"
              autoFocus
            />
            {message && (
              <div className={`text-center text-xl font-bold ${
                message.includes('对') ? 'text-green-500' : 'text-red-500'
              }`}>
                {message}
              </div>
            )}
          </div>
          <button
            onClick={checkAnswer}
            disabled={!userAnswer}
            className="w-full py-4 bg-green-500 text-white text-xl font-bold rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            提交答案
          </button>
        </div>
      )}
    </div>
  );
};
