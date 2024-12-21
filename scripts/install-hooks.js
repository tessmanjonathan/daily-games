import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hookSource = path.join(__dirname, 'pre-commit.js');
const hookTarget = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit.js');

// Copy the hook file
fs.copyFileSync(hookSource, hookTarget);

// Create a shell script wrapper for the pre-commit hook
const wrapperPath = path.join(__dirname, '..', '.git', 'hooks', 'pre-commit');
const wrapperContent = `#!/bin/sh
node "${hookTarget}"
`;

fs.writeFileSync(wrapperPath, wrapperContent);

// Make both files executable
try {
  execSync(`chmod +x ${hookTarget}`);
  execSync(`chmod +x ${wrapperPath}`);
  console.log('Git hooks installed successfully');
} catch (error) {
  console.error('Failed to make hooks executable:', error);
}