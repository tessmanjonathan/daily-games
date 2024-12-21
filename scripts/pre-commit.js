import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_DIR = 'src/components';
const VERSION_FILE = '.version-info.json';

function getLastCommitHash(filePath) {
  try {
    return execSync(`git log -1 --format=%H -- ${filePath}`).toString().trim();
  } catch (e) {
    return null;
  }
}

function updateVersionInfo() {
  // Read existing version info or create new
  let versionInfo = {};
  try {
    versionInfo = JSON.parse(fs.readFileSync(VERSION_FILE));
  } catch (e) {}

  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only').toString().split('\n');
  
  // Check for game component changes
  const gameFiles = stagedFiles.filter(file => 
    file.startsWith('src/components/') && 
    (file.endsWith('Tiles.jsx') || file.endsWith('Numbers.jsx'))
  );

  gameFiles.forEach(file => {
    const gameName = path.basename(file, '.jsx').toLowerCase();
    const currentInfo = versionInfo[gameName] || { version: '1.0.0' };
    
    // Increment patch version
    const [major, minor, patch] = currentInfo.version.split('.');
    currentInfo.version = `${major}.${minor}.${parseInt(patch) + 1}`;
    currentInfo.lastUpdated = new Date().toISOString();
    currentInfo.commitHash = getLastCommitHash(file);

    versionInfo[gameName] = currentInfo;
  });

  // Save updated version info
  fs.writeFileSync(VERSION_FILE, JSON.stringify(versionInfo, null, 2));
  
  // Stage the version file if it was modified
  if (gameFiles.length > 0) {
    execSync(`git add ${VERSION_FILE}`);
  }
}

try {
  updateVersionInfo();
  process.exit(0);
} catch (error) {
  console.error('Error updating version info:', error);
  process.exit(1);
}