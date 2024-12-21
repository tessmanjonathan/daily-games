import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_CONFIG = 'src/games.json';

function getLastCommitHash(filePath) {
  try {
    return execSync(`git log -1 --format=%H -- ${filePath}`).toString().trim();
  } catch (e) {
    return null;
  }
}

function updateVersionInfo() {
  console.log('Starting version info update...');
  
  // Read games configuration
  let gamesConfig = {};
  try {
    gamesConfig = JSON.parse(fs.readFileSync(GAMES_CONFIG));
    console.log('Current games config loaded');
  } catch (e) {
    console.error('Error reading games config:', e);
    process.exit(1);
  }

  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only').toString().split('\n');
  console.log('Staged files:', stagedFiles);
  
  // Check for game component changes using paths from config
  const gameUpdates = Object.entries(gamesConfig.games)
    .filter(([_, game]) => stagedFiles.includes(game.path));
  
  console.log('Games to update:', gameUpdates.map(([id]) => id));

  let hasUpdates = false;
  
  gameUpdates.forEach(([gameId, game]) => {
    console.log(`Processing game: ${game.title}`);
    
    // Increment patch version
    const [major, minor, patch] = game.version.split('.');
    game.version = `${major}.${minor}.${parseInt(patch) + 1}`;
    game.lastUpdated = new Date().toISOString();
    game.commitHash = getLastCommitHash(game.path);

    console.log(`New version for ${game.title}: ${game.version}`);
    hasUpdates = true;
  });

  if (hasUpdates) {
    console.log('Saving updated games config');
    fs.writeFileSync(GAMES_CONFIG, JSON.stringify(gamesConfig, null, 2));
    execSync(`git add ${GAMES_CONFIG}`);
  } else {
    console.log('No updates needed to games config');
  }
}

try {
  updateVersionInfo();
  process.exit(0);
} catch (error) {
  console.error('Error updating version info:', error);
  process.exit(1);
}