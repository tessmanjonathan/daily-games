// If you are a developer and find this page, please don't spoil the fun for others!

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Ghost, Cloud, Star, Moon, Sun, Heart, Zap } from 'lucide-react';

const ICONS = [
  { icon: Cloud, name: 'cloud' },
  { icon: Star, name: 'star' },
  { icon: Moon, name: 'moon' },
  { icon: Sun, name: 'sun' },
  { icon: Heart, name: 'heart' },
  { icon: Zap, name: 'zap' }
];

const INITIAL_SPEED = 3;
const ICON_SIZE = 48;
const GHOST_SIZE = 64;
const DEV_MODE = process.env.NODE_ENV === 'development';
const WIN_SCORE = DEV_MODE ? 8 : 404;
const WAIT_TIME = DEV_MODE ? 5000 : 15000;

const NotFoundGame = () => {
  const [gameState, setGameState] = useState('waiting');
  const [score, setScore] = useState(0);
  const [sprites, setSprites] = useState([]);
  const [gameContainer, setGameContainer] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  // Add custom animation classes (move this INSIDE the component)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animate-fade-in {
        animation: fadeIn 1s ease-out forwards;
      }
      .animate-fade-out {
        animation: fadeOut 1s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Timer effect to handle the ghost disappearing
  useEffect(() => {
    if (gameState !== 'waiting') return;

    const ghostElement = document.querySelector('.ghost-container');
    
    // Start fade out slightly before state change
    const fadeTimeout = setTimeout(() => {
      if (ghostElement) {
        ghostElement.classList.add('animate-fade-out');
      }
    }, WAIT_TIME - 1000); // Start fade 1 second before state change

    // Change state after full wait time
    const stateTimeout = setTimeout(() => {
      setGameState('intro');
    }, WAIT_TIME);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(stateTimeout);
    };
  }, [gameState]);

  // Calculate max sprites based on container size
  const getMaxSprites = useCallback(() => {
    if (!gameContainer.width || !gameContainer.height) return 30;
    const area = gameContainer.width * gameContainer.height;
    const spriteArea = ICON_SIZE * ICON_SIZE;
    return Math.min(Math.floor(area / (spriteArea * 6)), 40);
  }, [gameContainer]);

  // Initialize game container size and handle resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setGameContainer({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleCollisions = (sprites) => {
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const sprite1 = sprites[i];
        const sprite2 = sprites[j];

        const dx = sprite2.x - sprite1.x;
        const dy = sprite2.y - sprite1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ICON_SIZE) {
          const tempDx = sprite1.dx;
          const tempDy = sprite1.dy;
          sprite1.dx = sprite2.dx;
          sprite1.dy = sprite2.dy;
          sprite2.dx = tempDx;
          sprite2.dy = tempDy;

          const overlap = ICON_SIZE - distance;
          const angle = Math.atan2(dy, dx);
          sprite1.x -= (overlap / 2) * Math.cos(angle);
          sprite1.y -= (overlap / 2) * Math.sin(angle);
          sprite2.x += (overlap / 2) * Math.cos(angle);
          sprite2.y += (overlap / 2) * Math.sin(angle);
        }
      }
    }
    return [...sprites];
  };

  const initializeGame = () => {
    const ghost = {
      id: 0,
      x: Math.random() * (gameContainer.width - ICON_SIZE),
      y: Math.random() * (gameContainer.height - ICON_SIZE),
      dx: (Math.random() - 0.5) * INITIAL_SPEED,
      dy: (Math.random() - 0.5) * INITIAL_SPEED,
      type: 'ghost'
    };
    setSprites([ghost]);
    setGameState('playing');
  };

  // Update sprite positions
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId;
    const moveSprites = () => {
      setSprites(currentSprites => {
        const updatedSprites = currentSprites.map(sprite => {
          let { x, y, dx, dy } = sprite;
          
          x += dx;
          y += dy;
          
          if (x <= 0 || x >= gameContainer.width - ICON_SIZE) {
            dx = -dx;
            x = x <= 0 ? 0 : gameContainer.width - ICON_SIZE;
          }
          if (y <= 0 || y >= gameContainer.height - ICON_SIZE) {
            dy = -dy;
            y = y <= 0 ? 0 : gameContainer.height - ICON_SIZE;
          }
          
          return { ...sprite, x, y, dx, dy };
        });

        return handleCollisions(updatedSprites);
      });

      animationFrameId = requestAnimationFrame(moveSprites);
    };

    moveSprites();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, gameContainer]);

  const handleSpriteClick = (clickedSprite) => {
    if (clickedSprite.type === 'ghost') {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore >= WIN_SCORE) {
        setGameState('win');
        return;
      }
      
      const updatedSprites = sprites.map(sprite => {
        if (sprite.type === 'ghost') {
          return {
            ...sprite,
            x: Math.random() * (gameContainer.width - ICON_SIZE),
            y: Math.random() * (gameContainer.height - ICON_SIZE),
            dx: (Math.random() - 0.5) * INITIAL_SPEED,
            dy: (Math.random() - 0.5) * INITIAL_SPEED
          };
        }
        return sprite;
      });

      if (sprites.length < getMaxSprites()) {
        const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
        const newSprite = {
          id: sprites.length,
          x: Math.random() * (gameContainer.width - ICON_SIZE),
          y: Math.random() * (gameContainer.height - ICON_SIZE),
          dx: (Math.random() - 0.5) * INITIAL_SPEED,
          dy: (Math.random() - 0.5) * INITIAL_SPEED,
          type: randomIcon.name
        };
        updatedSprites.push(newSprite);
      }
      
      setSprites(updatedSprites);
    } else {
      setGameState('gameOver');
    }
  };

  const getIconComponent = (type) => {
    if (type === 'ghost') return Ghost;
    return ICONS.find(icon => icon.name === type)?.icon || Ghost;
  };

  return (
    <div className="p-6">
      <div 
        ref={containerRef}
        className="relative h-96 bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
      >
        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="ghost-container animate-fade-in">
              <Ghost className="w-32 h-32 text-gray-400 mb-8 transition-all duration-1000 animate-float" />
            </div>
            <h1 className="text-5xl font-bold text-gray-700 dark:text-gray-100 mb-6 animate-fade-in">
              No game here...
            </h1>
            <p className="text-2xl text-gray-500 dark:text-gray-400 animate-fade-in">
              Maybe try one of our other games?
            </p>
          </div>
        )}

        {gameState === 'intro' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-700 dark:text-gray-100 mb-6">
              Wait... where did our ghost go?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              It was just here a moment ago...
            </p>
            <button
              onClick={() => setGameState('instructions')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Help us find it!
            </button>
          </div>
        )}

        {gameState === 'instructions' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-6">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100">
                A strange game was found...
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="space-y-2">
                  <p>It seems our ghost icon has developed a mind of its own!</p>
                  <p>Click on the ghost to score points</p>
                  <p>But beware of the other objects that it attracts...</p>
                  <p>Can you capture the ghost enough times?</p>
                </div>
                <button
                  onClick={initializeGame}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            <div className="absolute top-4 left-4 z-10">
              <div className="text-lg font-bold text-gray-600 dark:text-gray-300">
                Score: {score}
              </div>
            </div>

            {sprites.map(sprite => {
              const IconComponent = getIconComponent(sprite.type);
              const isGhost = sprite.type === 'ghost';
              return (
                <div
                  key={sprite.id}
                  className={`absolute cursor-pointer text-gray-700 dark:text-gray-100 hover:opacity-80 transition-opacity
                    ${isGhost ? 'z-50' : 'z-0'}`}
                  style={{
                    transform: `translate(${sprite.x}px, ${sprite.y}px)`,
                    width: `${isGhost ? GHOST_SIZE : ICON_SIZE}px`,
                    height: `${isGhost ? GHOST_SIZE : ICON_SIZE}px`,
                    padding: isGhost ? '12px' : '0',
                    margin: isGhost ? '-12px' : '0',
                  }}
                  onClick={() => handleSpriteClick(sprite)}
                >
                  <IconComponent className="w-full h-full" />
                </div>
              );
            })}
          </>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-8">
            <Ghost className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                Oops! Our ghost got away...
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Final Score: {score}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Now don't spoil our little secret ghost game for your friends...
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => {
                    setScore(0);
                    setSprites([]);
                    setGameState('intro');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
                <a
                  href="#tiles"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Play Today's Tiles
                </a>
              </div>
            </div>
          </div>
        )}

        {gameState === 'win' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-8">
            <Ghost className="w-16 h-16 text-blue-400 animate-bounce" />
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                404 Points! You Win!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                You've mastered the ghost game!
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => {
                    setScore(0);
                    setSprites([]);
                    setGameState('intro');
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Play Again
                </button>
                <a
                  href="#tiles"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Try Today's Tiles
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFoundGame;