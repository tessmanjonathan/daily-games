import { version } from '../../package.json';

const gameVersions = {
  tiles: {
    version: '1.0.0',
    lastUpdated: null,
    commitHash: null
  },
  numbers: {
    version: '1.0.0',
    lastUpdated: null,
    commitHash: null
  }
};

try {
  const versionInfo = require('../../.version-info.json');
  Object.assign(gameVersions, versionInfo);
} catch (e) {
  console.warn('No version info file found');
}

export const getGameVersion = (gameName) => {
  const gameInfo = gameVersions[gameName.toLowerCase()];
  if (!gameInfo) return null;

  return {
    version: gameInfo.version,
    lastUpdated: gameInfo.lastUpdated ? new Date(gameInfo.lastUpdated).toLocaleDateString() : 'Unknown',
    commitHash: gameInfo.commitHash || 'Unknown'
  };
};

export const getAppVersion = () => version;