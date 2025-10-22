@echo off
echo ========================================
echo Building ChatGPT Extension to .crx file
echo ========================================

echo.
echo [1/4] Installing dependencies...
call npm install

echo.
echo [2/4] Building extension...
call npm run build

echo.
echo [3/4] Creating .crx file...
crx3 dist -o chatgpt-message-navigator.crx

echo.
echo [4/4] Creating .crx file with private key...
crx3 dist -p chatgpt-message-navigator.pem -o chatgpt-message-navigator-with-key.crx

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Generated files:
echo - chatgpt-message-navigator.crx (145 KB) - Ready to install
echo - chatgpt-message-navigator-with-key.crx (145 KB) - With private key
echo - chatgpt-message-navigator.pem (3 KB) - Private key for updates
echo.
echo To install the extension:
echo 1. Open Chrome and go to chrome://extensions/
echo 2. Enable "Developer mode"
echo 3. Click "Load unpacked" and select the "dist" folder
echo    OR drag and drop the .crx file into the extensions page
echo.
pause
