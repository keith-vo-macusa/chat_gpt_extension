#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building ChatGPT Message Navigator Extension...\n');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build unified extension
  console.log('📦 Building unified extension...');
  execSync('npm run build:unified', { stdio: 'inherit' });

  // Verify all files exist
  const requiredFiles = ['content.js', 'content.css', 'manifest.json', 'popup.js'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join('dist', file)));

  if (missingFiles.length > 0) {
    console.error('❌ Missing files:', missingFiles);
    process.exit(1);
  }

  // Show build summary
  console.log('\n✅ Build completed successfully!');
  console.log('📁 Files in dist/:');

  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => {
    const filePath = path.join('dist', file);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(2);
    console.log(`   ${file} (${size} KB)`);
  });

  console.log('\n🎉 Extension is ready to load!');
  console.log('📂 Load the "dist" folder as an unpacked extension in Chrome.');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
