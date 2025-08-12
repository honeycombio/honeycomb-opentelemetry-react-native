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
  serviceName: 'your-great-react-native-app',
  instrumentations: [], // add automatic instrumentation
});
sdk.start();
```

4. Android (optional)

Add the following lines to the beginning of your `MainApplication.kt`'s  `onCreate` method

```Kotlin
override fun onCreate() {
  val configure =
    HoneycombOpentelemetryReactNativeModule.builder(this)
      .setApiKey("test-key")
      .setServiceName("your-great-react-native-app")

  HoneycombOpentelemetryReactNativeModule.configure(configure)
 // ....
}
```

5. IOS (optional)

  a. go to your app's `ios` directory and run `pod install` then

  b. Add the following lines to the beginning your `AppDelegate.swift`'s application method

```swift
override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
) -> Bool {
    let config = HoneycombWrapper.builder()
        .setApiKey("test-key")
        .setServiceName("your-great-react-native-app")
        .setDebug(true)
    HoneycombWrapper.configure(config)
}
```

6. Build and run your application, and then look for data in Honeycomb. On the Home screen, choose your application by looking for the service name in the Dataset dropdown at the top. Data should populate.

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

The following auto-instrumentations are included by default:

- Error Handler
- Fetch Instrumentation
- Slow event loop detection instrumentation

You can disable them by using the following configuration options:

| Option                                                | Type                                   | Required? | default value     | Description                                              |
|-------------------------------------------------------|----------------------------------------|-----------|-------------------|----------------------------------------------------------|
| `uncaughtExceptionInstrumentationConfig`              | UncaughtExceptionInstrumentationConfig | No        | { enabled: true } | configuration for uncaught exception instrumentation.    |
| `fetchInstrumentationConfig`                          | FetchInstrumentationConfig             | No        | { enabled: true } | configuration for fetch instrumentation.                 |
| `slowEventLoopInstrumentationConfig`                 | slowEventLoopInstrumentationConfig    | No        | { enabled: true } | configuration for slow event loop instrumentation.      |


### Error handler
The Honeycomb React Native SDK includes a global error handler for uncaught exceptions by default.

### Slow event loop detection
The Honeycomb React Native SDK comes with a slow event loop detection instrumentation. 

#### Configuration 
| Option                        | Type                                | Required? | default value | Description                                                                                                                                                                         |
|-------------------------------|-------------------------------------|-----------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `loopSampleIntervalMs`.       | number                              | No        | 50            | Duration (in milliseconds) between each sampling of the event loop duration.                                                                                                        |
| `stallThresholdMs`            | number                              | No        | 50            | The acceptable margin of error (in milliseconds) for which the event loop can be delayed before it is considered stalled                                                            |
| `applyCustomAttributesOnSpan` | ApplyCustomAttributesOnSpanFunction | No.       | undefined     | A callback function for adding custom attributes to the span when a slow event loop is recorded. Will automatically be applied to all spans generated by the auto-instrumentation. |


#### Fields
When a slow event loop is detected, it will emit a 'slow event loop' span with the following fields.

| Field                     | Description                                         | Example |
|---------------------------|-----------------------------------------------------|---------|
| `hermes.eventloop.delay` | The total time of the detected delay in miliseconds | `104`.  |

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
