# Migration Guide: OpenTelemetry JS SDK to Honeycomb OpenTelemetry React Native SDK

This guide helps you migrate from using the OpenTelemetry JS SDK directly to the Honeycomb OpenTelemetry React Native SDK.

## Overview

The Honeycomb OpenTelemetry React Native SDK simplifies your OpenTelemetry setup by:
- Providing a single initialization class instead of manually configuring providers and exporters
- Including built-in auto-instrumentation for common React Native scenarios
- Handling session tracking and resource attributes automatically
- Supporting both JavaScript and native (iOS/Android) telemetry

## Installation

Install the Honeycomb SDK:

```sh
yarn add @honeycombio/opentelemetry-react-native
```

You can remove the following OpenTelemetry packages that are now bundled:

```sh
yarn remove @opentelemetry/sdk-trace-web \
  @opentelemetry/sdk-metrics \
  @opentelemetry/sdk-logs \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/exporter-metrics-otlp-http \
  @opentelemetry/exporter-logs-otlp-http \
  @opentelemetry/web-common
```

## JavaScript Configuration

The Honeycomb SDK greatly simplifies your configuration code.

```diff
- import { Context, metrics } from '@opentelemetry/api';
- import { logs } from '@opentelemetry/api-logs';
- import {
-   ConsoleSpanExporter,
-   SimpleSpanProcessor,
-   WebTracerProvider,
- } from "@opentelemetry/sdk-trace-web";
- import {
-   ConsoleMetricExporter,
-   MeterProvider,
-   PeriodicExportingMetricReader,
- } from "@opentelemetry/sdk-metrics";
- import {
-   ConsoleLogRecordExporter,
-   LoggerProvider,
-   SimpleLogRecordProcessor,
- } from "@opentelemetry/sdk-logs";
- import { Resource } from "@opentelemetry/resources";
- import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
- import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
- import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

+ import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';

export default function configureHoneycomb() {
  const serviceName = "reactnative-demo";
  const honeycombKey = "YOUR-API-KEY-HERE";
- const honeycombURL = "https://api.honeycomb.io";

+ const sdk = new HoneycombReactNativeSDK({
+   apiKey: honeycombKey,
+   serviceName: serviceName,
+ });
+
+ sdk.start();

- const resource = new Resource({
-   "service.name": serviceName,
- });
-
- const headers = {
-   "x-honeycomb-team": honeycombKey,
-   "x-honeycomb-dataset": serviceName,
- };
-
- // Traces
- const traceProvider = new WebTracerProvider({
-   resource,
-   spanProcessors: [
-     new SimpleSpanProcessor(
-       new OTLPTraceExporter({ headers, url: `${honeycombURL}/v1/traces` })
-     ),
-     new SimpleSpanProcessor(new ConsoleSpanExporter()),
-   ],
- });
- traceProvider.register();
-
- // Metrics
- const metricsHeaders = {
-   "x-honeycomb-team": honeycombKey,
-   "x-honeycomb-dataset": `${serviceName}-metrics`,
- };
- const metricExporter = new OTLPMetricExporter({
-   headers: metricsHeaders,
-   url: `${honeycombURL}/v1/metrics`,
- });
- const meterProvider = new MeterProvider({
-   resource,
-   readers: [
-     new PeriodicExportingMetricReader({
-       exporter: metricExporter,
-     }),
-     new PeriodicExportingMetricReader({
-       exporter: new ConsoleMetricExporter(),
-     }),
-   ],
- });
- metrics.setGlobalMeterProvider(meterProvider);
-
- // Logging
- const logExporter = new OTLPLogExporter({
-   headers,
-   url: `${honeycombURL}/v1/logs`,
- });
- const loggerProvider = new LoggerProvider({ resource });
- loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));
- loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()));
- logs.setGlobalLoggerProvider(loggerProvider);
}
```

## Removing Custom Native Modules

If you previously added native modules from our example code or documentation, you can now remove them. The Honeycomb SDK handles this automatically through its built-in native integrations.

### iOS

**Remove:**

- `HoneycombModule.swift`
- `HNYModule.m`
- `HNYModule.h`

