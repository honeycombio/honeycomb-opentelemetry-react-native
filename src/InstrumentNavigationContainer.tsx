import { useRef } from 'react';

import { trace } from '@opentelemetry/api';

import {
  useNavigationContainerRef,
  type NavigationContainerProps,
} from '@react-navigation/native';

// TODO: this code is only manually tested using a modified example app, automated tests should be added

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
          const timestamp = Date.now();
          const previousRoute = routeNameRef.current;
          const currentRoute = navigationRef.current?.getCurrentRoute()?.name;

          if (currentRoute && previousRoute !== currentRoute) {
            trace
              .getTracer('io.honeycomb.navigation')
              .startSpan('screen appeared', { startTime: timestamp })
              .setAttribute('screen.route', currentRoute)
              .end();

            if (previousRoute) {
              trace
                .getTracer('io.honeycomb.navigation')
                .startSpan('screen disappeared', { startTime: timestamp })
                .setAttribute('screen.route', previousRoute)
                .end();
            }

            routeNameRef.current = currentRoute;

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
