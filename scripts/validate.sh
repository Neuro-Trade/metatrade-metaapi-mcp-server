#!/bin/bash

# MetaAPI MCP Server - Validation Script
# This script validates your setup before running the server

echo "🔍 MetaAPI MCP Server - Setup Validation"
echo "========================================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
  echo "  ✅ Node.js $NODE_VERSION installed"
  MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo "  ⚠️  Warning: Node.js 18+ recommended (you have $NODE_VERSION)"
  fi
else
  echo "  ❌ Node.js not found. Please install Node.js 18+"
  exit 1
fi
echo ""

# Check dependencies
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
  echo "  ✅ node_modules found"
else
  echo "  ⚠️  node_modules not found. Run: npm install"
fi
echo ""

# Check .env file
echo "✓ Checking environment configuration..."
if [ -f ".env" ]; then
  echo "  ✅ .env file exists"
  
  # Check for token
  if grep -q "METAAPI_TOKEN=" .env && ! grep -q "METAAPI_TOKEN=your_" .env; then
    echo "  ✅ METAAPI_TOKEN configured"
  else
    echo "  ⚠️  METAAPI_TOKEN not configured. Edit .env file"
  fi
else
  echo "  ⚠️  .env file not found. Copy from .env.example"
fi
echo ""

# Check main server file
echo "✓ Checking server files..."
if [ -f "src/index.js" ]; then
  echo "  ✅ src/index.js exists"
else
  echo "  ❌ src/index.js not found"
  exit 1
fi
echo ""

# Test import
echo "✓ Testing server imports..."
node -e "
try {
  require('./src/index.js');
  console.log('  ⚠️  Server started (expected for validation)');
  process.exit(0);
} catch (e) {
  if (e.message.includes('METAAPI_TOKEN')) {
    console.log('  ⚠️  Token not set (this is okay for validation)');
  } else {
    console.log('  ❌ Import error:', e.message);
    process.exit(1);
  }
}" 2>&1 | head -n 1

echo ""
echo "========================================"
echo "📋 Setup Summary"
echo "========================================"
echo ""

WARNINGS=0

# Summary checks
if [ ! -d "node_modules" ]; then
  echo "⚠️  Run: npm install"
  WARNINGS=$((WARNINGS + 1))
fi

if [ ! -f ".env" ]; then
  echo "⚠️  Run: cp .env.example .env"
  WARNINGS=$((WARNINGS + 1))
fi

if [ -f ".env" ] && (grep -q "METAAPI_TOKEN=your_" .env || ! grep -q "METAAPI_TOKEN=" .env); then
  echo "⚠️  Edit .env and add your MetaAPI token"
  WARNINGS=$((WARNINGS + 1))
fi

if [ $WARNINGS -eq 0 ]; then
  echo "✅ Everything looks good!"
  echo ""
  echo "🚀 Ready to start:"
  echo "   npm start"
  echo ""
  echo "📚 Next steps:"
  echo "   1. Configure Claude Desktop (see MCP_CLIENT_CONFIG.md)"
  echo "   2. Restart Claude Desktop"
  echo "   3. Ask: 'List my MetaAPI accounts'"
else
  echo ""
  echo "⚠️  Please address the warnings above before starting"
fi

echo ""
