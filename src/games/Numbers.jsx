import React, { useState, useEffect, useRef } from 'react';
import { Info, Delete, CornerDownLeft, Calendar } from 'lucide-react';
import Instructions from '../components/Instructions';
import Version from '../components/Version';


const Numbers = () => {
  const MAX_GUESSES = 5;
  const NUMBER_LENGTH = 6;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [targetNumber, setTargetNumber] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedPreference = localStorage.getItem('gamesShowInstructions');
    return savedPreference === null ? true : JSON.parse(savedPreference);
  });
  const inputRefs = useRef([]);

  const generateDailyNumber = (date) => {
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
    setTargetNumber(generateDailyNumber(selectedDate));
    inputRefs.current = Array(NUMBER_LENGTH).fill().map((_, i) => inputRefs.current[i] || React.createRef());
  }, [selectedDate]);

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
    
    const isWin = currentGuess === targetNumber;
    if (isWin || newGuesses.length === MAX_GUESSES) {
      setGameOver(true);
    }
    
    setCurrentGuess('');
    setFocusedIndex(0);
  };

  const remainingRows = Array(MAX_GUESSES - guesses.length)
    .fill()
    .map((_, rowIndex) => Array(NUMBER_LENGTH).fill('empty'));

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
    setTargetNumber(generateDailyNumber(newDate));
    startNewGame();
  };

  const startNewGame = () => {
    setGuesses([]);
    setGameOver(false);
    setCurrentGuess('');
    setFocusedIndex(0);
  };

  const playPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
    setTargetNumber(generateDailyNumber(previousDate));
    startNewGame();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, gameOver]);

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Numbers</h2>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark-mode-date
              [&::-webkit-calendar-picker-indicator]:dark:invert
              [&::-webkit-calendar-picker-indicator]:dark:opacity-70
              [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
          />
          <button 
            onClick={() => setShowInstructions(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {showAlert && (
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded">
          {alertMessage}
        </div>
      )}

      {/* Past Guesses Grid */}
      <div className="grid gap-2">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {guess.number.split('').map((digit, digitIndex) => (
              <div
                key={`${rowIndex}-${digitIndex}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-xl font-bold text-white rounded
                  ${guess.results[digitIndex] === 'correct' 
                    ? 'bg-green-500 dark:bg-green-500' 
                    : guess.results[digitIndex] === 'close'
                    ? 'bg-yellow-500 dark:bg-yellow-500' 
                    : 'bg-gray-400 dark:bg-gray-600'}
                  transition-colors
                `}
              >
                {digit}
              </div>
            ))}
          </div>
        ))}

        {/* Current Guess */}
        {!gameOver && (
          <div className="flex gap-2 justify-center">
            {Array(NUMBER_LENGTH).fill().map((_, index) => (
              <div
                key={`current-${index}`}
                className={`
                  w-12 h-12 flex items-center justify-center text-xl font-bold rounded
                  border-2 cursor-pointer transition-all
                  dark:text-white
                  ${index === focusedIndex 
                    ? 'border-blue-500 dark:border-blue-400' 
                    : currentGuess[index]
                    ? 'border-gray-400 dark:border-gray-500' 
                    : 'border-gray-200 dark:border-gray-700'}
                  hover:border-blue-300 dark:hover:border-blue-400
                  bg-white dark:bg-gray-700
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

        {/* Empty Rows */}
        {remainingRows.slice(gameOver ? 0 : 1).map((row, rowIndex) => (
          <div key={`empty-${rowIndex}`} className="flex gap-2 justify-center">
            {row.map((_, digitIndex) => (
              <div
                key={`empty-${rowIndex}-${digitIndex}`}
                className="w-12 h-12 border-2 border-gray-200 dark:border-gray-700 rounded"
              />
            ))}
          </div>
        ))}
      </div>

      {/* Number Pad */}
      {!gameOver && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4].map((number) => (
              <button
                key={number}
                onClick={() => handleDigitInput(number.toString())}
                className="p-4 h-14 font-bold rounded transition-colors
                  bg-gray-200 hover:bg-gray-300 
                  dark:bg-gray-700 dark:hover:bg-gray-600
                  dark:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentGuess.length >= NUMBER_LENGTH}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => setCurrentGuess(prev => prev.slice(0, -1))}
              className="p-4 h-14 rounded transition-colors
                bg-blue-500 hover:bg-blue-600 text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center"
              disabled={currentGuess.length === 0}
            >
              <Delete className="w-6 h-6" />
            </button>
            {[5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleDigitInput(number.toString())}
                className="p-4 h-14 font-bold rounded transition-colors
                  bg-gray-200 hover:bg-gray-300 
                  dark:bg-gray-700 dark:hover:bg-gray-600
                  dark:text-white
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentGuess.length >= NUMBER_LENGTH}
              >
                {number}
              </button>
            ))}
            <button
              onClick={submitGuess}
              className="p-4 h-14 rounded transition-colors
                bg-green-500 hover:bg-green-600 text-white
                disabled:bg-gray-300 dark:disabled:bg-gray-600
                flex items-center justify-center"
              disabled={currentGuess.length !== NUMBER_LENGTH}
            >
              <CornerDownLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Game Over State */}
      {gameOver && (
        <div className="mt-8 space-y-4 max-w-md mx-auto">
          <div className={`text-xl font-bold text-center ${
            guesses[guesses.length - 1].number === targetNumber 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {guesses[guesses.length - 1].number === targetNumber ? (
              <>Congratulations! You solved NUMBERS for {selectedDate.toLocaleDateString()} in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}!</>
            ) : (
              <>Game Over! The number was {targetNumber}</>
            )}
          </div>
          
          <div className="space-y-2">
            <button
              onClick={playPreviousDay}
              className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Play Previous Day
            </button>
            <a
              href="#tiles"
              className="block w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors text-center"
            >
              Try out today's Daily Tile game
            </a>
          </div>
        </div>
      )}

      <Instructions
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Welcome to Daily Numbers!"
      >
        <p>Here's how to play:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Try to guess today's 6-digit number within 5 attempts</li>
          <li>After each guess, you'll get feedback:</li>
          <ul className="list-disc pl-6 space-y-1">
            <li><span className="text-green-500 dark:text-green-400 font-bold">Green</span> means the digit is correct</li>
            <li><span className="text-yellow-500 dark:text-yellow-400 font-bold">Yellow</span> means the digit is within 2 numbers of the correct digit (including wraparound: 9↔0)</li>
            <li><span className="text-gray-500 dark:text-gray-400 font-bold">Gray</span> means the digit is not close</li>
          </ul>
          <li><span className="font-bold">Remember!</span> Numbers wrap around: for example, 9 is within 2 of 0 and 1, and 0 is within 2 of 8 and 9</li>
          <li>You can play previous days' puzzles using the date selector</li>
        </ul>
        <p>Good luck!</p>
      </Instructions>

      <Version gameName="Numbers" />
    </div>
  );
};

export default Numbers;