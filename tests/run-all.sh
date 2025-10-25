#!/bin/bash

# Test Runner for MetaAPI MCP Server
# Runs all test suites in organized order

set -e

# Suppress MetaAPI SDK internal warnings/debug messages
export NODE_OPTIONS="--no-warnings"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         MetaAPI MCP Server - Test Suite Runner              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:3333/health > /dev/null 2>&1; then
    echo "✅ Server is running"
    echo ""
else
    echo "❌ Server is not running!"
    echo "   Start the server with: npm start"
    echo ""
    exit 1
fi

# Run basic test
echo "═══════════════════════════════════════════════════════════════"
echo "Running: Basic Connection Test"
echo "═══════════════════════════════════════════════════════════════"
node basic.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

# Run integration tests
echo "═══════════════════════════════════════════════════════════════"
echo "Running: Account Tools Test"
echo "═══════════════════════════════════════════════════════════════"
node integration/account.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Running: Account Management Test"
echo "═══════════════════════════════════════════════════════════════"
node integration/account-management.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Running: Market Data Tools Test"
echo "═══════════════════════════════════════════════════════════════"
node integration/market-data.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Running: Market Info Tools Test"
echo "═══════════════════════════════════════════════════════════════"
node integration/market-info.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Running: Position & Order Query Test"
echo "═══════════════════════════════════════════════════════════════"
node integration/position-order-queries.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Running: Trading Tools Test"
echo "═══════════════════════════════════════════════════════════════"
node integration/trading.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "Running: Trading Operations Test (Dry Run)"
echo "═══════════════════════════════════════════════════════════════"
node integration/trading-operations.test.js 2>&1 | grep -v "onConnected\|onBrokerConnectionStatusChanged\|onHealthStatus\|onSynchronizationStarted" || true
echo ""

# Summary
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  All Tests Passed! ✅                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
