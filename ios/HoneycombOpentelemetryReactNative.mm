#import "HoneycombOpentelemetryReactNative.h"

@implementation HoneycombOpentelemetryReactNative
RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeHoneycombOpentelemetryReactNativeSpecJSI>(params);
}

@end
