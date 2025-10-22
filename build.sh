#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building extension..."
npm run build

echo "Build completed! Extension files are in the 'dist' folder."
echo "Load the 'dist' folder as an unpacked extension in Chrome."
