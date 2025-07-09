#import "HoneycombReactNative.h"
#import "HoneycombOpentelemetryReactNative-Swift.h"

@implementation HoneycombReactNative

+ (void) configure {
    HoneycombWrapper *wrapper = [[HoneycombWrapper alloc] init];

    [wrapper configure];
}

@end

