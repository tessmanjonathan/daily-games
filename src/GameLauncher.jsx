import React, { useState, useEffect, lazy, Suspense } from 'react';
import gamesConfig from './games.json';

// Define game components map for dynamic loading
const gameComponents = {
  tiles: lazy(() => import('./games/Tiles.jsx')),
  numbers: lazy(() => import('./games/Numbers.jsx'))
};

const GameLauncher = () => {
  const [currentGame, setCurrentGame] = useState(
    Object.values(gamesConfig.games).find(game => game.enabled)?.id
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const gameId = Object.keys(gamesConfig.games).find(id => path.includes(id));
    if (gameId) {
      setCurrentGame(gameId);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handlePopState = () => {
    const path = window.location.pathname.toLowerCase();
    const gameId = Object.keys(gamesConfig.games).find(id => path.includes(id));
    if (gameId) {
      setCurrentGame(gameId);
    }
  };

  const switchGame = (gameId) => {
    setCurrentGame(gameId);
    setIsMenuOpen(false);
    window.history.pushState({}, '', `/${gameId}`);
  };

  // Get the current game component
  const CurrentGameComponent = gameComponents[currentGame];

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
              {Object.values(gamesConfig.games)
                .filter(game => game.enabled)
                .map((game) => (
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
            <div className="absolute bottom-0 left-0 right-0 p-4">
              Version 1.0.0
              <p className="text-xs text-gray-500">© {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Suspense fallback={<div className="p-8 text-center">Loading game...</div>}>
              {CurrentGameComponent && <CurrentGameComponent />}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameLauncher;