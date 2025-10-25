# Usage Examples

This guide shows practical examples of using the MetaAPI MCP Server through Claude Desktop.

## Getting Started

### List Your Accounts

```
"List my trading accounts"
```

This will show all MetaAPI accounts connected to your API token, including their IDs, names, and connection status.

### Check Account Balance

```
"Show me the balance and equity for account abc123"
```

Returns detailed account information including balance, equity, margin, free margin, and leverage.

---

## Market Data Analysis

### Check Current Prices

```
"What's the current price of EURUSD?"
```

```
"Show me real-time prices for GBPUSD, USDJPY, and GOLD"
```

### Get Historical Data

```
"Get the last 100 hourly candles for EURUSD"
```

```
"Show me daily candles for GBPUSD from the last month"
```

### Analyze Tick Data

```
"Get the last 500 ticks for USDJPY"
```

Useful for analyzing price movements and spreads.

### Symbol Information

```
"Get the symbol specification for GOLD"
```

Returns contract size, tick size, tick value, trading hours, and other specifications.

---

## Position Management

### View Open Positions

```
"Show all my open positions"
```

```
"What positions do I have on EURUSD?"
```

### Modify Positions

```
"Set stop loss to 1.0850 for position 12345"
```

```
"Update position 12345 with stop loss 1.0850 and take profit 1.0950"
```

### Close Positions

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

## Order Management

### View Pending Orders

```
"Show my pending orders"
```

```
"What orders do I have for GBPUSD?"
```

### Create Market Orders

```
"Buy 0.1 lots of EURUSD at market price"
```

```
"Sell 0.5 lots of GBPUSD with stop loss at 1.2500 and take profit at 1.2700"
```

### Create Limit Orders

```
"Create a buy limit order for EURUSD at 1.0850, volume 0.2 lots"
```

```
"Set a sell limit order at 1.1000 for EURUSD with 0.1 lot volume"
```

### Create Stop Orders

```
"Create a buy stop order for GBPUSD at 1.2600"
```

```
"Set a sell stop for USDJPY at 149.50 with volume 0.3 lots"
```

### Modify Orders

```
"Change the open price of order 67890 to 1.0900"
```

```
"Update order 67890 stop loss to 1.0850"
```

### Cancel Orders

```
"Cancel order 67890"
```

```
"Cancel all pending EURUSD orders"
```

---

## Trading History

### View Order History

```
"Show all my orders from last week"
```

```
"Get order history for the last 30 days"
```

```
"Show orders for ticket 12345"
```

### View Deal History

```
"Show all deals from January 2024"
```

```
"Get deals for position 12345"
```

```
"Show my trading history for the last month"
```

---

## Advanced Features

### Calculate Margin

```
"Calculate the margin needed to buy 1 lot of EURUSD at 1.0900"
```

Helps you plan trades and manage risk.

### Market Data Subscriptions

```
"Subscribe to real-time updates for EURUSD"
```

```
"Show me all my active market subscriptions"
```

```
"Unsubscribe from GBPUSD updates"
```

### Server Information

```
"What's the current server time?"
```

Useful for coordinating trades with market sessions.

---

## Complex Workflows

### Complete Trade Analysis

```
"For account abc123:
1. Show current balance and equity
2. Get the last 50 hourly candles for EURUSD
3. Show current EURUSD price
4. List any open EURUSD positions"
```

### Risk Management

```
"For my position 12345:
1. Get the current position details
2. Show me the current price
3. Calculate what my loss would be if I set stop loss at 1.0850"
```

### Portfolio Overview

```
"Give me a complete overview:
1. List all my trading accounts
2. For each account, show balance and open positions
3. Show pending orders
4. List active market subscriptions"
```

---

## Tips

1. **Be specific with account IDs** - Always include the account ID when working with multiple accounts
2. **Use natural language** - Claude understands conversational requests
3. **Combine multiple requests** - Ask for related information in one query
4. **Check specifications** - Review symbol specs before trading to understand tick sizes and contract values
5. **Monitor positions** - Regularly check position status and adjust stop losses as needed

---

## Common Patterns

### Before Opening a Trade

```
1. "Get symbol specification for EURUSD"
2. "What's the current price of EURUSD?"
3. "Calculate margin for buying 0.5 lots at current price"
4. "Show my current balance and free margin"
```

### After Opening a Trade

```
1. "Show my open positions"
2. "Set stop loss to [price] for position [id]"
3. "Monitor EURUSD price updates"
```

### End of Day Review

```
1. "Show all positions opened today"
2. "Get all deals from today"
3. "Show current account balance vs opening balance"
```
