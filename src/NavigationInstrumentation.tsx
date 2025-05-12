import { trace } from '@opentelemetry/api';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

type NavigationInstrumentationProps = React.PropsWithChildren<{
  ref: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
}>;

export function NavigationInstrumentation({
  ref,
  children,
}: NavigationInstrumentationProps) {
  const routeNameRef = useRef<string>(undefined);

  useEffect(() => {
    if (!ref) {
      //Error
      return;
    }
    ref.addListener('state', () => {
      const timestamp = Date.now();
      const previousRoute = routeNameRef.current;
      const { name: currentRoute } = ref.getCurrentRoute() ?? {};
      if (currentRoute) {
        trace
          .getTracer('io.honeycomb.navigation')
          .startSpan('screen appeared', { startTime: timestamp })
          .setAttribute('screen.route', currentRoute)
          .end();
      }
      if (previousRoute) {
        trace
          .getTracer('io.honeycomb.navigation')
          .startSpan('screen disappeared', { startTime: timestamp })
          .setAttribute('screen.route', previousRoute)
          .end();
      }
    });
  }, [ref]);
  return <>{children}</>;
}
