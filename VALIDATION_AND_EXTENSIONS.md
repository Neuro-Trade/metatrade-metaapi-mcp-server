# MetaAPI MCP Server - Validation & Extensions

## Current Implementation Status

### ✅ Correctly Implemented Methods

Based on the official MetaAPI SDK documentation, the following methods are correctly implemented:

1. **Account Management**
   - ✅ `getAccount(accountId)` - Used in `getConnection()` 
   - ✅ `getAccountsWithClassicPagination()` - Used in `list_accounts`
   - ✅ `account.deploy()` - Auto-deployment in `getConnection()`
   - ✅ `account.waitConnected()` - Connection waiting
   - ✅ `account.getRPCConnection()` - RPC connection retrieval

2. **RPC Methods**
   - ✅ `connection.getAccountInformation()` - Account info
   - ✅ `connection.getPositions()` - Open positions
   - ✅ `connection.getOrders()` - Pending orders
   - ✅ `connection.getHistoryOrdersByTimeRange()` - History orders
   - ✅ `connection.getDealsByTimeRange()` - Deal history
   - ✅ `connection.getServerTime()` - Server time
   - ✅ `connection.calculateMargin()` - Margin calculation
   - ✅ `connection.createMarketBuyOrder()` - Market buy
   - ✅ `connection.createMarketSellOrder()` - Market sell
   - ✅ `connection.createLimitBuyOrder()` - Limit buy
   - ✅ `connection.createLimitSellOrder()` - Limit sell

### 📝 Methods to Add (from SDK docs)

#### 1. **Symbol/Market Data Methods**
```javascript
// Get list of all symbols
connection.getSymbols()

// Get symbol specification
connection.getSymbolSpecification(symbol)

// Get symbol price (current quote)
connection.getSymbolPrice(symbol)

// Get latest tick
connection.getTerminalState().price(symbol)

// Get candles (OHLCV)
connection.getCandle(symbol, timeframe, time)
```

#### 2. **Additional Order Methods**
```javascript
// Stop orders
connection.createStopBuyOrder(symbol, volume, openPrice, stopLoss, takeProfit, options)
connection.createStopSellOrder(symbol, volume, openPrice, stopLoss, takeProfit, options)

// Stop limit orders  
connection.createStopLimitBuyOrder(symbol, volume, openPrice, stopLimitPrice, stopLoss, takeProfit, options)
connection.createStopLimitSellOrder(symbol, volume, openPrice, stopLimitPrice, stopLoss, takeProfit, options)
```

#### 3. **Position Management Methods**
```javascript
// Get single position by ID
connection.getPosition(positionId)

// Close position by symbol (closes ALL positions for symbol)
connection.closePositionsBySymbol(symbol)
```

#### 4. **Order Management Methods**
```javascript
// Get single order
connection.getOrder(orderId)

// Modify pending order
connection.modifyOrder(orderId, openPrice, stopLoss, takeProfit, options)
```

#### 5. **History Methods**
```javascript
// By ticket
connection.getHistoryOrdersByTicket(ticket)
connection.getDealsByTicket(ticket)

// By position
connection.getHistoryOrdersByPosition(positionId)
connection.getDealsByPosition(positionId)
```

#### 6. **Streaming API (WebSocket)**
```javascript
// Get streaming connection instead of RPC
const streamingConnection = account.getStreamingConnection()
await streamingConnection.connect()
await streamingConnection.waitSynchronized()

// Access terminal state
const terminalState = streamingConnection.terminalState
terminalState.connected
terminalState.connectedToBroker
terminalState.accountInformation
terminalState.positions
terminalState.orders
terminalState.specifications
terminalState.specification(symbol)
terminalState.price(symbol)

// Access history storage
const historyStorage = streamingConnection.historyStorage
historyStorage.deals
historyStorage.historyOrders
```

#### 7. **Account State Methods**
```javascript
// Check connection status
account.connectionStatus // 'CONNECTED', 'DISCONNECTED', etc.
account.state // 'DEPLOYED', 'DEPLOYING', 'UNDEPLOYED'

// Undeploy account
account.undeploy()

// Redeploy account
account.redeploy()
```

## Recommended Extensions

### Priority 1: Add Missing Core Trading Methods

1. **get_position** - Get single position details
2. **get_order** - Get single order details
3. **get_symbols** - List all tradeable symbols
4. **get_symbol_specification** - Get symbol details (lot size, margins, etc.)
5. **create_stop_buy_order** - Stop buy orders
6. **create_stop_sell_order** - Stop sell orders
7. **modify_order** - Modify pending orders
8. **close_positions_by_symbol** - Close all positions for a symbol

