import { type TracerProvider } from '@opentelemetry/api';
import HoneycombOpentelemetryReactNative from './NativeHoneycombOpentelemetryReactNative';
import { InstrumentationBase } from '@opentelemetry/instrumentation';
import { VERSION } from './version';
import type { InstrumentationConfig } from '@opentelemetry/instrumentation';

const LIBRARY_NAME = '@honeycombio/app-startup';

export interface ReactNativeStartupInstrumentationConfig
  extends InstrumentationConfig {}

/**
 * Emit a span with the total time from when the app was started to when this was called.
 */
export class ReactNativeStartupInstrumentation extends InstrumentationBase {
  private _isEnabled: boolean;

  constructor({
    enabled = true,
  }: ReactNativeStartupInstrumentationConfig = {}) {
    const config: ReactNativeStartupInstrumentationConfig = {
      enabled,
    };
    super(LIBRARY_NAME, VERSION, config);
    this._isEnabled = enabled;
  }

  enable(): void {
    if (this._isEnabled) {
      this._diag.debug('Instrumentation already enabled');
    }
    this._isEnabled = true;
  }

  disable(): void {
    if (!this._isEnabled) {
      this._diag.debug('Instrumentation already disabled');
    }
    this._isEnabled = false;
  }

  protected init(): void {}

  /**
   * Sets TracerProvider to this plugin
   * @param tracerProvider
   */
  public setTracerProvider(tracerProvider: TracerProvider): void {
    super.setTracerProvider(tracerProvider);
    if (this._isEnabled) {
      this.sendAppStartTrace();
    }
  }

  sendAppStartTrace(): void {
    let startTime = HoneycombOpentelemetryReactNative.getAppStartTime();
    this.tracer.startSpan('react native startup', { startTime }).end();
  }
}
