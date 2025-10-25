const MetaApi = require('metaapi.cloud-sdk').default;
const api = new MetaApi('test-token');

console.log('=== MetaApi SDK Structure ===\n');
console.log('Available properties:', Object.keys(api));
console.log('\nMetatraderAccountApi methods:', 
  Object.getOwnPropertyNames(Object.getPrototypeOf(api.metatraderAccountApi))
    .filter(m => !m.startsWith('_') && m !== 'constructor')
);
