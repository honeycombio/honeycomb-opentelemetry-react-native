import type { ConfigPlugin } from '@expo/config-plugins';
import { withInfoPlist } from '@expo/config-plugins';

interface IOSPluginOptions {
  sourceMapUuid: string;
}

const withIOSPlugin: ConfigPlugin<IOSPluginOptions> = (config, options) => {
  return withInfoPlist(config, (config) => {
    config.modResults.appDebugSourceMapUUID = options.sourceMapUuid;
    return config;
  });
};

export default withIOSPlugin;
