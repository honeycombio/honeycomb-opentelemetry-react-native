import {
  InstrumentationBase,
  type InstrumentationConfig,
} from '@opentelemetry/instrumentation';
import { VERSION } from './version';
import type { Span } from '@opentelemetry/api';
import {
  AppState,
  type AppStateStatus,
  type NativeEventSubscription,
} from 'react-native';

const LIBRARY_NAME = '@honeycombio/slow-event-loop';

const DEFAULT_LOOP_SAMPLE_INTERVAL_MS = 50;
const DEFAULT_STALL_THRESHOLD_MS = 50;

interface SlowEventLoopInfo {
  delayMs: number;
  timestampMs: number;
}

type ApplyCustomAttributesOnSpanFunction = (
  span: Span,
  slowEventLoopInfo: SlowEventLoopInfo
) => void;

export interface SlowEventLoopInstrumentationConfig
  extends InstrumentationConfig {
  loopSampleIntervalMs?: number;
  stallThresholdMs?: number;
  applyCustomAttributesOnSpan?: ApplyCustomAttributesOnSpanFunction;
}

export class SlowEventLoopInstrumentation extends InstrumentationBase {
  private _isEnabled: boolean;
  readonly applyCustomAttributesOnSpan?: ApplyCustomAttributesOnSpanFunction;

  private _lastLoopTimestamp: number = 0;

  private _loopSampleIntervalMs: number;
  private _stallThresholdMs: number;
  private _intervalRef: ReturnType<typeof setInterval> | null = null;
  private _appStateRef: NativeEventSubscription | null = null;

  private _isAppSuspended: boolean;

  constructor({
    enabled = true,
    loopSampleIntervalMs = DEFAULT_LOOP_SAMPLE_INTERVAL_MS,
    stallThresholdMs = DEFAULT_STALL_THRESHOLD_MS,
    applyCustomAttributesOnSpan,
  }: SlowEventLoopInstrumentationConfig = {}) {
    const config: SlowEventLoopInstrumentationConfig = {
      enabled,
      applyCustomAttributesOnSpan,
    };

    super(LIBRARY_NAME, VERSION, config);

    this._loopSampleIntervalMs = loopSampleIntervalMs;
    this._stallThresholdMs = stallThresholdMs;
    this._isAppSuspended = false;

    if (enabled) {
      this.enable();
    }

    this._isEnabled = enabled;
    this.applyCustomAttributesOnSpan = applyCustomAttributesOnSpan;
  }

  enable(): void {
    if (this._isEnabled) {
      this._diag.debug('Instrumentation already enabled');
    }
    if (AppState?.isAvailable) {
      this._appStateRef = AppState.addEventListener(
        'change',
        this._suspendResumeHandler.bind(this)
      );
    }

    this._lastLoopTimestamp = Date.now();

    this._isEnabled = true;

    this._intervalRef = setInterval(
      this._checkEventLoop.bind(this),
      this._loopSampleIntervalMs
    );
  }
  disable(): void {
    if (!this._isEnabled) {
      this._diag.debug('Instrumentation already disabled');
    }

    if (this._intervalRef !== null) {
      clearInterval(this._intervalRef);
    }

    if (this._appStateRef !== null) {
      this._appStateRef?.remove();
    }
  }

  protected init(): void {}

  private _checkEventLoop(): void {
    const nowTimestamp = Date.now();

    const intervalSinceLastCheck = nowTimestamp - this._lastLoopTimestamp;

    if (
      intervalSinceLastCheck >=
      this._loopSampleIntervalMs + this._stallThresholdMs
    ) {
      this._emitSlowEventLoopSpan({
        delayMs: intervalSinceLastCheck,
        timestampMs: this._lastLoopTimestamp,
      });
    }

    this._lastLoopTimestamp = nowTimestamp;

    if (!this._isEnabled || this._isAppSuspended) {
      if (this._intervalRef) {
        clearInterval(this._intervalRef);
      }
    }
  }

  private _emitSlowEventLoopSpan({
    delayMs,
    timestampMs,
  }: SlowEventLoopInfo): void {
    const slowEventLoopSpan = this.tracer.startSpan('slow event loop', {
      startTime: timestampMs,
    });

    // hermes is not listed in the JS semantic conventions so we
    // are going to use the `hermes` namespace and the node/web/v8 naming convention
    slowEventLoopSpan.setAttribute('hermes.eventloop.delay', delayMs);

    if (this.applyCustomAttributesOnSpan) {
      this.applyCustomAttributesOnSpan(slowEventLoopSpan, {
        delayMs,
        timestampMs,
      });
    }

    slowEventLoopSpan.end(timestampMs + delayMs);
  }

  private _suspendResumeHandler(appState: AppStateStatus): void {
    if (appState === 'active') {
      this._isAppSuspended = false;

      if (this._isEnabled && this._intervalRef === null) {
        this._lastLoopTimestamp = Date.now();

        this._intervalRef = setInterval(
          this._checkEventLoop.bind(this),
          this._loopSampleIntervalMs
        );
      }
    } else {
      this._isAppSuspended = true;
      if (this._intervalRef !== null) {
        clearInterval(this._intervalRef);
      }
    }
  }
}
