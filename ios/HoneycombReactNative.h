#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface HoneycombReactNative : NSObject
+ (void)configure (HoneycombConfigure *);
+ (HoneycombConfigure *)builder;
@end

NS_ASSUME_NONNULL_END