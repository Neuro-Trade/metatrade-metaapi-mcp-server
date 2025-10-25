# Testing with Claude Desktop (HTTP/SSE)

## Quick Setup

Since this server uses HTTP/SSE transport, you need to configure Claude Desktop to connect via URL.

### Step 1: Start the Server

```bash
npm start
```

The server will run at `http://localhost:3333`

### Step 2: Configure Claude Desktop

Edit your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "metaapi": {
      "url": "http://localhost:3333/sse"
    }
  }
}
```

### Step 3: Restart Claude Desktop

Completely quit and restart Claude Desktop for the changes to take effect.

### Step 4: Verify Connection

In Claude Desktop, you should now see the MetaAPI server connected. You can ask Claude:

```
What MCP servers are connected?
```

Or start using the tools:

```
List my MetaAPI trading accounts
```

```
Get the current price of EURUSD on account b7320f60-ef3c-4589-a692-c6b39f76c313
```

## Available Tools in Claude

Once connected, Claude can use all 32 trading tools:

- **Account Management**: list_accounts, get_account_state, deploy_account, etc.
- **Trading**: place_market_order, place_limit_order, close_position, etc.
- **Market Data**: get_symbol_price, get_candles, get_ticks, etc.
- **History**: get_positions, get_orders, get_history_orders, etc.

## Example Conversations

### Get Account Overview
```
"Give me an overview of my MetaAPI account"
```

### Check Prices
```
"What's the current price of EURUSD?"
```

### Place a Trade (Demo)
```
"Place a 0.01 lot buy order on EURUSD with stop loss at 1.0850 and take profit at 1.0950"
```

### Get Historical Data
```
"Show me the last 20 hourly candles for GBPUSD"
```

## Troubleshooting

### Server Not Connecting

1. Make sure the server is running:
   ```bash
   curl http://localhost:3333/health
   ```
   Should return: `{"status":"ok","server":"MetaAPI MCP Server"}`

2. Check the server logs for connection attempts

3. Verify your config file syntax is valid JSON

4. Make sure you completely quit and restarted Claude Desktop

### Environment Variables

Make sure your `.env` file has your MetaAPI token:

```bash
METAAPI_TOKEN=your_token_here
```

### Port Issues

If port 3333 is in use, you can change it:

```bash
PORT=8080 npm start
```

Then update Claude config:
```json
{
  "mcpServers": {
    "metaapi": {
      "url": "http://localhost:8080/sse"
    }
  }
}
```

## Advanced Configuration

### With Environment Variables

If you need to pass environment variables, you can't do that directly with HTTP/SSE. The server loads them from `.env` file, so make sure all required variables are in the `.env` file before starting.

### Multiple Accounts

The server automatically discovers all your MetaAPI accounts. You just need one server instance.

### Security Note

This server runs on localhost only and is intended for local development. For production use, implement proper authentication and use HTTPS.

## Testing Without Claude

You can also test the server using the included test scripts:

```bash
# Basic test
node tests/test_client.js

# Comprehensive test
node tests/test_mcp_client.js

# Candle visualization
node tests/test_candle_viz.js
```

## Server Logs

The server logs all activity to stderr. You'll see:
- Connection requests
- Tool calls
- Session management
- Errors and warnings

Watch the terminal where you ran `npm start` to see real-time activity.
