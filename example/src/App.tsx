import { Button, Platform, Text, View, StyleSheet } from 'react-native';
import {
  HoneycombReactNativeSDK,
  multiply,
} from '@honeycombio/opentelemetry-react-native';
import { DiagLogLevel, trace } from '@opentelemetry/api';

function onTraceClick() {
  let span = trace
    .getTracer('honeycomb-react-native-example')
    .startSpan('button-click');
  console.log('the trace button was clicked!');
  span.end();
}

const result = multiply(3, 7);

const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

const sdk = new HoneycombReactNativeSDK({
  endpoint: `http://${localhost}:4318`,
  serviceName: 'reactnative-demo-web',
  logLevel: DiagLogLevel.DEBUG,
});
sdk.start();

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        onPress={onTraceClick}
        title="Send a trace."
        testID="send_trace"
        color="#841584"
        accessibilityLabel="trace_demo_button"
      />
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
