import Honeycomb
import OpenTelemetryApi

@objc(HNYReactNativeWrapper) public class HoneycombReactNative: NSObject {
    // In Swift, static members are only initialized when accessed, so we can't set it here.
    private static var startTime: Date? = nil
    private static var startSpan: Span? = nil

    @objc public static func optionsBuilder() -> HoneycombOptions.Builder {
        if startTime == nil {
            startTime = Date()
        }

        return HoneycombOptions.Builder()
            // This produces a lot of extra UI events that are not particularly helpful
            .setUIKitInstrumentationEnabled(false)

            // This locks up react native.
            .setURLSessionInstrumentationEnabled(false)
    }

    @objc public static func configure(_ builder: HoneycombOptions.Builder) {
        if startTime == nil {
            startTime = Date()
        }

        do {
            if let sourceMapUuid = Bundle.main.object(
                forInfoDictionaryKey: "app.debug.source_map_uuid"
            ) as? String {
                builder.setResourceAttributes(["app.debug.source_map_uuid": sourceMapUuid])
            }

            try Honeycomb.configure(options: builder.build())
        } catch {
            NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
        }
    }

    @objc public static func sessionId() -> String? {
        return Honeycomb.currentSession()?.id
    }

    @objc public static func getAppStartTime() -> Double {
        if startTime == nil {
            startTime = Date()
        }
        // Convert the TimeInterval to milliseconds, for JavaScript.
        return startTime!.timeIntervalSince1970 * 1000.0
    }

    @objc public static func debugSourceMapUUID() -> String? {
        return Bundle.main.object(forInfoDictionaryKey: "app.debug.source_map_uuid") as? String
    }
}
