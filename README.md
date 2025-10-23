# MetaAPI MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to MetaAPI trading platform capabilities. This server exposes MetaTrader account management, trading operations, market data, and streaming price feeds through the MCP protocol.

## Features

### Tools (Functions)
- **Account Management**: List accounts, get account state, view account information
- **Trading Operations**: Place market/limit orders, close positions, modify positions, cancel orders
- **Market Data**: Get symbol prices, calculate margin requirements, retrieve server time
- **History & Reporting**: View positions, orders, historical orders, and deals
- **Real-time Streaming**: Subscribe to price updates for symbols

### Resources
Expose account metadata, positions, and orders as MCP resources:
- `metaapi://accounts` - All trading accounts
- `metaapi://accounts/{accountId}` - Specific account details
- `metaapi://accounts/{accountId}/positions` - Account positions
- `metaapi://accounts/{accountId}/orders` - Account pending orders

### Prompts
Pre-configured workflows for common tasks:
- `account_overview` - Comprehensive account analysis
- `risk_check` - Pre-trade risk assessment
- `trading_summary` - Recent trading activity summary

## Installation

### Prerequisites
- Node.js >= 18.0.0
- MetaAPI account and API token
- Provisioned MetaTrader accounts in MetaAPI

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the project root:
```bash
METAAPI_TOKEN=your_metaapi_token_here
```

You can get your MetaAPI token from: https://app.metaapi.cloud/

3. **Verify MetaTrader accounts:**

Make sure you have at least one MetaTrader account provisioned in MetaAPI. You'll need the account ID(s) to use with the tools.

## Usage

### Running the Server

**Start the server (stdio mode):**
```bash
npm start
```

**Development mode with auto-reload:**
```bash
npm run dev
```

### Connecting from MCP Clients

#### Claude Desktop Configuration

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "metaapi": {
      "command": "node",
      "args": ["/path/to/metaapi-mcp-server/src/index.js"],
      "env": {
        "METAAPI_TOKEN": "your_metaapi_token_here"
      }
    }
  }
}
```

#### Other MCP Clients

The server uses stdio transport by default, which is compatible with any MCP client that supports stdio connections.

## Available Tools

### Account Management

#### list_accounts
Lists all provisioned MetaTrader accounts.
```
No parameters required
```

#### get_account_state
Get comprehensive account state including balance, equity, positions, and orders.
```json
{
  "accountId": "your-account-id"
}
```

#### get_account_information
Get detailed account information.
```json
{
  "accountId": "your-account-id"
}
```

### Trading Operations

#### place_market_order
Place a market order (buy/sell at current price).
```json
{
  "accountId": "your-account-id",
  "symbol": "EURUSD",
  "side": "buy",
  "volume": 0.01,
  "stopLoss": 1.0950,
  "takeProfit": 1.1050,
  "comment": "Optional comment"
}
```

#### place_limit_order
Place a pending limit order.
```json
{
  "accountId": "your-account-id",
  "symbol": "GBPUSD",
  "side": "buy",
  "volume": 0.1,
  "openPrice": 1.2500,
  "stopLoss": 1.2400,
  "takeProfit": 1.2600
}
```

#### close_position
Close an open position.
```json
{
  "accountId": "your-account-id",
  "positionId": "position-id"
}
```

#### modify_position
Modify stop loss and take profit of a position.
```json
{
  "accountId": "your-account-id",
  "positionId": "position-id",
  "stopLoss": 1.0950,
  "takeProfit": 1.1050
}
```

#### cancel_order
Cancel a pending order.
```json
{
  "accountId": "your-account-id",
  "orderId": "order-id"
}
```

### Market Data

#### get_symbol_price
Get current bid/ask prices for a symbol.
```json
{
  "accountId": "your-account-id",
  "symbol": "EURUSD"
}
```

#### calculate_margin
Calculate margin required for a trade.
```json
{
  "accountId": "your-account-id",
  "symbol": "GBPUSD",
  "type": "ORDER_TYPE_BUY",
  "volume": 0.1,
  "openPrice": 1.2500
}
```

#### get_server_time
Get the broker server time.
```json
{
  "accountId": "your-account-id"
}
```

### History & Positions

#### get_positions
Get all open positions.
```json
{
  "accountId": "your-account-id"
}
```

#### get_orders
Get all pending orders.
```json
{
  "accountId": "your-account-id"
}
```

#### get_history_orders
Get historical orders within a time range.
```json
{
  "accountId": "your-account-id",
  "startTime": "2025-01-01T00:00:00Z",
  "endTime": "2025-01-31T23:59:59Z"
}
```
*Note: If times are omitted, defaults to last 90 days.*

#### get_deals
Get deal history within a time range.
```json
{
  "accountId": "your-account-id",
  "startTime": "2025-01-01T00:00:00Z",
  "endTime": "2025-01-31T23:59:59Z"
}
```

### Streaming

#### subscribe_price
Subscribe to real-time price updates for a symbol.
```json
{
  "accountId": "your-account-id",
  "symbol": "EURUSD"
}
```
*Note: Price updates are logged to stderr. In production, this would stream via SSE.*

## Architecture & Design Principles

### Connection Management
- **Connection Reuse**: RPC connections are cached and reused across tool calls for performance
- **Auto-deployment**: Accounts are automatically deployed if not already deployed
- **Synchronization**: Connections wait for terminal synchronization before allowing operations

### Error Handling
- MetaAPI errors are mapped to user-friendly messages
- Common errors (market closed, insufficient funds, etc.) are clearly identified
- All errors include both a message and error code

### Trading Safety
- **Idempotency**: Market orders use client-generated `clientOrderId` to prevent duplicate fills
- **Validation**: Parameters are validated before sending to MetaAPI
- **Risk Management**: Tools for margin calculation and risk checks before trading

### Logging
- All logs go to stderr (MCP requirement)
- Logs include request context: tool name, account ID, operation
- Structured logging for easy monitoring

### Performance Considerations
- Connection pooling and reuse
- Parallel requests where possible
- Efficient resource caching

## Security

### Token Management
- Token is loaded from environment variables
- Token is never returned in tool results or logs
- Use `.env` file for local development (git-ignored)

### Best Practices
- Never commit `.env` file to version control
- Use separate tokens for development/production
- Rotate tokens regularly
- Monitor API usage in MetaAPI dashboard

## Development

### Project Structure
```
.
├── src/
│   └── index.js          # Main MCP server implementation
├── example.js            # Original MetaAPI example (reference)
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create this)
└── README.md            # This file
```

### Adding New Tools

To add a new tool:

1. Add tool definition in `ListToolsRequestSchema` handler
2. Implement tool logic in `CallToolRequestSchema` handler
3. Add error handling with user-friendly messages
4. Test with various account states

### Testing

Test individual tools using an MCP client or by running the server directly:

```bash
# Start server
npm start

# In another terminal, send MCP requests via stdin
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npm start
```

## Troubleshooting

### Common Issues

**"METAAPI_TOKEN environment variable is required"**
- Create a `.env` file with your MetaAPI token
- Or set the environment variable in your shell/MCP client config

**"Account not deployed"**
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
