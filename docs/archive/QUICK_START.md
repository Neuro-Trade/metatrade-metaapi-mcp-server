# Quick Start Guide

Get started with the MetaAPI MCP Server in 5 minutes.

## Step 1: Get Your MetaAPI Token

1. Go to [MetaAPI Dashboard](https://app.metaapi.cloud/)
2. Sign up or log in
3. Navigate to **API Access** or **Settings**
4. Copy your API token

## Step 2: Set Up Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your token:

```bash
METAAPI_TOKEN=your_actual_token_here
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Verify Your Setup

Test that the server can start:

```bash
npm start
```

You should see:
```
[INFO] MetaAPI client initialized
[INFO] MetaAPI MCP Server running on stdio
```

Press `Ctrl+C` to stop.

## Step 5: Configure Your MCP Client

### For Claude Desktop (Recommended)

**macOS:**
```bash
# Edit configuration
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Add this configuration:**
```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/Downloads/code-sample-node-rpc-b7320f60-ef3c-4589-a692-c6b39f76c313/src/index.js"
      ],
      "env": {
        "METAAPI_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

**Important:** Replace:
- `YOUR_USERNAME` with your actual macOS username
- `your_actual_token_here` with your MetaAPI token

**Restart Claude Desktop**

## Step 6: Test in Claude

1. Open Claude Desktop
2. Start a new conversation
3. Try these commands:

**List your accounts:**
```
Can you list my MetaAPI trading accounts?
```

**Check account state:**
```
Show me the state of account [YOUR_ACCOUNT_ID]
```

**Get current price:**
```
What's the current price of EURUSD on account [YOUR_ACCOUNT_ID]?
```

## Example Workflows

### Check Account Overview
```
Give me a comprehensive overview of my trading account [ACCOUNT_ID]
```

### Place a Trade (Demo Only!)
```
Place a market buy order for 0.01 lots of EURUSD on account [ACCOUNT_ID] 
with stop loss at 1.0950 and take profit at 1.1050
```

### Check Recent Activity
```
Show me my trading history for the last 7 days on account [ACCOUNT_ID]
```

### Risk Assessment
```
Calculate the margin required to buy 0.1 lots of GBPUSD at 1.2500 
on account [ACCOUNT_ID]
```

## Troubleshooting

### "Can't find MetaAPI tools"

1. Check that Claude Desktop config is correct
2. Restart Claude Desktop completely
3. Check the path to `index.js` is absolute and correct
4. Verify Node.js is installed: `node --version`

### "METAAPI_TOKEN environment variable is required"

- Make sure token is set in Claude config's `env` section
- Verify there are no typos in the token
- Check that you're using the full token, not truncated

### "Account not deployed"

- First connection takes 2-5 minutes to deploy
- The server will deploy accounts automatically
- Check MetaAPI dashboard to see account status

### "No accounts found"

- Verify you have MetaTrader accounts provisioned in MetaAPI
- Go to [MetaAPI Dashboard](https://app.metaapi.cloud/) → **Accounts**
- Create a demo account if you don't have one

## Next Steps

1. **Read the full documentation:** [README.md](README.md)
2. **Explore available tools:** Ask Claude "What MetaAPI tools are available?"
3. **Try the prompts:** Use built-in prompts like `account_overview`
4. **Check resources:** Access account data via MCP resources
5. **Review examples:** See [example.js](example.js) for MetaAPI SDK usage

## Important Notes

⚠️ **Trading Risks**
- Always test with demo accounts first
- Real trading involves financial risk
- Verify all parameters before placing orders
- Use appropriate risk management (stop loss, position sizing)

🔒 **Security**
- Never commit your `.env` file
- Keep your MetaAPI token secure
- Use separate tokens for development and production
- Rotate tokens regularly

📚 **Resources**
- [MetaAPI Documentation](https://metaapi.cloud/docs/)
- [MCP Protocol Docs](https://modelcontextprotocol.io/)
- [Full Server README](README.md)
- [Client Configuration Guide](MCP_CLIENT_CONFIG.md)

## Getting Help

- **MetaAPI Issues:** https://metaapi.cloud/docs/
- **MCP Server Issues:** Check this repository
- **Questions:** Ask in Claude Desktop using the MCP server!

---

**Ready to trade?** 🚀

Start by asking Claude: *"List my MetaAPI accounts"*
