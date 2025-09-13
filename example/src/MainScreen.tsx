import { trace } from '@opentelemetry/api';
import { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { localhost, sdk } from './honeycomb';
import { useNavigation } from '@react-navigation/native';

function onTraceClick() {
  let span = trace
    .getTracer('honeycomb-react-native-example')
    .startSpan('button-click');
  console.log('the trace button was clicked!');
  span.end();
}

async function sendNetworkRequest() {
  const url = new URL(`http://${localhost}:1080/simple-api`);
  try {
    const response = await fetch(url);
    console.log(response);
  } catch (e) {
    console.error(e);
  }
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
        onPress={async () => {
          setStatusText('fetch started.');
          await sendNetworkRequest();
          setStatusText('fetch complete');
        }}
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
      <Button
        onPress={() => navigation.navigate('Resources')}
        title="Resource Attributes"
        testID="goto_resources"
        color="#28a745"
        accessibilityLabel="navigate_to_resources"
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
    gap: 12,
    padding: 20,
  },
});
