import { trace, type Attributes } from '@opentelemetry/api';

import HoneycombOpentelemetryReactNative from './NativeHoneycombOpentelemetryReactNative';

const LIBRARY_NAME = '@honeycombio/time-to-interactive';

let recorded = false;

/**
 * Records one `time to interactive` span for this JavaScript runtime.
 * The span starts when the native app started and ends at this call.
 * Later calls do nothing, so every entry screen can call it and only the
 * first ready screen is measured.
 * `react native startup` ends earlier, when the SDK finishes starting.
 */
export function markInteractive(attributes?: Attributes): void {
  if (recorded) {
    return;
  }
  try {
    const startTime = HoneycombOpentelemetryReactNative.getAppStartTime();
    const span = trace
      .getTracer(LIBRARY_NAME)
      .startSpan('time to interactive', {
        startTime,
        attributes,
      });
    span.end();
    recorded = true;
  } catch {
    // A missing native module must not block the screen. A later call can retry.
  }
}

/** Test helper. Not exported from the package entry. */
export function resetTimeToInteractiveForTests(): void {
  recorded = false;
}
