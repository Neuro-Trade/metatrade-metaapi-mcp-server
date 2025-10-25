# Testing with Claude Desktop

This guide shows you how to connect your MetaAPI MCP Server to Claude Desktop.

## Prerequisites

1. **Claude Desktop** installed on your Mac
2. **MetaAPI MCP Server** running on `http://localhost:3333`
3. **MetaAPI Token** configured in `.env`

## Step 1: Start the MCP Server

```bash
# In your project directory
npm start
```

You should see:
```
[INFO] MetaAPI client initialized
[INFO] MetaAPI MCP Server running on http://localhost:3333
[INFO] SSE endpoint: http://localhost:3333/sse
[INFO] Health check: http://localhost:3333/health
```

## Step 2: Configure Claude Desktop

### Find Claude's Configuration File

The configuration file location on macOS:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Edit the Configuration

Open the file in your editor:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Or:
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Add MCP Server Configuration

Add your MetaAPI server to the `mcpServers` section:

```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "/Users/5aleel/Downloads/code-sample-node-rpc-b7320f60-ef3c-4589-a692-c6b39f76c313/src/index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_metaapi_token_here"
      }
    }
  }
}
```

**Important:** Replace:
- The path with your actual project path
- `your_metaapi_token_here` with your actual MetaAPI token

### Alternative: Using HTTP Transport

If you want Claude to connect to your already-running HTTP server (instead of starting a new instance):

```json
{
  "mcpServers": {
    "metaapi": {
      "url": "http://localhost:3333/sse",
      "transport": "sse"
    }
  }
}
```

## Step 3: Restart Claude Desktop

1. **Quit Claude Desktop** completely (Cmd+Q)
2. **Reopen Claude Desktop**
3. Claude will automatically connect to your MCP server

## Step 4: Verify Connection

In Claude Desktop, you should see:
- A small server icon or indicator showing "metaapi" is connected
- The server should appear in the MCP servers list

## Step 5: Test with Claude

Try these prompts in Claude:

### 1. List Trading Accounts
```
Show me my MetaAPI trading accounts
```

### 2. Get Account Information
```
Get the account information for account b7320f60-ef3c-4589-a692-c6b39f76c313
```

### 3. Get Current Price
```
What's the current price of EURUSD?
```

### 4. Get Candlestick Data
```
Show me the last 20 15-minute candles for EURUSD
```

### 5. Check Positions
```
Do I have any open positions?
```

### 6. Account Overview Prompt
```
Give me a comprehensive overview of my trading account
```

## Troubleshooting

### Server Not Connecting

1. **Check Server is Running**
   ```bash
   curl http://localhost:3333/health
   ```
   Should return: `{"status":"ok","server":"MetaAPI MCP Server"}`

2. **Check Configuration Path**
   Make sure the path in `claude_desktop_config.json` is correct:
   ```bash
   ls -la /Users/5aleel/Downloads/code-sample-node-rpc-b7320f60-ef3c-4589-a692-c6b39f76c313/src/index.js
   ```

3. **Check Environment Variable**
   Verify your MetaAPI token is set correctly

4. **View Claude Logs**
   Check Claude Desktop logs for errors:
   ```bash
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

### Tools Not Appearing

1. **Restart Claude** completely (Cmd+Q and reopen)
2. **Check Server Logs** for any errors
3. **Verify Token** is valid and account is deployed

### Connection Drops

If Claude disconnects frequently:
1. Make sure server stays running
2. Check network connectivity
3. Review server logs for errors

## Available Tools in Claude

Once connected, Claude can use these tools:

### Account Management
- List accounts
- Get account state
- Get account information
- Deploy/undeploy/redeploy accounts

### Trading
- Place market orders
- Place limit orders
- Create stop orders
- Close positions
- Modify positions/orders
- Cancel orders

### Market Data
- Get symbol prices
- Get symbols list
- Get symbol specifications
- Get candlestick data
- Get tick data
- Subscribe to prices

### History & Analysis
- Get positions
- Get orders
- Get historical orders
- Get deals
- Get terminal state

## Resources Available

Claude can also access these resources:

- `metaapi://accounts` - All your trading accounts
- `metaapi://accounts/{id}` - Specific account details
- `metaapi://accounts/{id}/positions` - Account positions
- `metaapi://accounts/{id}/orders` - Pending orders

## Example Conversations

### Trading Assistant
```
You: I want to trade EURUSD. Can you help me analyze the market first?

Claude: I'll help you analyze EURUSD. Let me:
1. Get the current price
2. Fetch recent candlestick data
3. Check your account balance
4. Calculate the margin required

[Uses tools: get_symbol_price, get_candles, get_account_information, calculate_margin]
```

### Account Monitoring
```
You: Give me a complete overview of my trading account

Claude: I'll get you a comprehensive account overview.

[Uses prompt: account_overview]
[Shows: Balance, equity, margin, open positions, pending orders, recent performance]
```

### Risk Management
```
You: I want to place a 0.1 lot buy order on EURUSD. Is it safe?

Claude: Let me perform a risk check first.

[Uses prompt: risk_check]
[Analyzes: Available margin, position size, account risk, recommended stop loss]
```

## Security Notes

- ⚠️ Never share your `claude_desktop_config.json` file (contains API token)
- ⚠️ Keep your MetaAPI token secure
- ⚠️ Only use this on your local machine
- ⚠️ Be careful with trading commands - they execute real trades!

## Next Steps

Once connected:
1. Ask Claude to list your accounts
2. Try getting market data
3. Use the AI prompts for analysis
4. Experiment with different trading scenarios

## Support

For issues:
- MetaAPI Documentation: https://metaapi.cloud/docs/
- MCP Documentation: https://spec.modelcontextprotocol.io/
- Check server logs: The terminal where you ran `npm start`
