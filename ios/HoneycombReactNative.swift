import Honeycomb
import OpenTelemetryApi

@objc(HNYReactNativeWrapper) public class HoneycombReactNative: NSObject {
    // In Swift, static members are only initialized when accessed, so we can't set it here.
    private static var startTime: Date? = nil

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

            builder.setResourceAttributes(
                "telemetry.distro.name",
                "@honeycombio/opentelemetry-react-native"
            )

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
