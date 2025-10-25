#!/usr/bin/env node

/**
 * Basic MCP Server Test
 * Tests: Connection, Tools, Resources, Prompts
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';

async function testBasicConnection() {
    console.log('🧪 Basic MCP Server Test\n');
    console.log(`Connecting to ${SERVER_URL}/sse\n`);

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));
    const client = new Client(
        { name: 'basic-test-client', version: '1.0.0' },
        { capabilities: {} }
    );

    try {
        // Test 1: Connection
        console.log('📝 Test 1: Server Connection');
        console.log('─'.repeat(60));
        await client.connect(transport);
        console.log('✅ Connected successfully\n');

        // Test 2: List Tools
        console.log('📝 Test 2: List Tools');
        console.log('─'.repeat(60));
        const tools = await client.listTools();
        console.log(`✅ Found ${tools.tools.length} tools\n`);

        // Test 3: List Resources
        console.log('📝 Test 3: List Resources');
        console.log('─'.repeat(60));
        const resources = await client.listResources();
        console.log(`✅ Found ${resources.resources.length} resources\n`);

        // Test 4: List Prompts
        console.log('📝 Test 4: List Prompts');
        console.log('─'.repeat(60));
        const prompts = await client.listPrompts();
        console.log(`✅ Found ${prompts.prompts.length} prompts\n`);

        console.log('═'.repeat(60));
        console.log('✅ All basic tests passed!');
        console.log('═'.repeat(60));

        await client.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testBasicConnection();
