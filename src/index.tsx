export { default as useNavigationInstrumentation } from './useNavigationInstrumentation';
import HoneycombOpentelemetryReactNative from './NativeHoneycombOpentelemetryReactNative';

import {
  type HoneycombOptions,
  HoneycombWebSDK,
} from '@honeycombio/opentelemetry-web';

export {
  UncaughtExceptionInstrumentation,
  type UncaughtExceptionInstrumentationConfig,
} from './UncaughtExceptionInstrumentation';

// This function is an example of how to proxy native code.
// TODO: Remove this, once we have other native code.
export function multiply(a: number, b: number): number {
  return HoneycombOpentelemetryReactNative.multiply(a, b);
}

/**
 * The options used to configure the Honeycomb React Native SDK.
 */
interface HoneycombReactNativeOptions extends Partial<HoneycombOptions> {}

/**
 * The entry point to Honeycomb in React Native apps.
 */
export class HoneycombReactNativeSDK extends HoneycombWebSDK {
  constructor(options?: HoneycombReactNativeOptions) {
    super({
      ...options,

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
