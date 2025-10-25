# MetaAPI MCP Server - Test Suite

Organized test suite for the MetaAPI MCP Server.

## Test Structure

```
tests/
├── basic.test.js                          # Basic connection and server tests
├── integration/                           # Integration tests for tool categories
│   ├── account.test.js                    # Account query tools
│   ├── account-management.test.js         # Account state & deployment tools
│   ├── market-data.test.js                # Market data retrieval tools
│   ├── market-info.test.js                # Market information & specs tools
│   ├── position-order-queries.test.js     # Position/order query tools
│   ├── trading.test.js                    # Basic position/order listing
│   └── trading-operations.test.js         # Trading operations (dry run)
├── run-all.sh                             # Run all tests automatically
└── README.md                              # This file
```

## Running Tests

### Run All Tests

```bash
./tests/run-all.sh
```

### Run Individual Tests

**Basic Tests:**
```bash
node tests/basic.test.js
```

**Account Tools:**
```bash
node tests/integration/account.test.js
node tests/integration/account-management.test.js
```

**Market Data Tools:**
```bash
node tests/integration/market-data.test.js
node tests/integration/market-info.test.js
```

**Position & Order Tools:**
```bash
node tests/integration/trading.test.js
node tests/integration/position-order-queries.test.js
```

**Trading Operations:**
```bash
node tests/integration/trading-operations.test.js
```

## Test Categories

### Basic Tests (`basic.test.js`)

Tests fundamental MCP server functionality:
- Server connection via SSE
- List tools (32 tools)
- List resources (4 resources)
- List prompts (3 prompts)

### Account Tests

#### Account Tools (`integration/account.test.js`)
- `list_accounts` - List all trading accounts
- `get_account_information` - Get account balance, equity, leverage

#### Account Management (`integration/account-management.test.js`)
- `get_account_state` - Get account connection state
- `get_terminal_state` - Get terminal state and specifications
- `deploy_account` - Deploy trading account
- `redeploy_account` - Redeploy trading account
- `undeploy_account` - Undeploy account (not tested to avoid disruption)

### Market Data Tests

#### Market Data Tools (`integration/market-data.test.js`)
- `get_symbols` - List available trading symbols
- `get_symbol_price` - Get current bid/ask prices
- `get_candles` - Get historical candle data

#### Market Info Tools (`integration/market-info.test.js`)
- `get_symbol_specification` - Get symbol contract specifications
- `calculate_margin` - Calculate required margin for trade
- `subscribe_price` - Subscribe to real-time price updates
- `get_ticks` - Get tick-by-tick price data
- `get_server_time` - Get server timestamp

### Position & Order Tests

#### Trading Tools (`integration/trading.test.js`)
- `get_positions` - List open positions
- `get_orders` - List pending orders

#### Position & Order Queries (`integration/position-order-queries.test.js`)
- `get_position` - Get specific position by ID
- `get_order` - Get specific order by ID
- `get_history_orders` - Get historical orders
- `get_deals` - Get deals (trades) history
- `get_history_orders_by_ticket` - Get order by ticket number
- `get_deals_by_ticket` - Get deals by ticket number

### Trading Operations Tests

#### Trading Operations (`integration/trading-operations.test.js`)

**⚠️ DRY RUN MODE** - These tests validate tool signatures without executing real trades:

- `place_market_order` - Place market order
- `place_limit_order` - Place limit order
- `create_stop_buy_order` - Create stop buy order
- `create_stop_sell_order` - Create stop sell order
- `create_market_order_with_trailing_sl` - Create order with trailing stop loss
- `modify_position` - Modify position SL/TP
- `modify_order` - Modify pending order
- `close_position` - Close open position
- `cancel_order` - Cancel pending order

**Note:** Trading operations tests expect errors due to dummy IDs - they validate tool signatures only.

## Prerequisites

1. **Server must be running:**
   ```bash
   npm start
   ```

2. **Environment variables:**
   - `METAAPI_TOKEN` - Your MetaAPI API token (in .env)
   - `ACCOUNT_ID` - Your MetaAPI account ID (optional, has default)

## Test Output

Each test provides clear output:
- ✅ Success indicators
- ❌ Error messages with details
- 📝 Test descriptions
- 📊 Data summaries

Example output:
```
🧪 Market Data Tools Test

✅ Connected to MCP server

📝 Test 1: get_symbols
────────────────────────────────────────────────────────────
✅ Found 156 symbols
   First 5: EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD

...

═══════════════════════════════════════════════════════════
✅ All market data tests passed!
═══════════════════════════════════════════════════════════
```

## Writing New Tests

### Integration Test Template

```javascript
#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';
const ACCOUNT_ID = process.env.ACCOUNT_ID || 'your-account-id';

async function testFeature() {
    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));
    const client = new Client(
        { name: 'test-client', version: '1.0.0' },
        { capabilities: {} }
    );

    try {
        await client.connect(transport);
        
        // Your test code here
        const result = await client.callTool({
            name: 'tool_name',
            arguments: { /* ... */ }
        });
        
        console.log('✅ Test passed!');
        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testFeature();
```

## CI/CD Integration

The test runner returns proper exit codes:
- `0` - All tests passed
- `1` - Tests failed

Use in CI/CD:
```bash
#!/bin/bash
npm start &
SERVER_PID=$!
sleep 5
./tests/run-all.sh
TEST_EXIT=$?
kill $SERVER_PID
exit $TEST_EXIT
```

## Archived Tests

Old test files are preserved in `archive/` for reference:
- `test_client.js` - Original basic test
- `test_mcp_client.js` - Original MCP test
- `test_candle_viz.js` - Candle visualization
- `test_market_order_tools.js` - Market order testing
- `test_ticks_recent.js` - Tick data testing
- Phase tests (test_phase1, test_phase2, test_phase3)

## Troubleshooting

**Server not running:**
```
❌ Server is not running!
   Start the server with: npm start
```
→ Start the server in another terminal

**Connection errors:**
```
Error: connect ECONNREFUSED
```
→ Verify server is on port 3333 and accessible

**Tool errors:**
```
MetaAPI error: ...
```
→ Check METAAPI_TOKEN is valid and account is deployed
