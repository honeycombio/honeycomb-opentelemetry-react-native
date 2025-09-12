#import <Foundation/Foundation.h>
#import <HoneycombOpentelemetryReactNative/HoneycombOpentelemetryReactNative-Swift.h>

NS_ASSUME_NONNULL_BEGIN

@interface HNYHoneycombReactNative : NSObject
+ (void)configure:(HNYOptions *)config;
+ (HNYOptions *)optionsBuilder;
@end

NS_ASSUME_NONNULL_END
