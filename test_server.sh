#!/bin/bash
# Start server in background and test it
node src/index.js &
SERVER_PID=$!
sleep 2
echo "Server started with PID: $SERVER_PID"
kill $SERVER_PID 2>/dev/null || true
echo "Test complete"
