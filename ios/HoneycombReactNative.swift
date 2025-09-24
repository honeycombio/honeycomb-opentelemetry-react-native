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
            if let sourceMapUuid = Bundle.main.object(
                forInfoDictionaryKey: "app.debug.source_map_uuid"
            ) as? String {
                configure.setResourceAttributes(["app.debug.source_map_uuid": sourceMapUuid])
            }

            try Honeycomb.configure(options: configure.build())
        } catch {
            NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
        }
    }

    @objc public static func sessionId() -> String? {
        return Honeycomb.currentSession()?.id
    }

    @objc public static func debugSourceMapUUID() -> String? {
        return Bundle.main.object(forInfoDictionaryKey: "app.debug.source_map_uuid") as? String
    }
}
