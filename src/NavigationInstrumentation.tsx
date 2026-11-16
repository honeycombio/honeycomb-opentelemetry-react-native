import { trace } from '@opentelemetry/api';
import { useEffect, useRef } from 'react';

const LIBRARY_NAME = '@honeycombio/navigation';

/**
 * Methods this component reads. A navigation container ref satisfies this
 * without pinning the app to one installed copy of React Navigation.
 */
type NavigationRouteRef = {
  isReady: () => boolean;
  addListener: (event: 'state', callback: () => void) => () => void;
  getCurrentRoute: () => { readonly name?: string } | undefined;
};

type NavigationInstrumentationProps = React.PropsWithChildren<{
  ref: NavigationRouteRef;
}>;

export function NavigationInstrumentation({
  ref,
  children,
}: NavigationInstrumentationProps) {
  const routeNameRef = useRef<string>(undefined);

  useEffect(() => {
    if (!ref || !ref.isReady()) {
      return;
    }
    return ref.addListener('state', () => {
      const timestamp = Date.now();
      const previousRoute = routeNameRef.current;
      const { name: currentRoute } = ref.getCurrentRoute() ?? {};
      if (currentRoute) {
        trace
          .getTracer(LIBRARY_NAME)
          .startSpan('screen appeared', { startTime: timestamp })
          .setAttribute('screen.route', currentRoute)
          .end();
      }
      if (previousRoute) {
        trace
          .getTracer(LIBRARY_NAME)
          .startSpan('screen disappeared', { startTime: timestamp })
          .setAttribute('screen.route', previousRoute)
          .end();
      }
    });
  }, [ref]);
  return <>{children}</>;
}
