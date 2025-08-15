#import <Foundation/Foundation.h>
#import <HoneycombOpentelemetryReactNative/HoneycombOpentelemetryReactNative-Swift.h>

NS_ASSUME_NONNULL_BEGIN

@interface HoneycombReactNative : NSObject
+ (void)configure:(Builder *)config;
+ (Builder *)builder;
@end

NS_ASSUME_NONNULL_END
