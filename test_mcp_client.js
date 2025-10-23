#!/usr/bin/env node

/**
 * Test MCP Client to reproduce the JSON parsing error
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testMCPServer() {
    console.log('Starting MCP server test...\n');

    const server = spawn('npm', ['start'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: __dirname
    });

    let response = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
        response += data.toString();
        console.log('SERVER OUTPUT:', data.toString());
    });

    server.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error('SERVER ERROR:', data.toString());
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send list tools request
    const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
    };

    console.log('Sending request:', JSON.stringify(request));
    server.stdin.write(JSON.stringify(request) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n=== RAW RESPONSE ===');
    console.log(response);

    console.log('\n=== ATTEMPTING TO PARSE ===');
    try {
        // Try to parse each line as JSON
        const lines = response.split('\n').filter(l => l.trim());
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            console.log(`\nLine ${i + 1} (length ${line.length}):`);
            console.log('First 100 chars:', line.substring(0, 100));

            try {
                const parsed = JSON.parse(line);
                console.log('✅ Valid JSON');
                if (parsed.result && parsed.result.tools) {
                    console.log(`Found ${parsed.result.tools.length} tools`);
                }
            } catch (e) {
                console.log('❌ Parse error:', e.message);
                console.log('Char at position 5:', line.charCodeAt(5), `(${line.charAt(5)})`);
                console.log('First 20 chars:', JSON.stringify(line.substring(0, 20)));
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }

    server.kill();
    process.exit(0);
}

testMCPServer().catch(console.error);
