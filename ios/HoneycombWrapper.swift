import Honeycomb

@objc public class HoneycombWrapper : NSObject {
  @objc public static func configure() {
    do {
        let options = try HoneycombOptions.Builder()
            .setServiceName("reactnative-example")
            .setAPIEndpoint("http://localhost:4318")
            .build()
        try Honeycomb.configure(options: options)
    } catch {
        NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
    }
  }
}
