import { recordException } from '@honeycombio/opentelemetry-web';
import {
  Component,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from 'react';

import { normalizeCaughtError } from './caughtError';

export type HoneycombErrorBoundaryFallbackProps = {
  /** The value the subtree threw. Usually an Error. */
  error: unknown;
  /** Clears the caught error and renders the children again. */
  resetError: () => void;
};

export type HoneycombErrorBoundaryProps = {
  children: ReactNode;
  /**
   * Shown after a render error. A function receives the error and `resetError`.
   * An element is shown as-is. `null` shows nothing.
   */
  fallback:
    | ReactElement
    | null
    | ((props: HoneycombErrorBoundaryFallbackProps) => ReactNode);
};

type State = {
  hasError: boolean;
  error: unknown;
};

/**
 * Catches errors thrown while React is rendering. Those errors never reach the
 * global handler, so this boundary records them as an `exception` span and
 * shows `fallback` instead of a blank screen.
 */
export class HoneycombErrorBoundary extends Component<
  HoneycombErrorBoundaryProps,
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo): void {
    const componentStack = errorInfo.componentStack?.trim();
    try {
      recordException(normalizeCaughtError(error), {
        'exception.source': 'react.render',
        ...(componentStack
          ? { 'exception.component_stack': componentStack }
          : {}),
      });
    } catch {
      // Reporting must not replace the fallback with a second crash.
    }
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { fallback } = this.props;
    if (typeof fallback === 'function') {
      return fallback({
        error: this.state.error,
        resetError: this.resetError,
      });
    }
    return fallback;
  }
}
