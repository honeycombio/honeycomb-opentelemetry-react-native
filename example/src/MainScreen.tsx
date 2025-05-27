import { trace } from '@opentelemetry/api';
import { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { sdk } from './honeycomb';

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

export default function MainScreen() {
  const [statusText, setStatusText] = useState('');

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
