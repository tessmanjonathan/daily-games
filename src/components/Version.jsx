import React from 'react';
import { getGameVersion } from '../utils/versionTracker';

const Version = ({ gameName }) => {
  const currentYear = new Date().getFullYear();
  const versionInfo = getGameVersion(gameName);
  
  if (!versionInfo) return null;
  
  return (
    <div className="text-center mt-8 text-gray-400 text-sm space-y-1">
      <p>Version {versionInfo.version} ({versionInfo.lastUpdated})</p>
      <p>© {currentYear} Daily Games. All rights reserved.</p>
      {process.env.NODE_ENV === 'development' && (
        <p className="text-xs">Commit: {versionInfo.commitHash.slice(0, 7)}</p>
      )}
    </div>
  );
};

export default Version;