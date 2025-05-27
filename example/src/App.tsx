import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import { init as honeyInit } from './honeycomb';

honeyInit();

const RootStack = createNativeStackNavigator({
  screens: {
    Main: MainScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
