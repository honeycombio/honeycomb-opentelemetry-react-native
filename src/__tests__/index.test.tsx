import { recordException } from '@honeycombio/opentelemetry-web';
import { trace } from '@opentelemetry/api';
import { createElement } from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { HoneycombErrorBoundary } from '../HoneycombErrorBoundary';
import HoneycombOpentelemetryReactNative from '../NativeHoneycombOpentelemetryReactNative';
import {
  markInteractive,
  resetTimeToInteractiveForTests,
} from '../timeToInteractive';
import { useMarkInteractive } from '../useMarkInteractive';

jest.mock('@opentelemetry/api', () => {
  const startSpan = jest.fn(() => ({ end: jest.fn() }));
  return {
    trace: {
      getTracer: () => ({ startSpan }),
    },
  };
});

jest.mock('../NativeHoneycombOpentelemetryReactNative', () => ({
  __esModule: true,
  default: {
    getAppStartTime: jest.fn(() => 1_700_000_000_000),
  },
}));

jest.mock('@honeycombio/opentelemetry-web', () => ({
  recordException: jest.fn(),
}));

const mockStartSpan = trace.getTracer('test').startSpan as jest.Mock;

function ReadyProbe({ ready }: { ready: boolean }) {
  useMarkInteractive(ready);
  return null;
}

describe('time to interactive', () => {
  beforeEach(() => {
    mockStartSpan.mockClear();
    resetTimeToInteractiveForTests();
  });

  it('records one span from native app start', () => {
    markInteractive({ 'screen.route': 'feed' });
    markInteractive();

    expect(mockStartSpan).toHaveBeenCalledTimes(1);
    expect(mockStartSpan).toHaveBeenCalledWith('time to interactive', {
      startTime: 1_700_000_000_000,
      attributes: { 'screen.route': 'feed' },
    });
    expect(
      HoneycombOpentelemetryReactNative.getAppStartTime
    ).toHaveBeenCalledTimes(1);
  });

  it('waits until the screen is ready', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<ReadyProbe ready={false} />);
    });
    expect(mockStartSpan).not.toHaveBeenCalled();

    act(() => {
      renderer!.update(<ReadyProbe ready />);
    });
    act(() => {
      renderer!.update(<ReadyProbe ready />);
    });

    expect(mockStartSpan).toHaveBeenCalledTimes(1);
  });
});

function Boom() {
  throw new Error('render failed');
}

describe('HoneycombErrorBoundary', () => {
  beforeEach(() => {
    jest.mocked(recordException).mockClear();
  });

  it('records a render error and shows the fallback', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    let resetError = () => {};
    let renderer: TestRenderer.ReactTestRenderer;

    act(() => {
      renderer = TestRenderer.create(
        <HoneycombErrorBoundary
          fallback={(props) => {
            resetError = props.resetError;
            return createElement('Text', null, 'Try again');
          }}
        >
          <Boom />
        </HoneycombErrorBoundary>
      );
    });

    expect(recordException).toHaveBeenCalledTimes(1);
    const reported = jest.mocked(recordException).mock.calls[0]?.[0];
    expect(reported).toMatchObject({ message: 'render failed' });
    expect(jest.mocked(recordException).mock.calls[0]?.[1]).toMatchObject({
      'exception.source': 'react.render',
    });
    expect(renderer!.toJSON()).toMatchObject({
      type: 'Text',
      children: ['Try again'],
    });

    function Healthy() {
      return createElement('Text', null, 'Back');
    }

    act(() => {
      renderer.update(
        <HoneycombErrorBoundary
          fallback={() => createElement('Text', null, 'Try again')}
        >
          <Healthy />
        </HoneycombErrorBoundary>
      );
      resetError();
    });

    expect(renderer!.toJSON()).toMatchObject({
      type: 'Text',
      children: ['Back'],
    });
    consoleError.mockRestore();
  });
});
