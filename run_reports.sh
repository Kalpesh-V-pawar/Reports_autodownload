#!/bin/bash

# -------------------------
# 1️⃣ Setup Node environment
# -------------------------
echo "⏳ Checking Node and NPM versions..."
node -v
npm -v

# If node_modules folder exists, clean it
if [ -d "node_modules" ]; then
  echo "🧹 Removing existing node_modules..."
  rm -rf node_modules
fi

# -------------------------
# 2️⃣ Install dependencies
# -------------------------
# If package-lock.json doesn't exist, generate it
if [ ! -f "package-lock.json" ]; then
  echo "📦 package-lock.json missing, running npm install..."
  npm install
else
  echo "📦 package-lock.json found, running npm ci..."
  npm ci
fi

# -------------------------
# 3️⃣ Run the Puppeteer script
# -------------------------
# Assuming your script is index.js
echo "🚀 Running the Puppeteer script..."
node index.js

# -------------------------
# 4️⃣ Done
# -------------------------
echo "✅ Script completed!"