**Modify:**
For iOS, there is no native code to remove from the `AppDelegate` files. If you wish to use Native Modules, add the code described in [Native Configuration](#native-configuration-optional-but-recommended)

### Android

**Remove:**
- `HoneycombModule.kt`
- `HoneycombPackage.kt`

**Modify:** 

If you are using native modules, you can directly convert the configuration to use the Honeycomb SDK's Native Modules as shown below.
If you are not using Native Modules, you may reset your `MainApplication.kt` to its default value

`MainApplication.kt`
```diff
-import io.honeycomb.opentelemetry.android.Honeycomb
-import io.honeycomb.opentelemetry.android.HoneycombOptions
-import io.opentelemetry.android.OpenTelemetryRum
+import com.honeycombopentelemetryreactnative.HoneycombOpentelemetryReactNativeModule

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {
- var otelRum: OpenTelemetryRum? = null

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
    this,
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> {
        val packages = PackageList(this).packages
-       packages.add(HoneycombPackage({ otelRum }))
        return packages
      }
     // ...
    }
  )

-  override val reactHost: ReactHost
-    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
-   val options = HoneycombOptions.builder(this)
+   val options = HoneycombOpentelemetryReactNativeModule.optionsBuilder(this)
      .setApiKey("YOUR-API-KEY-HERE")
      .setServiceName("reactnative-demo")
-     .build()

+   HoneycombOpentelemetryReactNativeModule.configure(this, options)
-   otelRum = Honeycomb.configure(this, options)

    super.onCreate()
    // ...
  }
}
```

## Configuration Options (optional)

The Honeycomb SDK supports additional configuration options compared to the OpenTelemetry JS SDK:

```typescript
import { HoneycombReactNativeSDK } from '@honeycombio/opentelemetry-react-native';
import { ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const sdk = new HoneycombReactNativeSDK({
  apiKey: 'YOUR-API-KEY-HERE',
  serviceName: 'reactnative-demo',

  // Optional: Add custom resource attributes
  resourceAttributes: {
    "my.custom.attribute": 'custom-value',
  },

  // Optional: Configure fetch instrumentation
  fetchInstrumentationConfig: {
    enabled: true,
  },

  // Optional: Configure error handling
  uncaughtExceptionInstrumentationConfig: {
    enabled: true,
  },

  // Optional: Add custom span processors (applies to JavaScript spans only, not native spans)
  spanProcessors: [
    // Your custom span processors
  ],

  // Optional: Configure slow event loop detection
  slowEventLoopInstrumentationConfig: {
    enabled: true,
    loopSampleIntervalMs: 50,
    stallThresholdMs: 50,
  },

  // Optional: Configure React Native startup instrumentation
  reactNativeStartupInstrumentationConfig: {
    enabled: true,
  },
});

sdk.start();
```

## Auto-Instrumentation

The Honeycomb SDK includes built-in auto-instrumentation:

- **App Startup** (new): Measures time from native SDK start to JavaScript initialization
- **Error Handler** (new): Global error handler for uncaught exceptions
- **Fetch Instrumentation**: Automatically traces HTTP requests (previously required explicit setup with `@opentelemetry/instrumentation-fetch`)
- **Slow Event Loop Detection** (new): Detects when the event loop is stalled

All auto-instrumentations are enabled by default. You can disable them individually via configuration options (see above).

### Navigation Instrumentation (requires additional configuration)

The Honeycomb SDK provides a `NavigationInstrumentation` component for tracking navigation events.

#### For Expo Router:

```tsx
import { HoneycombReactNativeSDK, NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';
import { useNavigationContainerRef } from 'expo-router';

// Initialize SDK
const sdk = new HoneycombReactNativeSDK({
  apiKey: 'YOUR-API-KEY-HERE',
  serviceName: 'your-app',
});
sdk.start();

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationInstrumentation ref={navigationRef}>
      {/* Your app content */}
    </NavigationInstrumentation>
  );
}
```

#### For React Navigation:

```tsx
import { HoneycombReactNativeSDK, NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

// Initialize SDK
const sdk = new HoneycombReactNativeSDK({
  apiKey: 'YOUR-API-KEY-HERE',
  serviceName: 'your-app',
});
sdk.start();

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <NavigationInstrumentation ref={navigationRef}>
        {/* Your navigation screens */}
      </NavigationInstrumentation>
    </NavigationContainer>
  );
}
```

## Sending Custom Spans

If you manually instrumented your React Native app you will not need to make any changes. Emitting custom spans will work exactly as it did before.

```typescript
import { trace } from '@opentelemetry/api';

const span = trace
  .getTracer('your-tracer-name')
  .startSpan('some-span');

// Do work...

span.end();
```

## Native Configuration (Optional but Recommended)

To get the full benefits of the SDK, including native telemetry and additional device/OS attributes, configure the native SDKs:

### Android

1. Add dependencies to `android/app/build.gradle`:

```kotlin
dependencies {
    implementation "io.honeycomb.android:honeycomb-opentelemetry-android:0.0.19"
    implementation "io.opentelemetry.android:android-agent:0.11.0-alpha"
}
```

2. If your min SDK version is below 26, enable core library desugaring:

```kotlin
android {
  compileOptions {
    coreLibraryDesugaringEnabled true
  }

  dependencies {
    coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"
  }
}
```

3. Configure in `MainApplication.kt`:

```kotlin
override fun onCreate() {
  val options = HoneycombOpentelemetryReactNativeModule.optionsBuilder(this)
    .setApiKey("YOUR-API-KEY-HERE")
    .setServiceName("reactnative-demo")

  HoneycombOpentelemetryReactNativeModule.configure(this, options)

  super.onCreate()
  // ... rest of your onCreate
}
```

### iOS

1. Edit `ios/Podfile` to add `use_frameworks!`:

```ruby
platform :ios, min_ios_version_supported
prepare_react_native_project!
use_frameworks!
```

2. Run `pod install` from the `ios` directory:

```sh
cd ios && pod install && cd ..
```

3. Configure in `AppDelegate.swift`:

```swift
override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
) -> Bool {
    let options = HoneycombReactNative.optionsBuilder()
        .setAPIKey("YOUR-API-KEY-HERE")
        .setServiceName("reactnative-demo")

    HoneycombReactNative.configure(options)

    // ... rest of your application setup
    return true
}
```

## What You Get

After migrating, your telemetry will include:

### Default Attributes

All spans and log events automatically include attributes such as:
- Device information (`device.id`, `device.model.identifier`, `device.manufacturer`)
- OS information (`os.name`, `os.version`, `os.description`)
- App information (`service.name`, `service.version`, `app.bundle.version`)
- Session tracking (`session.id`)
- Build metadata (when using native SDKs)

Some attributes like `device.id`, `device.manufacturer`, and `os.description` require native SDK configuration. See the [Default Attributes](README.md#default-attributes) section in the README for a complete list.

### Simplified Maintenance

- Single package to update instead of multiple OpenTelemetry packages
- Built-in integration with Honeycomb's OTLP endpoint
- Automatic session and resource management
- Pre-configured auto-instrumentation

## Additional Resources

- [Honeycomb OpenTelemetry React Native SDK README](README.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)
- [Honeycomb Documentation](https://docs.honeycomb.io/get-started/start-building/application/react-native/)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
