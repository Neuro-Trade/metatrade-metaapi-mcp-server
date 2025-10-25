#!/usr/bin/env node

/**
 * Position & Order Tools Test
 * Tests: get_positions, get_orders
 * Note: Does not place real trades
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';
const ACCOUNT_ID = process.env.ACCOUNT_ID || 'b7320f60-ef3c-4589-a692-c6b39f76c313';

async function testTradingTools() {
    console.log('🧪 Position & Order Tools Test\n');

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));
    const client = new Client(
        { name: 'trading-test', version: '1.0.0' },
        { capabilities: {} }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // Test 1: Get Positions
        console.log('📝 Test 1: get_positions');
        console.log('─'.repeat(60));
        const positionsResult = await client.callTool({
            name: 'get_positions',
            arguments: { accountId: ACCOUNT_ID }
        });

        const positionsData = JSON.parse(positionsResult.content[0].text);
        const positions = positionsData.positions || [];
        console.log(`✅ Found ${positions.length} open position(s)`);
        if (positions.length > 0) {
            positions.forEach(pos => {
                console.log(`   - ${pos.symbol}: ${pos.type} ${pos.volume} lots @ ${pos.openPrice}`);
            });
        }
        console.log();

        // Test 2: Get Orders
        console.log('📝 Test 2: get_orders');
        console.log('─'.repeat(60));
        const ordersResult = await client.callTool({
            name: 'get_orders',
            arguments: { accountId: ACCOUNT_ID }
        });

        const ordersData = JSON.parse(ordersResult.content[0].text);
        const orders = ordersData.orders || [];
        console.log(`✅ Found ${orders.length} pending order(s)`);
        if (orders.length > 0) {
            orders.forEach(order => {
                console.log(`   - ${order.symbol}: ${order.type} ${order.volume} lots @ ${order.openPrice}`);
            });
        }
        console.log();

        console.log('═'.repeat(60));
        console.log('✅ All trading tools tests passed!');
        console.log('═'.repeat(60));

        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testTradingTools();
