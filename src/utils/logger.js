/**
 * Logger utility for MCP server
 * Outputs to stderr as required by MCP specification
 */

export const logger = {
    info: (...args) => console.error('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    warn: (...args) => console.error('[WARN]', ...args),
    debug: (...args) => console.error('[DEBUG]', ...args),
};
