import React, { useState } from 'react';
import { RefreshCw, Calendar, Info, X } from 'lucide-react';

const TileGame = () => {
  const [gameState, setGameState] = useState('playing');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAnimation, setShowAnimation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const [userPattern, setUserPattern] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  
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

  const handleCellClick = (row, col) => {
    if (gameState !== 'playing') return;
    
    const newUserPattern = [...userPattern];
    newUserPattern[row] = [...newUserPattern[row]];
    
    if (newUserPattern[row][col] === 4) {
      // Remove selection state but maintain the tile's color
      newUserPattern[row][col] = userPattern[row][col];
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

  const confirmPattern = () => {
    const currentSelections = userPattern.flat().filter(cell => cell === 4).length;
    if (currentSelections !== 3) {
      setFeedback('You must select exactly 3 squares!');
      return;
    }

    setAttempts(prev => prev + 1);
    setShowAnimation(true);
    
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
      selectedPositions.forEach(([i, j]) => {
        if (correctCount === 3) {
          setGameState('complete');
          setFeedback(`Congratulations, you solved the Daily TILE in ${attempts + 1} ${attempts === 0 ? 'attempt' : 'attempts'}!`);
          // On win, all correct tiles turn green (handled by renderCell)
        } else if (correctCount === 0) {
          newUserPattern[i][j] = 1; // gray
        } else {
          newUserPattern[i][j] = 3; // yellow
        }
      });
      
      setUserPattern(newUserPattern);
      setShowAnimation(false);
      
      if (correctCount > 0 && correctCount < 3) {
        setFeedback(`${correctCount} out of 3 squares are correct!`);
      } else if (correctCount === 0) {
        setFeedback('None of these squares are correct.');
      }
    }, 500);
  };

  const startNewGame = () => {
    setGameState('playing');
    setUserPattern(Array(4).fill().map(() => Array(4).fill(0)));
    setFeedback('');
    setAttempts(0);
    setShowAnimation(false);
  };

  const playPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
    setDailyPattern(generateDailyPattern(previousDate));
    startNewGame();
  };

  const getColorClass = (state) => {
    switch (state) {
      case 1: return 'bg-gray-300';
      case 3: return 'bg-yellow-300';
      case 4: return '';
      default: return 'bg-white';
    }
  };

  const renderCell = (row, col) => {
    const cellState = userPattern[row][col];
    const isComplete = gameState === 'complete';
    
    return (
      <div
        data-row={row}
        data-col={col}
        onClick={() => handleCellClick(row, col)}
        className={`w-14 h-14 cursor-pointer transition-all duration-200
          ${showAnimation ? 'animate-spin' : ''}
          ${getColorClass(cellState)}
          ${cellState === 4 ? 'border-4 border-blue-500' : 'border-2 border-gray-300'}
          ${gameState === 'playing' ? 'hover:border-blue-300' : ''}
          ${isComplete && dailyPattern[row][col] === 1 ? 'bg-green-500 border-2 border-green-600' : ''}`}
      />
    );
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold ml-8">Daily TILE</h1>
          <button 
            onClick={() => setShowInstructions(true)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            max={today}
            className="border rounded px-2 py-1"
          />
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
        <p className="text-sm text-gray-500">Attempts: {attempts}</p>
      </div>

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
          <p className={`text-center mb-4 ${gameState === 'complete' ? 'text-green-600 font-bold text-xl' : 'text-gray-600'}`}>
            {feedback}
          </p>
        )}
        
        {gameState === 'playing' && (
          <button
            onClick={confirmPattern}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Flip Tiles
          </button>
        )}

        {gameState === 'complete' && (
          <button
            onClick={playPreviousDay}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Play Previous Day
          </button>
        )}
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-4">How to Play Daily TILE</h2>
            
            <div className="space-y-4">
              <p>Welcome to Daily TILE! Here's how to play:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>There are 3 hidden tiles in the 4x4 grid</li>
                <li>Select 3 tiles and click "Flip Tiles" to make a guess</li>
                <li>Yellow tiles mean you found a correct position</li>
                <li>Gray tiles mean the position was incorrect</li>
                <li>Keep guessing until you find all 3 tiles</li>
                <li>You can play previous days' puzzles using the date selector</li>
              </ul>
              <p>Good luck!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TileGame;