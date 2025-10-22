import HoneycombOpentelemetryReactNative from './NativeHoneycombOpentelemetryReactNative';
import {
  type HoneycombOptions,
  HoneycombWebSDK,
} from '@honeycombio/opentelemetry-web';
import {
  FetchInstrumentation,
  type FetchInstrumentationConfig,
} from '@opentelemetry/instrumentation-fetch';
import {
  ReactNativeStartupInstrumentation,
  type ReactNativeStartupInstrumentationConfig,
} from './ReactNativeStartupInstrumentation';
import {
  UncaughtExceptionInstrumentation,
  type UncaughtExceptionInstrumentationConfig,
} from './UncaughtExceptionInstrumentation';
import {
  resourceFromAttributes,
  type DetectedResourceAttributes,
  type Resource,
} from '@opentelemetry/resources';
import { RandomIdGenerator } from '@opentelemetry/sdk-trace-base';
import {
  ATTR_OS_NAME,
  ATTR_OS_VERSION,
  ATTR_TELEMETRY_DISTRO_NAME,
  ATTR_TELEMETRY_DISTRO_VERSION,
  ATTR_TELEMETRY_SDK_LANGUAGE,
  ATTR_TELEMETRY_SDK_NAME,
  ATTR_TELEMETRY_SDK_VERSION,
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
} from '@opentelemetry/semantic-conventions/incubating';
import { VERSION } from './version';
import {
  SlowEventLoopInstrumentation,
  type SlowEventLoopInstrumentationConfig,
} from './SlowEventLoopInstrumentation';
import { type SessionProvider } from '@opentelemetry/web-common';

export { NavigationInstrumentation } from './NavigationInstrumentation';
export { ReactNativeStartupInstrumentation } from './ReactNativeStartupInstrumentation';
export {
  SlowEventLoopInstrumentation,
  type SlowEventLoopInstrumentationConfig,
} from './SlowEventLoopInstrumentation';
export {
  UncaughtExceptionInstrumentation,
  type UncaughtExceptionInstrumentationConfig,
} from './UncaughtExceptionInstrumentation';

import { Platform, type PlatformOSType } from 'react-native';

const generator = new RandomIdGenerator();
const defaultSessionId = generator.generateTraceId();

// By default, we include a SessionIdProvider that uses the native session ID,
// if possible. Otherwise, it falls back with a reasonable default.
class SessionIdProvider implements SessionProvider {
  getSessionId(): string | null {
    const nativeSessionId = HoneycombOpentelemetryReactNative.getSessionId();
    if (nativeSessionId) {
      return nativeSessionId;
    }
    return defaultSessionId;
  }
}

/**
 * The options used to configure the Honeycomb React Native SDK.
 */
interface HoneycombReactNativeOptions extends Partial<HoneycombOptions> {
  reactNativeStartupInstrumentationConfig?: ReactNativeStartupInstrumentationConfig;
  uncaughtExceptionInstrumentationConfig?: UncaughtExceptionInstrumentationConfig;
  fetchInstrumentationConfig?: FetchInstrumentationConfig;
  slowEventLoopInstrumentationConfig?: SlowEventLoopInstrumentationConfig;
}

const reactNativeOSTypeToOtelOSName: Record<PlatformOSType, string> = {
  ios: 'iOS',
  android: 'Android',
  macos: 'macOS',
  native: 'Native',
  web: 'Web',
  windows: 'windows',
} as const;

function getOSName(): string {
  return reactNativeOSTypeToOtelOSName[Platform.OS];
}

/**
 * The entry point to Honeycomb in React Native apps.
 */
export class HoneycombReactNativeSDK extends HoneycombWebSDK {
  constructor(options?: HoneycombReactNativeOptions) {
    const instrumentations = [...(options?.instrumentations || [])];

    if (options?.reactNativeStartupInstrumentationConfig?.enabled !== false) {
      instrumentations.push(
        new ReactNativeStartupInstrumentation(
          options?.reactNativeStartupInstrumentationConfig
        )
      );
    }

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

    const { major, minor, patch, prerelease } =
      Platform.constants.reactNativeVersion;
    let reactNativeVersion = `${major}.${minor}.${patch}`;
    if (prerelease) {
      reactNativeVersion = `${reactNativeVersion}-${[prerelease]}`;
    }

    // If the native SDKs are not initialized, fall back the the RN furnished values
    const nativeAttributes = HoneycombOpentelemetryReactNative.getResource();
    if (!nativeAttributes[ATTR_OS_NAME]) {
      nativeAttributes[ATTR_OS_NAME] = getOSName();
    }
    if (!nativeAttributes[ATTR_OS_VERSION]) {
      nativeAttributes[ATTR_OS_VERSION] = Platform.Version;
    }

    const attributes: DetectedResourceAttributes = {
      ...nativeAttributes,

      // Honeycomb distro attributes,
      'honeycomb.distro.version': VERSION,
      'honeycomb.distro.runtime_version': reactNativeVersion,

      // Opentelemetry attributes
      [ATTR_TELEMETRY_DISTRO_NAME]: '@honeycombio/opentelemetry-react-native',
      [ATTR_TELEMETRY_DISTRO_VERSION]: VERSION,
      [ATTR_TELEMETRY_SDK_LANGUAGE]: 'hermesjs',
      [ATTR_TELEMETRY_SDK_NAME]: 'opentelemetry',
      [ATTR_TELEMETRY_SDK_VERSION]: VERSION,

      // React Native enviornment
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: __DEV__
        ? 'development'
        : 'production',
    };
    const sourceMapUuid =
      HoneycombOpentelemetryReactNative.getDebugSourceMapUUID();
    if (sourceMapUuid) {
      attributes['app.debug.source_map_uuid'] = sourceMapUuid;
    }
    let resource: Resource = resourceFromAttributes(attributes);

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
      sessionProvider: new SessionIdProvider(),
      webVitalsInstrumentationConfig: {
        enabled: false,
      },
      globalErrorsInstrumentationConfig: {
        enabled: false,
      },
    });
  }
}
