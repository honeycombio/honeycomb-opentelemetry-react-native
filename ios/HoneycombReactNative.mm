#import "HoneycombReactNative.h"

@implementation HoneycombReactNative

+ (void)configure:(HoneycombConfigure *)config {
  [HoneycombWrapper configure:config];
}

+ (HoneycombConfigure *)builder {
  return [HoneycombWrapper builder];
}

@end
