
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting custom build process...');

// Remove existing lockfile if it exists
const lockfilePath = path.join(__dirname, 'bun.lockb');
if (fs.existsSync(lockfilePath)) {
  console.log('🗑️  Removing existing lockfile...');
  fs.unlinkSync(lockfilePath);
}

try {
  // Install dependencies without frozen lockfile
  console.log('📦 Installing dependencies...');
  execSync('bun install', { stdio: 'inherit' });
  
  // Build the project
  console.log('🔨 Building project...');
  execSync('bun run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
