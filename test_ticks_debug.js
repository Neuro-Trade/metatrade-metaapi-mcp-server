#!/usr/bin/env node

/**
 * Debug get_ticks for MT5 account
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const ACCOUNT_ID = 'b7320f60-ef3c-4589-a692-c6b39f76c313';
const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';

async function debugTicks() {
    console.log('🔍 Debugging get_ticks for MT5 account...\n');

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));

    const client = new Client(
        {
            name: 'ticks-debug-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // First check account info
        console.log('📋 Step 1: Getting account information...');
        console.log('─'.repeat(60));
        const accountInfo = await client.callTool({
            name: 'get_account_information',
            arguments: {
                accountId: ACCOUNT_ID
            }
        });

        const accountData = JSON.parse(accountInfo.content[0].text);
        console.log('Account Details:');
        console.log(`  Platform: ${accountData.platform || 'Unknown'}`);
        console.log(`  Type: ${accountData.type || 'Unknown'}`);
        console.log(`  Server: ${accountData.server || 'Unknown'}`);
        console.log(`  Broker: ${accountData.broker || 'Unknown'}`);
        console.log(`  Currency: ${accountData.currency || 'Unknown'}`);
        console.log();

        // Try with very recent time (last hour)
        console.log('📊 Step 2: Testing get_ticks with recent time (last 1 hour)...');
        console.log('─'.repeat(60));
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        console.log(`Start Time: ${oneHourAgo.toISOString()}`);

        try {
            const ticksResult1 = await client.callTool({
                name: 'get_ticks',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'EURUSD',
                    startTime: oneHourAgo.toISOString(),
                    offset: 0,
                    limit: 100
                }
            });

            const ticksData1 = JSON.parse(ticksResult1.content[0].text);
            console.log(`Symbol: ${ticksData1.symbol}`);
            console.log(`Start Time: ${ticksData1.startTime}`);
            console.log(`Offset: ${ticksData1.offset}`);
            console.log(`Ticks Retrieved: ${ticksData1.count}`);

            if (ticksData1.ticks && ticksData1.ticks.length > 0) {
                console.log('\n✅ SUCCESS! Sample tick data:');
                const tick = ticksData1.ticks[0];
                console.log(JSON.stringify(tick, null, 2));
            } else {
                console.log('⚠️  No ticks returned (empty array)');
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        console.log();

        // Try with even more recent time (last 5 minutes)
        console.log('📊 Step 3: Testing with very recent time (last 5 minutes)...');
        console.log('─'.repeat(60));
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        console.log(`Start Time: ${fiveMinutesAgo.toISOString()}`);

        try {
            const ticksResult2 = await client.callTool({
                name: 'get_ticks',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'EURUSD',
                    startTime: fiveMinutesAgo.toISOString(),
                    offset: 0,
                    limit: 50
                }
            });

            const ticksData2 = JSON.parse(ticksResult2.content[0].text);
            console.log(`Ticks Retrieved: ${ticksData2.count}`);

            if (ticksData2.ticks && ticksData2.ticks.length > 0) {
                console.log('\n✅ SUCCESS! Tick data available!');
                console.log(`First tick time: ${ticksData2.ticks[0].time}`);
                console.log(`Last tick time: ${ticksData2.ticks[ticksData2.ticks.length - 1].time}`);
                console.log('\nSample ticks (first 3):');
                ticksData2.ticks.slice(0, 3).forEach((tick, i) => {
                    console.log(`\nTick ${i + 1}:`);
                    console.log(JSON.stringify(tick, null, 2));
                });
            } else {
                console.log('⚠️  Still no ticks returned');
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        console.log();

        // Try without startTime (use default)
        console.log('📊 Step 4: Testing without startTime (default 7 days)...');
        console.log('─'.repeat(60));

        try {
            const ticksResult3 = await client.callTool({
                name: 'get_ticks',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'EURUSD',
                    limit: 100
                }
            });

            const ticksData3 = JSON.parse(ticksResult3.content[0].text);
            console.log(`Start Time (default): ${ticksData3.startTime}`);
            console.log(`Ticks Retrieved: ${ticksData3.count}`);

            if (ticksData3.ticks && ticksData3.ticks.length > 0) {
                console.log('\n✅ SUCCESS with default time!');
                console.log(`Total ticks: ${ticksData3.count}`);
            } else {
                console.log('⚠️  No ticks with default time either');
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        console.log();

        console.log('═'.repeat(60));
        console.log('📋 DIAGNOSIS SUMMARY');
        console.log('═'.repeat(60));
        console.log('\nPossible reasons if no ticks returned:');
        console.log('1. Server needs to be G1 or G2 (check server name above)');
        console.log('2. Tick history may have limited retention period');
        console.log('3. Symbol may not have tick-level data available');
        console.log('4. Account may need specific permissions for tick data');
        console.log('\n💡 Recommendation: Try a different symbol or check MetaAPI documentation');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('\n👋 Disconnected\n');
        process.exit(0);
    }
}

debugTicks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
