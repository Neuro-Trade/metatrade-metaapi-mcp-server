/**
 * Map MetaAPI errors to user-friendly messages
 * @param {Error} error - The error object from MetaAPI
 * @returns {Object} Formatted error object with code
 */
export function mapError(error) {
    const message = error.message || String(error);

    if (message.includes('market is closed')) {
        return { error: 'Market is closed', code: 'MARKET_CLOSED' };
    }
    if (message.includes('trade context busy')) {
        return { error: 'Trade context is busy, please retry', code: 'TRADE_CONTEXT_BUSY' };
    }
    if (message.includes('not enough money')) {
        return { error: 'Insufficient funds', code: 'INSUFFICIENT_FUNDS' };
    }
    if (message.includes('invalid stops')) {
        return { error: 'Invalid stop loss or take profit levels', code: 'INVALID_STOPS' };
    }

    return { error: message, code: 'UNKNOWN_ERROR' };
}

/**
 * Generate a unique client order ID
 * @param {string} symbol - Trading symbol
 * @param {string} side - Order side (buy/sell)
 * @returns {string} Unique client order ID
 */
export function generateClientOrderId(symbol, side) {
    const timestamp = Date.now();
    return `${symbol}_${side}_${timestamp}`;
}
