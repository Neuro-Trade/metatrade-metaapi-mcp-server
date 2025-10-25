#!/bin/bash
# Start HTTP/SSE MCP server and test it

echo "🚀 Starting MetaAPI MCP Server (HTTP/SSE mode)..."
node src/index.js &
SERVER_PID=$!

echo "⏳ Waiting for server to start..."
sleep 3

echo "✅ Server started with PID: $SERVER_PID"
echo "📡 Server running at http://localhost:3333"
echo "🔗 SSE endpoint: http://localhost:3333/sse"
echo "💚 Health check: http://localhost:3333/health"
echo ""
echo "Testing health endpoint..."
curl -s http://localhost:3333/health || echo "Health check failed"

echo ""
echo "Press Ctrl+C to stop the server, or it will run for 10 seconds..."
sleep 10

echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null || true
echo "✅ Test complete"