### Priority 2: Add Historical Market Data

9. **get_candles** - Get OHLCV candlestick data
10. **get_ticks** - Get historical ticks
11. **get_history_orders_by_ticket** - Search by ticket ID
12. **get_deals_by_ticket** - Search deals by ticket

### Priority 3: Add Streaming Enhancements

13. **subscribe_terminal_state** - Real-time terminal updates
14. **get_specifications** - Get all symbol specifications
15. **get_terminal_state** - Get current terminal state snapshot

### Priority 4: Add Account Management

16. **undeploy_account** - Stop account to save resources
17. **redeploy_account** - Restart account
18. **get_account_connection_status** - Check connection health

## Code Quality Issues Found

### Issue 1: Missing Options Parameters
Current implementation of `place_market_order` doesn't support all options:
```javascript
// Current - Limited options
{ comment, clientId, magic, slippage }

// Should support (from SDK docs)
{
  comment,
  clientId,
  magic,
  slippage,
  trailingStopLoss: {
    distance: {
      distance: number,
      units: 'RELATIVE_PRICE' | 'RELATIVE_PIPS' | 'ABSOLUTE_PRICE' | 'ABSOLUTE_PIPS'
    },
    threshold: { /* same structure */ }
  },
  stopUnits: 'RELATIVE_PRICE' | 'RELATIVE_PIPS' | 'ABSOLUTE_PRICE' | 'ABSOLUTE_PIPS',
  takeProfitUnits: 'RELATIVE_PRICE' | 'RELATIVE_PIPS' | 'ABSOLUTE_PRICE' | 'ABSOLUTE_PIPS'
}
```

### Issue 2: Error Handling
Should check for specific MetaAPI error types:
- `TradeError` - Trading errors with `stringCode` and `numericCode`
- `TimeoutError` - Connection timeouts
- `NotSynchronizedError` - Account not synchronized
- `NotConnectedError` - Account not connected

### Issue 3: Resource Management
Should implement cleanup:
```javascript
// Close connections when done
connection.close()

// Remove subscribers
connection.removeAllListeners()
```

## Validation Checklist

### ✅ Correct API Usage
- [x] Using `getAccountsWithClassicPagination()` with `.items` array
- [x] Using `getAccount(id)` for single accounts
- [x] Using `getRPCConnection()` correctly
- [x] Calling `waitConnected()` before operations
- [x] Calling `waitSynchronized()` before trading

### ✅ Best Practices
- [x] Connection pooling implemented
- [x] Auto-deployment working
- [x] Error mapping for user-friendly messages
- [x] Client ID generation for idempotent trades
- [x] Logging to stderr (MCP compliant)

### ⚠️ Improvements Needed
- [ ] Add all SDK trading methods (stop orders, order modification)
- [ ] Add symbol/market data methods
- [ ] Add historical data retrieval
- [ ] Implement streaming connection option
- [ ] Add proper connection cleanup
- [ ] Support all trade options (trailing SL, units, etc.)
- [ ] Add error type checking
- [ ] Implement rate limiting awareness

## Implementation Priority

### Phase 1: Core Extensions (Today)
1. Add `get_position(positionId)`
2. Add `get_order(orderId)`
3. Add `get_symbols()`
4. Add `get_symbol_specification(symbol)`
5. Add `create_stop_buy_order`
6. Add `create_stop_sell_order`
7. Add `modify_order`

### Phase 2: Market Data (Next)
8. Add `get_candles` for historical OHLCV
9. Add `get_history_orders_by_ticket`
10. Add `get_deals_by_ticket`

### Phase 3: Advanced Features
11. Add streaming connection support
12. Add terminal state monitoring
13. Add trailing stop loss support
14. Add account lifecycle management

## SDK Documentation References

- Main docs: https://metaapi.cloud/docs/client/
- RPC API: https://metaapi.cloud/docs/client/restApi/overview/
- SDK Examples: https://github.com/metaapi/metaapi-javascript-sdk/tree/master/examples
- Best Practices: https://metaapi.cloud/docs/client/sdkBestPractices/

## Next Steps

1. ✅ Validate current implementation against SDK
2. 🔄 Add Phase 1 extensions (7 methods)
3. ⏳ Test new methods with real account
4. ⏳ Update documentation with new tools
5. ⏳ Implement Phase 2 and 3
