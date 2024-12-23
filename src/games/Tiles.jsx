import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Info } from 'lucide-react';
import Instructions from '../components/Instructions';
import Version from '../components/Version';


const Tiles = () => {
  const [gameState, setGameState] = useState('playing');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [userPattern, setUserPattern] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  const [originalState, setOriginalState] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedPreference = localStorage.getItem('gamesShowInstructions');
    return savedPreference === null ? true : JSON.parse(savedPreference);
  });
  const [isSpinning, setIsSpinning] = useState(false);
  
  const generateDailyPattern = (date) => {
    let seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    
    const seededRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const pattern = Array(4).fill().map(() => Array(4).fill(0));
    let squaresPlaced = 0;
    while (squaresPlaced < 3) {
      const row = Math.floor(seededRandom() * 4);
      const col = Math.floor(seededRandom() * 4);
      
      if (pattern[row][col] === 0) {
        pattern[row][col] = 1;
        squaresPlaced++;
      }
    }

    return pattern;
  };

  const [dailyPattern, setDailyPattern] = useState(generateDailyPattern(selectedDate));

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
    setDailyPattern(generateDailyPattern(newDate));
    startNewGame();
  };

  const confirmPattern = useCallback(() => {
    if (gameState !== 'playing' || isSpinning) return;
    
    setIsSpinning(true);
    
    let correctCount = 0;
    const selectedPositions = [];
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (userPattern[i][j] === 4) {
          selectedPositions.push([i, j]);
          if (dailyPattern[i][j] === 1) {
            correctCount++;
          }
        }
      }
    }
    
    const newUserPattern = [...userPattern].map(row => [...row]);
    
    setTimeout(() => {
      setIsSpinning(false);
      setAttempts(prev => prev + 1);
      // Create new originalState array
      const newOriginalState = [...originalState].map(row => [...row]);
      
      selectedPositions.forEach(([i, j]) => {
        if (correctCount === 3) {
          setGameState('complete');
          setFeedback(`Congratulations, you solved TILES for ${selectedDate.toLocaleDateString()} in ${attempts + 1} ${attempts === 0 ? 'attempt' : 'attempts'}!`);
        } else if (correctCount === 0) {
          newUserPattern[i][j] = 1; // gray
          newOriginalState[i][j] = 1; // store gray in original state
        } else {
          // Only set to yellow if it wasn't previously gray (sticky gray implementation)
          if (originalState[i][j] !== 1) {
            newUserPattern[i][j] = 3; // yellow
            newOriginalState[i][j] = 3; // store yellow in original state
          } else {
            // Keep it gray if it was previously gray
            newUserPattern[i][j] = 1;
            newOriginalState[i][j] = 1;
          }
        }
      });
      
      setOriginalState(newOriginalState);
      
      setUserPattern(newUserPattern);
      
      if (correctCount > 0 && correctCount < 3) {
        setFeedback(`${correctCount} out of 3 squares are correct!`);
      } else if (correctCount === 0) {
        setFeedback('None of these squares are correct.');
      }
    }, 650); // Slightly longer than the animation duration
  }, [gameState, userPattern, dailyPattern, attempts, selectedDate, isSpinning]);

  useEffect(() => {
    const checkCurrentSelections = () => {
      const currentSelections = userPattern.flat().filter(cell => cell === 4).length;
      if (currentSelections === 3 && gameState === 'playing') {
        confirmPattern();
      }
    };
    checkCurrentSelections();
  }, [userPattern, gameState, confirmPattern]);

  const handleCellClick = (row, col) => {
    if (gameState !== 'playing') return;
    
    const newUserPattern = [...userPattern];
    newUserPattern[row] = [...newUserPattern[row]];
    
    if (newUserPattern[row][col] === 4) {
      // If unselecting a tile, return it to its original state
      newUserPattern[row][col] = originalState[row][col];
    } else {
      const currentSelections = newUserPattern.flat().filter(cell => cell === 4).length;
      if (currentSelections >= 3) {
        setFeedback('You can only select 3 squares at a time');
        return;
      }
      newUserPattern[row][col] = 4;
    }
    
    setUserPattern(newUserPattern);
    setFeedback('');
  };

  const startNewGame = () => {
    setGameState('playing');
    setUserPattern(Array(4).fill().map(() => Array(4).fill(0)));
    setOriginalState(Array(4).fill().map(() => Array(4).fill(0)));
    setFeedback('');
    setAttempts(0);
    setIsSpinning(false);
  };

  const playPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
    setDailyPattern(generateDailyPattern(previousDate));
    startNewGame();
  };

  const getColorClass = (state, isComplete = false) => {
    if (isComplete) {
      return 'bg-green-500 dark:bg-green-500 border-2 border-green-600 dark:border-green-400';
    }
    
    switch (state) {
      case 1: // Gray (incorrect) - using your dark mode colors
        return 'bg-gray-300 dark:bg-gray-700';
      case 3: // Yellow indicator
        return 'bg-yellow-300 dark:bg-yellow-500';
      case 4: // Selected state
        return 'bg-blue-200 dark:bg-blue-500/50';
      default: // Empty state
        return 'bg-white dark:bg-gray-800';
    }
  };
  
  const renderCell = (row, col) => {
    const cellState = userPattern[row][col];
    const isComplete = gameState === 'complete';
    const isSelected = cellState === 4;
    
    return (
      <div
        data-row={row}
        data-col={col}
        onClick={() => handleCellClick(row, col)}
        className={`
          w-14 h-14 transition-all duration-200
          ${isSelected && isSpinning ? 'animate-[spin_0.6s_ease-in-out_1]' : ''}
          ${isComplete && dailyPattern[row][col] === 1 
            ? getColorClass(cellState, true)
            : getColorClass(cellState)}
          ${cellState === 4 
            ? 'border-4 border-blue-500 dark:border-blue-400' 
            : 'border-2 border-gray-300 dark:border-gray-600'}
          ${gameState === 'playing' 
            ? 'hover:border-blue-300 dark:hover:border-blue-400 cursor-pointer' 
            : 'cursor-not-allowed'}
        `}
      />
    );
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-6 relative">
      {/* Game Header Row */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Tiles</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={formatDateForInput(selectedDate)}
            onChange={handleDateChange}
            max={formatDateForInput(today)}
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

      {/* Game Content */}
      <div className="grid grid-cols-4 gap-2 mb-6 mx-auto w-fit">
        {[0, 1, 2, 3].map(row => (
          <React.Fragment key={row}>
            {[0, 1, 2, 3].map(col => (
              <React.Fragment key={`${row}-${col}`}>
                {renderCell(row, col)}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="space-y-4">
        {feedback && (
          <p className={`text-center mb-4 ${
            gameState === 'complete' 
              ? 'text-green-600 dark:text-green-400 font-bold text-xl' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {feedback}
          </p>
        )}

        {gameState === 'complete' && (
          <div className="space-y-2">
            <button
              onClick={playPreviousDay}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Play Previous Day
            </button>
            <a
              href="#numbers"
              className="block w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-center"
            >
              Try out today's Daily Number game
            </a>
          </div>
        )}
      </div>

      <Instructions
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Welcome to Daily Tiles!"
      >
        <p>Here's how to play:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>There are 3 hidden tiles in the 4x4 grid</li>
          <li>Select 3 tiles to make a guess</li>
          <li><span className="text-yellow-500 font-bold">Yellow</span> tiles means that at least one of the 3 tiles is correct</li>
          <li><span className="text-gray-500 font-bold">Gray</span> tiles mean none of the 3 tiles were correct</li>
          <li>Keep guessing until you find all 3 tiles</li>
          <li>You can play previous days' puzzles using the date selector</li>
        </ul>
        <p>Good luck!</p>
      </Instructions>

      <Version gameName="Tiles" />
    </div>
  );
};

export default Tiles;