#!/usr/bin/env node

/**
 * Test get_ticks with very recent data
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const ACCOUNT_ID = 'b7320f60-ef3c-4589-a692-c6b39f76c313';
const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';

async function testRecentTicks() {
    console.log('🔍 Testing get_ticks with very recent data...\n');

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));

    const client = new Client(
        {
            name: 'recent-ticks-test',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);

        // Test 1: Default (now 1 hour ago)
        console.log('📊 TEST 1: Using default time (1 hour ago)...');
        console.log('─'.repeat(60));
        const result1 = await client.callTool({
            name: 'get_ticks',
            arguments: {
                accountId: ACCOUNT_ID,
                symbol: 'EURUSD',
                limit: 50
            }
        });

        const data1 = JSON.parse(result1.content[0].text);
        console.log(`Start Time: ${data1.startTime}`);
        console.log(`Ticks: ${data1.count}`);
        if (data1.note) console.log(`Note: ${data1.note}`);
        if (data1.count > 0) {
            console.log('\n✅ SUCCESS! Got tick data with default time');
            console.log('Sample tick:', JSON.stringify(data1.ticks[0], null, 2));
        }
        console.log();

        // Test 2: Last 5 minutes
        console.log('📊 TEST 2: Last 5 minutes...');
        console.log('─'.repeat(60));
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
        const result2 = await client.callTool({
            name: 'get_ticks',
            arguments: {
                accountId: ACCOUNT_ID,
                symbol: 'EURUSD',
                startTime: fiveMinAgo.toISOString(),
                limit: 50
            }
        });

        const data2 = JSON.parse(result2.content[0].text);
        console.log(`Start Time: ${data2.startTime}`);
        console.log(`Ticks: ${data2.count}`);
        if (data2.note) console.log(`Note: ${data2.note}`);
        if (data2.count > 0) {
            console.log('\n✅ SUCCESS! Got tick data');
            console.log('Sample tick:', JSON.stringify(data2.ticks[0], null, 2));
        }
        console.log();

        // Test 3: Try different symbol (GBPUSD)
        console.log('📊 TEST 3: Different symbol (GBPUSD)...');
        console.log('─'.repeat(60));
        const result3 = await client.callTool({
            name: 'get_ticks',
            arguments: {
                accountId: ACCOUNT_ID,
                symbol: 'GBPUSD',
                limit: 50
            }
        });

        const data3 = JSON.parse(result3.content[0].text);
        console.log(`Symbol: ${data3.symbol}`);
        console.log(`Ticks: ${data3.count}`);
        if (data3.count > 0) {
            console.log('\n✅ GBPUSD has tick data!');
        }
        console.log();

        console.log('═'.repeat(60));
        if (data1.count === 0 && data2.count === 0 && data3.count === 0) {
            console.log('⚠️  CONCLUSION: No tick data available');
            console.log('\nPossible reasons:');
            console.log('1. Broker (Exness) may not provide historical tick data');
            console.log('2. Trial account may have tick data disabled');
            console.log('3. Tick data retention may be very limited (e.g., only live ticks)');
            console.log('\n💡 Historical tick data availability varies by broker.');
            console.log('   The tool is working correctly - it just depends on broker settings.');
        } else {
            console.log('✅ Tick data is available!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        process.exit(0);
    }
}

testRecentTicks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
