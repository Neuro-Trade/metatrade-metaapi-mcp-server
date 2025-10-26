# MetaAPI MCP Server# MetaAPI MCP Server



A Model Context Protocol (MCP) server that provides AI assistants like Claude with direct access to MetaAPI trading platform. Trade forex, stocks, and commodities through natural language conversations.A Model Context Protocol (MCP) server that provides AI assistants like Claude with direct access to MetaAPI trading platform. Trade forex, stocks, and commodities through natural language conversations.



---## 🚀 Quick Start



## Table of Contents### Option 1: Pass Token in URL (Recommended)



- [Quick Start](#quick-start)Start the server and pass your token via URL query parameter:

- [Features](#features)

- [Getting Started](#getting-started)```bash

- [Tools Reference](#tools-reference)# Install dependencies

- [Usage Examples](#usage-examples)npm install

- [Configuration](#configuration)

- [Architecture](#architecture)# Start the server

- [Development](#development)npm start

- [Troubleshooting](#troubleshooting)```

- [Support](#support)

Configure Claude Desktop:

---

```json

## Quick Start{

  "mcpServers": {

### Option 1: Pass Token in URL (Recommended)    "MetaAPI MCP": {

      "command": "npx",

Start the server and pass your token via URL query parameter:      "args": [

        "mcp-remote",

```bash        "http://localhost:3000/sse?token=your_metaapi_token_here"

# Install dependencies      ]

npm install    }

  }

# Start the server}

npm start```

```

### Option 2: Use .env File

Configure Claude Desktop:

```bash

```json# Install dependencies

{npm install

  "mcpServers": {

    "MetaAPI MCP": {# Create .env file with your MetaAPI token

      "command": "npx",echo "METAAPI_TOKEN=your_token_here" > .env

      "args": [

        "mcp-remote",# Start the server

        "http://localhost:3000/sse?token=your_metaapi_token_here"npm start

      ]```

    }

  }Configure Claude Desktop:

}

``````json

{

### Option 2: Use .env File  "mcpServers": {

    "MetaAPI MCP": {

```bash      "command": "npx",

# Install dependencies      "args": [

npm install        "mcp-remote",

        "http://localhost:3000/sse"

# Create .env file with your MetaAPI token      ]

echo "METAAPI_TOKEN=your_token_here" > .env    }

  }

# Start the server}

npm start```

```

See the complete [Getting Started Guide](docs/GETTING_STARTED.md) for more details.

Configure Claude Desktop:

## ✨ Features

```json

{### 32 Trading Tools

  "mcpServers": {- **Account Management** - View balances, equity, margin, and account details

    "MetaAPI MCP": {- **Market Data** - Real-time prices, historical candles, tick data

      "command": "npx",- **Order Management** - Market orders, limit orders, stop orders

      "args": [- **Position Management** - Modify, close, or monitor positions

        "mcp-remote",- **Trading History** - View past orders, deals, and performance

        "http://localhost:3000/sse"- **Risk Management** - Calculate margins, set stop losses

      ]

    }### 4 MCP Resources

  }- `metaapi://accounts` - All trading accounts

}- `metaapi://accounts/{accountId}` - Specific account details

```- `metaapi://accounts/{accountId}/positions` - Open positions

- `metaapi://accounts/{accountId}/orders` - Pending orders

---

### 3 Smart Prompts

## Features- `account_overview` - Complete account analysis

- `risk_check` - Pre-trade risk assessment

### 32 Trading Tools- `trading_summary` - Recent activity summary



- **Account Management** - View balances, equity, margin, and account details## 📖 Documentation

- **Market Data** - Real-time prices, historical candles, tick data

- **Order Management** - Market orders, limit orders, stop orders- **[Getting Started](docs/GETTING_STARTED.md)** - Installation and setup

- **Position Management** - Modify, close, or monitor positions- **[Tools Reference](docs/TOOLS_REFERENCE.md)** - All 32 tools documented

- **Trading History** - View past orders, deals, and performance- **[Usage Examples](docs/EXAMPLES.md)** - Practical trading examples

- **Risk Management** - Calculate margins, set stop losses- **[Configuration](docs/CONFIGURATION.md)** - Advanced configuration options

- **[Docker Deployment](DOCKER.md)** - Production deployment with Docker

### 4 MCP Resources- **[Quick Deploy Guide](DEPLOY.md)** - Fast deployment commands



- `metaapi://accounts` - All trading accounts## 🐳 Docker Deployment

- `metaapi://accounts/{accountId}` - Specific account details

- `metaapi://accounts/{accountId}/positions` - Open positionsQuick start with Docker:

- `metaapi://accounts/{accountId}/orders` - Pending orders

```bash

### 3 Smart Prompts# Using Docker Compose

docker-compose up -d

- `account_overview` - Complete account analysis

- `risk_check` - Pre-trade risk assessment# Or using npm scripts

- `trading_summary` - Recent activity summarynpm run compose:up

```

---

See [DOCKER.md](DOCKER.md) for complete deployment guide.

## Getting Started

## 🎯 Example Usage with Claude

### Prerequisites

Once configured, you can ask Claude:

- Node.js 18 or higher

- MetaAPI account and API token```

- Claude Desktop application"List my trading accounts"

"What's the current price of EURUSD?"

### Installation"Show my open positions"

"Buy 0.1 lots of EURUSD with stop loss at 1.0850"

1. **Clone or download this project**"Get the last 50 hourly candles for GBPUSD"

```

2. **Install dependencies**

   ```bashSee [EXAMPLES.md](docs/EXAMPLES.md) for more usage patterns.

   npm install

   ```## 🏗️ Architecture



3. **Configure your MetaAPI token**```

   MetaAPI MCP Server (HTTP/SSE)

   Create a `.env` file in the project root:├── Express Server (Port 3000)

   ```env├── MCP Server Instance

   METAAPI_TOKEN=your_metaapi_token_here│   ├── 32 Trading Tools

   ```│   ├── 4 Resources

│   └── 3 Prompts

4. **Start the server**└── MetaAPI SDK Client

   ```bash    └── Your MT4/MT5 Accounts

   npm start```

   ```

   ## 📋 Prerequisites

   The server will start on `http://localhost:3000`

- Node.js >= 18.0.0

### Configure Claude Desktop- MetaAPI account ([Sign up](https://metaapi.cloud/))

- API token from MetaAPI dashboard

1. **Open Claude Desktop configuration file**- At least one MT4/MT5 account provisioned in MetaAPI

   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`## 🔧 Installation & Setup



2. **Add the MetaAPI MCP server configuration**See the complete [Getting Started Guide](docs/GETTING_STARTED.md) for detailed instructions.

   

   **Option A: Pass token in URL query parameter (Recommended for remote server)**### Quick Setup

   ```json

   {1. Clone/download this repository

     "mcpServers": {2. Install dependencies: `npm install`

       "MetaAPI MCP": {3. Create `.env` file with your METAAPI_TOKEN

         "command": "/Users/yourusername/.nvm/versions/node/v20.18.1/bin/npx",4. Start server: `npm start`

         "args": [5. Configure Claude Desktop (see guide)

           "mcp-remote",

           "http://localhost:3000/sse?token=your_metaapi_token_here"## 💡 Available Commands

         ],

         "env": {```bash

           "NODE_PATH": "/Users/yourusername/.nvm/versions/node/v20.18.1/lib/node_modules",npm start          # Start the server

           "PATH": "/Users/yourusername/.nvm/versions/node/v20.18.1/bin:/usr/local/bin:/usr/bin:/bin"npm run dev        # Development mode with auto-reload

         }npm test           # Run test suite

       }```

     }

   }## 🔗 API Endpoints

   ```

   - `http://localhost:3000/health` - Health check

   **Option B: Use .env file (simpler configuration)**- `http://localhost:3000/sse` - SSE connection for MCP clients

   ```json- `http://localhost:3000/message/:sessionId` - JSON-RPC messages

   {

     "mcpServers": {## 🛠️ Development

       "MetaAPI MCP": {

         "command": "npx",### Project Structure

         "args": [

           "mcp-remote",```

           "http://localhost:3000/sse"metaapi-mcp-server/

         ]├── src/

       }│   ├── index.js              # Main server & MCP setup

     }│   ├── config.js             # Configuration & MetaAPI client

   }│   └── utils/

   ```│       ├── logger.js         # Logging utility

│       ├── connection.js     # Connection management

3. **Restart Claude Desktop**│       └── helpers.js        # Helper functions

   ├── tests/                    # Test files

   Completely quit and restart the application.├── scripts/                  # Utility scripts

├── docs/                     # Documentation

### Verify Connection└── .env                      # Environment variables (create this)

```

Once Claude Desktop restarts, try asking:

### Testing

- "What MCP servers are connected?"

- "List my MetaAPI trading accounts"```bash

# Test basic functionality

You should see the MetaAPI MCP server in the list of available servers.node tests/test_client.js



---# Test all MCP features

node tests/test_mcp_client.js

## Tools Reference

# Test market data visualization

The MetaAPI MCP Server provides 32 tools for trading, market data, and account management.node tests/test_candle_viz.js

```

### Account Management

## 📚 Learn More

#### list_accounts

List all MetaAPI accounts accessible with your API token.- [MetaAPI Documentation](https://metaapi.cloud/docs/)

- [Model Context Protocol](https://modelcontextprotocol.io/)

**Returns:** Array of account objects with id, name, type, platform, and state- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)



**Example:**## ⚠️ Important Notes

```

"List my trading accounts"- **Demo Accounts**: Test with demo accounts before using real money

```- **API Limits**: MetaAPI has rate limits - see their documentation

- **Security**: Keep your API token secure, never commit `.env` files

#### get_account_information- **Risk**: Trading involves risk - use proper risk management

Get detailed information about a specific trading account including balance, equity, and margin.

## 📄 License

**Arguments:**

- `accountId` (required): The MetaAPI account IDMIT



**Example:**## 🤝 Contributing

```

"Show me the account information for account abc123"Contributions are welcome! Please read the contribution guidelines first.

```

## 📞 Support

---

- [MetaAPI Support](https://metaapi.cloud/docs/)

### Market Data- [MCP Documentation](https://modelcontextprotocol.io/)

- Issues: Use GitHub Issues for bug reports

#### get_symbols

List all available trading symbols (currency pairs, commodities, etc.) for an account.---



**Arguments:**Made with ❤️ for AI-powered trading

- `accountId` (required): The MetaAPI account ID- The server will attempt to deploy accounts automatically

- This may take a few minutes on first connection

**Example:**- Check account status in MetaAPI dashboard

```

"What symbols can I trade on account abc123?"**"Trade context busy"**

```- The MT terminal is processing another request

- Retry the operation after a short delay

#### get_symbol_specification- The server will include this in the error message

Get detailed specification for a symbol including tick size, contract size, trading hours, etc.

**"Market is closed"**

**Arguments:**- Trading session is closed for the symbol

- `accountId` (required): The MetaAPI account ID- Check broker trading hours

- `symbol` (required): Symbol name (e.g., "EURUSD")- Use `get_server_time` to verify current time



**Example:****Connection timeouts**

```- First connection to an account can take 2-5 minutes

"Get the specification for EURUSD"- The server logs progress during connection/synchronization

```- Check stderr logs for connection status



#### get_symbol_price## Performance Tips

Get current real-time price for a symbol.

1. **Reuse connections**: The server caches connections automatically

**Arguments:**2. **Batch queries**: Use resources to get multiple data points efficiently

- `accountId` (required): The MetaAPI account ID3. **Streaming for prices**: Use `subscribe_price` instead of polling `get_symbol_price`

- `symbol` (required): Symbol name4. **Check margin first**: Use `calculate_margin` before placing orders to avoid rejections



**Example:**## Resources

```

"What's the current price of GBPUSD?"- [MetaAPI Documentation](https://metaapi.cloud/docs/)

```- [MetaAPI JavaScript SDK](https://github.com/agiliumtrade-ai/metaapi-node.js-sdk)

- [Model Context Protocol](https://modelcontextprotocol.io/)

#### get_candles- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

Retrieve historical candle/bar data for technical analysis.

## License

**Arguments:**

- `accountId` (required): The MetaAPI account IDMIT

- `symbol` (required): Symbol name

- `timeframe` (required): Candle timeframe (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1mn)## Support

- `limit` (optional): Number of candles (default: 100, max: 1000)

For issues related to:

**Example:**- **MetaAPI functionality**: Check [MetaAPI docs](https://metaapi.cloud/docs/) or contact MetaAPI support

```- **MCP server implementation**: Open an issue in this repository

"Get the last 50 hourly candles for EURUSD"- **MCP protocol**: See [MCP documentation](https://modelcontextprotocol.io/)

```

#### get_tick_data
Retrieve recent tick-by-tick price data.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `limit` (optional): Number of ticks (default: 100, max: 1000)

**Example:**
```
"Show me the last 200 ticks for USDJPY"
```

#### get_current_tick
Get the most recent tick for a symbol.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"What's the current tick for GOLD?"
```

---

### Position Management

#### get_positions
List all open positions for an account.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"Show my open positions"
```

#### get_position
Get details of a specific position by ID.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID

**Example:**
```
"Get details for position 12345"
```

#### modify_position
Modify stop loss or take profit of an existing position.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID
- `stopLoss` (optional): New stop loss price
- `takeProfit` (optional): New take profit price

**Example:**
```
"Set stop loss to 1.0850 and take profit to 1.0950 for position 12345"
```

#### close_position
Close an open position partially or completely.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID
- `volume` (optional): Volume to close (if partial)

**Example:**
```
"Close position 12345"
```

#### close_position_by_symbol
Close all positions for a specific symbol.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"Close all EURUSD positions"
```

---

### Order Management

#### get_orders
List all pending orders.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"Show my pending orders"
```

#### get_order
Get details of a specific order by ID.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `orderId` (required): Order ID

**Example:**
```
"Get details for order 67890"
```

#### create_market_order
Execute a market order to buy or sell immediately at current price.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `actionType` (required): "ORDER_TYPE_BUY" or "ORDER_TYPE_SELL"
- `volume` (required): Trade volume in lots
- `stopLoss` (optional): Stop loss price
- `takeProfit` (optional): Take profit price
- `comment` (optional): Order comment

**Example:**
```
"Buy 0.1 lots of EURUSD with stop loss at 1.0850"
```

#### create_limit_order
Create a pending limit order to buy/sell at a specific price.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `actionType` (required): "ORDER_TYPE_BUY_LIMIT" or "ORDER_TYPE_SELL_LIMIT"
- `volume` (required): Trade volume in lots
- `openPrice` (required): Price at which to execute order
- `stopLoss` (optional): Stop loss price
- `takeProfit` (optional): Take profit price
- `comment` (optional): Order comment

**Example:**
```
"Create a buy limit order for GBPUSD at 1.2500, volume 0.2 lots"
```

#### create_stop_order
Create a pending stop order.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `actionType` (required): "ORDER_TYPE_BUY_STOP" or "ORDER_TYPE_SELL_STOP"
- `volume` (required): Trade volume in lots
- `openPrice` (required): Price at which to trigger order
- `stopLoss` (optional): Stop loss price
- `takeProfit` (optional): Take profit price
- `comment` (optional): Order comment

**Example:**
```
"Create a buy stop order for USDJPY at 150.00"
```

#### modify_order
Modify a pending order's price or stop loss/take profit.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `orderId` (required): Order ID
- `openPrice` (optional): New open price
- `stopLoss` (optional): New stop loss
- `takeProfit` (optional): New take profit

**Example:**
```
"Change order 67890 open price to 1.2550"
```

#### cancel_order
Cancel a pending order.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `orderId` (required): Order ID

**Example:**
```
"Cancel order 67890"
```

---

### Trading History

#### get_history_orders_by_ticket
Get historical orders filtered by ticket number.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `ticket` (required): Ticket/order number

**Example:**
```
"Get history for ticket 12345"
```

#### get_history_orders_by_position
Get historical orders associated with a position.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID

**Example:**
```
"Get order history for position 12345"
```

#### get_history_orders_by_time_range
Get historical orders within a time range.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `startTime` (required): Start time (ISO 8601 format)
- `endTime` (required): End time (ISO 8601 format)
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Results limit (default: 1000)

**Example:**
```
"Get all orders from January 1 to January 31, 2024"
```

#### get_deals_by_ticket
Get deal history filtered by ticket number.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `ticket` (required): Ticket number

**Example:**
```
"Get deals for ticket 12345"
```

#### get_deals_by_position
Get deals associated with a position.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID

**Example:**
```
"Get deals for position 12345"
```

#### get_deals_by_time_range
Get deals within a time range.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `startTime` (required): Start time (ISO 8601 format)
- `endTime` (required): End time (ISO 8601 format)
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Results limit (default: 1000)

**Example:**
```
"Show all deals from last week"
```

---

### Market Subscriptions

#### subscribe_to_market_data
Subscribe to real-time price updates for symbols.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `subscriptions` (optional): Array of subscription types

**Example:**
```
"Subscribe to real-time prices for EURUSD"
```

#### unsubscribe_from_market_data
Unsubscribe from price updates.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"Unsubscribe from EURUSD updates"
```

#### get_active_subscriptions
List all active market data subscriptions.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"What symbols am I subscribed to?"
```

---

### Server Information

#### get_server_time
Get the current server time from MetaAPI.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"What's the server time?"
```

#### calculate_margin
Calculate required margin for a trade.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `type` (required): Order type
- `volume` (required): Trade volume in lots
- `openPrice` (required): Expected open price

**Example:**
```
"Calculate margin for buying 1 lot of EURUSD at 1.0900"
```

---

## Usage Examples

### Market Data Analysis

#### Check Current Prices

```
"What's the current price of EURUSD?"
```

```
"Show me real-time prices for GBPUSD, USDJPY, and GOLD"
```

#### Get Historical Data

```
"Get the last 100 hourly candles for EURUSD"
```

```
"Show me daily candles for GBPUSD from the last month"
```

#### Analyze Tick Data

```
"Get the last 500 ticks for USDJPY"
```

#### Symbol Information

```
"Get the symbol specification for GOLD"
```

---

### Position Management Workflows

#### View Open Positions

```
"Show all my open positions"
```

```
"What positions do I have on EURUSD?"
```

#### Modify Positions

```
"Set stop loss to 1.0850 for position 12345"
```

```
"Update position 12345 with stop loss 1.0850 and take profit 1.0950"
```

#### Close Positions

```
"Close position 12345"
```

```
"Close all EURUSD positions"
```

```
"Close half of position 12345"
```

---

### Order Management Patterns

#### View Pending Orders

```
"Show my pending orders"
```

```
"What orders do I have for GBPUSD?"
```

#### Create Market Orders

```
"Buy 0.1 lots of EURUSD at market price"
```

```
"Sell 0.5 lots of GBPUSD with stop loss at 1.2500 and take profit at 1.2700"
```

#### Create Limit Orders

```
"Create a buy limit order for EURUSD at 1.0850, volume 0.2 lots"
```

```
"Set a sell limit order at 1.1000 for EURUSD with 0.1 lot volume"
```

#### Create Stop Orders

```
"Create a buy stop order for GBPUSD at 1.2600"
```

```
"Set a sell stop for USDJPY at 149.50 with volume 0.3 lots"
```

#### Modify Orders

```
"Change the open price of order 67890 to 1.0900"
```

```
"Update order 67890 stop loss to 1.0850"
```

#### Cancel Orders

```
"Cancel order 67890"
```

---

### Complex Multi-Step Workflows

#### Complete Trade Analysis

```
"For account abc123:
1. Show current balance and equity
2. Get the last 50 hourly candles for EURUSD
3. Show current EURUSD price
4. List any open EURUSD positions"
```

#### Risk Management

```
"For my position 12345:
1. Get the current position details
2. Show me the current price
3. Calculate what my loss would be if I set stop loss at 1.0850"
```

#### Portfolio Overview

```
"Give me a complete overview:
1. List all my trading accounts
2. For each account, show balance and open positions
3. Show pending orders
4. List active market subscriptions"
```

---

### Trading Tips

1. **Be specific with account IDs** - Always include the account ID when working with multiple accounts
2. **Use natural language** - Claude understands conversational requests
3. **Combine multiple requests** - Ask for related information in one query
4. **Check specifications** - Review symbol specs before trading to understand tick sizes and contract values
5. **Monitor positions** - Regularly check position status and adjust stop losses as needed

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: Your MetaAPI API token
METAAPI_TOKEN=your_token_here

# Optional: Server port (default: 3000)
PORT=3000

# Optional: Log level (default: info)
LOG_LEVEL=info
```

### Getting a MetaAPI Token

1. Sign up at [MetaAPI](https://metaapi.cloud/)
2. Navigate to your dashboard
3. Generate an API token
4. Copy the token to your `.env` file

---

### Server Configuration

#### Port Configuration

Default port is 3000. To change, set in `.env`:

```env
PORT=8080
```

#### Custom Port in Claude Desktop

If you changed the server port:

```json
{
  "mcpServers": {
    "MetaAPI MCP": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8080/sse"
      ]
    }
  }
}
```

#### Multiple Servers

You can run multiple instances on different ports:

```json
{
  "mcpServers": {
    "MetaAPI Production": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3000/sse"
      ]
    },
    "MetaAPI Demo": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3334/sse"
      ]
    }
  }
}
```

---

### Security Considerations

#### API Token Security

- Never commit `.env` files to version control
- Keep your MetaAPI token private
- Rotate tokens periodically
- Use separate tokens for production and testing

#### Network Security

- The server runs on localhost by default
- Only expose to network if absolutely necessary
- Use HTTPS in production (requires reverse proxy)
- Consider firewall rules for exposed instances

#### Claude Desktop Access

- Claude Desktop connects via localhost
- No external network access required
- Tokens stay on your machine

---

### Performance Tuning

#### Market Data Limits

- Candles: Max 1000 per request
- Ticks: Max 1000 per request
- History: Paginated with offset/limit

#### Rate Limiting

MetaAPI has rate limits. The server doesn't enforce additional limits, but be aware of:

- API calls per minute
- Concurrent connections
- Data retrieval limits

Check [MetaAPI documentation](https://metaapi.cloud/docs/) for current limits.

---

## Architecture

```
MetaAPI MCP Server (HTTP/SSE)
├── Express Server (Port 3000)
├── MCP Server Instance
│   ├── 32 Trading Tools
│   ├── 4 Resources
│   └── 3 Prompts
└── MetaAPI SDK Client
    └── Your MT4/MT5 Accounts
```

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
├── config/                   # Config examples
├── docs/                     # Documentation
└── .env                      # Environment variables (create this)
```

---

## Development

### Available Commands

```bash
npm start          # Start the server
npm run dev        # Development mode with auto-reload
npm test           # Run test suite
```

### API Endpoints

- `http://localhost:3000/health` - Health check
- `http://localhost:3000/sse` - SSE connection for MCP clients
- `http://localhost:3000/message/:sessionId` - JSON-RPC messages

### Testing

```bash
# Test basic functionality
node tests/test_client.js

# Test all MCP features
node tests/test_mcp_client.js

# Test market data visualization
node tests/test_candle_viz.js
```

---

## Troubleshooting

### Server Won't Start

Check:
- Port 3000 is available: `lsof -i :3000`
- `.env` file exists and has METAAPI_TOKEN
- Dependencies installed: `npm install`

### Claude Can't Connect

Check:
- Server is running: `curl http://localhost:3000/health`
- Config file syntax is valid JSON
- `mcp-remote` package is available: `npx mcp-remote --version`
- Restart Claude Desktop completely

### Invalid Token Errors

- Verify token in MetaAPI dashboard
- Check for whitespace in `.env` file
- Ensure token has not expired
- Try regenerating the token

### Health Check

Test the server is running:

```bash
curl http://localhost:3000/health
```

Should return:

```json
{"status":"ok","server":"MetaAPI MCP Server"}
```

### Common Issues

**"Account not deployed"**
- The server will attempt to deploy accounts automatically
- This may take a few minutes on first connection
- Check account status in MetaAPI dashboard

**"Trade context busy"**
- The MT terminal is processing another request
- Retry the operation after a short delay

**"Market is closed"**
- Trading session is closed for the symbol
- Check broker trading hours
- Use `get_server_time` to verify current time

**Connection timeouts**
- First connection to an account can take 2-5 minutes
- The server logs progress during connection/synchronization

---

## Performance Tips

1. **Reuse connections**: The server caches connections automatically
2. **Batch queries**: Use resources to get multiple data points efficiently
3. **Streaming for prices**: Use `subscribe_to_market_data` instead of polling `get_symbol_price`
4. **Check margin first**: Use `calculate_margin` before placing orders to avoid rejections

---

## Support

### External Resources

- [MetaAPI Documentation](https://metaapi.cloud/docs/)
- [MetaAPI JavaScript SDK](https://github.com/agiliumtrade-ai/metaapi-node.js-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

### Getting Help

For issues related to:
- **MetaAPI functionality**: Check [MetaAPI docs](https://metaapi.cloud/docs/) or contact MetaAPI support
- **MCP server implementation**: Open an issue in this repository
- **MCP protocol**: See [MCP documentation](https://modelcontextprotocol.io/)

---

## Important Notes

- **Demo Accounts**: Test with demo accounts before using real money
- **API Limits**: MetaAPI has rate limits - see their documentation
- **Security**: Keep your API token secure, never commit `.env` files
- **Risk**: Trading involves risk - use proper risk management

---

## License

MIT

---

Made with ❤️ for AI-powered trading
