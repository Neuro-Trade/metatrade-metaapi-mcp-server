#!/bin/bash

# Simple script to start the MetaAPI MCP HTTP/SSE Server

echo "🚀 Starting MetaAPI MCP Server (HTTP/SSE mode)..."
echo ""
echo "Server will be available at:"
echo "  • Main: http://localhost:3333"
echo "  • SSE:  http://localhost:3333/sse"
echo "  • Health: http://localhost:3333/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

node src/index.js
