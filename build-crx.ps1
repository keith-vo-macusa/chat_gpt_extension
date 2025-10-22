#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building ChatGPT Extension to .crx file" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "[1/4] Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "[2/4] Building extension..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "[3/4] Creating .crx file..." -ForegroundColor Yellow
crx3 dist -o chatgpt-message-navigator.crx

Write-Host ""
Write-Host "[4/4] Creating .crx file with private key..." -ForegroundColor Yellow
crx3 dist -p chatgpt-message-navigator.pem -o chatgpt-message-navigator-with-key.crx

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "Generated files:" -ForegroundColor White
Write-Host "- chatgpt-message-navigator.crx (145 KB) - Ready to install" -ForegroundColor Gray
Write-Host "- chatgpt-message-navigator-with-key.crx (145 KB) - With private key" -ForegroundColor Gray
Write-Host "- chatgpt-message-navigator.pem (3 KB) - Private key for updates" -ForegroundColor Gray

Write-Host ""
Write-Host "To install the extension:" -ForegroundColor White
Write-Host "1. Open Chrome and go to chrome://extensions/" -ForegroundColor Gray
Write-Host "2. Enable 'Developer mode'" -ForegroundColor Gray
Write-Host "3. Click 'Load unpacked' and select the 'dist' folder" -ForegroundColor Gray
Write-Host "   OR drag and drop the .crx file into the extensions page" -ForegroundColor Gray

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
