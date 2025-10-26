#!/usr/bin/env node

/**
 * Account Tools Test
 * Tests: list_accounts, get_account_information
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

async function testAccountTools() {
    console.log('🧪 Account Tools Test\n');

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));
    const client = new Client(
        { name: 'account-test', version: '1.0.0' },
        { capabilities: {} }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // Test 1: List Accounts
        console.log('📝 Test 1: list_accounts');
        console.log('─'.repeat(60));
        const accountsResult = await client.callTool({
            name: 'list_accounts',
            arguments: {}
        });

        const accountsData = JSON.parse(accountsResult.content[0].text);
        const accounts = accountsData.accounts || [];
        console.log(`✅ Found ${accounts.length} account(s)`);

        if (accounts.length > 0) {
            const account = accounts[0];
            console.log(`   - ID: ${account.id}`);
            console.log(`   - Name: ${account.name}`);
            console.log(`   - Type: ${account.type}\n`);

            // Test 2: Get Account Information
            console.log('📝 Test 2: get_account_information');
            console.log('─'.repeat(60));
            const infoResult = await client.callTool({
                name: 'get_account_information',
                arguments: { accountId: account.id }
            });

            const infoData = JSON.parse(infoResult.content[0].text);
            console.log('✅ Account Information:');
            console.log(`   - Balance: $${infoData.balance}`);
            console.log(`   - Equity: $${infoData.equity}`);
            console.log(`   - Leverage: ${infoData.leverage}`);
            console.log(`   - Currency: ${infoData.currency}\n`);
        }

        console.log('═'.repeat(60));
        console.log('✅ All account tests passed!');
        console.log('═'.repeat(60));

        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testAccountTools();
