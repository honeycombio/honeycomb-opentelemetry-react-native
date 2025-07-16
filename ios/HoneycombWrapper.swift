import Honeycomb

@objc public class HoneycombWrapper : NSObject {
  @objc public static func configure() {
    do {
      let options = try HoneycombOptions.Builder()
        .setAPIKey("test-key")
        .setServiceName("reactnative-example")
        .setAPIEndpoint("http://localhost:4318")
        .setDebug(true)
      
        // This produces a lot of extra UI events that are not particularly helpful
        .setUIKitInstrumentationEnabled(false)
      
        // This locks up react native.
        .setURLSessionInstrumentationEnabled(false)
        .build()
      try Honeycomb.configure(options: options)
    } catch {
      NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
    }
  }

  @objc public static func sessionId() -> String? {
    return Honeycomb.currentSession()?.id
  }
}
