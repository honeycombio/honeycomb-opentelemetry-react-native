import { type TracerProvider } from '@opentelemetry/api';
import HoneycombOpentelemetryReactNative from './NativeHoneycombOpentelemetryReactNative';
import { InstrumentationAbstract } from '@honeycombio/opentelemetry-web';
import { VERSION } from './version';
import type { InstrumentationConfig } from '@opentelemetry/instrumentation';

const LIBRARY_NAME = '@honeycombio/app-startup';

export interface AppStartupInstrumentationConfig
  extends InstrumentationConfig {}

/**
 * Emit a span with the total time from when the app was started to when this was called.
 */
export class AppStartupInstrumentation extends InstrumentationAbstract {
  private _isEnabled: boolean;

  constructor({ enabled = true }: AppStartupInstrumentationConfig = {}) {
    const config: AppStartupInstrumentationConfig = {
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
    console.error("setTracerProvider called on AppStartupInstrumentation");
    this._diag.debug('setTracerProvider called on AppStartupInstrumentation');
    super.setTracerProvider(tracerProvider);
    if (this._isEnabled) {
        this.sendAppStartTrace();
    }
  }

  sendAppStartTrace(): void {
    console.error("the AppStartInstrumentation is being initialized!");

    let startTimeSeconds = HoneycombOpentelemetryReactNative.getAppStartTime();
    // JavaScript's Date type has millisecond granularity.
    let startTime = startTimeSeconds * 1000;

    this.tracer.startSpan('app start', { startTime }).end();
  }
}
