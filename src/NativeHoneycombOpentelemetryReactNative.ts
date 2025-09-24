import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getSessionId(): string | null;
  getDebugSourceMapUUID(): string | null;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'HoneycombOpentelemetryReactNative'
);
