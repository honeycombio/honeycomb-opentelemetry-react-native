import Honeycomb

@objc public class HoneycombWrapper : NSObject {
  @objc public func configure() {
    do {
        let options = try HoneycombOptions.Builder()
            .setAPIKey("some-key")
            .setServiceName("reactnative-demo-ios")
            .setAPIEndpoint("https://api-dogfood.honeycomb.io")
            .build()
        try Honeycomb.configure(options: options)
    } catch {
        NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
    }
  }
}
