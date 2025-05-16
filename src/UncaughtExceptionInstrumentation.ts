import {
  InstrumentationAbstract,
  recordException,
} from '@honeycombio/opentelemetry-web';
import { type InstrumentationConfig } from '@opentelemetry/instrumentation';
import type { Span } from '@opentelemetry/api';
import { VERSION } from './version';

const LIBRARY_NAME = 'io.honeycomb.react-native.uncaught-exceptions';

type ApplyCustomAttributesOnSpanFunction = (span: Span, error: Error) => void;

// This is not exported by React Native so we need to decare it.
type ErrorHandlerCallback = (error: any, isFatal?: boolean) => void;

export interface UncaughtExceptionInstrumentationConfig
  extends InstrumentationConfig {
  applyCustomAttributesOnSpan?: ApplyCustomAttributesOnSpanFunction;
}

export class UncaughtExceptionInstrumentation extends InstrumentationAbstract {
  private _isEnabled: boolean;
  readonly applyCustomAttributesOnSpan?: ApplyCustomAttributesOnSpanFunction;
  private _oldErrorHandler?: ErrorHandlerCallback;
  constructor({
    enabled = true,
    applyCustomAttributesOnSpan,
  }: UncaughtExceptionInstrumentationConfig = {}) {
    const config: UncaughtExceptionInstrumentationConfig = {
      enabled,
      applyCustomAttributesOnSpan,
    };

    super(LIBRARY_NAME, VERSION, config);

    if (enabled) {
      this.enable();
    }

    this._isEnabled = enabled;
    this.applyCustomAttributesOnSpan = applyCustomAttributesOnSpan;
  }

  onError = (caughtError: any, isFatal?: boolean) => {
    const error: Error = caughtError;

    if (error) {
      recordException(error, {}, this.tracer, this.applyCustomAttributesOnSpan);
    }

    if (this._oldErrorHandler) {
      return this._oldErrorHandler(caughtError, isFatal);
    }
  };

  init() {}

  enable(): void {
    if (this._isEnabled) {
      this._diag.debug(`Instrumentation already enabled`);
    }

    this._isEnabled = true;
    this._oldErrorHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler(this.onError);
  }

  disable(): void {
    if (!this._isEnabled) {
      this._diag.debug(`Instrumentation already disabled`);
    }

    this._isEnabled = false;
    if (this._oldErrorHandler) {
      ErrorUtils.setGlobalHandler(this._oldErrorHandler);
    }
  }

  public isEnabled() {
    return this._isEnabled;
  }
}
