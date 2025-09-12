import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getSessionId(): string | null;

  // Returns the time the app was first started, in seconds since epoch,
  // with fractional seconds.
  getAppStartTime(): number;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'HoneycombOpentelemetryReactNative'
);
