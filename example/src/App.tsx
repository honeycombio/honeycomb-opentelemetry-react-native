import { useState } from 'react';
import { Button, Platform, Text, View, StyleSheet } from 'react-native';
import {
  HoneycombReactNativeSDK,
  UncaughtExceptionInstrumentation,
} from '@honeycombio/opentelemetry-react-native';
import { DiagLogLevel, trace } from '@opentelemetry/api';
import { NavigationContainer } from '@react-navigation/native';

const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

//Swaps out the default error handler so we can test errors
ErrorUtils.setGlobalHandler(() => {});

const sdk = new HoneycombReactNativeSDK({
  endpoint: `http://${localhost}:4318`,
  serviceName: 'reactnative-example',
  logLevel: DiagLogLevel.DEBUG,
  instrumentations: [new UncaughtExceptionInstrumentation()],
});
sdk.start();

function onErrorClick() {
  throw new Error('test error');
}

function onStringErrorClick() {
  throw 'string error';
}

function onTraceClick() {
  let span = trace
    .getTracer('honeycomb-react-native-example')
    .startSpan('button-click');
  console.log('the trace button was clicked!');
  span.end();
}

export default function App() {
  const [statusText, setStatusText] = useState('');

  async function onFlushClick() {
    setStatusText('Flushing...');
    await sdk.shutdown();
    setStatusText('Flushed');
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Button
          onPress={onTraceClick}
          title="Send a trace"
          testID="send_trace"
          color="#841584"
          accessibilityLabel="send_trace_button"
        />
        <Button
          onPress={onFlushClick}
          title="Flush"
          testID="flush"
          color="#841584"
          accessibilityLabel="flush_button"
        />
        <Button
          onPress={onErrorClick}
          title="Throw an Error"
          testID="throw_error"
          color="#841515"
          accessibilityLabel="throw_error_button"
        />
        <Button
          onPress={onStringErrorClick}
          title="Throw a String"
          testID="throw_string"
          color="#841515"
          accessibilityLabel="throw_string_button"
        />
        <Text id="status" testID="status">
          {statusText}
        </Text>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
