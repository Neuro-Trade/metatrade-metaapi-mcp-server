#!/usr/bin/env node

// Test client to verify MCP server functionality
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

async function testServer() {
    console.log('🧪 Starting MCP server test...\n');

    // Spawn the server process
    const serverProcess = spawn('node', ['src/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Capture stderr for logs
    serverProcess.stderr.on('data', (data) => {
        console.log('📋 Server log:', data.toString().trim());
    });

    // Create client transport
    const transport = new StdioClientTransport({
        command: 'node',
        args: ['src/index.js'],
    });

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
        // Connect to server
        await client.connect(transport);
        console.log('✅ Connected to MCP server\n');

        // Test 1: List tools
        console.log('📝 Test 1: Listing available tools...');
        const tools = await client.listTools();
        console.log(`✅ Found ${tools.tools.length} tools:`);
        tools.tools.forEach((tool, i) => {
            console.log(`   ${i + 1}. ${tool.name} - ${tool.description.substring(0, 60)}...`);
        });
        console.log();

        // Test 2: List resources
        console.log('📝 Test 2: Listing available resources...');
        const resources = await client.listResources();
        console.log(`✅ Found ${resources.resources.length} resources:`);
        resources.resources.forEach((resource, i) => {
            console.log(`   ${i + 1}. ${resource.uri} - ${resource.name}`);
        });
        console.log();

        // Test 3: List prompts
        console.log('📝 Test 3: Listing available prompts...');
        const prompts = await client.listPrompts();
        console.log(`✅ Found ${prompts.prompts.length} prompts:`);
        prompts.prompts.forEach((prompt, i) => {
            console.log(`   ${i + 1}. ${prompt.name} - ${prompt.description}`);
        });
        console.log();

        // Test 4: Call list_accounts tool
        console.log('📝 Test 4: Calling list_accounts tool...');
        try {
            const result = await client.callTool({
                name: 'list_accounts',
                arguments: {},
            });
            console.log('✅ list_accounts result:', JSON.stringify(result, null, 2).substring(0, 500));
        } catch (error) {
            console.log('⚠️  list_accounts error (expected if no accounts):', error.message);
        }

        console.log('\n🎉 All tests completed!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await client.close();
        serverProcess.kill();
    }
}

testServer().catch(console.error);
