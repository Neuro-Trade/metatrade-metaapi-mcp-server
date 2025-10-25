# Tools Reference

The MetaAPI MCP Server provides 32 tools for trading, market data, and account management.

## Account Management

### list_accounts
List all MetaAPI accounts accessible with your API token.

**Returns:** Array of account objects with id, name, type, platform, and state

**Example:**
```
"List my trading accounts"
```

### get_account_information
Get detailed information about a specific trading account including balance, equity, and margin.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"Show me the account information for account abc123"
```

---

## Market Data

### get_symbols
List all available trading symbols (currency pairs, commodities, etc.) for an account.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"What symbols can I trade on account abc123?"
```

### get_symbol_specification
Get detailed specification for a symbol including tick size, contract size, trading hours, etc.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name (e.g., "EURUSD")

**Example:**
```
"Get the specification for EURUSD"
```

### get_symbol_price
Get current real-time price for a symbol.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"What's the current price of GBPUSD?"
```

### get_candles
Retrieve historical candle/bar data for technical analysis.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `timeframe` (required): Candle timeframe (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1mn)
- `limit` (optional): Number of candles (default: 100, max: 1000)

**Example:**
```
"Get the last 50 hourly candles for EURUSD"
```

### get_tick_data
Retrieve recent tick-by-tick price data.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `limit` (optional): Number of ticks (default: 100, max: 1000)

**Example:**
```
"Show me the last 200 ticks for USDJPY"
```

### get_current_tick
Get the most recent tick for a symbol.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"What's the current tick for GOLD?"
```

---

## Position Management

### get_positions
List all open positions for an account.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"Show my open positions"
```

### get_position
Get details of a specific position by ID.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID

**Example:**
```
"Get details for position 12345"
```

### modify_position
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

### close_position
Close an open position partially or completely.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID
- `volume` (optional): Volume to close (if partial)

**Example:**
```
"Close position 12345"
```

### close_position_by_symbol
Close all positions for a specific symbol.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"Close all EURUSD positions"
```

---

## Order Management

### get_orders
List all pending orders.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"Show my pending orders"
```

### get_order
Get details of a specific order by ID.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `orderId` (required): Order ID

**Example:**
```
"Get details for order 67890"
```

### create_market_order
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

### create_limit_order
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

### create_stop_order
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

### modify_order
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

### cancel_order
Cancel a pending order.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `orderId` (required): Order ID

**Example:**
```
"Cancel order 67890"
```

---

## Trading History

### get_history_orders_by_ticket
Get historical orders filtered by ticket number.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `ticket` (required): Ticket/order number

**Example:**
```
"Get history for ticket 12345"
```

### get_history_orders_by_position
Get historical orders associated with a position.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID

**Example:**
```
"Get order history for position 12345"
```

### get_history_orders_by_time_range
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

### get_deals_by_ticket
Get deal history filtered by ticket number.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `ticket` (required): Ticket number

**Example:**
```
"Get deals for ticket 12345"
```

### get_deals_by_position
Get deals associated with a position.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `positionId` (required): Position ID

**Example:**
```
"Get deals for position 12345"
```

### get_deals_by_time_range
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

## Market Subscriptions

### subscribe_to_market_data
Subscribe to real-time price updates for symbols.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name
- `subscriptions` (optional): Array of subscription types

**Example:**
```
"Subscribe to real-time prices for EURUSD"
```

### unsubscribe_from_market_data
Unsubscribe from price updates.

**Arguments:**
- `accountId` (required): The MetaAPI account ID
- `symbol` (required): Symbol name

**Example:**
```
"Unsubscribe from EURUSD updates"
```

### get_active_subscriptions
List all active market data subscriptions.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"What symbols am I subscribed to?"
```

---

## Server Information

### get_server_time
Get the current server time from MetaAPI.

**Arguments:**
- `accountId` (required): The MetaAPI account ID

**Example:**
```
"What's the server time?"
```

### calculate_margin
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
