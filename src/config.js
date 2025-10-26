import { createRequire } from 'module';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Import CommonJS MetaApi SDK
const require = createRequire(import.meta.url);
const MetaApi = require('metaapi.cloud-sdk').default;

// Note: MetaAPI client is now initialized in src/index.js with token from command-line args or .env
// This file exports configuration constants only

// Server configuration
export const config = {
    port: process.env.PORT || 3000,
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

