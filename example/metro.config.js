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

config.resolver.resolveRequest = function (context, moduleName, platform) {
  // Metro does not properly support the "exports" section in package.json,
  // which OpenTelemetry uses. So, until we find a more permanent workaround,
  // we can rewrite the relevant OTel imports manually.
  //
  // Note: Newer versions of metro have an unstable_enablePackageExports,
  // which should do the trick, but doesn't currently work in this repo.

  const moduleNameRewrites = {
    '@opentelemetry/otlp-exporter-base/browser-http':
      '@opentelemetry/otlp-exporter-base/build/src/index-browser-http.js',
    '@opentelemetry/semantic-conventions/incubating':
      '@opentelemetry/semantic-conventions/build/src/index-incubating.js',
  };

  if (moduleNameRewrites[moduleName]) {
    moduleName = moduleNameRewrites[moduleName];
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
