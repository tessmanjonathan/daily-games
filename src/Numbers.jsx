import React, { useState, useEffect, useRef } from 'react';

const Numbers = () => {
  const MAX_GUESSES = 6;
  const NUMBER_LENGTH = 6;
  
  const [targetNumber, setTargetNumber] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);

  const generateDailyNumber = () => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
      hash = hash & hash;
    }
    let number = '';
    let seed = Math.abs(hash);
    for (let i = 0; i < NUMBER_LENGTH; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      number += Math.floor((seed / 233280) * 10).toString();
    }
    return number;
  };

  useEffect(() => {
    setTargetNumber(generateDailyNumber());
    inputRefs.current = Array(NUMBER_LENGTH).fill().map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  const isWithinTwo = (guess, target) => {
    const g = parseInt(guess);
    const t = parseInt(target);
    if (g === t) return 'correct';
    const diff = Math.abs(g - t);
    const wrapDiff = 10 - diff;
    return (diff <= 2 || wrapDiff <= 2) ? 'close' : 'wrong';
  };

  const evaluateGuess = (guess) => {
    const results = [];
    for (let i = 0; i < NUMBER_LENGTH; i++) {
      if (guess[i] === targetNumber[i]) {
        results.push('correct');
      } else {
        results.push(isWithinTwo(guess[i], targetNumber[i]));
      }
    }
    return results;
  };

  const handleDigitInput = (digit) => {
    if (gameOver || currentGuess.length >= NUMBER_LENGTH) return;
    setCurrentGuess(prev => {
      const newGuess = prev + digit;
      if (newGuess.length < NUMBER_LENGTH) {
        setFocusedIndex(newGuess.length);
      }
      return newGuess;
    });
  };

  const handleKeyPress = (e) => {
    if (gameOver) return;
    if (e.key === 'Enter' && currentGuess.length === NUMBER_LENGTH) {
      submitGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => {
        const newGuess = prev.slice(0, -1);
        setFocusedIndex(Math.max(0, newGuess.length));
        return newGuess;
      });
    } else if (/^\d$/.test(e.key) && currentGuess.length < NUMBER_LENGTH) {
      handleDigitInput(e.key);
    }
  };

  const handleBoxClick = (index) => {
    if (!gameOver) {
      setFocusedIndex(index);
      inputRefs.current[index]?.focus();
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== NUMBER_LENGTH) {
      setAlertMessage('Please enter all 6 digits');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const results = evaluateGuess(currentGuess);
    const newGuesses = [...guesses, { number: currentGuess, results }];
    setGuesses(newGuesses);
    
    if (currentGuess === targetNumber || newGuesses.length === MAX_GUESSES) {
      setGameOver(true);
    }
    
    setCurrentGuess('');
    setFocusedIndex(0);
  };

  const remainingRows = Array(MAX_GUESSES - guesses.length)
    .fill()
    .map((_, rowIndex) => Array(NUMBER_LENGTH).fill('empty'));

  const resetGame = () => {
    setTargetNumber(generateDailyNumber());
    setGuesses([]);
    setGameOver(false);
    setCurrentGuess('');
    setFocusedIndex(0);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, gameOver]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Number</h2>
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {showAlert && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
          {alertMessage}
        </div>
      )}

      <div className="grid gap-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {guess.number.split('').map((digit, digitIndex) => (
              <div
                key={`${rowIndex}-${digitIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-xl font-bold text-white rounded
                  ${guess.results[digitIndex] === 'correct' ? 'bg-green-500' : 
                    guess.results[digitIndex] === 'close' ? 'bg-yellow-500' : 'bg-gray-400'}
                `}
              >
                {digit}
              </div>
            ))}
          </div>
        ))}

        {!gameOver && (
          <div className="flex gap-2 justify-center">
            {Array(NUMBER_LENGTH).fill().map((_, index) => (
              <div
                key={`current-${index}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-xl font-bold border-2 rounded cursor-pointer
                  ${index === focusedIndex ? 'border-blue-500' : 
                    currentGuess[index] ? 'border-gray-400' : 'border-gray-200'}
                `}
                onClick={() => handleBoxClick(index)}
              >
                <input
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  className="sr-only"
                  onFocus={() => setFocusedIndex(index)}
                />
                {currentGuess[index] || ''}
              </div>
            ))}
          </div>
        )}

        {remainingRows.slice(gameOver ? 0 : 1).map((row, rowIndex) => (
          <div key={`empty-${rowIndex}`} className="flex gap-2 justify-center">
            {row.map((_, digitIndex) => (
              <div
                key={`empty-${rowIndex}-${digitIndex}`}
                className="w-12 h-12 border-2 border-gray-200 rounded"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 max-w-xs mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
            <button
              key={number}
              onClick={() => handleDigitInput(number.toString())}
              className="p-4 bg-gray-200 rounded hover:bg-gray-300 font-bold"
              disabled={gameOver || currentGuess.length >= NUMBER_LENGTH}
            >
              {number}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}
            className="flex-1 p-4 bg-gray-300 rounded hover:bg-gray-400 font-bold"
            disabled={gameOver || currentGuess.length === 0}
          >
            Backspace
          </button>
          <button
            onClick={submitGuess}
            className="flex-1 p-4 bg-green-500 text-white rounded hover:bg-green-600 font-bold disabled:bg-gray-300"
            disabled={gameOver || currentGuess.length !== NUMBER_LENGTH}
          >
            Enter
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="mt-6 text-center">
          {currentGuess === targetNumber ? (
            <div className="text-green-600 font-bold">
              Congratulations! You won in {guesses.length} guesses!
            </div>
          ) : (
            <div className="text-red-600 font-bold">
              Game Over! The number was {targetNumber}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Numbers;