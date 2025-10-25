# MetaAPI MCP Server - API Reference

Complete reference for all available tools, resources, and prompts.

---

## Table of Contents

- [Tools](#tools)
  - [Account Management](#account-management)
  - [Trading Operations](#trading-operations)
  - [Market Data](#market-data)
  - [History & Reporting](#history--reporting)
  - [Streaming](#streaming)
- [Resources](#resources)
- [Prompts](#prompts)
- [Error Handling](#error-handling)
- [Data Types](#data-types)

---

## Tools

### Account Management

#### `list_accounts`

List all provisioned MetaTrader accounts.

**Parameters:** None

**Returns:**
```json
[
  {
    "id": "account-id",
    "name": "My MT5 Account",
    "login": "12345678",
    "server": "ICMarketsSC-Demo",
    "platform": "mt5",
    "type": "cloud",
    "state": "DEPLOYED",
    "connectionStatus": "CONNECTED"
  }
]
```

**Example:**
```
List my MetaAPI accounts
```

---

#### `get_account_state`

Get comprehensive account state including balance, equity, positions, and orders.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID

**Returns:**
```json
{
  "account": {
    "balance": 10000.00,
    "equity": 10050.25,
    "margin": 100.00,
    "freeMargin": 9950.25,
    "marginLevel": 10050.25,
    "credit": 0,
    "currency": "USD"
  },
  "positions": [...],
  "orders": [...],
  "summary": {
    "balance": 10000.00,
    "equity": 10050.25,
    "margin": 100.00,
    "freeMargin": 9950.25,
    "marginLevel": 10050.25,
    "openPositions": 2,
    "pendingOrders": 1
  }
}
```

**Example:**
```
Show me the complete state of account abc-123-def
```

---

#### `get_account_information`

Get detailed account information.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID

**Returns:**
```json
{
  "balance": 10000.00,
  "equity": 10050.25,
  "margin": 100.00,
  "freeMargin": 9950.25,
  "marginLevel": 10050.25,
  "credit": 0,
  "currency": "USD",
  "leverage": 100,
  "name": "John Doe",
  "server": "ICMarketsSC-Demo",
  "tradeAllowed": true
}
```

**Example:**
```
Get account information for abc-123-def
```

---

### Trading Operations

#### `place_market_order`

Place a market order (buy or sell at current market price).

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `symbol` (string, required): Trading symbol (e.g., "EURUSD", "GBPUSD")
- `side` (string, required): "buy" or "sell"
- `volume` (number, required): Order volume in lots (e.g., 0.01, 0.1, 1.0)
- `stopLoss` (number, optional): Stop loss price
- `takeProfit` (number, optional): Take profit price
- `comment` (string, optional): Order comment

**Returns:**
```json
{
  "success": true,
  "orderId": "123456789",
  "positionId": "987654321",
  "stringCode": "TRADE_RETCODE_DONE",
  "message": "Order placed successfully",
  "clientOrderId": "buy_EURUSD_1234567890_abc123"
}
```

**Example:**
```
Place a market buy order for 0.01 lots of EURUSD on account abc-123-def 
with stop loss at 1.0950 and take profit at 1.1050
```

**Notes:**
- Uses client-generated order ID for idempotency
- Validates symbol format and lot sizes
- Returns error if market is closed or insufficient funds

---

#### `place_limit_order`

Place a pending limit order.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `symbol` (string, required): Trading symbol
- `side` (string, required): "buy" or "sell"
- `volume` (number, required): Order volume in lots
- `openPrice` (number, required): Price at which to open the order
- `stopLoss` (number, optional): Stop loss price
- `takeProfit` (number, optional): Take profit price
- `comment` (string, optional): Order comment

**Returns:**
```json
{
  "success": true,
  "orderId": "123456789",
  "stringCode": "TRADE_RETCODE_DONE",
  "message": "Order placed successfully",
  "clientOrderId": "buy_GBPUSD_1234567890_xyz789"
}
```

**Example:**
```
Place a limit buy order for 0.1 lots of GBPUSD at 1.2500 
on account abc-123-def with SL at 1.2400 and TP at 1.2600
```

---

#### `close_position`

Close an open position.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `positionId` (string, required): The position ID to close

**Returns:**
```json
{
  "success": true,
  "stringCode": "TRADE_RETCODE_DONE",
  "message": "Position closed successfully"
}
```

**Example:**
```
Close position 987654321 on account abc-123-def
```

---

#### `modify_position`

Modify stop loss and take profit of an existing position.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `positionId` (string, required): The position ID to modify
- `stopLoss` (number, optional): New stop loss price
- `takeProfit` (number, optional): New take profit price

**Returns:**
```json
{
  "success": true,
  "stringCode": "TRADE_RETCODE_DONE",
  "message": "Position modified successfully"
}
```

**Example:**
```
Modify position 987654321 on account abc-123-def 
to have stop loss at 1.0980 and take profit at 1.1020
```

---

#### `cancel_order`

Cancel a pending order.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `orderId` (string, required): The order ID to cancel

**Returns:**
```json
{
  "success": true,
  "stringCode": "TRADE_RETCODE_DONE",
  "message": "Order cancelled successfully"
}
```

**Example:**
```
Cancel order 123456789 on account abc-123-def
```

---

### Market Data

#### `get_symbol_price`

Get current bid/ask prices for a trading symbol.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `symbol` (string, required): Trading symbol (e.g., "EURUSD")

**Returns:**
```json
{
  "symbol": "EURUSD",
  "bid": 1.10125,
  "ask": 1.10135,
  "time": "2025-10-21T10:30:00.000Z",
  "brokerTime": "2025-10-21 12:30:00.000"
}
```

**Example:**
```
What's the current price of EURUSD on account abc-123-def?
```

---

#### `calculate_margin`

Calculate margin required for a trade.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `symbol` (string, required): Trading symbol
- `type` (string, required): "ORDER_TYPE_BUY" or "ORDER_TYPE_SELL"
- `volume` (number, required): Order volume in lots
- `openPrice` (number, required): Expected open price

**Returns:**
```json
{
  "margin": 110.25
}
```

**Example:**
```
Calculate margin required to buy 0.1 lots of GBPUSD at 1.2500 
on account abc-123-def
```

---

#### `get_server_time`

Get the broker server time.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID

**Returns:**
```json
{
  "serverTime": "2025-10-21T10:30:00.000Z",
  "brokerTime": "2025-10-21 12:30:00.000"
}
```

**Example:**
```
What time is it on the broker server for account abc-123-def?
```

---

### History & Reporting

#### `get_positions`

Get all open positions.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID

**Returns:**
```json
[
  {
    "id": "987654321",
    "symbol": "EURUSD",
    "type": "POSITION_TYPE_BUY",
    "volume": 0.01,
    "openPrice": 1.10000,
    "currentPrice": 1.10125,
    "stopLoss": 1.09500,
    "takeProfit": 1.11000,
    "profit": 1.25,
    "swap": 0.00,
    "commission": -0.10,
    "openTime": "2025-10-21T08:00:00.000Z"
  }
]
```

**Example:**
```
Show me all open positions on account abc-123-def
```

---

#### `get_orders`

Get all pending orders.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID

**Returns:**
```json
[
  {
    "id": "123456789",
    "symbol": "GBPUSD",
    "type": "ORDER_TYPE_BUY_LIMIT",
    "volume": 0.1,
    "openPrice": 1.25000,
    "stopLoss": 1.24000,
    "takeProfit": 1.26000,
    "time": "2025-10-21T09:00:00.000Z"
  }
]
```

**Example:**
```
List all pending orders on account abc-123-def
```

---

#### `get_history_orders`

Get historical orders within a time range.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `startTime` (string, optional): Start time in ISO format (defaults to 90 days ago)
- `endTime` (string, optional): End time in ISO format (defaults to now)

**Returns:**
```json
[
  {
    "id": "111222333",
    "symbol": "EURUSD",
    "type": "ORDER_TYPE_BUY",
    "state": "ORDER_STATE_FILLED",
    "volume": 0.01,
    "openPrice": 1.10000,
    "time": "2025-10-21T08:00:00.000Z",
    "doneTime": "2025-10-21T08:00:01.000Z"
  }
]
```

**Example:**
```
Show me order history from October 1st to October 21st for account abc-123-def
```

---

#### `get_deals`

Get deal history within a time range.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `startTime` (string, optional): Start time in ISO format (defaults to 90 days ago)
- `endTime` (string, optional): End time in ISO format (defaults to now)

**Returns:**
```json
[
  {
    "id": "444555666",
    "positionId": "987654321",
    "symbol": "EURUSD",
    "type": "DEAL_TYPE_BUY",
    "volume": 0.01,
    "price": 1.10000,
    "profit": 1.25,
    "commission": -0.10,
    "swap": 0.00,
    "time": "2025-10-21T08:00:00.000Z"
  }
]
```

**Example:**
```
Show me all deals from the last 30 days on account abc-123-def
```

---

### Streaming

#### `subscribe_price`

Subscribe to real-time price updates for a symbol.

**Parameters:**
- `accountId` (string, required): The MetaTrader account ID
- `symbol` (string, required): Trading symbol to subscribe to

**Returns:**
```json
{
  "success": true,
  "message": "Subscribed to EURUSD price updates for account abc-123-def",
  "note": "Price updates will be logged to stderr. In a production setup, use SSE to stream to client."
}
```

**Example:**
```
Subscribe to EURUSD price updates on account abc-123-def
```

**Notes:**
- Price updates are currently logged to stderr
- In production, this would use SSE for real-time streaming to clients
- Subscription persists until server restart or explicit unsubscribe

---

## Resources

Resources provide read-only access to account data via MCP's resource system.

### `metaapi://accounts`

List all trading accounts.

**URI:** `metaapi://accounts`

**Returns:** Array of account summaries

---

### `metaapi://accounts/{accountId}`

Get detailed information for a specific account.

**URI:** `metaapi://accounts/{accountId}`

**Returns:** Account information object

---

### `metaapi://accounts/{accountId}/positions`

Get open positions for an account.

**URI:** `metaapi://accounts/{accountId}/positions`

**Returns:** Array of position objects

---

### `metaapi://accounts/{accountId}/orders`

Get pending orders for an account.

**URI:** `metaapi://accounts/{accountId}/orders`

**Returns:** Array of order objects

---

## Prompts

Pre-configured prompts for common workflows.

### `account_overview`

Get a comprehensive overview of a trading account.

**Arguments:**
- `accountId` (string, required): The MetaTrader account ID

**Generates:**
A prompt that requests comprehensive account analysis including:
- Balance, equity, and margin information
- Open positions with P&L
- Pending orders
- Risk assessment
- Recent performance summary

---

### `risk_check`

Perform a risk assessment before placing a trade.

**Arguments:**
- `accountId` (string, required): The MetaTrader account ID
- `symbol` (string, required): Trading symbol
- `volume` (number, required): Proposed trade volume

**Generates:**
A prompt that performs pre-trade risk assessment including:
- Current account equity and free margin
- Required margin calculation
- Current exposure analysis
- Post-trade margin level
- Risk/reward recommendation

---

### `trading_summary`

Get a summary of recent trading activity.

**Arguments:**
- `accountId` (string, required): The MetaTrader account ID
- `days` (number, optional): Number of days to look back (default: 7)

**Generates:**
A prompt that provides trading performance summary including:
- Total number of trades
- Win/loss ratio
- Total profit/loss
- Most traded symbols
- Average trade duration
- Current open positions

---

## Error Handling

All tools return errors in a consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "tool": "tool_name"
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `MARKET_CLOSED` | Trading session is closed | Wait for market to open |
| `TRADE_CONTEXT_BUSY` | Terminal is processing another request | Retry after delay |
| `INSUFFICIENT_FUNDS` | Not enough margin for trade | Reduce volume or add funds |
| `INVALID_STOPS` | Invalid SL/TP levels | Check price levels and spread |
| `UNKNOWN_ERROR` | Unhandled error | Check logs for details |

---

## Data Types

### Account Information

```typescript
{
  balance: number;        // Account balance
  equity: number;         // Current equity
  margin: number;         // Used margin
  freeMargin: number;     // Available margin
  marginLevel: number;    // Margin level percentage
  credit: number;         // Account credit
  currency: string;       // Account currency (e.g., "USD")
  leverage: number;       // Account leverage
  name: string;           // Account holder name
  server: string;         // Broker server
  tradeAllowed: boolean;  // Trading allowed flag
}
```

### Position

```typescript
{
  id: string;             // Position ID
  symbol: string;         // Trading symbol
  type: string;           // "POSITION_TYPE_BUY" or "POSITION_TYPE_SELL"
  volume: number;         // Position volume in lots
  openPrice: number;      // Opening price
  currentPrice: number;   // Current price
  stopLoss?: number;      // Stop loss price
  takeProfit?: number;    // Take profit price
  profit: number;         // Current profit/loss
  swap: number;           // Swap amount
  commission: number;     // Commission paid
  openTime: string;       // Opening time (ISO format)
}
```

### Order

```typescript
{
  id: string;             // Order ID
  symbol: string;         // Trading symbol
  type: string;           // Order type (e.g., "ORDER_TYPE_BUY_LIMIT")
  volume: number;         // Order volume in lots
  openPrice: number;      // Order price
  stopLoss?: number;      // Stop loss price
  takeProfit?: number;    // Take profit price
  time: string;           // Order time (ISO format)
  expirationTime?: string; // Expiration time (ISO format)
}
```

### Price

```typescript
{
  symbol: string;         // Trading symbol
  bid: number;            // Bid price
  ask: number;            // Ask price
  time: string;           // Price time (ISO format)
  brokerTime: string;     // Broker server time
}
```

---

## Best Practices

1. **Always check account state before trading**
2. **Use calculate_margin before placing orders**
3. **Set appropriate stop loss and take profit levels**
4. **Test with demo accounts first**
5. **Monitor margin levels regularly**
6. **Use prompts for complex workflows**
7. **Handle errors gracefully and retry when appropriate**

---

For more information, see:
- [README.md](README.md) - Full documentation
- [QUICK_START.md](QUICK_START.md) - Getting started guide
- [MCP_CLIENT_CONFIG.md](MCP_CLIENT_CONFIG.md) - Client configuration
