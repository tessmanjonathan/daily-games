import React from 'react';
import gamesConfig from '../games.json';

const Version = ({ gameName }) => {
  const currentYear = new Date().getFullYear();
  const gameInfo = gamesConfig.games[gameName.toLowerCase()];
  
  if (!gameInfo) return null;
  
  const formattedDate = gameInfo.lastUpdated 
    ? new Date(gameInfo.lastUpdated).toLocaleDateString()
    : 'Initial Release';
  
  return (
    <div className="text-center mt-8 text-gray-400 text-sm space-y-1">
      <p>Version {gameInfo.version} ({formattedDate})</p>
      <p>© {currentYear}</p>
      {process.env.NODE_ENV === 'development' && gameInfo.commitHash && (
        <p className="text-xs">Commit: {gameInfo.commitHash.slice(0, 7)}</p>
      )}
    </div>
  );
};

export default Version;