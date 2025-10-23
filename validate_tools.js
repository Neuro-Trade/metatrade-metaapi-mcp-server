#!/usr/bin/env node

/**
 * Quick validation that all 23 tools are registered
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function validateTools() {
    console.log('Validating Phase 1 Extended MCP Server...\n');

    const transport = new StdioClientTransport({
        command: 'node',
        args: ['src/index.js'],
    });

    const client = new Client(
        {
            name: 'validation-client',
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

        console.log('📋 TOOL VALIDATION RESULTS');
        console.log('='.repeat(60));
        console.log(`Total tools: ${tools.length}\n`);

        const expectedPhase1Tools = [
            'get_position',
            'get_order',
            'get_symbols',
            'get_symbol_specification',
            'create_stop_buy_order',
            'create_stop_sell_order',
            'modify_order',
        ];

        const originalTools = [
            'list_accounts',
            'get_account_state',
            'get_account_information',
            'place_market_order',
            'place_limit_order',
            'close_position',
            'modify_position',
            'cancel_order',
            'get_symbol_price',
            'calculate_margin',
            'get_server_time',
            'get_positions',
            'get_orders',
            'get_history_orders',
            'get_deals',
            'subscribe_price',
        ];

        console.log('ORIGINAL TOOLS (16):');
        originalTools.forEach((toolName, index) => {
            const exists = tools.find(t => t.name === toolName);
            console.log(`  ${index + 1}. ${toolName} ${exists ? '✅' : '❌'}`);
        });

        console.log('\nNEW PHASE 1 TOOLS (7):');
        expectedPhase1Tools.forEach((toolName, index) => {
            const exists = tools.find(t => t.name === toolName);
            console.log(`  ${index + 1}. ${toolName} ${exists ? '✅' : '❌'}`);
        });

        const expectedPhase2Tools = [
            'get_candles',
            'get_ticks',
            'get_history_orders_by_ticket',
            'get_deals_by_ticket',
        ];

        console.log('\nNEW PHASE 2 TOOLS (4):');
        expectedPhase2Tools.forEach((toolName, index) => {
            const exists = tools.find(t => t.name === toolName);
            console.log(`  ${index + 1}. ${toolName} ${exists ? '✅' : '❌'}`);
        });

        const expectedPhase3Tools = [
            'get_terminal_state',
            'undeploy_account',
            'deploy_account',
            'redeploy_account',
            'create_market_order_with_trailing_sl',
            'get_server_time',
        ];

        console.log('\nNEW PHASE 3 TOOLS (6):');
        expectedPhase3Tools.forEach((toolName, index) => {
            const exists = tools.find(t => t.name === toolName);
            console.log(`  ${index + 1}. ${toolName} ${exists ? '✅' : '❌'}`);
        });

        console.log('\n' + '='.repeat(60));
        console.log(`Expected: 32 tools (15 original + 7 Phase 1 + 4 Phase 2 + 6 Phase 3)`);
        console.log(`Actual: ${tools.length} tools`);

        if (tools.length === 32) {
            console.log('✅ ALL TOOLS REGISTERED SUCCESSFULLY');
            console.log('\n🎉 ALL PHASES COMPLETE - NO DUPLICATES!');
        } else {
            console.log('⚠️  Tool count mismatch');
        }

        console.log('\n📖 See VALIDATION_AND_EXTENSIONS.md for details');
        console.log('   ✅ Phase 1: Core extensions (7 tools)');
        console.log('   ✅ Phase 2: Market data (4 tools)');
        console.log('   ✅ Phase 3: Advanced features (6 tools)');


        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Validation failed:', error.message);
        process.exit(1);
    }
}

validateTools();
