const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getConfig(getDefaultConfig(__dirname), {
  root,
  pkg,
  project: __dirname,
});

// Needed so that we can make use of @opentelemetry package.json "exports" field
// See: https://reactnative.dev/blog/2023/06/21/package-exports-support
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
