@echo off
echo Installing dependencies...
call npm install

echo Building extension...
call npm run build

echo Copying CSS file...
copy src\content.css dist\content.css

echo Build completed! Extension files are in the 'dist' folder.
echo Files: content.js, content.css, manifest.json
echo Load the 'dist' folder as an unpacked extension in Chrome.
pause
