# Honeycomb OpenTelemetry React Native

[![OSS Lifecycle](https://img.shields.io/osslifecycle/honeycombio/honeycomb-opentelemetry-react-native)](https://github.com/honeycombio/home/blob/main/honeycomb-oss-lifecycle-and-practices.md)
[![CircleCI](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-react-native.svg?style=shield)](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-react-native)

Honeycomb wrapper for [OpenTelemetry](https://opentelemetry.io) in React Native apps.

**STATUS: this library is experimental.** Data shapes are unstable and subject to change. We are actively seeking feedback to ensure usability.

## Getting started

1. Add a [metro.config.js](example/metro.config.js) to the root of your repo and enable `config.resolver.unstable_enablePackageExports`. This is required for OpenTelemetry to be able to properly import its dependencies.

2. Install this library:

```sh
yarn add @honeycombio/opentelemetry-react-native
```

3. [Get a Honeycomb API key](https://docs.honeycomb.io/get-started/configure/environments/manage-api-keys/#find-api-keys).

4. Initialize tracing at the start of your application:

```js
import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';

const sdk = new HoneycombReactNativeSDK({
  apiKey: 'api-key-goes-here',
  serviceName: 'your-great-react-native-app',
  instrumentations: [], // add automatic instrumentation
});
sdk.start();
```

5. Android (optional)

 a. Add the following dependencies to your apps build.gradle.

```Kotlin
dependencies {
    //...
    implementation "io.honeycomb.android:honeycomb-opentelemetry-android:0.0.16"
    implementation "io.opentelemetry.android:android-agent:0.11.0-alpha"
}
```

 b. If your min SDK version is below 26, you will likely need to add core library desugaring to your android gradle build.

`android/app/build.gradle`
```diff
android {
  //
  compileOptions {
+   coreLibraryDesugaringEnabled true
    //...
  }

  //...
  dependencies {
+   coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"
  }
}
```

 c. Add the following lines to the beginning of your `MainApplication.kt`'s  `onCreate` method.

```Kotlin
override fun onCreate() {
  val options =
    HoneycombOpentelemetryReactNativeModule.optionsBuilder(this)
      .setApiKey("test-key")
      .setServiceName("your-great-react-native-app")

  HoneycombOpentelemetryReactNativeModule.configure(this, options)
 // ....
}
```

6. iOS (optional)

  a. Edit your app's podfile to add the `use_frameworks!` option.

`ios/Podfile`
```diff
  platform :ios, min_ios_version_supported
  prepare_react_native_project!
+ use_frameworks!
```
  b. Go to your app's `ios` directory and run `pod install` then

  c. Add the following lines to the beginning your `AppDelegate.swift`'s application method

```swift
override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
) -> Bool {
    let options = HoneycombReactNative.optionsBuilder()
        .setAPIKey("test-key")
        .setServiceName("your-great-react-native-app")
    HoneycombReactNative.configure(options)
    //...
}
```

7. Build and run your application, and then look for data in Honeycomb. On the Home screen, choose your application by looking for the service name in the Dataset dropdown at the top. Data should populate.

Refer to our [Honeycomb documentation](https://docs.honeycomb.io/get-started/start-building/web/) for more information on instrumentation and troubleshooting.

## Source Map Symbolication
React Native projects automatically minify JS source files. Honeycomb provides a collector that can un-minify JS stack traces, but that requires a little bit of set up.

### Generating Source Maps

iOS projects have source maps [disabled by default](https://reactnative.dev/docs/debugging-release-builds). To generate source maps during a build, open Xcode and edit the build phase "Bundle React Native code and images". Add this line to the top of the script:

```
export SOURCEMAP_FILE="$(pwd)/../main.jsbundle.map";
```

Android projects will generate source maps by default.

### Tracking Source Maps

Once you have your source maps, your app will need to include an attribute on the telemetry it emits so that we know which source map should be used for which stack trace.

For expo projects, add the following to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      // ...
      ["@honeycombio/opentelemetry-react-native"],
    ]
  }
}
```

### Tying It All Together
(this section coming soon)


## SDK Configuration Options

See the [Honeycomb Web SDK](https://github.com/honeycombio/honeycomb-opentelemetry-web/tree/main/packages/honeycomb-opentelemetry-web) for more most options.

These are the React Native-specific options:

| Option               | Type                           | Required? | Description                  |
|----------------------|--------------------------------|-----------|------------------------------|

## Default Attributes
All spans will include the following attributes:

| name                          | Native or JS | static? | description                                                                               | example        |
|-------------------------------|--------------|---------|-------------------------------------------------------------------------------------------|----------------|
| `deployment.environment.name` | JS only.     | static. | "development" when running in developer mode, "production" if this is a production build. | "development"  |



## Auto-instrumentation

The following auto-instrumentations are included by default:

- App Startup
- Error Handler
- Fetch Instrumentation
- Slow event loop detection instrumentation

You can disable them by using the following configuration options:

| Option                                                | Type                                   | Required? | default value     | Description                                              |
|-------------------------------------------------------|----------------------------------------|-----------|-------------------|----------------------------------------------------------|
| `reactNativeStartupInstrumentationConfig`              | UncaughtExceptionInstrumentationConfig | No        | { enabled: true } | configuration for React Native startup instrumentation   |
| `uncaughtExceptionInstrumentationConfig`              | UncaughtExceptionInstrumentationConfig | No        | { enabled: true } | configuration for uncaught exception instrumentation     |
| `fetchInstrumentationConfig`                          | FetchInstrumentationConfig             | No        | { enabled: true } | configuration for fetch instrumentation.                 |
| `slowEventLoopInstrumentationConfig`                  | slowEventLoopInstrumentationConfig     | No        | { enabled: true } | configuration for slow event loop instrumentation        |

### React Native Startup
React Native Startup instrumentation automatically measures the time from when the native SDKs start to when
native code starts running to when the JavaScript SDK is finished initializing. This
instrumentation requires the Honeycomb native SDKs to be installed to measure the full span. The
emitted span is named `react native startup`.

### Error handler
The Honeycomb React Native SDK includes a global error handler for uncaught exceptions by default.

### Fetch Instrumentation
React Native uses [OpenTelemetry JS's Fetch Instrumentation](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-fetch).

### Slow event loop detection
The Honeycomb React Native SDK comes with a slow event loop detection instrumentation.

#### Configuration
| Option                        | Type                                | Required? | default value | Description                                                                                                                                                                         |
|-------------------------------|-------------------------------------|-----------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `loopSampleIntervalMs`.       | number                              | No        | 50            | Duration (in milliseconds) between each sampling of the event loop duration.                                                                                                        |
| `stallThresholdMs`            | number                              | No        | 50            | The acceptable margin of error (in milliseconds) for which the event loop can be delayed before it is considered stalled                                                            |
| `applyCustomAttributesOnSpan` | ApplyCustomAttributesOnSpanFunction | No        | undefined     | A callback function for adding custom attributes to the span when a slow event loop is recorded. Will automatically be applied to all spans generated by the auto-instrumentation. |


#### Fields
When a slow event loop is detected, it will emit a 'slow event loop' span with the following fields.

| Field                     | Description                                         | Example |
|---------------------------|-----------------------------------------------------|---------|
| `hermes.eventloop.delay`  | The total time of the detected delay in miliseconds | `104`   |

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
