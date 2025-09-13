import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getSessionId(): string | null;
  getResource(): {
    [key: string]: string | number | boolean;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'HoneycombOpentelemetryReactNative'
);
