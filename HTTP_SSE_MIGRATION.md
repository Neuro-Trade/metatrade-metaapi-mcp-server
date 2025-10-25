# HTTP/SSE Migration Guide

## Overview

The MCP server has been successfully converted from **stdio** transport to **HTTP with Server-Sent Events (SSE)** transport. This enables the server to be accessed over HTTP, making it more flexible and easier to integrate with web applications and remote clients.

## What Changed

### Server (`src/index.js`)
- ✅ Replaced `StdioServerTransport` with `SSEServerTransport`
- ✅ Added Express.js HTTP server
- ✅ Added CORS support for cross-origin requests
- ✅ Added health check endpoint at `/health`
- ✅ SSE endpoint available at `/sse`
- ✅ Message endpoint at `/message` for client requests

### Dependencies (`package.json`)
- ✅ Updated `@modelcontextprotocol/sdk` to `^1.0.4`
- ✅ Already had `express` and `cors` installed

### Test Scripts (All `test_*.js` files)
- ✅ Replaced `StdioClientTransport` with `SSEClientTransport`
- ✅ Updated to connect to HTTP server instead of spawning process
- ✅ Added `SERVER_URL` environment variable support
- ✅ Updated files:
  - `test_client.js`
  - `test_mcp_client.js`
  - `test_phase1_tools.js`
  - `test_phase1_trading.js`
  - `test_phase2.js`
  - `test_phase3.js`
  - `test_market_order_tools.js`
  - `test_candle_viz.js`
  - `test_ticks_debug.js`
  - `test_ticks_recent.js`

### Shell Script (`test_server.sh`)
- ✅ Updated to start HTTP server and show connection info
- ✅ Added health check test
- ✅ Improved logging and status messages

## How to Use

### 1. Start the Server

```bash
npm start
```

The server will start on port 3000 by default. You should see:
```
[INFO] MetaAPI MCP Server running on http://localhost:3000
[INFO] SSE endpoint: http://localhost:3000/sse
[INFO] Health check: http://localhost:3000/health
```

### 2. Configure Custom Port (Optional)

```bash
PORT=8080 npm start
```

### 3. Test the Server

#### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "server": "MetaAPI MCP Server"
}
```

#### Run Test Scripts

Start the server in one terminal:
```bash
npm start
```

In another terminal, run any test script:
```bash
node test_client.js
node test_mcp_client.js
node test_phase1_tools.js
# etc.
```

Or use the shell script:
```bash
./test_server.sh
```

### 4. Custom Server URL

If your server is running on a different host/port, set the `MCP_SERVER_URL` environment variable:

```bash
MCP_SERVER_URL=http://localhost:8080 node test_client.js
```

## Client Connection Example

### JavaScript/Node.js

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const SERVER_URL = 'http://localhost:3000';

const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));

const client = new Client(
    {
        name: 'my-client',
        version: '1.0.0',
    },
    {
        capabilities: {},
    }
);

await client.connect(transport);

// Now you can use the client
const tools = await client.listTools();
console.log('Available tools:', tools.tools.length);

await client.close();
```

### Claude Desktop Config

Update your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "metaapi": {
      "url": "http://localhost:3000/sse"
    }
  }
}
```

**Note:** Make sure the server is running before starting Claude Desktop.

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/sse` | GET | SSE endpoint for MCP client connections |
| `/message` | POST | Message endpoint for client requests |

## Benefits of HTTP/SSE

1. **Remote Access**: Server can be accessed from different machines
2. **Web Integration**: Can be integrated with web applications
3. **Scalability**: Multiple clients can connect simultaneously
4. **Standard Protocol**: Uses standard HTTP/SSE protocols
5. **Debugging**: Easier to debug with HTTP tools like curl, Postman
6. **CORS Support**: Can be accessed from web browsers

## Troubleshooting

### Server won't start
- Check if port 3000 is already in use
- Use a different port: `PORT=8080 npm start`

### Client can't connect
- Ensure server is running: `curl http://localhost:3000/health`
- Check the server URL in your client
- Verify no firewall is blocking the port

### CORS errors
- The server has CORS enabled for all origins
- If you need to restrict origins, modify the `cors()` configuration in `src/index.js`

## Rollback (If Needed)

If you need to rollback to stdio transport:

1. Restore `src/index.js` from git history
2. Restore test files from git history
3. Run `npm install`

## Next Steps

- Set up HTTPS/TLS for secure connections
- Add authentication/authorization
- Deploy to a cloud provider
- Add rate limiting
- Add request logging and monitoring
