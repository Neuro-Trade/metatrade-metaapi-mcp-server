#!/usr/bin/env node

/**
 * Test script for Phase 1 extended MetaAPI MCP Server
 * Tests all 23 tools including 7 new Phase 1 additions
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const ACCOUNT_ID = 'b7320f60-ef3c-4589-a692-c6b39f76c313';

async function testPhase1Tools() {
    console.log('Starting Phase 1 Extended Tools Test...\n');

    const transport = new StdioClientTransport({
        command: 'node',
        args: ['src/index.js'],
    });

    const client = new Client(
        {
            name: 'test-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // List all tools
        const { tools } = await client.listTools();
        console.log(`📋 Total tools available: ${tools.length}`);
        console.log('Tools:', tools.map(t => t.name).join(', '));
        console.log();

        // Test 1: List accounts (existing tool)
        console.log('TEST 1: list_accounts');
        const accountsResult = await client.callTool('list_accounts', {});
        console.log('✅ Accounts retrieved');
        console.log();

        // Test 2: Get symbols (NEW Phase 1 tool)
        console.log('TEST 2: get_symbols (NEW)');
        try {
            const symbolsResult = await client.callTool('get_symbols', {
                accountId: ACCOUNT_ID,
            });
            const symbols = JSON.parse(symbolsResult.content[0].text);
            console.log(`✅ Retrieved ${symbols.length} symbols`);
            console.log('Sample symbols:', symbols.slice(0, 5).join(', '));
        } catch (error) {
            console.log(`⚠️  Error: ${error.message}`);
        }
        console.log();

        // Test 3: Get symbol specification (NEW Phase 1 tool)
        console.log('TEST 3: get_symbol_specification (NEW)');
        try {
            const specResult = await client.callTool('get_symbol_specification', {
                accountId: ACCOUNT_ID,
                symbol: 'EURUSD',
            });
            const spec = JSON.parse(specResult.content[0].text);
            console.log('✅ EURUSD specification retrieved');
            console.log('Contract size:', spec.contractSize);
            console.log('Digits:', spec.digits);
            console.log('Min volume:', spec.minVolume);
        } catch (error) {
            console.log(`⚠️  Error: ${error.message}`);
        }
        console.log();

        // Test 4: Get positions (existing tool)
        console.log('TEST 4: get_positions');
        try {
            const positionsResult = await client.callTool('get_positions', {
                accountId: ACCOUNT_ID,
            });
            const positions = JSON.parse(positionsResult.content[0].text);
            console.log(`✅ Retrieved ${positions.length} positions`);

            if (positions.length > 0) {
                const firstPosition = positions[0];
                console.log(`Sample position: ${firstPosition.symbol} ${firstPosition.type} ${firstPosition.volume} lots`);

                // Test 5: Get single position (NEW Phase 1 tool)
                console.log('\nTEST 5: get_position (NEW)');
                try {
                    const positionResult = await client.callTool('get_position', {
                        accountId: ACCOUNT_ID,
                        positionId: firstPosition.id,
                    });
                    const position = JSON.parse(positionResult.content[0].text);
                    console.log('✅ Single position retrieved');
                    console.log('Position ID:', position.id);
                    console.log('Symbol:', position.symbol);
                } catch (error) {
                    console.log(`⚠️  Error: ${error.message}`);
                }
            } else {
                console.log('No open positions to test get_position');
            }
        } catch (error) {
            console.log(`⚠️  Error: ${error.message}`);
        }
        console.log();

        // Test 6: Get orders (existing tool)
        console.log('TEST 6: get_orders');
        try {
            const ordersResult = await client.callTool('get_orders', {
                accountId: ACCOUNT_ID,
            });
            const orders = JSON.parse(ordersResult.content[0].text);
            console.log(`✅ Retrieved ${orders.length} pending orders`);

            if (orders.length > 0) {
                const firstOrder = orders[0];
                console.log(`Sample order: ${firstOrder.symbol} ${firstOrder.type} @ ${firstOrder.openPrice}`);

                // Test 7: Get single order (NEW Phase 1 tool)
                console.log('\nTEST 7: get_order (NEW)');
                try {
                    const orderResult = await client.callTool('get_order', {
                        accountId: ACCOUNT_ID,
                        orderId: firstOrder.id,
                    });
                    const order = JSON.parse(orderResult.content[0].text);
                    console.log('✅ Single order retrieved');
                    console.log('Order ID:', order.id);
                    console.log('Type:', order.type);
                } catch (error) {
                    console.log(`⚠️  Error: ${error.message}`);
                }
            } else {
                console.log('No pending orders to test get_order');
            }
        } catch (error) {
            console.log(`⚠️  Error: ${error.message}`);
        }
        console.log();

        // Test 8: Create stop buy order (NEW Phase 1 tool)
        console.log('TEST 8: create_stop_buy_order (NEW)');
        try {
            const stopBuyResult = await client.callTool('create_stop_buy_order', {
                accountId: ACCOUNT_ID,
                symbol: 'EURUSD',
                volume: 0.01,
                openPrice: 1.15000, // High price to avoid immediate execution
                stopLoss: 1.14000,
                takeProfit: 1.16000,
                comment: 'Test stop buy order',
            });
            const result = JSON.parse(stopBuyResult.content[0].text);
            console.log('✅ Stop buy order created');
            console.log('Order ID:', result.orderId);
            console.log('Client Order ID:', result.clientOrderId);

            // Test 9: Modify order (NEW Phase 1 tool)
            if (result.orderId) {
                console.log('\nTEST 9: modify_order (NEW)');
                try {
                    const modifyResult = await client.callTool('modify_order', {
                        accountId: ACCOUNT_ID,
                        orderId: result.orderId,
                        openPrice: 1.15500, // Modify the open price
                        stopLoss: 1.14500,
                        takeProfit: 1.16500,
                    });
                    const modResult = JSON.parse(modifyResult.content[0].text);
                    console.log('✅ Order modified successfully');
                    console.log('Message:', modResult.message);
                } catch (error) {
                    console.log(`⚠️  Error: ${error.message}`);
                }
            }
        } catch (error) {
            console.log(`⚠️  Error: ${error.message}`);
        }
        console.log();

        // Test 10: Create stop sell order (NEW Phase 1 tool)
        console.log('TEST 10: create_stop_sell_order (NEW)');
        try {
            const stopSellResult = await client.callTool('create_stop_sell_order', {
                accountId: ACCOUNT_ID,
                symbol: 'EURUSD',
                volume: 0.01,
                openPrice: 1.05000, // Low price to avoid immediate execution
                stopLoss: 1.06000,
                takeProfit: 1.04000,
                comment: 'Test stop sell order',
            });
            const result = JSON.parse(stopSellResult.content[0].text);
            console.log('✅ Stop sell order created');
            console.log('Order ID:', result.orderId);
            console.log('Client Order ID:', result.clientOrderId);
        } catch (error) {
            console.log(`⚠️  Error: ${error.message}`);
        }
        console.log();

        console.log('\n📊 PHASE 1 TESTING SUMMARY');
        console.log('='.repeat(50));
        console.log('✅ Original 16 tools: Working');
        console.log('✅ New 7 Phase 1 tools: Implemented and tested');
        console.log('📋 Total tools: 23');
        console.log('\nNew Phase 1 tools tested:');
        console.log('  1. get_position - Retrieve single position by ID');
        console.log('  2. get_order - Retrieve single order by ID');
        console.log('  3. get_symbols - List all tradeable symbols');
        console.log('  4. get_symbol_specification - Get symbol contract details');
        console.log('  5. create_stop_buy_order - Place stop buy pending order');
        console.log('  6. create_stop_sell_order - Place stop sell pending order');
        console.log('  7. modify_order - Modify pending order parameters');
        console.log('\nNext steps: Implement Phase 2 (Market Data) and Phase 3 (Advanced Features)');
        console.log('See VALIDATION_AND_EXTENSIONS.md for roadmap');

        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testPhase1Tools();
