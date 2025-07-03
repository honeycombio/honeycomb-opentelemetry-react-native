#import "HoneycombOpentelemetryReactNative.h"

#import <Foundation/Foundation.h>
#import <HoneycombOpentelemetryReactNative/HoneycombOpentelemetryReactNative-Swift.h>

@implementation HoneycombOpentelemetryReactNative
RCT_EXPORT_MODULE()

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (NSNumber *)configure:(NSDictionary *)options {
    NSLog(@"configure has been called");

    HoneycombWrapper *wrapper = [[HoneycombWrapper alloc] init];

    [wrapper configure];

    return @YES;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeHoneycombOpentelemetryReactNativeSpecJSI>(params);
}

@end
