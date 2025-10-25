const MetaApi = require('metaapi.cloud-sdk').default;
const token = process.env.METAAPI_TOKEN || process.env.TOKEN;
const api = new MetaApi(token);

async function inspectAccounts() {
    try {
        console.log('Fetching accounts with classic pagination...');
        const result = await api.metatraderAccountApi.getAccountsWithClassicPagination();
        console.log('\nType:', typeof result);
        console.log('Is Array:', Array.isArray(result));
        console.log('Keys:', Object.keys(result));
        console.log('\nFull result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

inspectAccounts();
