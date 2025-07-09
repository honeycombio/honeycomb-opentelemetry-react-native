export { NavigationInstrumentation } from './NavigationInstrumentation';

import {
  type HoneycombOptions,
  HoneycombWebSDK,
} from '@honeycombio/opentelemetry-web';
import {
  FetchInstrumentation,
  type FetchInstrumentationConfig,
} from '@opentelemetry/instrumentation-fetch';
import {
  UncaughtExceptionInstrumentation,
  type UncaughtExceptionInstrumentationConfig,
} from './UncaughtExceptionInstrumentation';
import {
  resourceFromAttributes,
  type Resource,
} from '@opentelemetry/resources';
import {
  ATTR_OS_NAME,
  ATTR_OS_VERSION,
  ATTR_TELEMETRY_DISTRO_NAME,
  ATTR_TELEMETRY_DISTRO_VERSION,
  ATTR_TELEMETRY_SDK_LANGUAGE,
} from '@opentelemetry/semantic-conventions/incubating';

import { VERSION } from './version';
import { Platform } from 'react-native';
import {
  SlowEventLoopInstrumentation,
  type SlowEventLoopInstrumentationConfig,
} from './SlowEventLoopInstrumentation';

export {
  SlowEventLoopInstrumentation,
  type SlowEventLoopInstrumentationConfig,
} from './SlowEventLoopInstrumentation';

export {
  UncaughtExceptionInstrumentation,
  type UncaughtExceptionInstrumentationConfig,
} from './UncaughtExceptionInstrumentation';

/**
 * The options used to configure the Honeycomb React Native SDK.
 */
interface HoneycombReactNativeOptions extends Partial<HoneycombOptions> {
  uncaughtExceptionInstrumentationConfig?: UncaughtExceptionInstrumentationConfig;
  fetchInstrumentationConfig?: FetchInstrumentationConfig;
  slowEventLoopInstrumentationConfig?: SlowEventLoopInstrumentationConfig;
}

/**
 * The entry point to Honeycomb in React Native apps.
 */
export class HoneycombReactNativeSDK extends HoneycombWebSDK {
  constructor(options?: HoneycombReactNativeOptions) {
    const instrumentations = [...(options?.instrumentations || [])];

    if (options?.fetchInstrumentationConfig?.enabled !== false) {
      instrumentations.push(
        new FetchInstrumentation(options?.fetchInstrumentationConfig)
      );
    }

    if (options?.uncaughtExceptionInstrumentationConfig?.enabled !== false) {
      instrumentations.push(
        new UncaughtExceptionInstrumentation(
          options?.uncaughtExceptionInstrumentationConfig
        )
      );
    }

    let resource: Resource = resourceFromAttributes({
      // Honeycomb distro attributes
      'honeycomb.distro.version': VERSION,
      'honeycomb.distro.runtime_version': 'react native',

      // Opentelemetry attributes
      [ATTR_TELEMETRY_DISTRO_NAME]: '@honeycombio/opentelemetry-react-native',
      [ATTR_TELEMETRY_DISTRO_VERSION]: VERSION,
      [ATTR_TELEMETRY_SDK_LANGUAGE]: 'hermesjs',

      // OS attributes
      [ATTR_OS_NAME]: Platform.OS,
      [ATTR_OS_VERSION]: Platform.Version,
    });

    if (options?.resource) {
      resource = resource.merge(options.resource);
    }

    if (options?.slowEventLoopInstrumentationConfig?.enabled !== false) {
      instrumentations.push(
        new SlowEventLoopInstrumentation(
          options?.slowEventLoopInstrumentationConfig
        )
      );
    }

    super({
      ...options,

      // Add default instrumentations
      instrumentations,

      resource,

      // Override web options that make no sense for React Native.
      disableBrowserAttributes: true,
      webVitalsInstrumentationConfig: {
        enabled: false,
      },
      globalErrorsInstrumentationConfig: {
        enabled: false,
      },
    });
  }
}
