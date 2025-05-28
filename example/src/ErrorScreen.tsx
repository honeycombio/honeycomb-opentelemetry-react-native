import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, View } from 'react-native';

function onErrorClick() {
  throw new Error('test error');
}

function onStringErrorClick() {
  throw 'string error';
}

export default function ErrorScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
      <Button
        onPress={() => navigation.navigate('Main')}
        title="Main"
        testID="goto_main"
        color="#2552ab"
        accessibilityLabel="navigate_to_main"
      />
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
