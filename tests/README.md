# MetaAPI MCP Server - Test Suite

This directory contains all test scripts for the MetaAPI MCP Server.

## Running Tests

Make sure the server is running first:

```bash
npm start
```

Then run individual tests in a separate terminal:

```bash
# Basic connection test
node tests/test_client.js

# MCP protocol test
node tests/test_mcp_client.js

# Candle data visualization
node tests/test_candle_viz.js

# Market order tools
node tests/test_market_order_tools.js
```

## Test Files

### Core Tests
- **test_client.js** - Basic MCP connection and protocol test
- **test_mcp_client.js** - Comprehensive MCP client functionality test

### Feature Tests
- **test_phase1_tools.js** - Phase 1 extended tools (symbols, specifications, etc.)
- **test_phase1_trading.js** - Phase 1 trading operations
- **test_phase2.js** - Phase 2 historical data features
- **test_phase3.js** - Phase 3 advanced features

### Data Tests
- **test_candle_viz.js** - Candlestick data visualization
- **test_ticks_debug.js** - Tick data debugging
- **test_ticks_recent.js** - Recent tick data retrieval

### Trading Tests
- **test_market_order_tools.js** - Market order placement and management

## Test Configuration

All tests connect to `http://localhost:3333` by default. You can override this with the `MCP_SERVER_URL` environment variable:

```bash
MCP_SERVER_URL=http://localhost:8080 node tests/test_client.js
```

## Test Account

Tests use the account ID: `b7320f60-ef3c-4589-a692-c6b39f76c313`

Make sure your MetaAPI account is deployed and connected before running tests.
