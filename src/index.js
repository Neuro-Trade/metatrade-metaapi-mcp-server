#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createRequire } from 'module';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import CommonJS MetaApi SDK
const require = createRequire(import.meta.url);
const MetaApi = require('metaapi.cloud-sdk').default;

// Logger that writes to stderr (MCP requirement)
const logger = {
    info: (...args) => console.error('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.error('[WARN]', ...args),
    debug: (...args) => console.error('[DEBUG]', ...args),
};

// Initialize MetaApi client (reused across requests)
const METAAPI_TOKEN = process.env.METAAPI_TOKEN || process.env.TOKEN;
if (!METAAPI_TOKEN) {
    logger.error('METAAPI_TOKEN environment variable is required');
    process.exit(1);
}

const metaApi = new MetaApi(METAAPI_TOKEN);
logger.info('MetaAPI client initialized');

// Connection cache to reuse RPC connections
const connectionCache = new Map();

// Active price subscriptions for streaming
const priceSubscriptions = new Map();

/**
 * Get or create a cached RPC connection for an account
 */
async function getConnection(accountId) {
    if (connectionCache.has(accountId)) {
        return connectionCache.get(accountId);
    }

    try {
        const account = await metaApi.metatraderAccountApi.getAccount(accountId);

        // Check if account is deployed
        const deployedStates = ['DEPLOYING', 'DEPLOYED'];
        if (!deployedStates.includes(account.state)) {
            logger.info(`Account ${accountId} not deployed, deploying now...`);
            await account.deploy();
        }

        logger.info(`Waiting for account ${accountId} to connect...`);
        await account.waitConnected();

        const connection = account.getRPCConnection();
        await connection.connect();

        logger.info(`Waiting for account ${accountId} to synchronize...`);
        await connection.waitSynchronized();

        connectionCache.set(accountId, { account, connection });
        return { account, connection };
    } catch (error) {
        logger.error(`Failed to get connection for account ${accountId}:`, error.message);
        throw error;
    }
}

/**
 * Map MetaAPI errors to user-friendly messages
 */
function mapError(error) {
    const message = error.message || String(error);

    if (message.includes('market is closed')) {
        return { error: 'Market is closed', code: 'MARKET_CLOSED' };
    }
    if (message.includes('trade context busy')) {
        return { error: 'Trade context is busy, please retry', code: 'TRADE_CONTEXT_BUSY' };
    }
    if (message.includes('not enough money')) {
        return { error: 'Insufficient funds', code: 'INSUFFICIENT_FUNDS' };
    }
    if (message.includes('invalid stops')) {
        return { error: 'Invalid stop loss or take profit levels', code: 'INVALID_STOPS' };
    }

    return { error: message, code: 'UNKNOWN_ERROR' };
}

/**
 * Generate a unique client order ID for idempotency
 */
function generateClientOrderId(symbol, side) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${side}_${symbol}_${timestamp}_${random}`;
}

// Create MCP server
const server = new Server(
    {
        name: 'metaapi-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
            resources: {},
            prompts: {},
        },
    }
);

// List all available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // Account management tools
            {
                name: 'list_accounts',
                description: 'List all provisioned MetaTrader accounts',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_account_state',
                description: 'Get detailed state of a trading account including equity, balance, positions, and orders',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'get_account_information',
                description: 'Get account information including balance, equity, margin, and other details',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },

            // Trading tools
            {
                name: 'place_market_order',
                description: 'Place a market order (buy or sell at current market price)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                        side: {
                            type: 'string',
                            enum: ['buy', 'sell'],
                            description: 'Order side: buy or sell',
                        },
                        volume: {
                            type: 'number',
                            description: 'Order volume in lots (e.g., 0.01, 0.1, 1.0)',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'Optional stop loss price',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'Optional take profit price',
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional order comment',
                        },
                    },
                    required: ['accountId', 'symbol', 'side', 'volume'],
                },
            },
            {
                name: 'place_limit_order',
                description: 'Place a pending limit order',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                        side: {
                            type: 'string',
                            enum: ['buy', 'sell'],
                            description: 'Order side: buy or sell',
                        },
                        volume: {
                            type: 'number',
                            description: 'Order volume in lots',
                        },
                        openPrice: {
                            type: 'number',
                            description: 'Price at which to open the order',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'Optional stop loss price',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'Optional take profit price',
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional order comment',
                        },
                    },
                    required: ['accountId', 'symbol', 'side', 'volume', 'openPrice'],
                },
            },
            {
                name: 'close_position',
                description: 'Close an open position',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        positionId: {
                            type: 'string',
                            description: 'The position ID to close',
                        },
                    },
                    required: ['accountId', 'positionId'],
                },
            },
            {
                name: 'modify_position',
                description: 'Modify stop loss and take profit of an existing position',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        positionId: {
                            type: 'string',
                            description: 'The position ID to modify',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'New stop loss price',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'New take profit price',
                        },
                    },
                    required: ['accountId', 'positionId'],
                },
            },
            {
                name: 'cancel_order',
                description: 'Cancel a pending order',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        orderId: {
                            type: 'string',
                            description: 'The order ID to cancel',
                        },
                    },
                    required: ['accountId', 'orderId'],
                },
            },

            // Market data tools
            {
                name: 'get_symbol_price',
                description: 'Get current price for a trading symbol',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                    },
                    required: ['accountId', 'symbol'],
                },
            },
            {
                name: 'calculate_margin',
                description: 'Calculate margin required for a trade',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol',
                        },
                        type: {
                            type: 'string',
                            enum: ['ORDER_TYPE_BUY', 'ORDER_TYPE_SELL'],
                            description: 'Order type',
                        },
                        volume: {
                            type: 'number',
                            description: 'Order volume in lots',
                        },
                        openPrice: {
                            type: 'number',
                            description: 'Expected open price',
                        },
                    },
                    required: ['accountId', 'symbol', 'type', 'volume', 'openPrice'],
                },
            },

            // History tools
            {
                name: 'get_positions',
                description: 'Get all open positions',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'get_orders',
                description: 'Get all pending orders',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'get_history_orders',
                description: 'Get history orders within a time range',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        startTime: {
                            type: 'string',
                            description: 'Start time in ISO format (defaults to 90 days ago)',
                        },
                        endTime: {
                            type: 'string',
                            description: 'End time in ISO format (defaults to now)',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'get_deals',
                description: 'Get deal history within a time range',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        startTime: {
                            type: 'string',
                            description: 'Start time in ISO format (defaults to 90 days ago)',
                        },
                        endTime: {
                            type: 'string',
                            description: 'End time in ISO format (defaults to now)',
                        },
                    },
                    required: ['accountId'],
                },
            },

            // Streaming tool
            {
                name: 'subscribe_price',
                description: 'Subscribe to real-time price updates for a symbol',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol to subscribe to',
                        },
                    },
                    required: ['accountId', 'symbol'],
                },
            },
            // Additional trading tools
            {
                name: 'get_position',
                description: 'Get details of a specific position by ID',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        positionId: {
                            type: 'string',
                            description: 'The position ID',
                        },
                    },
                    required: ['accountId', 'positionId'],
                },
            },
            {
                name: 'get_order',
                description: 'Get details of a specific pending order by ID',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        orderId: {
                            type: 'string',
                            description: 'The order ID',
                        },
                    },
                    required: ['accountId', 'orderId'],
                },
            },
            {
                name: 'get_symbols',
                description: 'Get list of all available trading symbols',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'get_symbol_specification',
                description: 'Get detailed specification for a trading symbol (contract size, spreads, margins, etc.)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD)',
                        },
                    },
                    required: ['accountId', 'symbol'],
                },
            },
            {
                name: 'create_stop_buy_order',
                description: 'Place a stop buy order (triggers buy when price reaches specified level)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                        volume: {
                            type: 'number',
                            description: 'Order volume in lots',
                        },
                        openPrice: {
                            type: 'number',
                            description: 'Price at which the stop order triggers',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'Optional stop loss price',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'Optional take profit price',
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional order comment',
                        },
                    },
                    required: ['accountId', 'symbol', 'volume', 'openPrice'],
                },
            },
            {
                name: 'create_stop_sell_order',
                description: 'Place a stop sell order (triggers sell when price reaches specified level)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                        volume: {
                            type: 'number',
                            description: 'Order volume in lots',
                        },
                        openPrice: {
                            type: 'number',
                            description: 'Price at which the stop order triggers',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'Optional stop loss price',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'Optional take profit price',
                        },
                        comment: {
                            type: 'string',
                            description: 'Optional order comment',
                        },
                    },
                    required: ['accountId', 'symbol', 'volume', 'openPrice'],
                },
            },
            {
                name: 'modify_order',
                description: 'Modify a pending order (change price, stop loss, or take profit)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'The MetaTrader account ID',
                        },
                        orderId: {
                            type: 'string',
                            description: 'The order ID to modify',
                        },
                        openPrice: {
                            type: 'number',
                            description: 'New order open price',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'New stop loss price',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'New take profit price',
                        },
                    },
                    required: ['accountId', 'orderId', 'openPrice'],
                },
            },

            // Phase 2: Historical Market Data
            {
                name: 'get_candles',
                description: 'Get historical OHLCV candlestick data for a symbol. Retrieve candles by timeframe (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1mn). The API retrieves market data from G1 and MT4 G2 servers.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                        timeframe: {
                            type: 'string',
                            description: 'Candlestick timeframe: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1mn',
                            enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1mn'],
                        },
                        startTime: {
                            type: 'string',
                            description: 'Start time in ISO 8601 format (optional). If not provided, retrieves latest candles.',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of candles to retrieve (default: 1000)',
                            default: 1000,
                        },
                    },
                    required: ['accountId', 'symbol', 'timeframe'],
                },
            },
            {
                name: 'get_ticks',
                description: 'Get historical tick data for a symbol. Retrieve tick-level price updates. Requirements: MT5 accounts only (not MT4). Historical tick data availability depends on the broker - some brokers may not provide historical ticks or may have limited retention periods. If no ticks are returned, the broker may only provide live tick streaming or may not support historical tick data.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID (must be MT5)',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD, GBPUSD)',
                        },
                        startTime: {
                            type: 'string',
                            description: 'Start time in ISO 8601 format. Defaults to 1 hour ago. Use recent times for better availability.',
                        },
                        offset: {
                            type: 'number',
                            description: 'Offset from start time for pagination (default: 0)',
                            default: 0,
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum number of ticks to retrieve (default: 1000, max: 1000)',
                            default: 1000,
                        },
                    },
                    required: ['accountId', 'symbol'],
                },
            },
            {
                name: 'get_history_orders_by_ticket',
                description: 'Retrieve history orders by ticket number. Useful for looking up specific orders from trading history.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID',
                        },
                        ticket: {
                            type: 'string',
                            description: 'Order ticket number to search for',
                        },
                    },
                    required: ['accountId', 'ticket'],
                },
            },
            {
                name: 'get_deals_by_ticket',
                description: 'Retrieve deals (trade executions) by ticket number. Useful for looking up specific deal transactions from trading history.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID',
                        },
                        ticket: {
                            type: 'string',
                            description: 'Deal ticket number to search for',
                        },
                    },
                    required: ['accountId', 'ticket'],
                },
            },
            {
                name: 'get_terminal_state',
                description: 'Get complete terminal state snapshot including account info, positions, orders, and specifications. Useful for getting full account state at once.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'undeploy_account',
                description: 'Undeploy (stop) a MetaAPI account. This will disconnect the account and free up resources. Use when you want to temporarily stop an account.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID to undeploy',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'deploy_account',
                description: 'Deploy (start) a MetaAPI account. This will connect the account and make it ready for trading. Use after undeploying an account.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID to deploy',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'redeploy_account',
                description: 'Redeploy (restart) a MetaAPI account. This will undeploy and then deploy the account, useful for resetting connection issues.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID to redeploy',
                        },
                    },
                    required: ['accountId'],
                },
            },
            {
                name: 'create_market_order_with_trailing_sl',
                description: 'Create a market order with trailing stop loss. Trailing SL automatically adjusts as price moves in your favor. Supports distance-based and threshold-based trailing.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID',
                        },
                        actionType: {
                            type: 'string',
                            enum: ['ORDER_TYPE_BUY', 'ORDER_TYPE_SELL'],
                            description: 'Order type: ORDER_TYPE_BUY for buy, ORDER_TYPE_SELL for sell',
                        },
                        symbol: {
                            type: 'string',
                            description: 'Trading symbol (e.g., EURUSD)',
                        },
                        volume: {
                            type: 'number',
                            description: 'Order volume in lots',
                        },
                        stopLoss: {
                            type: 'number',
                            description: 'Initial stop loss price (optional)',
                        },
                        takeProfit: {
                            type: 'number',
                            description: 'Take profit price (optional)',
                        },
                        trailingStopLoss: {
                            type: 'object',
                            description: 'Trailing stop loss configuration',
                            properties: {
                                distance: {
                                    type: 'object',
                                    description: 'Distance-based trailing SL',
                                    properties: {
                                        distance: {
                                            type: 'number',
                                            description: 'SL distance from current price',
                                        },
                                        units: {
                                            type: 'string',
                                            enum: ['RELATIVE_PRICE', 'RELATIVE_POINTS', 'RELATIVE_PIPS'],
                                            description: 'Distance units (default: RELATIVE_PRICE)',
                                        },
                                    },
                                    required: ['distance'],
                                },
                                threshold: {
                                    type: 'object',
                                    description: 'Threshold-based trailing SL',
                                    properties: {
                                        thresholds: {
                                            type: 'array',
                                            description: 'Array of threshold configurations',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    threshold: {
                                                        type: 'number',
                                                        description: 'Price threshold to activate trailing SL',
                                                    },
                                                    stopLoss: {
                                                        type: 'number',
                                                        description: 'Stop loss value when threshold is reached',
                                                    },
                                                },
                                                required: ['threshold', 'stopLoss'],
                                            },
                                        },
                                        units: {
                                            type: 'string',
                                            enum: ['ABSOLUTE_PRICE', 'RELATIVE_PRICE', 'RELATIVE_POINTS', 'RELATIVE_PIPS'],
                                            description: 'Threshold units (default: ABSOLUTE_PRICE)',
                                        },
                                        stopPriceBase: {
                                            type: 'string',
                                            enum: ['CURRENT_PRICE', 'OPEN_PRICE'],
                                            description: 'Base price for SL calculation (default: OPEN_PRICE)',
                                        },
                                    },
                                    required: ['thresholds'],
                                },
                            },
                        },
                        comment: {
                            type: 'string',
                            description: 'Order comment (optional)',
                        },
                        clientId: {
                            type: 'string',
                            description: 'Client-side order ID for idempotency (optional, auto-generated if not provided)',
                        },
                    },
                    required: ['accountId', 'actionType', 'symbol', 'volume', 'trailingStopLoss'],
                },
            },
            {
                name: 'get_server_time',
                description: 'Get the current server time from the MetaTrader terminal. Useful for synchronization and timing operations.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        accountId: {
                            type: 'string',
                            description: 'MetaAPI account ID',
                        },
                    },
                    required: ['accountId'],
                },
            },
        ],
    };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        logger.info(`Tool called: ${name}`, args);

        switch (name) {
            // Account management
            case 'list_accounts': {
                // Using classic pagination to get all accounts
                const response = await metaApi.metatraderAccountApi.getAccountsWithClassicPagination();
                // The response is paginated - extract the actual accounts array
                const accounts = response.items || [];
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(accounts.map(acc => ({
                                id: acc.id,
                                name: acc.name,
                                login: acc.login,
                                server: acc.server,
                                platform: acc.platform,
                                type: acc.type,
                                state: acc.state,
                                connectionStatus: acc.connectionStatus,
                            })), null, 2),
                        },
                    ],
                };
            }

            case 'get_account_state': {
                const { connection } = await getConnection(args.accountId);
                const [accountInfo, positions, orders] = await Promise.all([
                    connection.getAccountInformation(),
                    connection.getPositions(),
                    connection.getOrders(),
                ]);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                account: accountInfo,
                                positions,
                                orders,
                                summary: {
                                    balance: accountInfo.balance,
                                    equity: accountInfo.equity,
                                    margin: accountInfo.margin,
                                    freeMargin: accountInfo.freeMargin,
                                    marginLevel: accountInfo.marginLevel,
                                    openPositions: positions.length,
                                    pendingOrders: orders.length,
                                },
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_account_information': {
                const { connection } = await getConnection(args.accountId);
                const accountInfo = await connection.getAccountInformation();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(accountInfo, null, 2),
                        },
                    ],
                };
            }

            // Trading operations
            case 'place_market_order': {
                const { connection } = await getConnection(args.accountId);
                // Don't use clientId - broker validation is too strict

                const tradeOptions = {
                    comment: args.comment || `Market ${args.side}`,
                };

                if (args.stopLoss) tradeOptions.stopLoss = args.stopLoss;
                if (args.takeProfit) tradeOptions.takeProfit = args.takeProfit;

                let result;
                if (args.side === 'buy') {
                    result = await connection.createMarketBuyOrder(
                        args.symbol,
                        args.volume,
                        tradeOptions.stopLoss,
                        tradeOptions.takeProfit,
                        tradeOptions
                    );
                } else {
                    result = await connection.createMarketSellOrder(
                        args.symbol,
                        args.volume,
                        tradeOptions.stopLoss,
                        tradeOptions.takeProfit,
                        tradeOptions
                    );
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                orderId: result.orderId,
                                positionId: result.positionId,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'place_limit_order': {
                const { connection } = await getConnection(args.accountId);
                const clientId = generateClientOrderId(args.symbol, args.side);

                const tradeOptions = {
                    comment: args.comment || `Limit ${args.side}`,
                    clientId,
                };

                let result;
                if (args.side === 'buy') {
                    result = await connection.createLimitBuyOrder(
                        args.symbol,
                        args.volume,
                        args.openPrice,
                        args.stopLoss,
                        args.takeProfit,
                        tradeOptions
                    );
                } else {
                    result = await connection.createLimitSellOrder(
                        args.symbol,
                        args.volume,
                        args.openPrice,
                        args.stopLoss,
                        args.takeProfit,
                        tradeOptions
                    );
                }

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                orderId: result.orderId,
                                stringCode: result.stringCode,
                                message: result.message,
                                clientOrderId: clientId,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'close_position': {
                const { connection } = await getConnection(args.accountId);
                const result = await connection.closePosition(args.positionId);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'modify_position': {
                const { connection } = await getConnection(args.accountId);
                const result = await connection.modifyPosition(
                    args.positionId,
                    args.stopLoss,
                    args.takeProfit
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'cancel_order': {
                const { connection } = await getConnection(args.accountId);
                const result = await connection.cancelOrder(args.orderId);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            // Market data
            case 'get_symbol_price': {
                const { connection } = await getConnection(args.accountId);
                const price = await connection.getSymbolPrice(args.symbol);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(price, null, 2),
                        },
                    ],
                };
            }

            case 'calculate_margin': {
                const { connection } = await getConnection(args.accountId);
                const margin = await connection.calculateMargin({
                    symbol: args.symbol,
                    type: args.type,
                    volume: args.volume,
                    openPrice: args.openPrice,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(margin, null, 2),
                        },
                    ],
                };
            }

            case 'get_server_time': {
                const { connection } = await getConnection(args.accountId);
                const serverTime = await connection.getServerTime();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                serverTime: serverTime.time,
                                brokerTime: serverTime.brokerTime,
                            }, null, 2),
                        },
                    ],
                };
            }

            // History
            case 'get_positions': {
                const { connection } = await getConnection(args.accountId);
                const positions = await connection.getPositions();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(positions, null, 2),
                        },
                    ],
                };
            }

            case 'get_orders': {
                const { connection } = await getConnection(args.accountId);
                const orders = await connection.getOrders();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(orders, null, 2),
                        },
                    ],
                };
            }

            case 'get_history_orders': {
                const { connection } = await getConnection(args.accountId);
                const startTime = args.startTime
                    ? new Date(args.startTime)
                    : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                const endTime = args.endTime ? new Date(args.endTime) : new Date();

                const orders = await connection.getHistoryOrdersByTimeRange(startTime, endTime);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(orders, null, 2),
                        },
                    ],
                };
            }

            case 'get_deals': {
                const { connection } = await getConnection(args.accountId);
                const startTime = args.startTime
                    ? new Date(args.startTime)
                    : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                const endTime = args.endTime ? new Date(args.endTime) : new Date();

                const deals = await connection.getDealsByTimeRange(startTime, endTime);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(deals, null, 2),
                        },
                    ],
                };
            }

            // Streaming
            case 'subscribe_price': {
                const { account } = await getConnection(args.accountId);
                const streamingConnection = account.getStreamingConnection();
                await streamingConnection.connect();

                const key = `${args.accountId}:${args.symbol}`;

                // Subscribe to price updates
                const listener = async (price) => {
                    logger.info(`Price update for ${args.symbol}:`, price);
                };

                streamingConnection.addSynchronizationListener(listener);
                await streamingConnection.subscribeToMarketData(args.symbol);

                priceSubscriptions.set(key, { streamingConnection, listener });

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                message: `Subscribed to ${args.symbol} price updates for account ${args.accountId}`,
                                note: 'Price updates will be logged to stderr. In a production setup, use SSE to stream to client.',
                            }, null, 2),
                        },
                    ],
                };
            }

            // Additional trading methods
            case 'get_position': {
                const { connection } = await getConnection(args.accountId);
                const position = await connection.getPosition(args.positionId);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(position, null, 2),
                        },
                    ],
                };
            }

            case 'get_order': {
                const { connection } = await getConnection(args.accountId);
                const order = await connection.getOrder(args.orderId);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(order, null, 2),
                        },
                    ],
                };
            }

            case 'get_symbols': {
                const { connection } = await getConnection(args.accountId);
                const symbols = await connection.getSymbols();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(symbols, null, 2),
                        },
                    ],
                };
            }

            case 'get_symbol_specification': {
                const { connection } = await getConnection(args.accountId);
                const spec = await connection.getSymbolSpecification(args.symbol);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(spec, null, 2),
                        },
                    ],
                };
            }

            case 'create_stop_buy_order': {
                const { connection } = await getConnection(args.accountId);
                // Don't use clientId - broker validation is too strict
                const result = await connection.createStopBuyOrder(
                    args.symbol,
                    args.volume,
                    args.openPrice,
                    args.stopLoss,
                    args.takeProfit,
                    {
                        comment: args.comment,
                    }
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                orderId: result.orderId,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'create_stop_sell_order': {
                const { connection } = await getConnection(args.accountId);
                // Don't use clientId - broker validation is too strict
                const result = await connection.createStopSellOrder(
                    args.symbol,
                    args.volume,
                    args.openPrice,
                    args.stopLoss,
                    args.takeProfit,
                    {
                        comment: args.comment,
                    }
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                orderId: result.orderId,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'modify_order': {
                const { connection } = await getConnection(args.accountId);
                const result = await connection.modifyOrder(
                    args.orderId,
                    args.openPrice,
                    args.stopLoss,
                    args.takeProfit
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                stringCode: result.stringCode,
                                message: result.message,
                            }, null, 2),
                        },
                    ],
                };
            }

            // Phase 2: Historical Market Data
            case 'get_candles': {
                const { account } = await getConnection(args.accountId);
                const startTime = args.startTime ? new Date(args.startTime) : undefined;
                const candles = await account.getHistoricalCandles(
                    args.symbol,
                    args.timeframe,
                    startTime,
                    args.limit
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                symbol: args.symbol,
                                timeframe: args.timeframe,
                                count: candles ? candles.length : 0,
                                candles: candles || [],
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_ticks': {
                const { account } = await getConnection(args.accountId);
                // Default to very recent time (last hour) for better historical tick availability
                const startTime = args.startTime
                    ? new Date(args.startTime)
                    : new Date(Date.now() - 60 * 60 * 1000); // Default to 1 hour ago

                console.log(`[DEBUG] Fetching ticks for ${args.symbol} from ${startTime.toISOString()}`);

                const ticks = await account.getHistoricalTicks(
                    args.symbol,
                    startTime,
                    args.offset || 0,
                    args.limit || 1000
                );

                console.log(`[DEBUG] Received ${ticks ? ticks.length : 0} ticks`);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                symbol: args.symbol,
                                startTime: startTime.toISOString(),
                                offset: args.offset || 0,
                                count: ticks ? ticks.length : 0,
                                ticks: ticks || [],
                                note: ticks && ticks.length === 0
                                    ? 'Historical tick data may not be available for this symbol/timeframe. Try: 1) More recent startTime (last few minutes), 2) Different symbol, 3) Check if broker provides tick history'
                                    : undefined
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_history_orders_by_ticket': {
                const { connection } = await getConnection(args.accountId);
                const orders = await connection.getHistoryOrdersByTicket(args.ticket);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                ticket: args.ticket,
                                count: orders ? orders.length : 0,
                                orders: orders || [],
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_deals_by_ticket': {
                const { connection } = await getConnection(args.accountId);
                const deals = await connection.getDealsByTicket(args.ticket);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                ticket: args.ticket,
                                count: deals ? deals.length : 0,
                                deals: deals || [],
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_terminal_state': {
                const { account, connection } = await getConnection(args.accountId);

                // Get all terminal state components
                const [accountInfo, positions, orders, symbols] = await Promise.all([
                    connection.getAccountInformation(),
                    connection.getPositions(),
                    connection.getOrders(),
                    connection.getSymbols(),
                ]);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                accountInfo,
                                positions,
                                orders,
                                symbols,
                                timestamp: new Date().toISOString(),
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'undeploy_account': {
                const account = await api.metatraderAccountApi.getAccount(args.accountId);
                await account.undeploy();

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                accountId: args.accountId,
                                message: 'Account undeployed successfully',
                                state: 'UNDEPLOYED',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'deploy_account': {
                const account = await api.metatraderAccountApi.getAccount(args.accountId);
                await account.deploy();

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                accountId: args.accountId,
                                message: 'Account deployed successfully',
                                state: 'DEPLOYING',
                                note: 'Account is now deploying. Use get_account_information to check deployment status.',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'redeploy_account': {
                const account = await api.metatraderAccountApi.getAccount(args.accountId);

                // Undeploy first
                await account.undeploy();
                logger.info(`Account ${args.accountId} undeployed, waiting before redeploy...`);

                // Wait a bit for undeploy to complete
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Deploy again
                await account.deploy();

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                accountId: args.accountId,
                                message: 'Account redeployed successfully',
                                state: 'DEPLOYING',
                                note: 'Account was undeployed and is now deploying. Use get_account_information to check deployment status.',
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'create_market_order_with_trailing_sl': {
                const { connection } = await getConnection(args.accountId);

                // Generate client ID for idempotency
                const clientId = args.clientId || generateClientOrderId(
                    args.symbol,
                    args.actionType === 'ORDER_TYPE_BUY' ? 'buy' : 'sell'
                );

                // Build trailing stop loss configuration
                const trailingStopLoss = {};

                if (args.trailingStopLoss.distance) {
                    trailingStopLoss.distance = {
                        distance: args.trailingStopLoss.distance.distance,
                        units: args.trailingStopLoss.distance.units || 'RELATIVE_PRICE',
                    };
                }

                if (args.trailingStopLoss.threshold) {
                    trailingStopLoss.threshold = {
                        thresholds: args.trailingStopLoss.threshold.thresholds,
                        units: args.trailingStopLoss.threshold.units || 'ABSOLUTE_PRICE',
                        stopPriceBase: args.trailingStopLoss.threshold.stopPriceBase || 'OPEN_PRICE',
                    };
                }

                // Build options object
                const options = {
                    comment: args.comment || 'Trailing SL order',
                    clientId,
                    trailingStopLoss,
                };

                // Create market order with trailing SL
                const result = args.actionType === 'ORDER_TYPE_BUY'
                    ? await connection.createMarketBuyOrder(args.symbol, args.volume, args.stopLoss, args.takeProfit, options)
                    : await connection.createMarketSellOrder(args.symbol, args.volume, args.stopLoss, args.takeProfit, options);

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                orderId: result.orderId,
                                positionId: result.positionId,
                                stringCode: result.stringCode,
                                message: result.message,
                                clientOrderId: clientId,
                                trailingStopLoss,
                            }, null, 2),
                        },
                    ],
                };
            }

            case 'get_server_time': {
                const { connection } = await getConnection(args.accountId);
                const serverTime = await connection.getServerTime();

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                serverTime: serverTime.time,
                                brokerTime: serverTime.brokerTime,
                                timestamp: new Date().toISOString(),
                            }, null, 2),
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error) {
        logger.error(`Error executing tool ${name}:`, error);
        const mappedError = mapError(error);

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        error: mappedError.error,
                        code: mappedError.code,
                        tool: name,
                    }, null, 2),
                },
            ],
            isError: true,
        };
    }
});

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
        const response = await metaApi.metatraderAccountApi.getAccountsWithClassicPagination();
        const accounts = response.items || [];

        const resources = [
            {
                uri: 'metaapi://accounts',
                name: 'All Trading Accounts',
                description: 'List of all provisioned MetaTrader accounts',
                mimeType: 'application/json',
            },
        ];

        // Add per-account resources
        for (const account of accounts) {
            resources.push({
                uri: `metaapi://accounts/${account.id}`,
                name: `Account ${account.name}`,
                description: `Details for account ${account.login} on ${account.server}`,
                mimeType: 'application/json',
            });

            resources.push({
                uri: `metaapi://accounts/${account.id}/positions`,
                name: `Positions - ${account.name}`,
                description: `Open positions for account ${account.login}`,
                mimeType: 'application/json',
            });

            resources.push({
                uri: `metaapi://accounts/${account.id}/orders`,
                name: `Orders - ${account.name}`,
                description: `Pending orders for account ${account.login}`,
                mimeType: 'application/json',
            });
        }

        return { resources };
    } catch (error) {
        logger.error('Error listing resources:', error);
        return { resources: [] };
    }
});

