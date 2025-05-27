import {
  createStaticNavigation,
  useNavigationContainerRef,
  type StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import { init as honeyInit } from './honeycomb';
import { NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';
import ErrorScreen from './ErrorScreen';

honeyInit();

const RootStack = createNativeStackNavigator({
  screens: {
    Main: MainScreen,
    Errors: ErrorScreen,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const navRef = useNavigationContainerRef<ReactNavigation.RootParamList>();

  return (
    <NavigationInstrumentation ref={navRef}>
      <Navigation ref={navRef} />
    </NavigationInstrumentation>
  );
}
