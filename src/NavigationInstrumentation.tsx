import { trace } from '@opentelemetry/api';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

const LIBRARY_NAME = '@honeycomb/navigation';

type NavigationInstrumentationProps = React.PropsWithChildren<{
  ref: NavigationContainerRefWithCurrent<any>;
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
    ref.addListener('state', () => {
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
