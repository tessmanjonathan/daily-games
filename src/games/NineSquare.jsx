import React, { useState, useEffect } from 'react';
import { Calendar, Info } from 'lucide-react';
import Instructions from '../components/Instructions';
import Version from '../components/Version';

const NineSquare = () => {
  const [gameState, setGameState] = useState('playing');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showInstructions, setShowInstructions] = useState(() => {
    const savedPreference = localStorage.getItem('gamesShowInstructions');
    return savedPreference === null ? true : JSON.parse(savedPreference);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [sequence, setSequence] = useState([]);
  const [revealed, setRevealed] = useState(Array(9).fill(false));
  const [currentStep, setCurrentStep] = useState(0);

  // Generate NineSquare based on date
  const generateDailyNinesquare = (date) => {
    let seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    
    const seededRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Create array 1-9 and shuffle it
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  };

  useEffect(() => {
    const newSequence = generateDailyNinesquare(selectedDate);
    setSequence(newSequence);
    setRevealed(Array(9).fill(false));
    setCurrentStep(0);
    setGameState('playing');
    setAttempts(0);
    setFeedback('');
  }, [selectedDate]);

  const handleCellClick = (index) => {
    if (gameState !== 'playing') return;

    if (sequence[index] === currentStep + 1) {
      // Correct next number
      const newRevealed = [...revealed];
      newRevealed[index] = true;
      setRevealed(newRevealed);
      setCurrentStep(currentStep + 1);
      setFeedback(`Found ${currentStep + 1}!`);

      if (currentStep + 1 === 9) {
        setGameState('complete');
        setFeedback(`Congratulations! You completed NineSquare for ${selectedDate.toLocaleDateString()} in ${attempts + 1} ${attempts === 0 ? 'attempt' : 'attempts'}!`);
      }
    } else {
      // Wrong number - reset revealed cells
      setRevealed(Array(9).fill(false));
      setCurrentStep(0);
      setAttempts(prev => prev + 1);
      setFeedback('Wrong sequence! Start over.');
    }
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  const playPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
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
      {/* Game Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">NineSquare</h1>
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

      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6 mx-auto w-fit">
        {sequence.map((num, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            className={`
              w-20 h-20 flex items-center justify-center text-2xl font-bold
              border-2 cursor-pointer transition-all
              ${revealed[index] 
                ? 'bg-green-500 text-white border-green-600' 
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white hover:border-blue-300'}
              ${gameState === 'playing' ? '' : 'cursor-not-allowed'}
            `}
          >
            {revealed[index] ? num : ''}
          </div>
        ))}
      </div>

      {/* Feedback and Controls */}
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
              href="#tiles"
              className="block w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-center"
            >
              Try out today's Tiles game
            </a>
          </div>
        )}
      </div>

      {/* Instructions Modal */}
      <Instructions
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Welcome to Daily NineSquare!"
      >
        <p>Here's how to play:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Find the numbers 1-9 in sequential order</li>
          <li>Click squares to reveal their numbers</li>
          <li>If you click a wrong number, all revealed numbers will be hidden</li>
          <li>Keep trying until you reveal all numbers in the correct order</li>
          <li>You can play previous days' puzzles using the date selector</li>
        </ul>
        <p>Good luck!</p>
      </Instructions>

      <Version gameName="NineSquare" />
    </div>
  );
};

export default NineSquare;