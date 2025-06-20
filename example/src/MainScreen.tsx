import { trace } from '@opentelemetry/api';
import { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { sdk } from './honeycomb';
import { useNavigation } from '@react-navigation/native';

function onTraceClick() {
  let span = trace
    .getTracer('honeycomb-react-native-example')
    .startSpan('button-click');
  console.log('the trace button was clicked!');
  span.end();
}

async function sendNetworkRequest() {
  await fetch('honeycomb.io.test/testget');
}

export default function MainScreen() {
  const [statusText, setStatusText] = useState('');

  const navigation = useNavigation();

  async function onFlushClick() {
    setStatusText('Flushing...');
    await sdk.shutdown();
    setStatusText('Flushed');
  }

  return (
    <View style={styles.container}>
      <Button
        onPress={onTraceClick}
        title="Send a trace"
        testID="send_trace"
        color="#841584"
        accessibilityLabel="send_trace_button"
      />
      <Button
        onPress={sendNetworkRequest}
        title="Send a network request"
        testID="send_network_request"
        color="#841584"
        accessibilityLabel="send_network_request"
      />
      <Button
        onPress={onFlushClick}
        title="Flush"
        testID="flush"
        color="#841584"
        accessibilityLabel="flush_button"
      />
      <Button
        onPress={() => navigation.navigate('Errors')}
        title="Errors"
        testID="goto_errors"
        color="#2552ab"
        accessibilityLabel="navigate_to_errors"
      />
      <Text id="status" testID="status">
        {statusText}
      </Text>
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
