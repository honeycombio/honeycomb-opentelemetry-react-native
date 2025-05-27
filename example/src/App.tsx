import {
  createStaticNavigation,
  useNavigationContainerRef,
  type ParamListBase,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import { init as honeyInit } from './honeycomb';
import { NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';

honeyInit();

const RootStack = createNativeStackNavigator({
  screens: {
    Main: MainScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const navRef = useNavigationContainerRef<ParamListBase>();

  return (
    <NavigationInstrumentation ref={navRef}>
      <Navigation ref={navRef} />
    </NavigationInstrumentation>
  );
}
