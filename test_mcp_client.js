#!/usr/bin/env node

/**
 * Test MCP Client using HTTP/SSE transport
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333';

async function testMCPServer() {
    console.log('Starting MCP server test...\n');
    console.log(`Connecting to ${SERVER_URL}/sse\n`);

    const transport = new SSEClientTransport(new URL(`${SERVER_URL}/sse`));

    const client = new Client(
        {
            name: 'metaapi-test-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // Send list tools request
        console.log('Requesting tools list...');
        const result = await client.listTools();
        
        console.log('\n=== RESPONSE ===');
        console.log(JSON.stringify(result, null, 2));

        if (result.tools) {
            console.log(`\n✅ Found ${result.tools.length} tools`);
            result.tools.forEach((tool, i) => {
                console.log(`${i + 1}. ${tool.name}`);
            });
        }

        console.log('\n✅ Test completed successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

testMCPServer().catch(console.error);
