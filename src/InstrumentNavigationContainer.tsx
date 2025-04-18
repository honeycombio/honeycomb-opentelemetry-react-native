import { useRef } from 'react';

import { trace } from '@opentelemetry/api';

import {
  useNavigationContainerRef,
  type NavigationContainerProps,
} from '@react-navigation/native';

export function instrumentNavigationContainer<
  T extends NavigationContainerProps = NavigationContainerProps,
>(WrappedNavigation: React.ComponentType<T>) {
  return ({ onReady, onStateChange, children, ...props }: T) => {
    const navigationRef = useNavigationContainerRef();
    const routeNameRef = useRef<string>(undefined);

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
            trace
              .getTracer('io.honeycomb.navigation')
              .startSpan('screen appeared', { startTime: timeStamp })
              .setAttribute('screen.route', currentRoute)
              .end();

            if (previousRoute) {
              trace
                .getTracer('io.honeycomb.navigation')
                .startSpan('screen disappeared', { startTime: timeStamp })
                .setAttribute('screen.route', currentRoute)
                .end();
            }

            if (onStateChange) {
              return onStateChange(state);
            }
          }
        }}
        {...(props as T)}
      >
        {children}
      </WrappedNavigation>
    );
  };
}
