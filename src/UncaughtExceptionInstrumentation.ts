import { InstrumentationAbstract } from '@honeycombio/opentelemetry-web';
import { type InstrumentationConfig } from '@opentelemetry/instrumentation';
import type { Span } from '@opentelemetry/api';
import { VERSION } from './version';

const LIBRARY_NAME = 'io.honeycomb.react-native.uncaught-exceptions';

type ApplyCustomAttributesOnSpanFunction = (span: Span, error: Error) => void;

export interface UncaughtExceptionInstrumentationConfig
  extends InstrumentationConfig {
  applyCustomAttributesOnSpan?: ApplyCustomAttributesOnSpanFunction;
}

export class UncaughtExceptionInstrumentation extends InstrumentationAbstract {
  //private _isEnabled: boolean;
  readonly applyCustomAttributesOnSpan?: ApplyCustomAttributesOnSpanFunction;
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

    //this._isEnabled = enabled;
    this.applyCustomAttributesOnSpan = applyCustomAttributesOnSpan;
  }

  enable(): void {
    throw new Error('Method not implemented.');
  }
  disable(): void {}
  protected init(): void {
    throw new Error('Method not implemented.');
  }
}
