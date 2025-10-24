import type { ConfigPlugin } from '@expo/config-plugins';

import withAndroidPlugin from './withUUIDAndroidPlugin';
import withIOSPlugin from './withUUIDIosPlugin';

const withPlugin: ConfigPlugin = (config) => {
  const sourceMapUuid = crypto.randomUUID();
  // Apply Android modifications first
  config = withAndroidPlugin(config, { sourceMapUuid });
  // Then apply iOS modifications and return
  config = withIOSPlugin(config, { sourceMapUuid });

  return config;
};

export default withPlugin;
