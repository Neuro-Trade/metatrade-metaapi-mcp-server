# MetaAPI MCP Server

A Model Context Protocol (MCP) server that provides AI assistants like Claude with direct access to MetaAPI trading platform. Trade forex, stocks, and commodities through natural language conversations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file with your MetaAPI token
echo "METAAPI_TOKEN=your_token_here" > .env

# Start the server
npm start
```

Then configure Claude Desktop (see [Getting Started Guide](docs/GETTING_STARTED.md)).

## ✨ Features

### 32 Trading Tools
- **Account Management** - View balances, equity, margin, and account details
- **Market Data** - Real-time prices, historical candles, tick data
- **Order Management** - Market orders, limit orders, stop orders
- **Position Management** - Modify, close, or monitor positions
- **Trading History** - View past orders, deals, and performance
- **Risk Management** - Calculate margins, set stop losses

### 4 MCP Resources
- `metaapi://accounts` - All trading accounts
- `metaapi://accounts/{accountId}` - Specific account details
- `metaapi://accounts/{accountId}/positions` - Open positions
- `metaapi://accounts/{accountId}/orders` - Pending orders

### 3 Smart Prompts
- `account_overview` - Complete account analysis
- `risk_check` - Pre-trade risk assessment
- `trading_summary` - Recent activity summary

## 📖 Documentation

- **[Getting Started](docs/GETTING_STARTED.md)** - Installation and setup
- **[Tools Reference](docs/TOOLS_REFERENCE.md)** - All 32 tools documented
- **[Usage Examples](docs/EXAMPLES.md)** - Practical trading examples
- **[Configuration](docs/CONFIGURATION.md)** - Advanced configuration options

## 🎯 Example Usage with Claude

Once configured, you can ask Claude:

```
"List my trading accounts"
"What's the current price of EURUSD?"
"Show my open positions"
"Buy 0.1 lots of EURUSD with stop loss at 1.0850"
"Get the last 50 hourly candles for GBPUSD"
```

See [EXAMPLES.md](docs/EXAMPLES.md) for more usage patterns.

## 🏗️ Architecture

```
MetaAPI MCP Server (HTTP/SSE)
├── Express Server (Port 3333)
├── MCP Server Instance
│   ├── 32 Trading Tools
│   ├── 4 Resources
│   └── 3 Prompts
└── MetaAPI SDK Client
    └── Your MT4/MT5 Accounts
```

## 📋 Prerequisites

- Node.js >= 18.0.0
- MetaAPI account ([Sign up](https://metaapi.cloud/))
- API token from MetaAPI dashboard
- At least one MT4/MT5 account provisioned in MetaAPI

## 🔧 Installation & Setup

See the complete [Getting Started Guide](docs/GETTING_STARTED.md) for detailed instructions.

### Quick Setup

1. Clone/download this repository
2. Install dependencies: `npm install`
3. Create `.env` file with your METAAPI_TOKEN
4. Start server: `npm start`
5. Configure Claude Desktop (see guide)

## 💡 Available Commands

```bash
npm start          # Start the server
npm run dev        # Development mode with auto-reload
npm test           # Run test suite
```

## 🔗 API Endpoints

- `http://localhost:3333/health` - Health check
- `http://localhost:3333/sse` - SSE connection for MCP clients
- `http://localhost:3333/message/:sessionId` - JSON-RPC messages

## 🛠️ Development

### Project Structure

```
metaapi-mcp-server/
├── src/
│   ├── index.js              # Main server & MCP setup
│   ├── config.js             # Configuration & MetaAPI client
│   └── utils/
│       ├── logger.js         # Logging utility
│       ├── connection.js     # Connection management
│       └── helpers.js        # Helper functions
├── tests/                    # Test files
├── scripts/                  # Utility scripts
├── docs/                     # Documentation
└── .env                      # Environment variables (create this)
```

### Testing

```bash
# Test basic functionality
node tests/test_client.js

# Test all MCP features
node tests/test_mcp_client.js

# Test market data visualization
node tests/test_candle_viz.js
```

## 📚 Learn More

- [MetaAPI Documentation](https://metaapi.cloud/docs/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)

## ⚠️ Important Notes

- **Demo Accounts**: Test with demo accounts before using real money
- **API Limits**: MetaAPI has rate limits - see their documentation
- **Security**: Keep your API token secure, never commit `.env` files
- **Risk**: Trading involves risk - use proper risk management

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read the contribution guidelines first.

## 📞 Support

- [MetaAPI Support](https://metaapi.cloud/docs/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- Issues: Use GitHub Issues for bug reports

---

Made with ❤️ for AI-powered trading
- The server will attempt to deploy accounts automatically
- This may take a few minutes on first connection
- Check account status in MetaAPI dashboard

**"Trade context busy"**
- The MT terminal is processing another request
- Retry the operation after a short delay
- The server will include this in the error message

**"Market is closed"**
- Trading session is closed for the symbol
- Check broker trading hours
- Use `get_server_time` to verify current time

**Connection timeouts**
- First connection to an account can take 2-5 minutes
- The server logs progress during connection/synchronization
- Check stderr logs for connection status

## Performance Tips

1. **Reuse connections**: The server caches connections automatically
2. **Batch queries**: Use resources to get multiple data points efficiently
3. **Streaming for prices**: Use `subscribe_price` instead of polling `get_symbol_price`
4. **Check margin first**: Use `calculate_margin` before placing orders to avoid rejections

## Resources

- [MetaAPI Documentation](https://metaapi.cloud/docs/)
- [MetaAPI JavaScript SDK](https://github.com/agiliumtrade-ai/metaapi-node.js-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

## License

MIT

## Support

For issues related to:
- **MetaAPI functionality**: Check [MetaAPI docs](https://metaapi.cloud/docs/) or contact MetaAPI support
- **MCP server implementation**: Open an issue in this repository
- **MCP protocol**: See [MCP documentation](https://modelcontextprotocol.io/)
