#!/usr/bin/env node

/**
 * Phase 2 Advanced Test - Visualize Candle Data
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const ACCOUNT_ID = 'b7320f60-ef3c-4589-a692-c6b39f76c313';

async function visualizeCandles() {
    console.log('📊 Phase 2 Advanced Test - Candle Data Visualization\n');

    const transport = new StdioClientTransport({
        command: 'node',
        args: ['src/index.js'],
    });

    const client = new Client(
        {
            name: 'candle-viz-client',
            version: '1.0.0',
        },
        {
            capabilities: {},
        }
    );

    try {
        await client.connect(transport);

        // Get 15-minute candles
        console.log('🔍 Fetching EUR/USD 15-minute candles...\n');
        const result = await client.callTool({
            name: 'get_candles',
            arguments: {
                accountId: ACCOUNT_ID,
                symbol: 'EURUSD',
                timeframe: '15m',
                limit: 20
            }
        });

        const data = JSON.parse(result.content[0].text);

        console.log('═'.repeat(80));
        console.log(`📈 ${data.symbol} - ${data.timeframe} Timeframe`);
        console.log(`📅 Candles Retrieved: ${data.count}`);
        console.log('═'.repeat(80));
        console.log();

        if (data.candles && data.candles.length > 0) {
            // Display table header
            console.log('┌─────────────────────┬─────────┬─────────┬─────────┬─────────┬────────┐');
            console.log('│ Time (UTC)          │ Open    │ High    │ Low     │ Close   │ Volume │');
            console.log('├─────────────────────┼─────────┼─────────┼─────────┼─────────┼────────┤');

            // Display candles (most recent first)
            data.candles.slice(0, 15).forEach(candle => {
                const time = new Date(candle.time).toISOString().replace('T', ' ').substring(0, 19);
                const open = candle.open.toFixed(5);
                const high = candle.high.toFixed(5);
                const low = candle.low.toFixed(5);
                const close = candle.close.toFixed(5);
                const volume = (candle.tickVolume || candle.volume || 0).toString().padStart(6);

                console.log(`│ ${time} │ ${open} │ ${high} │ ${low} │ ${close} │ ${volume} │`);
            });

            console.log('└─────────────────────┴─────────┴─────────┴─────────┴─────────┴────────┘');
            console.log();

            // Calculate statistics
            const latest = data.candles[0];
            const oldest = data.candles[data.candles.length - 1];
            const priceChange = latest.close - oldest.close;
            const priceChangePct = ((priceChange / oldest.close) * 100).toFixed(2);
            const avgVolume = data.candles.reduce((sum, c) => sum + (c.tickVolume || c.volume || 0), 0) / data.candles.length;

            console.log('📊 Statistics:');
            console.log(`   Latest Price: ${latest.close.toFixed(5)}`);
            console.log(`   Price Change: ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(5)} (${priceChangePct}%)`);
            console.log(`   Average Volume: ${avgVolume.toFixed(0)}`);
            console.log(`   High in Period: ${Math.max(...data.candles.map(c => c.high)).toFixed(5)}`);
            console.log(`   Low in Period: ${Math.min(...data.candles.map(c => c.low)).toFixed(5)}`);
            console.log();

            // Simple price chart
            console.log('📈 Price Movement (Close Prices):');
            console.log();

            const prices = data.candles.map(c => c.close).reverse().slice(0, 15);
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            const range = maxPrice - minPrice;

            // Create ASCII chart
            for (let i = 0; i < prices.length; i++) {
                const price = prices[i];
                const barLength = Math.round(((price - minPrice) / range) * 40);
                const bar = '█'.repeat(barLength);
                const time = new Date(data.candles[data.candles.length - 1 - i].time).toISOString().substring(11, 16);
                console.log(`${time} ${price.toFixed(5)} │${bar}`);
            }
        }

        console.log();
        console.log('✅ Candle visualization complete!');
        console.log();

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        process.exit(0);
    }
}

visualizeCandles().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
