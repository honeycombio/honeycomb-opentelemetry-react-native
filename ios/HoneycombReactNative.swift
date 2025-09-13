import Honeycomb

@objc(HNYReactNativeWrapper) public class HoneycombReactNative: NSObject {

    @objc public static func optionsBuilder() -> HoneycombOptions.Builder {
        return HoneycombOptions.Builder()
            // This produces a lot of extra UI events that are not particularly helpful
            .setUIKitInstrumentationEnabled(false)

            // This locks up react native.
            .setURLSessionInstrumentationEnabled(false)
    }

    @objc public static func configure(_ configure: HoneycombOptions.Builder) {
        do {
            try Honeycomb.configure(options: configure.build())
        } catch {
            NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
        }
    }

    @objc public static func sessionId() -> String? {
        return Honeycomb.currentSession()?.id
    }

    @objc public static func getResource() -> [String: Any] {
        let resource = Honeycomb.resource
        var result: [String: Any] = [:]

        for (key, value) in resource.attributes {
            switch value {
            case .string(let str):
                result[key] = str
            case .int(let int):
                result[key] = int
            case .double(let d):
                result[key] = d
            case .bool(let b):
                result[key] = b
            default:
                continue
            }
        }

        return result
    }
}
