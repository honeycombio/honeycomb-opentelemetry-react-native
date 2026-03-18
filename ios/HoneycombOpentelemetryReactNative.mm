#import "HoneycombOpentelemetryReactNative.h"
#import <HoneycombOpentelemetryReactNative/HoneycombOpentelemetryReactNative-Swift.h>

@implementation HoneycombOpentelemetryReactNative
RCT_EXPORT_MODULE()

- (instancetype)init {
  self = [super init];
  if (self) {
    // Reset the start time each time the JS bridge restarts so we don't
    // retain a stale cold-start timestamp across Activity recreations.
    [HNYReactNativeWrapper resetStartTime];
  }
  return self;
}

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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDebugSourceMapUUID) {
  return [HNYReactNativeWrapper debugSourceMapUUID];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getResource) {
  return [HNYReactNativeWrapper getResource];
}

@end
