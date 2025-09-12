#import "HoneycombReactNative.h"

@implementation HNYHoneycombReactNative

+ (void)configure:(HNYOptions *)config {
  [HNYReactNativeWrapper configure:config];
}

+ (HNYOptions *)optionsBuilder {
  return [HNYReactNativeWrapper optionsBuilder];
}

@end
