import { useState, useEffect } from 'react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🎈', '🌟', '🎨', '🎮', '🦋', '🌸', '🍎', '🚀'];

export const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      checkMatch(newFlipped, newCards);
    }
  };

  const checkMatch = (flipped: number[], currentCards: Card[]) => {
    const [first, second] = flipped;
    if (currentCards[first].emoji === currentCards[second].emoji) {
      const newCards = [...currentCards];
      newCards[first].isMatched = true;
      newCards[second].isMatched = true;
      setCards(newCards);
      setFlippedCards([]);

      if (newCards.every((card) => card.isMatched)) {
        setGameWon(true);
      }
    } else {
      setTimeout(() => {
        const newCards = [...currentCards];
        newCards[first].isFlipped = false;
        newCards[second].isFlipped = false;
        setCards(newCards);
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">记忆配对</h2>
        <p className="text-gray-600">移动次数：{moves}</p>
      </div>

      {gameWon ? (
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-600 mb-4">恭喜你赢了！</h3>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
          >
            再玩一次
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-3xl sm:text-4xl rounded-xl cursor-pointer transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white shadow-lg transform scale-105'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
