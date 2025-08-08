import Honeycomb

@objc public class HoneycombWrapper: NSObject {
    @objc public static func builder() -> HoneycombConfigure {
        return HoneycombConfigure()
    }

    @objc public static func configure(_ configure: HoneycombConfigure) {
        do {
            try Honeycomb.configure(options: configure.build())
        } catch {
            NSException(name: NSExceptionName("HoneycombOptionsError"), reason: "\(error)").raise()
        }
    }

    @objc public static func sessionId() -> String? {
        return Honeycomb.currentSession()?.id
    }
}
