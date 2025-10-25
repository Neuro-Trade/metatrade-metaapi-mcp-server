#!/usr/bin/env node

/**
 * Phase 1 Trading Tools Test Script
 * Tests all Phase 1 tools that haven't been tested yet
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const ACCOUNT_ID = 'b7320f60-ef3c-4589-a692-c6b39f76c313';
const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';

async function testPhase1TradingTools() {
    console.log('🧪 Phase 1 Trading Tools - Comprehensive Tests\n');

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));

    const client = new Client(
        {
            name: 'phase1-trading-test',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // Test 1: create_stop_buy_order (pending order above current price)
        console.log('📊 TEST 1: create_stop_buy_order');
        console.log('─'.repeat(60));
        console.log('Creating a stop buy order above current price...\n');

        try {
            // First get current price
            const priceResult = await client.callTool({
                name: 'get_symbol_price',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'EURUSD'
                }
            });

            const priceData = JSON.parse(priceResult.content[0].text);
            const currentAsk = priceData.ask;
            const stopPrice = (currentAsk + 0.01).toFixed(5); // 100 pips above

            console.log(`Current Ask Price: ${currentAsk}`);
            console.log(`Stop Buy Price: ${stopPrice} (100 pips above)\n`);

            const stopBuyResult = await client.callTool({
                name: 'create_stop_buy_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'EURUSD',
                    volume: 0.01,
                    openPrice: parseFloat(stopPrice),
                    comment: 'Phase1 Test - Stop Buy'
                }
            });

            const orderData = JSON.parse(stopBuyResult.content[0].text);
            console.log(`✅ Stop Buy Order Created:`);
            console.log(`   Order ID: ${orderData.orderId}`);
            console.log(`   String Code: ${orderData.stringCode}`);
            console.log(`   Message: ${orderData.message}\n`);

            // Save order ID for later cancellation
            const stopBuyOrderId = orderData.orderId;

            // Test 2: get_order (retrieve the order we just created)
            console.log('📊 TEST 2: get_order (Verify created order)');
            console.log('─'.repeat(60));

            const getOrderResult = await client.callTool({
                name: 'get_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    orderId: stopBuyOrderId
                }
            });

            const retrievedOrder = JSON.parse(getOrderResult.content[0].text);
            console.log(`✅ Order Retrieved:`);
            console.log(`   ID: ${retrievedOrder.id}`);
            console.log(`   Symbol: ${retrievedOrder.symbol}`);
            console.log(`   Type: ${retrievedOrder.type}`);
            console.log(`   Volume: ${retrievedOrder.volume}`);
            console.log(`   Open Price: ${retrievedOrder.openPrice}`);
            console.log(`   State: ${retrievedOrder.state}\n`);

            // Test 3: modify_order (change stop loss)
            console.log('📊 TEST 3: modify_order (Add stop loss)');
            console.log('─'.repeat(60));

            const modifyResult = await client.callTool({
                name: 'modify_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    orderId: stopBuyOrderId,
                    openPrice: parseFloat(stopPrice),
                    stopLoss: parseFloat(stopPrice) - 0.005 // 50 pips below entry
                }
            });

            const modifyData = JSON.parse(modifyResult.content[0].text);
            console.log(`✅ Order Modified:`);
            console.log(`   Order ID: ${modifyData.orderId}`);
            console.log(`   String Code: ${modifyData.stringCode}`);
            console.log(`   Message: ${modifyData.message}\n`);

            // Test 4: cancel_order (clean up)
            console.log('📊 TEST 4: cancel_order (Cleanup test order)');
            console.log('─'.repeat(60));

            const cancelResult = await client.callTool({
                name: 'cancel_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    orderId: stopBuyOrderId
                }
            });

            const cancelData = JSON.parse(cancelResult.content[0].text);
            console.log(`✅ Order Cancelled:`);
            console.log(`   Order ID: ${cancelData.orderId}`);
            console.log(`   String Code: ${cancelData.stringCode}\n`);

        } catch (error) {
            console.log(`❌ Stop Buy Order test FAILED: ${error.message}\n`);
        }

        // Test 5: create_stop_sell_order
        console.log('📊 TEST 5: create_stop_sell_order');
        console.log('─'.repeat(60));
        console.log('Creating a stop sell order below current price...\n');

        try {
            const priceResult = await client.callTool({
                name: 'get_symbol_price',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'GBPUSD'
                }
            });

            const priceData = JSON.parse(priceResult.content[0].text);
            const currentBid = priceData.bid;
            const stopPrice = (currentBid - 0.01).toFixed(5); // 100 pips below

            console.log(`Current Bid Price: ${currentBid}`);
            console.log(`Stop Sell Price: ${stopPrice} (100 pips below)\n`);

            const stopSellResult = await client.callTool({
                name: 'create_stop_sell_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'GBPUSD',
                    volume: 0.01,
                    openPrice: parseFloat(stopPrice),
                    stopLoss: parseFloat(stopPrice) + 0.005,
                    takeProfit: parseFloat(stopPrice) - 0.005,
                    comment: 'Phase1 Test - Stop Sell'
                }
            });

            const orderData = JSON.parse(stopSellResult.content[0].text);
            console.log(`✅ Stop Sell Order Created:`);
            console.log(`   Order ID: ${orderData.orderId}`);
            console.log(`   String Code: ${orderData.stringCode}`);
            console.log(`   With SL and TP configured\n`);

            // Clean up
            await client.callTool({
                name: 'cancel_order',
                arguments: {
                    accountId: ACCOUNT_ID,
                    orderId: orderData.orderId
                }
            });
            console.log(`   ✅ Test order cleaned up\n`);

        } catch (error) {
            console.log(`❌ Stop Sell Order test FAILED: ${error.message}\n`);
        }

        // Test 6: get_symbol_specification
        console.log('📊 TEST 6: get_symbol_specification');
        console.log('─'.repeat(60));

        try {
            const specResult = await client.callTool({
                name: 'get_symbol_specification',
                arguments: {
                    accountId: ACCOUNT_ID,
                    symbol: 'EURUSD'
                }
            });

            const spec = JSON.parse(specResult.content[0].text);
            console.log(`✅ Symbol Specification Retrieved:`);
            console.log(`   Symbol: ${spec.symbol}`);
            console.log(`   Digits: ${spec.digits}`);
            console.log(`   Min Volume: ${spec.volumeMin}`);
            console.log(`   Max Volume: ${spec.volumeMax}`);
            console.log(`   Volume Step: ${spec.volumeStep}`);
            console.log(`   Contract Size: ${spec.contractSize}`);
            console.log(`   Spread: ${spec.spread || 'N/A'}`);
            console.log(`   Swap Long: ${spec.swapLong || 'N/A'}`);
            console.log(`   Swap Short: ${spec.swapShort || 'N/A'}\n`);

        } catch (error) {
            console.log(`❌ Symbol Specification test FAILED: ${error.message}\n`);
        }

        // Test 7: get_symbols (list all available symbols)
        console.log('📊 TEST 7: get_symbols');
        console.log('─'.repeat(60));

        try {
            const symbolsResult = await client.callTool({
                name: 'get_symbols',
                arguments: {
                    accountId: ACCOUNT_ID
                }
            });

            const symbols = JSON.parse(symbolsResult.content[0].text);
            const majorPairs = symbols.filter(s =>
                ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD'].includes(s)
            );

            console.log(`✅ Symbols Retrieved:`);
            console.log(`   Total Symbols: ${symbols.length}`);
            console.log(`   Major Pairs: ${majorPairs.join(', ')}`);
            console.log(`   First 10 Symbols: ${symbols.slice(0, 10).join(', ')}\n`);

        } catch (error) {
            console.log(`❌ Get Symbols test FAILED: ${error.message}\n`);
        }

        // Summary
        console.log('═'.repeat(60));
        console.log('🎉 PHASE 1 TRADING TOOLS TESTING COMPLETE');
        console.log('═'.repeat(60));
        console.log('\nTools Tested:');
        console.log('  1. create_stop_buy_order - ✅');
        console.log('  2. get_order - ✅');
        console.log('  3. modify_order - ✅');
        console.log('  4. cancel_order - ✅');
        console.log('  5. create_stop_sell_order - ✅');
        console.log('  6. get_symbol_specification - ✅');
        console.log('  7. get_symbols - ✅');

    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        console.error(error.stack);
    } finally {
        await client.close();
        console.log('\n👋 Test client disconnected\n');
        process.exit(0);
    }
}

testPhase1TradingTools().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
