# Honeycomb OpenTelemetry React Native

[![OSS Lifecycle](https://img.shields.io/osslifecycle/honeycombio/honeycomb-opentelemetry-react-native)](https://github.com/honeycombio/home/blob/main/honeycomb-oss-lifecycle-and-practices.md)
[![CircleCI](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-react-native.svg?style=shield)](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-react-native)

Honeycomb wrapper for [OpenTelemetry](https://opentelemetry.io) in React Native apps.

**STATUS: this library is experimental.** Data shapes are unstable and subject to change. We are actively seeking feedback to ensure usability.

## Getting started

1. Install this library:

```sh
yarn add @honeycombio/opentelemetry-react-native
```

2. [Get a Honeycomb API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#find-api-keys).

3. Initialize tracing at the start of your application:

```js
import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';

const sdk = new HoneycombReactNativeSDK({
  apiKey: 'api-key-goes-here',
  serviceName: 'your-great-browser-application',
  instrumentations: [], // add automatic instrumentation
});
sdk.start();
```

4. Build and run your application, and then look for data in Honeycomb. On the Home screen, choose your application by looking for the service name in the Dataset dropdown at the top. Data should populate.

Refer to our [Honeycomb documentation](https://docs.honeycomb.io/get-started/start-building/web/) for more information on instrumentation and troubleshooting.

## SDK Configuration Options

See the [Honeycomb Web SDK](https://github.com/honeycombio/honeycomb-opentelemetry-web/tree/main/packages/honeycomb-opentelemetry-web) for more most options.

These are the React Native-specific options:

| Option               | Type                           | Required? | Description                  |
|----------------------|--------------------------------|-----------|------------------------------|

## Default Attributes
All spans will include the following attributes

TODO

## Auto-instrumentation

### Error handler
The Honeycomb React Native SDK includes a global error handler for uncaught exceptions. To use it, include it in the `instrumentations` config property.

```TypeScript
import { 
  HoneycombReactNativeSDK,
  UncaughtExceptionInstrumentation,
} from '@honeycombio/opentelemetry-react-native';

const sdk = new HoneycombReactNativeSDK({
  apiKey: 'api-key-goes-here',
  serviceName: 'your-great-browser-application',
  instrumentations: [
    new UncaughtExceptionInstrumentation() // Any uncaught errors will be automatically recorded
  ],
});
sdk.start();
```

### Fetch Instrumentation
requests made using fetch can be added using the OpenTelemetry's [Fetch request instrumentation](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch) You may include this as follows.

```TypeScript
import { 
  HoneycombReactNativeSDK,
  UncaughtExceptionInstrumentation,
} from '@honeycombio/opentelemetry-react-native';

import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";

const sdk = new HoneycombReactNativeSDK({
  apiKey: 'api-key-goes-here',
  serviceName: 'your-great-browser-application',
  instrumentations: [
    new FetchInstrumentation() // All requests made with fetch will be recorded
  ],
});
sdk.start();
```

## Manual Instrumentation

### Navigation
Navigation instrumentation depends on if you are using React NativeRouter or Expo Router for navigation. 
Honeycomb SDK provides a component (`<NavigationInstrumentation>`) that you can place in your main app or layout file. Below are examples
on using it with both ReactNative Router.

#### ReactNative Router
In ReactNative Router you will need to pass the ref into your navigation container as well as
into the `<NavigationInstrumentation>` component.

Note: the `<NavigationInstrumentation>` component has to be a child of your `<NavigationContainer>` component.

```TSX
import { NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';
import { useNavigationContainerRef, NavigationContainer } from '@react-navigation/native';


export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer
      ref={navigationRef}
    >
      <NavigationInstrumentation
        ref={navigationRef}
      >
        {/* Navigation/UI code*/}
      </NavigationInstrumentation>
    </NavigationContainer>
  );
}
```

#### Expo Router
The same component can also be used with expo's provided `useNavigationContainerRef` hook.
Since Expo generates its own `NavigationContainer` you do not need to pass the ref in again.

```TSX
import { NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';
import { useNavigationContainerRef } from 'expo-router';


export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationInstrumentation
      ref={navigationRef}
    >
      {/* Navigation/UI code*/}
    </NavigationInstrumentation>
  );
}
```

### Sending a custom span.

```typescript
let span = trace
  .getTracer('your-tracer-name')
  .startSpan('some-span');
span.end();
```
