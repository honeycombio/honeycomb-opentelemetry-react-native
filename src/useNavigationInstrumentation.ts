import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { trace } from '@opentelemetry/api';

export default function useNavigationInstrumentation() {
  const routeNameRef = useRef<string>(undefined);
  const currentRoute = usePathname();

  useEffect(() => {
    const timestamp = Date.now();
    const previousRoute = routeNameRef.current;
    trace
      .getTracer('io.honeycomb.navigation')
      .startSpan('screen appeared', { startTime: timestamp })
      .setAttribute('screen.route', currentRoute)
      .end();

    if (previousRoute) {
      trace
        .getTracer('io.honeycomb.navigation')
        .startSpan('screen disappeared', { startTime: timestamp })
        .setAttribute('screen.route', currentRoute)
        .end();
    }

    routeNameRef.current = currentRoute;
  }, [currentRoute]);
}
