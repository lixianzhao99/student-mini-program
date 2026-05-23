import { useState, useEffect } from 'react';

interface Color {
  name: string;
  value: string;
}

const colors: Color[] = [
  { name: '红色', value: '#EF4444' },
  { name: '蓝色', value: '#3B82F6' },
  { name: '绿色', value: '#22C55E' },
  { name: '黄色', value: '#EAB308' },
  { name: '紫色', value: '#A855F7' },
  { name: '橙色', value: '#F97316' },
  { name: '粉色', value: '#EC4899' },
  { name: '青色', value: '#06B6D4' },
];

export const ColorGame = () => {
  const [targetColor, setTargetColor] = useState<Color>(colors[0]);
  const [options, setOptions] = useState<Color[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const targetScore = 5;

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(target);
    
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    if (!selected.some(c => c.name === target.name)) {
      selected[0] = target;
    }
    setOptions(selected.sort(() => Math.random() - 0.5));
    setMessage('');
  };

  const checkAnswer = (selectedColor: Color) => {
    if (selectedColor.name === targetColor.name) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">颜色识别</h2>
        <p className="text-gray-600">得分：{score}/{targetScore}</p>
      </div>

      {gameWon ? (
        <div className="text-center">
          <div className="text-6xl mb-4">🎊</div>
          <h3 className="text-2xl font-bold text-purple-600 mb-4">你真棒！</h3>
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all"
          >
            再玩一次
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div 
            className="w-full h-40 rounded-2xl mb-6 shadow-lg"
            style={{ backgroundColor: targetColor.value }}
          />
          <p className="text-xl font-bold text-center mb-4 text-gray-800">
            这是什么颜色？
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {options.map((color, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(color)}
                className="py-4 px-6 text-xl font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                style={{ backgroundColor: color.value, color: 'white' }}
              >
                {color.name}
              </button>
            ))}
          </div>
          {message && (
            <div className={`text-center text-xl font-bold ${
              message.includes('对') ? 'text-green-500' : 'text-red-500'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
