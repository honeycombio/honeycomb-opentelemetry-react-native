import Honeycomb

@objc public class HoneycombConfigure: NSObject {
    private let builder: HoneycombOptions.Builder
    override internal init() {
        builder = HoneycombOptions.Builder()

            // This produces a lot of extra UI events that are not particularly helpful
            .setUIKitInstrumentationEnabled(false)

            // This locks up react native.
            .setURLSessionInstrumentationEnabled(false)
    }

    @objc public func setAPIKey(_ apiKey: String) -> HoneycombConfigure {
        builder.setAPIKey(apiKey)

        return self
    }

    @objc public func setTracesAPIKey(_ apiKey: String) -> HoneycombConfigure {
        builder.setTracesAPIKey(apiKey)
        return self
    }

    @objc public func setMetricsAPIKey(_ apiKey: String) -> HoneycombConfigure {
        builder.setMetricsAPIKey(apiKey)
        return self
    }

    @objc public func setLogsAPIKey(_ apiKey: String) -> HoneycombConfigure {
        builder.setLogsAPIKey(apiKey)
        return self
    }

    @objc public func setDataset(_ dataset: String) -> HoneycombConfigure {
        builder.setDataset(dataset)
        return self
    }

    @objc public func setMetricsDataset(_ dataset: String) -> HoneycombConfigure {
        builder.setMetricsDataset(dataset)
        return self
    }

    @objc public func setAPIEndpoint(_ endpoint: String) -> HoneycombConfigure {
        builder.setAPIEndpoint(endpoint)
        return self
    }

    @objc public func setTracesAPIEndpoint(_ endpoint: String) -> HoneycombConfigure {
        builder.setTracesAPIEndpoint(endpoint)
        return self
    }

    @objc public func setMetricsAPIEndpoint(_ endpoint: String) -> HoneycombConfigure {
        builder.setMetricsAPIEndpoint(endpoint)
        return self
    }

    @objc public func setLogsAPIEndpoint(_ endpoint: String) -> HoneycombConfigure {
        builder.setLogsAPIEndpoint(endpoint)
        return self
    }

    @objc public func setSampleRate(_ sampleRate: Int) -> HoneycombConfigure {
        builder.setSampleRate(sampleRate)
        return self
    }

    @objc public func setDebug(_ debug: Bool) -> HoneycombConfigure {
        builder.setDebug(debug)
        return self
    }

    @objc public func setServiceName(_ serviceName: String) -> HoneycombConfigure {
        builder.setServiceName(serviceName)
        return self
    }

    @objc public func setServiceVersion(_ serviceVersion: String) -> HoneycombConfigure {
        builder.setServiceVersion(serviceVersion)
        return self
    }

    @objc public func setResourceAttributes(_ resources: [String: String]) -> HoneycombConfigure {
        builder.setResourceAttributes(resources)

        return self
    }

    @objc public func setHeaders(_ headers: [String: String]) -> HoneycombConfigure {
        builder.setHeaders(headers)
        return self
    }

    @objc public func setTracesHeaders(_ headers: [String: String]) -> HoneycombConfigure {
        builder.setTracesHeaders(headers)
        return self
    }

    @objc public func setMetricsHeaders(_ headers: [String: String]) -> HoneycombConfigure {
        builder.setMetricsHeaders(headers)
        return self
    }

    @objc public func setLogsHeaders(_ headers: [String: String]) -> HoneycombConfigure {
        builder.setLogsHeaders(headers)
        return self
    }

    @objc public func setTimeout(_ timeout: TimeInterval) -> HoneycombConfigure {
        builder.setTimeout(timeout)
        return self
    }

    @objc public func setTracesTimeout(_ timeout: TimeInterval) -> HoneycombConfigure {
        builder.setTracesTimeout(timeout)
        return self
    }

    @objc public func setMetricsTimeout(_ timeout: TimeInterval) -> HoneycombConfigure {
        builder.setMetricsTimeout(timeout)
        return self
    }

    @objc public func setLogsTimeout(_ timeout: TimeInterval) -> HoneycombConfigure {
        builder.setLogsTimeout(timeout)
        return self
    }

    @objc public func setSessionTimeout(_ timeout: TimeInterval) -> HoneycombConfigure {
        builder.setSessionTimeout(timeout)
        return self
    }

    @objc public func setMetricKitInstrumentationEnabled(_ enabled: Bool) -> HoneycombConfigure {
        builder.setMetricKitInstrumentationEnabled(enabled)
        return self
    }
    private func setURLSessionInstrumentationEnabled(_ enabled: Bool) -> HoneycombConfigure {
        builder.setURLSessionInstrumentationEnabled(enabled)
        return self
    }
    private func setUIKitInstrumentationEnabled(_ enabled: Bool) -> HoneycombConfigure {
        builder.setUIKitInstrumentationEnabled(enabled)
        return self
    }
    @objc public func setTouchInstrumentationEnabled(_ enabled: Bool) -> HoneycombConfigure {
        builder.setTouchInstrumentationEnabled(enabled)
        return self
    }
    @objc public func setUnhandledExceptionInstrumentationEnabled(_ enabled: Bool)
        -> HoneycombConfigure
    {
        builder.setUnhandledExceptionInstrumentationEnabled(enabled)
        return self
    }

    @objc public func setOfflineCachingEnabled(_ enabled: Bool) -> HoneycombConfigure {
        builder.setOfflineCachingEnabled(enabled)
        return self
    }

    internal func build() throws -> HoneycombOptions {
        return try builder.build()
    }

}
