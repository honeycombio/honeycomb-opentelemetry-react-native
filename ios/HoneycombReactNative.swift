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

    @objc public static func configure(_ configure: HoneycombOptions.Builder) {
        if startTime == nil {
            startTime = Date()
        }

        do {
            try Honeycomb.configure(options: configure.build())
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
        return startTime!.timeIntervalSince1970
    }
}
