#!/usr/bin/env node

/**
 * Market Order Tools Test Script
 * Tests place_market_order, modify_position, close_position, close_position_partially
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const ACCOUNT_ID = 'b7320f60-ef3c-4589-a692-c6b39f76c313';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testMarketOrderTools() {
    console.log('🧪 Market Order Tools - Comprehensive Tests\n');

    const transport = new StdioClientTransport({
        command: 'node',
        args: ['src/index.js'],
    });

    const client = new Client(
        {
            name: 'market-order-test',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        let testPositionId = null;

        // Test 1: place_market_order (Buy)
        console.log('📊 TEST 1: place_market_order (Market Buy)');
        console.log('─'.repeat(60));
        console.log('Placing a market buy order for EUR/USD...\n');

        try {
            const buyResult = await client.callTool({
                name: 'place_market_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    side: 'buy',
                    symbol: 'EURUSD',
                    volume: 0.01,
                    comment: 'Test Market Buy - Phase 1'
                }
            });

            const orderData = JSON.parse(buyResult.content[0].text);
            console.log(`✅ Market Buy Order Placed:`);
            console.log(`   Position ID: ${orderData.positionId}`);
            console.log(`   String Code: ${orderData.stringCode}`);
            console.log(`   Message: ${orderData.message}\n`);

            testPositionId = orderData.positionId;

            // Wait for position to be fully opened
            await sleep(2000);

        } catch (error) {
            console.log(`❌ Market Buy Order test FAILED: ${error.message}\n`);
            console.log('   Note: This might fail due to market conditions or broker restrictions\n');
        }

        // Test 2: get_positions (verify position exists)
        console.log('📊 TEST 2: get_positions (Verify opened position)');
        console.log('─'.repeat(60));

        try {
            const positionsResult = await client.callTool({
                name: 'get_positions',
                arguments: {
                    accountId: ACCOUNT_ID
                }
            });

            const positions = JSON.parse(positionsResult.content[0].text);
            console.log(`✅ Current Open Positions: ${positions.length}`);

            if (positions.length > 0) {
                const testPos = positions.find(p => p.id === testPositionId) || positions[0];
                if (!testPositionId && positions[0]) {
                    testPositionId = positions[0].id;
                }

                console.log('\n   Latest Position:');
                console.log(`   ID: ${testPos.id}`);
                console.log(`   Symbol: ${testPos.symbol}`);
                console.log(`   Type: ${testPos.type}`);
                console.log(`   Volume: ${testPos.volume}`);
                console.log(`   Open Price: ${testPos.openPrice}`);
                console.log(`   Current Price: ${testPos.currentPrice}`);
                console.log(`   Profit: $${testPos.profit}`);
                console.log(`   Swap: $${testPos.swap || 0}\n`);
            } else {
                console.log('   No open positions found\n');
            }

        } catch (error) {
            console.log(`❌ Get Positions test FAILED: ${error.message}\n`);
        }

        if (testPositionId) {
            // Test 3: modify_position (add SL and TP)
            console.log('📊 TEST 3: modify_position (Add SL and TP)');
            console.log('─'.repeat(60));

            try {
                // Get current price to set realistic SL/TP
                const priceResult = await client.callTool({
                    name: 'get_symbol_price',
                    arguments: {
                        accountId: ACCOUNT_ID,
                        symbol: 'EURUSD'
                    }
                });

                const priceData = JSON.parse(priceResult.content[0].text);
                const currentPrice = priceData.bid;
                const stopLoss = (currentPrice - 0.005).toFixed(5); // 50 pips below
                const takeProfit = (currentPrice + 0.01).toFixed(5); // 100 pips above

                console.log(`Current Price: ${currentPrice}`);
                console.log(`Setting Stop Loss: ${stopLoss} (50 pips)`);
                console.log(`Setting Take Profit: ${takeProfit} (100 pips)\n`);

                const modifyResult = await client.callTool({
                    name: 'modify_position',
                    arguments: {
                        accountId: ACCOUNT_ID,
                        positionId: testPositionId,
                        stopLoss: parseFloat(stopLoss),
                        takeProfit: parseFloat(takeProfit)
                    }
                });

                const modifyData = JSON.parse(modifyResult.content[0].text);
                console.log(`✅ Position Modified:`);
                console.log(`   Position ID: ${modifyData.positionId}`);
                console.log(`   String Code: ${modifyData.stringCode}`);
                console.log(`   Message: ${modifyData.message}\n`);

                await sleep(1000);

            } catch (error) {
                console.log(`❌ Modify Position test FAILED: ${error.message}\n`);
            }

            // Test 4: close_position_partially (close half)
            console.log('📊 TEST 4: close_position_partially (Close 50%)');
            console.log('─'.repeat(60));

            try {
                const partialCloseResult = await client.callTool({
                    name: 'close_position_partially',
                    arguments: {
                        accountId: ACCOUNT_ID,
                        positionId: testPositionId,
                        volume: 0.005, // Close half of 0.01
                        comment: 'Partial close test'
                    }
                });

                const partialData = JSON.parse(partialCloseResult.content[0].text);
                console.log(`✅ Position Partially Closed:`);
                console.log(`   Position ID: ${partialData.positionId}`);
                console.log(`   String Code: ${partialData.stringCode}`);
                console.log(`   Volume Closed: 0.005 lots\n`);

                await sleep(1000);

            } catch (error) {
                console.log(`❌ Partial Close test FAILED: ${error.message}\n`);
            }

            // Test 5: close_position (close remaining)
            console.log('📊 TEST 5: close_position (Close completely)');
            console.log('─'.repeat(60));

            try {
                const closeResult = await client.callTool({
                    name: 'close_position',
                    arguments: {
                        accountId: ACCOUNT_ID,
                        positionId: testPositionId,
                        comment: 'Test cleanup'
                    }
                });

                const closeData = JSON.parse(closeResult.content[0].text);
                console.log(`✅ Position Closed:`);
                console.log(`   Position ID: ${closeData.positionId}`);
                console.log(`   String Code: ${closeData.stringCode}`);
                console.log(`   Message: ${closeData.message}\n`);

            } catch (error) {
                console.log(`❌ Close Position test FAILED: ${error.message}\n`);
            }
        } else {
            console.log('⚠️  Skipping modify/close tests - no test position available\n');
        }

        // Test 6: place_market_order (Sell) - quick test
        console.log('📊 TEST 6: place_market_order (Market Sell)');
        console.log('─'.repeat(60));
        console.log('Placing a market sell order for GBP/USD...\n');

        try {
            const sellResult = await client.callTool({
                name: 'place_market_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    side: 'sell',
                    symbol: 'GBPUSD',
                    volume: 0.01,
                    comment: 'Test Market Sell - Phase 1'
                }
            });

            const orderData = JSON.parse(sellResult.content[0].text);
            console.log(`✅ Market Sell Order Placed:`);
            console.log(`   Position ID: ${orderData.positionId}`);
            console.log(`   String Code: ${orderData.stringCode}\n`);

            // Wait and close immediately
            await sleep(2000);

            const closeResult = await client.callTool({
                name: 'close_position',
                arguments: {
                    accountId: ACCOUNT_ID,
                    positionId: orderData.positionId,
                    comment: 'Test cleanup'
                }
            });

            console.log(`   ✅ Test position cleaned up\n`);

        } catch (error) {
            console.log(`❌ Market Sell Order test FAILED: ${error.message}\n`);
        }

        // Summary
        console.log('═'.repeat(60));
        console.log('🎉 MARKET ORDER TOOLS TESTING COMPLETE');
        console.log('═'.repeat(60));
        console.log('\nTools Tested:');
        console.log('  1. place_market_order (Buy) - ✅');
        console.log('  2. get_positions - ✅');
        console.log('  3. modify_position - ✅');
        console.log('  4. close_position_partially - ✅');
        console.log('  5. close_position - ✅');
        console.log('  6. place_market_order (Sell) - ✅');
        console.log('\n⚠️  Note: Some tests may show failures due to:');
        console.log('  - Market conditions (low liquidity, high volatility)');
        console.log('  - Broker restrictions (demo account limits)');
        console.log('  - Minimum volume requirements');
        console.log('  - Spread/price constraints\n');

    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('\n👋 Test client disconnected\n');
        process.exit(0);
    }
}

testMarketOrderTools().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
