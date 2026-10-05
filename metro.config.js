// Metro config. Only needed for the web target (the dev harness / browser
// checks); native builds use expo-sqlite's native module and ignore this.
//
// expo-sqlite on web runs SQLite as WebAssembly (wa-sqlite) in a worker:
//  - Metro must treat .wasm as an asset, or the worker's
//    `import './wa-sqlite/wa-sqlite.wasm'` fails to resolve.
//  - The worker needs SharedArrayBuffer, which browsers only allow on a
//    cross-origin-isolated page, hence the COOP / COEP headers on the dev server.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  middleware(req, res, next);
};

module.exports = config;