// Read resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    try {
        if (uri === 'metaapi://accounts') {
            const response = await metaApi.metatraderAccountApi.getAccountsWithClassicPagination();
            const accounts = response.items || [];
            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify(accounts.map(acc => ({
                            id: acc.id,
                            name: acc.name,
                            login: acc.login,
                            server: acc.server,
                            platform: acc.platform,
                            type: acc.type,
                            state: acc.state,
                            connectionStatus: acc.connectionStatus,
                        })), null, 2),
                    },
                ],
            };
        }

        const accountMatch = uri.match(/^metaapi:\/\/accounts\/([^/]+)$/);
        if (accountMatch) {
            const accountId = accountMatch[1];
            const { connection } = await getConnection(accountId);
            const accountInfo = await connection.getAccountInformation();

            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify(accountInfo, null, 2),
                    },
                ],
            };
        }

        const positionsMatch = uri.match(/^metaapi:\/\/accounts\/([^/]+)\/positions$/);
        if (positionsMatch) {
            const accountId = positionsMatch[1];
            const { connection } = await getConnection(accountId);
            const positions = await connection.getPositions();

            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify(positions, null, 2),
                    },
                ],
            };
        }

        const ordersMatch = uri.match(/^metaapi:\/\/accounts\/([^/]+)\/orders$/);
        if (ordersMatch) {
            const accountId = ordersMatch[1];
            const { connection } = await getConnection(accountId);
            const orders = await connection.getOrders();

            return {
                contents: [
                    {
                        uri,
                        mimeType: 'application/json',
                        text: JSON.stringify(orders, null, 2),
                    },
                ],
            };
        }

        throw new Error(`Unknown resource URI: ${uri}`);
    } catch (error) {
        logger.error(`Error reading resource ${uri}:`, error);
        throw error;
    }
});

// List prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            {
                name: 'account_overview',
                description: 'Get a comprehensive overview of a trading account',
                arguments: [
                    {
                        name: 'accountId',
                        description: 'The MetaTrader account ID',
                        required: true,
                    },
                ],
            },
            {
                name: 'risk_check',
                description: 'Perform a risk check before placing a trade',
                arguments: [
                    {
                        name: 'accountId',
                        description: 'The MetaTrader account ID',
                        required: true,
                    },
                    {
                        name: 'symbol',
                        description: 'Trading symbol',
                        required: true,
                    },
                    {
                        name: 'volume',
                        description: 'Proposed trade volume',
                        required: true,
                    },
                ],
            },
            {
                name: 'trading_summary',
                description: 'Get a summary of recent trading activity',
                arguments: [
                    {
                        name: 'accountId',
                        description: 'The MetaTrader account ID',
                        required: true,
                    },
                    {
                        name: 'days',
                        description: 'Number of days to look back (default: 7)',
                        required: false,
                    },
                ],
            },
        ],
    };
});

// Get prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'account_overview': {
                const accountId = args?.accountId;
                if (!accountId) {
                    throw new Error('accountId is required');
                }

                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `Please provide a comprehensive overview of MetaTrader account ${accountId}. Include:
- Account balance, equity, and margin information
- Current open positions with P&L
- Pending orders
- Risk assessment (margin level, free margin)
- Recent performance summary

Use the get_account_state tool to gather this information.`,
                            },
                        },
                    ],
                };
            }

            case 'risk_check': {
                const { accountId, symbol, volume } = args || {};
                if (!accountId || !symbol || !volume) {
                    throw new Error('accountId, symbol, and volume are required');
                }

                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `Perform a risk assessment for the following proposed trade on account ${accountId}:
- Symbol: ${symbol}
- Volume: ${volume} lots

Check:
1. Current account equity and free margin
2. Required margin for this trade (use calculate_margin tool)
3. Current exposure on ${symbol}
4. Margin level after trade
5. Risk/reward assessment
6. Recommend whether to proceed with the trade`,
                            },
                        },
                    ],
                };
            }

            case 'trading_summary': {
                const accountId = args?.accountId;
                const days = args?.days || 7;
                if (!accountId) {
                    throw new Error('accountId is required');
                }

                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `Generate a trading summary for account ${accountId} for the last ${days} days:
- Total number of trades
- Win/loss ratio
- Total profit/loss
- Most traded symbols
- Average trade duration
- Current open positions

Use the get_deals and get_history_orders tools to gather this information.`,
                            },
                        },
                    ],
                };
            }

            default:
                throw new Error(`Unknown prompt: ${name}`);
        }
    } catch (error) {
        logger.error(`Error getting prompt ${name}:`, error);
        throw error;
    }
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('MetaAPI MCP Server running on stdio');
}

main().catch((error) => {
    logger.error('Fatal error:', error);
    process.exit(1);
});
