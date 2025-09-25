import type { ConfigPlugin } from '@expo/config-plugins';
import { withAndroidManifest } from '@expo/config-plugins';

interface AndroidPluginOptions {
  sourceMapUuid: string;
}

const withAndroidPlugin: ConfigPlugin<AndroidPluginOptions> = (
  config,
  options
) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config?.modResults?.manifest?.application?.[0];

    if (mainApplication) {
      // Ensure meta-data array exists
      if (!mainApplication['meta-data']) {
        mainApplication['meta-data'] = [];
      }

      // Remove any existing entry with the same name
      mainApplication['meta-data'] = mainApplication['meta-data'].filter(
        (entry) => entry.$['android:name'] !== 'app.debug.source_map_uuid'
      );

      // Add the custom message as a meta-data entry
      mainApplication['meta-data'].push({
        $: {
          'android:name': 'app.debug.source_map_uuid',
          'android:value': options.sourceMapUuid,
        },
      });
    }

    return config;
  });
};

export default withAndroidPlugin;
