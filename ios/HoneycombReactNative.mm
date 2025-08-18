#import "HoneycombReactNative.h"

@implementation HNYHoneycombReactNative

+ (void)configure:(Builder *)config {
  [HNYReactNativeWrapper configure:config];
}

+ (Builder *)optionsBuilder {
  return [HNYReactNativeWrapper optionsBuilder];
}

@end
