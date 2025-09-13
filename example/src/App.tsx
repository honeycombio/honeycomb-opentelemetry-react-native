import {
  createStaticNavigation,
  useNavigationContainerRef,
  type StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import { init as initHoneycomb } from './honeycomb';
import { NavigationInstrumentation } from '@honeycombio/opentelemetry-react-native';
import ErrorScreen from './ErrorScreen';
import ResourcesScreen from './ResourcesScreen';

initHoneycomb();

const RootStack = createNativeStackNavigator({
  screens: {
    Main: MainScreen,
    Errors: ErrorScreen,
    Resources: ResourcesScreen,
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
  const navRef = useNavigationContainerRef<RootStackParamList>();

  return (
    <NavigationInstrumentation ref={navRef}>
      <Navigation ref={navRef} />
    </NavigationInstrumentation>
  );
}
