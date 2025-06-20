import { Platform } from 'react-native';
import {
  HoneycombReactNativeSDK,
  UncaughtExceptionInstrumentation,
} from '@honeycombio/opentelemetry-react-native';
import { DiagLogLevel } from '@opentelemetry/api';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

//Swaps out the default error handler so we can test errors
ErrorUtils.setGlobalHandler(() => {});

export const sdk = new HoneycombReactNativeSDK({
  endpoint: `http://${localhost}:4318`,
  serviceName: 'reactnative-example',
  logLevel: DiagLogLevel.DEBUG,
  instrumentations: [
    new UncaughtExceptionInstrumentation(),
    new FetchInstrumentation(),
  ],
});

export function init() {
  sdk.start();
}
