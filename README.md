# Honeycomb OpenTelemetry React Native

[![OSS Lifecycle](https://img.shields.io/osslifecycle/honeycombio/honeycomb-opentelemetry-react-native)](https://github.com/honeycombio/home/blob/main/honeycomb-oss-lifecycle-and-practices.md)
[![CircleCI](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-react-native.svg?style=shield)](https://circleci.com/gh/honeycombio/honeycomb-opentelemetry-react-native)

Honeycomb wrapper for [OpenTelemetry](https://opentelemetry.io) in React Native apps.

**STATUS: this library is experimental.** Data shapes are unstable and subject to change. We are actively seeking feedback to ensure usability.

> **Note for AI assistants**: See [CLAUDE.md](CLAUDE.md) for development guidelines and project-specific instructions.

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
    implementation "io.honeycomb.android:honeycomb-opentelemetry-android:0.0.19"
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
import com.honeycombopentelemetryreactnative.HoneycombOpentelemetryReactNativeModule

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
import HoneycombOpentelemetryReactNative

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

> #### Other JS Runtimes
> Honeycomb ReactNative SDK has been primarily designed for, and tested on Hermes (the default JS runtime for ReactNative).
> Other Runtimes such as JavaScript Core have not been extensively tested. If you are using a different runtime, we highly 
> encourage you to upgrade to Hermes.

## Source Map Symbolication

React Native projects automatically minify JavaScript source files. Honeycomb provides a [symbolicator](https://github.com/honeycombio/opentelemetry-collector-symbolicator/) with our [collector distro](https://github.com/honeycombio/honeycomb-collector-distro) that can un-minify JS stack traces, but this requires setup to correlate stack traces with the correct source maps.

### Step 1: Enable Source Map Generation

**iOS:** Source maps are [disabled by default](https://reactnative.dev/docs/debugging-release-builds). To generate them during builds, open Xcode and edit the build phase "Bundle React Native code and images". Add this line to the top of the script:

```bash
export SOURCEMAP_FILE="$PROJECT_DIR/main.jsbundle.map"
```

**Android:** Source maps are generated automatically during builds. No configuration needed.

### Step 2: Generate and Set a UUID as a Resource Attribute

Your app needs to set a unique identifier as a Resource attribute using the `app.debug.source_map_uuid` key when configuring the SDK. This allows the symbolicator to correlate exception traces with the correct source maps.

#### Option A: Using the Expo Plugin (Recommended for Expo Projects)

Add the plugin to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      ["@honeycombio/opentelemetry-react-native"]
    ]
  }
}
```

The plugin will automatically generate a UUID and configure it as a Resource attribute in the SDK.

#### Option B: Manual UUID Generation (For Non-Expo Projects)

1. Generate your own UUID (e.g., using `uuidgen` or any UUID generation tool)

2. Choose one of the following approaches to attach it:

   **Approach 1: Automatic (Recommended)** - Let the SDK read and attach the UUID:

   Add the UUID to your platform configuration files:

   **Android** (`AndroidManifest.xml`):
   ```xml
   <application ...>
       <meta-data
           android:name="app.debug.source_map_uuid"
           android:value="your-generated-uuid-here" />
   </application>
   ```

   **iOS** (`Info.plist`):
   ```xml
   <key>app.debug.source_map_uuid</key>
   <string>your-generated-uuid-here</string>
   ```

   The SDK will automatically read these values and set them as Resource attributes.

   **Approach 2: Manual** - Set the UUID as a Resource attribute yourself when configuring the SDK in your code.

### Step 3: Extract the UUID After Building

After building your app, extract the UUID from your build artifacts:

**For Expo Plugin Users:**

**Android:**
```bash
UUID=$(xpath -q -e "string(//meta-data[@android:name='app.debug.source_map_uuid']/@android:value)" app/src/main/AndroidManifest.xml)
```

**iOS:**
```bash
UUID=$(defaults read $PWD/<your-app-name>/Info app.debug.source_map_uuid)
```

Replace `<your-app-name>` with your actual app directory name.

**For Manual UUID Generation:**

If you generated the UUID manually and placed it in your configuration files, use the same commands above to extract it. If you're setting the UUID as a Resource attribute manually in code, you already have the UUID value you generated.

### Step 4: Prepare Source Maps for Upload

Organize your source maps in a directory structure using the UUID:

1. **Create a directory named with the UUID:**
   ```bash
   mkdir -p "$UUID"
   ```

2. **Copy source maps into the UUID directory:**
   - iOS: `main.jsbundle.map`
   - Android: `index.android.bundle.map`

3. **Create stub files** that reference the source maps (place these in the UUID directory):

   **Android:**
   ```bash
   echo "//# sourceMappingURL=index.android.bundle.map" > "$UUID/index.android.bundle"
   ```

   **iOS:**
   ```bash
   echo "//# sourceMappingURL=main.jsbundle.map" > "$UUID/main.jsbundle"
   ```

### Step 5: Upload to Cloud Storage

Upload the UUID directory to your cloud storage service (e.g., S3, GCS). The final structure should be:

```
<uuid>/
  ├── main.jsbundle                  (iOS stub file)
  ├── main.jsbundle.map              (iOS source map)
  ├── index.android.bundle           (Android stub file)
  └── index.android.bundle.map       (Android source map)
```

When the [Honeycomb source_map_symbolicator](https://github.com/honeycombio/opentelemetry-collector-symbolicator/) processes exception traces with the `app.debug.source_map_uuid` Resource attribute, it will retrieve the corresponding source maps to properly symbolicate your JavaScript stack traces.


## SDK Configuration Options

See the [Honeycomb Web SDK](https://github.com/honeycombio/honeycomb-opentelemetry-web/tree/main/packages/honeycomb-opentelemetry-web) for more most options.

These are the React Native-specific options:

| Option               | Type                           | Required? | Description                  |
|----------------------|--------------------------------|-----------|------------------------------|

## Default Attributes
All spans and log events will include the following attributes:

| name                              | requires native configuration | OS      | description                                                                               | example                                                                                         |
|-----------------------------------|-------------------------------|---------|-------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `app.bundle.executable`           | Yes                           | iOS     | Name of app executable                                                                    | "MyApp"                                                                                         |
| `app.bundle.shortVersionString`   | Yes                           | iOS     | Short version string                                                                      | "1.0.0"                                                                                         |
| `app.bundle.version`              | Yes                           | iOS     | Version number                                                                            | "42"                                                                                            |
| `app.debug.binaryName`            | Yes                           | iOS     | Full path to app binary                                                                   | "/private/var/containers/Bundle/Application/.../MyApp.app/MyApp"                               |
| `app.debug.build_uuid`            | Yes                           | iOS     | Debug UUID of app                                                                         | "12345678-1234-5678-9ABC-DEF012345678"                                                          |
| `app.debug.proguard_uuid`         | Yes                           | Android | Unique UUID for correlating ProGuard mapping files with builds                            | "abcd1234-5678-90ab-cdef-1234567890ab"                                                          |
| `app.debug.source_map_uuid`       | Yes                           | Both    | UUID for correlating JS source maps with builds (requires UUID build plugin)              | "a1b2c3d4-e5f6-7890-abcd-ef1234567890"                                                          |
| `deployment.environment.name`     | No                            | Both    | "development" when running in developer mode, "production" if this is a production build  | "development"                                                                                   |
| `device.id`                       | Yes                           | Both    | Unique device identifier                                                                  | "12345678-1234-1234-1234-123456789012"                                                          |
| `device.manufacturer`             | Yes                           | Android | Manufacturer of the device                                                                | "Google"                                                                                        |
| `device.model.identifier`         | Yes                           | Both    | Device model identifier                                                                   | "Pixel 7" or "iPhone15,2"                                                                       |
| `device.model.name`               | Yes                           | Android | Same as `device.model.identifier`                                                         | "Pixel 7"                                                                                       |
| `honeycomb.distro.runtime_version` | No                           | Both    | React Native version (JS), iOS version (iOS), or Android version (Android)               | "0.76.3" or "17.0" or "14"                                                                      |
| `honeycomb.distro.version`        | No                            | Both    | Honeycomb SDK version                                                                     | "0.7.0" (JS), "2.1.0" (iOS), or "0.0.19" (Android)                                              |
| `os.description`                  | Yes                           | Both    | Description containing OS version, build ID, and SDK level                                | "iOS 17.0, Build 21A329, SDK 17.0"                                                              |
| `os.name`                         | No                            | Both    | Operating system name                                                                     | "iOS" or "Android"                                                                              |
| `os.type`                         | Yes                           | Both    | Operating system type                                                                     | "darwin" (iOS/macOS) or "linux" (Android)                                                       |
| `os.version`                      | No                            | Both    | Operating system version                                                                  | "17.0"                                                                                          |
| `rum.sdk.version`                 | Yes                           | Android | Version of the OpenTelemetry Android SDK                                                  | "0.11.0"                                                                                        |
| `service.name`                    | Yes                           | Both    | Application name (or "unknown_service" if unset)                                          | "my-mobile-app"                                                                                 |
| `service.version`                 | Yes                           | Both    | Optional version of the application                                                       | "1.2.3"                                                                                         |
| `session.id`                      | Yes                           | Both    | Unique identifier for the current user session                                            | "a1b2c3d4e5f67890abcdef1234567890"                                                              |
| `telemetry.distro.name`           | No                            | Both    | Name of the telemetry distribution                                                        | "@honeycombio/opentelemetry-react-native"                                                       |
| `telemetry.distro.version`        | No                            | Both    | Honeycomb SDK version                                                                     | "0.7.0" (JS), "2.1.0" (iOS), or "0.0.19" (Android)                                              |
| `telemetry.sdk.language`          | No                            | Both    | SDK language *                                                                           | "hermesjs" (JS), "swift" (iOS), or "android" (Android)                                          |
| `telemetry.sdk.name`              | No                            | Both    | Base SDK name                                                                             | "opentelemetry"                                                                                 |
| `telemetry.sdk.version`           | No                            | Both    | Version of the base OpenTelemetry SDK                                                     | "1.28.0" (JS), "2.0.2" (iOS), or "0.11.0" (Android)                                             |

*\* `telemetry.sdk.language` varies depending on the source of the telemetry event:*
- *`hermesjs`: Events from JavaScript code running on the React Native Hermes engine*
- *`swift`: Events from native iOS code instrumented by the iOS SDK*
- *`android`: Events from native Android code instrumented by the Android SDK*

This attribute enables filtering and analyzing telemetry by source layer, allowing you to distinguish between JavaScript-originated events and native platform-specific events in your observability data.

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
