#!/bin/bash

# 🚀 Quick Start Script - Flow Test Web
# Executa validações básicas e inicia o aplicativo

echo "════════════════════════════════════════════════════════════"
echo "  🚀 Flow Test Web - Quick Start"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from /web directory"
    echo "   cd /Users/marcusp/Documents/flow-test/web"
    exit 1
fi

echo "✅ Correct directory: $(pwd)"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo "📦 Node.js version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v(1[8-9]|[2-9][0-9]) ]]; then
    echo "⚠️  Warning: Node.js 18+ recommended"
fi
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Dependencies installed"
echo ""

# Check if compiled Electron files exist
if [ ! -d "dist-electron" ]; then
    echo "⚠️  dist-electron not found (will be built on dev)"
fi
echo ""

echo "════════════════════════════════════════════════════════════"
echo "  📋 Pre-flight Checklist"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  ✅ Node.js installed: $NODE_VERSION"
echo "  ✅ Dependencies: OK"
echo "  ✅ Working directory: OK"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "  🧪 Testing Instructions"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  1. Electron app will open automatically"
echo "  2. Navigate to: /runner"
echo "  3. Click '📁 Browse File'"
echo "  4. Select: tests/start-flow.yaml (or any YAML test)"
echo "  5. Click '▶️ Run Test'"
echo "  6. Observe:"
echo "     - Logs appearing in left panel"
echo "     - Steps being parsed in right panel"
echo "     - Progress bar updating"
echo ""
echo "  📖 Detailed guide: /web/docs/TESTING_GUIDE.md"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "  🚀 Starting Electron App..."
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  Press Ctrl+C to stop"
echo ""
sleep 2

npm run dev
