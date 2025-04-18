import { useRef } from 'react';

import { type Span, trace } from '@opentelemetry/api';

import {
  useNavigationContainerRef,
  type NavigationContainerProps,
} from '@react-navigation/native';

export function instrumentNavigationContainer<
  T extends NavigationContainerProps = NavigationContainerProps,
>(WrappedNavigation: React.ComponentType<T>) {
  return ({ onReady, onStateChange, ...props }: T) => {
    const navigationRef = useNavigationContainerRef();
    const routeNameRef = useRef<string>(undefined);
    const spanRef = useRef<Span>(undefined);

    return (
      <WrappedNavigation
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
          if (onReady) {
            return onReady();
          }
        }}
        onStateChange={(state) => {
          const timeStamp = Date.now();
          const previousRoute = routeNameRef.current;
          const currentRoute = navigationRef.current?.getCurrentRoute()?.name;

          if (currentRoute && previousRoute !== currentRoute) {
            const span = trace
              .getTracer('io.honeycomb.screens')
              .startSpan('screen appeared', { startTime: timeStamp })
              .setAttribute('screen.route', currentRoute);

            if (spanRef.current) {
              const prevSpan = spanRef.current;
              prevSpan.end(timeStamp);
            }

            spanRef.current = span;

            if (onStateChange) {
              return onStateChange(state);
            }
          }
        }}
        {...(props as T)}
      />
    );
  };
}
