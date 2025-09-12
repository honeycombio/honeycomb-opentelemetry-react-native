#import "HoneycombOpentelemetryReactNative.h"
#import <HoneycombOpentelemetryReactNative/HoneycombOpentelemetryReactNative-Swift.h>

@implementation HoneycombOpentelemetryReactNative
RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeHoneycombOpentelemetryReactNativeSpecJSI>(params);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSessionId) {
  return [HNYReactNativeWrapper sessionId];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getAppStartTime) {
  return @([HNYReactNativeWrapper getAppStartTime]);
}

@end
