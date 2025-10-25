#!/bin/bash

# Comprehensive test script to verify HTTP/SSE migration
# Run this after starting the server with: npm start

SERVER_URL="${MCP_SERVER_URL:-http://localhost:3333}"

echo "🧪 Testing MetaAPI MCP Server (HTTP/SSE mode)"
echo "================================================"
echo ""
echo "Server URL: $SERVER_URL"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
curl -s "$SERVER_URL/health" | python3 -m json.tool
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    exit 1
fi
echo ""

# Test 2: SSE Endpoint (just check if it responds)
echo "Test 2: SSE Endpoint Availability"
echo "----------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL/sse")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ SSE endpoint is available (HTTP $HTTP_CODE)"
else
    echo "⚠️  SSE endpoint returned HTTP $HTTP_CODE (may be normal for SSE)"
fi
echo ""

# Test 3: Run test clients
echo "Test 3: MCP Client Tests"
echo "------------------------"
echo "Running test_client.js..."
node test_client.js
if [ $? -eq 0 ]; then
    echo "✅ test_client.js passed"
else
    echo "❌ test_client.js failed"
    exit 1
fi
echo ""

echo "Running test_mcp_client.js..."
node test_mcp_client.js
if [ $? -eq 0 ]; then
    echo "✅ test_mcp_client.js passed"
else
    echo "❌ test_mcp_client.js failed"
    exit 1
fi
echo ""

echo "Running validate_tools.js..."
node validate_tools.js
if [ $? -eq 0 ]; then
    echo "✅ validate_tools.js passed"
else
    echo "❌ validate_tools.js failed"
    exit 1
fi
echo ""

echo "================================================"
echo "🎉 All tests passed!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Update your Claude Desktop config to use:"
echo "     \"url\": \"$SERVER_URL/sse\""
echo "  2. Run additional test scripts as needed"
echo "  3. Start using the MCP server with your clients"
echo ""
