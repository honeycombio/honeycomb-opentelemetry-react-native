import { InstrumentationAbstract } from '@honeycombio/opentelemetry-web';
import type { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { VERSION } from './version';

const LIBRARY_NAME = '@honeycombio/stuck-event-loop';

export interface StuckEventLoopInstrumentationConfig
  extends InstrumentationConfig {}

export class StuckEventLoopInstrumentation extends InstrumentationAbstract {
  private _isEnabled: boolean;

  constructor({ enabled = true }: StuckEventLoopInstrumentationConfig = {}) {
    const config: StuckEventLoopInstrumentationConfig = {
      enabled,
    };

    super(LIBRARY_NAME, VERSION, config);

    if (enabled) {
      this.enable();
    }

    this._isEnabled = enabled;
  }

  enable(): void {
    if (this._isEnabled) {
      this._diag.debug('Instrumentation already enabled');

      // TODO: enable the rest of the owl
    }
  }
  disable(): void {
    if (!this._isEnabled) {
      this._diag.debug('Instrumentation already disabled');
    }

    // TODO: disable the rest of the owl.
  }
  protected init(): void {}
}
