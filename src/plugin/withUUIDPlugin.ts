import type { ConfigPlugin } from '@expo/config-plugins';

import fs from 'node:fs';
import withAndroidPlugin from './withUUIDAndroidPlugin';
import withIOSPlugin from './withUUIDIosPlugin';

const withPlugin: ConfigPlugin = (config) => {
  const sourceMapUuid = crypto.randomUUID();
  // Apply Android modifications first
  config = withAndroidPlugin(config, { sourceMapUuid });
  // Then apply iOS modifications and return
  const resultConfig = withIOSPlugin(config, { sourceMapUuid });

  if (!fs.existsSync('./dist/tmp/hny')) {
    fs.mkdirSync('./dist/tmp/hny', { recursive: true });
  }
  fs.writeFileSync('./dist/tmp/hny/SourceMapUuid.txt', sourceMapUuid);

  return resultConfig;
};

export default withPlugin;
