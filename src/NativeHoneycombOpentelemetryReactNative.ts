import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  multiply(a: number, b: number): number;
  configure(options: Object): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'HoneycombOpentelemetryReactNative'
);
