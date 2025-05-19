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

## Manual Instrumentation

### Sending a custom span.

```
let span = trace
  .getTracer('your-tracer-name')
  .startSpan('some-span');
span.end();
```
