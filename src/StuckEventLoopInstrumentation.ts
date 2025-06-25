import { InstrumentationAbstract } from '@honeycombio/opentelemetry-web';
import type { InstrumentationConfig } from '@opentelemetry/instrumentation';
import { VERSION } from './version';
import {
  AppState,
  type AppStateStatus,
  type NativeEventSubscription,
} from 'react-native';

const LIBRARY_NAME = '@honeycombio/stuck-event-loop';

const DEFAULT_LOOP_SAMPLE_INTERVAL_MS = 50;
const DEFAULT_STALL_THRESHOLD_MS = 50;

export interface StuckEventLoopInstrumentationConfig
  extends InstrumentationConfig {
  loopSampleIntervalMs?: number;
  stallThresholdMs?: number;
}

export class StuckEventLoopInstrumentation extends InstrumentationAbstract {
  private _isEnabled: boolean;

  private _lastLoopTimestamp: number = 0;

  private _loopSampleIntervalMs: number;
  private _stallThresholdMs: number;
  private _timeoutRef: ReturnType<typeof setTimeout> | null = null;
  private _appStateRef: NativeEventSubscription | null = null;

  private _isAppSuspended: boolean;

  constructor({
    enabled = true,
    loopSampleIntervalMs = DEFAULT_LOOP_SAMPLE_INTERVAL_MS,
    stallThresholdMs = DEFAULT_STALL_THRESHOLD_MS,
  }: StuckEventLoopInstrumentationConfig = {}) {
    const config: StuckEventLoopInstrumentationConfig = {
      enabled,
    };

    super(LIBRARY_NAME, VERSION, config);

    this._loopSampleIntervalMs = loopSampleIntervalMs;
    this._stallThresholdMs = stallThresholdMs;
    this._isAppSuspended = false;

    if (enabled) {
      this.enable();
    }

    this._isEnabled = enabled;
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

    this._checkEventLoop();
  }
  disable(): void {
    if (!this._isEnabled) {
      this._diag.debug('Instrumentation already disabled');
    }

    if (this._timeoutRef !== null) {
      clearTimeout(this._timeoutRef);
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
      this._emitSlowEventLoopSpan(intervalSinceLastCheck, nowTimestamp);
    }

    this._lastLoopTimestamp = nowTimestamp;

    if (this._isEnabled && !this._isAppSuspended) {
      this._timeoutRef = setTimeout(
        this._checkEventLoop.bind(this),
        this._loopSampleIntervalMs
      );
    }
  }

  private _emitSlowEventLoopSpan(
    _loopDelayMs: number,
    _timestampMs: number
  ): void {
    //TODO: emit the owl span
  }

  private _suspendResumeHandler(appState: AppStateStatus): void {
    if (appState === 'active') {
      this._isAppSuspended = false;

      if (this._isEnabled && this._timeoutRef !== null) {
        this._lastLoopTimestamp = Date.now();

        this._checkEventLoop();
      }
    } else {
      this._isAppSuspended = true;
      if (this._timeoutRef !== null) {
        clearTimeout(this._timeoutRef);
      }
    }
  }
}
