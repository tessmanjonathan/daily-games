import React, { useState, useEffect } from 'react';
import Numbers from './Numbers.jsx';
import Tiles from './Tiles.jsx';

// Game configuration object
const GAMES = {
  tiles: {
    id: 'tiles',
    title: 'Tiles',
    component: Tiles,
    description: 'Find the hidden tiles in the grid',
    enabled: true,
    },
  numbers: {
    id: 'numbers',
    title: 'Numbers',
    component: Numbers,
    description: 'Guess the 6-digit number with proximity hints',
    enabled: true,
  },
};

const GameLauncher = () => {
  const [currentGame, setCurrentGame] = useState(Object.keys(GAMES).find(id => GAMES[id].enabled));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const gameId = Object.keys(GAMES).find(id => path.includes(id));
    if (gameId) {
      setCurrentGame(gameId);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePopState = () => {
    const path = window.location.pathname.toLowerCase();
    const gameId = Object.keys(GAMES).find(id => path.includes(id));
    if (gameId) {
      setCurrentGame(gameId);
    }
  };

  const switchGame = (gameId) => {
    setCurrentGame(gameId);
    setIsMenuOpen(false);
    window.history.pushState({}, '', `/${gameId}`);
  };

  const CurrentGameComponent = GAMES[currentGame].component;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                <div className="space-y-2">
                  <span className="block w-6 h-0.5 bg-gray-600"></span>
                  <span className="block w-6 h-0.5 bg-gray-600"></span>
                  <span className="block w-6 h-0.5 bg-gray-600"></span>
                </div>
              </button>
              <h1 className="ml-4 text-xl font-bold">Daily Games</h1>
            </div>
            
            {/* Current Game Title */}
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-700">
                {GAMES[currentGame].title}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Games</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <span className="sr-only">Close menu</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-1">
              {Object.values(GAMES).filter(game => game.enabled).map((game) => (
                <button
                  key={game.id}
                  onClick={() => switchGame(game.id)}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    currentGame === game.id
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{game.title}</div>
                  <div className={`text-sm ${
                    currentGame === game.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {game.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <CurrentGameComponent />
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameLauncher;