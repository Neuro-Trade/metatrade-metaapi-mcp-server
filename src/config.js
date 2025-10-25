import { createRequire } from 'module';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Import CommonJS MetaApi SDK
const require = createRequire(import.meta.url);
const MetaApi = require('metaapi.cloud-sdk').default;

// Get MetaAPI token from environment
const METAAPI_TOKEN = process.env.METAAPI_TOKEN || process.env.TOKEN;
if (!METAAPI_TOKEN) {
    logger.error('METAAPI_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize MetaApi client (reused across requests)
export const metaApi = new MetaApi(METAAPI_TOKEN);
logger.info('MetaAPI client initialized');

// Server configuration
export const config = {
    port: process.env.PORT || 3333,
    serverName: 'metaapi-mcp-server',
    serverVersion: '1.0.0',
    endpoints: {
        health: '/health',
        sse: '/sse',
        message: '/message/:sessionId',
    },
};

// Active price subscriptions for streaming
export const priceSubscriptions = new Map();
