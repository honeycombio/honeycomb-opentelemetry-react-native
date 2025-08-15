#import "HoneycombReactNative.h"

@implementation HoneycombReactNative

+ (void)configure:(Builder *)config {
  [HoneycombWrapper configure:config];
}

+ (Builder *)builder {
  return [HoneycombWrapper builder];
}

@end
