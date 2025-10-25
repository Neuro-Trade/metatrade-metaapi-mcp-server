import { logger } from './logger.js';

// Connection cache to reuse RPC connections
const connectionCache = new Map();

/**
 * Get or create a cached RPC connection for an account
 * @param {string} accountId - MetaAPI account ID
 * @param {Object} metaApi - MetaAPI client instance
 * @returns {Promise<{account: Object, connection: Object}>}
 */
export async function getConnection(accountId, metaApi) {
    if (connectionCache.has(accountId)) {
        return connectionCache.get(accountId);
    }

    try {
        const account = await metaApi.metatraderAccountApi.getAccount(accountId);

        // Check if account is deployed
        const deployedStates = ['DEPLOYING', 'DEPLOYED'];
        if (!deployedStates.includes(account.state)) {
            logger.info(`Account ${accountId} not deployed, deploying now...`);
            await account.deploy();
        }

        logger.info(`Waiting for account ${accountId} to connect...`);
        await account.waitConnected();

        const connection = account.getRPCConnection();
        await connection.connect();

        logger.info(`Waiting for account ${accountId} to synchronize...`);
        await connection.waitSynchronized();

        connectionCache.set(accountId, { account, connection });
        return { account, connection };
    } catch (error) {
        logger.error(`Failed to get connection for account ${accountId}:`, error.message);
        throw error;
    }
}

/**
 * Clear a connection from the cache
 * @param {string} accountId - MetaAPI account ID
 */
export function clearConnection(accountId) {
    connectionCache.delete(accountId);
}

/**
 * Clear all cached connections
 */
export function clearAllConnections() {
    connectionCache.clear();
}
