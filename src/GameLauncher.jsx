import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Settings } from 'lucide-react';
import gamesConfig from './games.json';

const gameComponents = {
  tiles: lazy(() => import('./games/Tiles.jsx')),
  numbers: lazy(() => import('./games/Numbers.jsx')),
  ninesquare: lazy(() => import('./games/NineSquare.jsx')),
};

const GameLauncher = () => {
  const [currentGame, setCurrentGame] = useState(
    Object.values(gamesConfig.games).find(game => game.enabled)?.id
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Function to check if a game has a specific tag
  const hasTag = (game, tag) => {
    return game.tags?.[tag] === true;
  };

  useEffect(() => {
    // Update dark mode in localStorage and document class
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase();
    const gameId = Object.keys(gamesConfig.games).find(id => hash === id);
    if (gameId) {
      setCurrentGame(gameId);
    } else if (currentGame) {
      window.location.hash = currentGame;
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).toLowerCase();
      const gameId = Object.keys(gamesConfig.games).find(id => hash === id);
      if (gameId) {
        setCurrentGame(gameId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchGame = (gameId) => {
    setCurrentGame(gameId);
    setIsMenuOpen(false);
    window.location.hash = gameId;
  };

  const CurrentGameComponent = gameComponents[currentGame];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } focus:outline-none`}
              >
                <div className="space-y-2">
                  <span className={`block w-6 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-600'}`}></span>
                  <span className={`block w-6 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-600'}`}></span>
                  <span className={`block w-6 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-600'}`}></span>
                </div>
              </button>
              <h1 className={`ml-4 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Daily Games
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Settings size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Menu */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className={`relative ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } rounded-lg shadow-xl p-6 w-96`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <span className="sr-only">Close settings</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games Menu */}
      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />

        <div className={`absolute inset-y-0 left-0 w-64 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg transform transition-transform duration-300 ease-in-out`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Games
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <span className="sr-only">Close menu</span>
                <svg className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className={`w-full px-4 py-3 text-left rounded-lg transition-colors relative ${
                    currentGame === game.id
                      ? 'bg-blue-500 text-white'
                      : darkMode 
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium flex items-center gap-2">
                    {game.title}
                    {hasTag(game, 'new') && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className={`text-sm ${
                    currentGame === game.id 
                      ? 'text-blue-100' 
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {game.description}
                  </div>
                </button>
              ))}
            </div>
            <div className={`absolute bottom-0 left-0 right-0 p-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Version 1.3.0
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className={`${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg overflow-hidden`}>
            <Suspense fallback={
              <div className={`p-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Loading game...
              </div>
            }>
              {CurrentGameComponent && <CurrentGameComponent />}
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameLauncher;