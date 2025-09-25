import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getSessionId(): string | null;

  // Returns the time the app was first started in ms since epoch, like a JS timestamp.
  getAppStartTime(): number;

  getDebugSourceMapUUID(): string | null;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'HoneycombOpentelemetryReactNative'
);
