#!/usr/bin/env node

/**
 * Tool Coverage Check
 * Verifies that all tool definitions have corresponding handlers
 */

import { readFileSync } from 'fs';

const indexFile = readFileSync('./src/index.js', 'utf-8');

// Extract tool definitions from ListToolsRequestSchema
const toolsSection = indexFile.match(/server\.setRequestHandler\(ListToolsRequestSchema, async \(\) => \{([\s\S]*?)\]\);/);
if (!toolsSection) {
    console.error('❌ Could not find tool definitions section');
    process.exit(1);
}

// Extract all tool names from definitions
const toolDefinitions = [];
const nameMatches = toolsSection[0].matchAll(/name: '([^']+)',/g);
for (const match of nameMatches) {
    toolDefinitions.push(match[1]);
}

console.log('📋 TOOL DEFINITIONS FOUND:', toolDefinitions.length);
console.log('─'.repeat(60));
toolDefinitions.forEach((name, i) => console.log(`${i + 1}. ${name}`));

// Extract tool handlers from CallToolRequestSchema
const handlersSection = indexFile.match(/server\.setRequestHandler\(CallToolRequestSchema, async \(request\) => \{([\s\S]*?)^}\);/m);
if (!handlersSection) {
    console.error('❌ Could not find tool handlers section');
    process.exit(1);
}

// Extract all case statements
const toolHandlers = [];
const caseMatches = handlersSection[0].matchAll(/case '([^']+)':/g);
for (const match of caseMatches) {
    toolHandlers.push(match[1]);
}

console.log('\n🔧 TOOL HANDLERS FOUND:', toolHandlers.length);
console.log('─'.repeat(60));
toolHandlers.forEach((name, i) => console.log(`${i + 1}. ${name}`));

// Find missing handlers
console.log('\n🔍 COVERAGE ANALYSIS');
console.log('═'.repeat(60));

const missingHandlers = toolDefinitions.filter(tool => !toolHandlers.includes(tool));
const extraHandlers = toolHandlers.filter(handler => !toolDefinitions.includes(handler));

if (missingHandlers.length === 0 && extraHandlers.length === 0) {
    console.log('✅ PERFECT COVERAGE! All tools have handlers.');
} else {
    if (missingHandlers.length > 0) {
        console.log('\n❌ TOOLS WITHOUT HANDLERS:');
        missingHandlers.forEach(tool => console.log(`   - ${tool}`));
    }

    if (extraHandlers.length > 0) {
        console.log('\n⚠️  HANDLERS WITHOUT DEFINITIONS:');
        extraHandlers.forEach(handler => console.log(`   - ${handler}`));
    }
}

// Check for duplicate get_server_time
const serverTimeCount = toolDefinitions.filter(t => t === 'get_server_time').length;
if (serverTimeCount > 1) {
    console.log(`\n⚠️  WARNING: 'get_server_time' is defined ${serverTimeCount} times!`);
}

console.log('\n═'.repeat(60));
console.log('SUMMARY:');
console.log(`  Definitions: ${toolDefinitions.length}`);
console.log(`  Handlers: ${toolHandlers.length}`);
console.log(`  Missing Handlers: ${missingHandlers.length}`);
console.log(`  Extra Handlers: ${extraHandlers.length}`);
console.log('═'.repeat(60));

// Exit with error if there are issues
if (missingHandlers.length > 0 || extraHandlers.length > 0) {
    process.exit(1);
}
