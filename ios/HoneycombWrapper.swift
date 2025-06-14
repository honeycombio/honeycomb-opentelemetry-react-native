import Foundation
import Honeycomb
import OpenTelemetryApi

@objc public class HoneycombWrapper : NSObject {
  @objc public var sessionId: String? {
    get {
      return Honeycomb.currentSession()?.id
    }
  }
  
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

  @objc public func sendSpan(parentId: String?, traceId: String?) {
    let tracerProvider = OpenTelemetry.instance.tracerProvider.get(
        instrumentationName: "swift sdk",
        instrumentationVersion: nil
    )

    var spanBuilder = tracerProvider
      .spanBuilder(spanName: "child span")
    
    if let traceId = traceId, let parentId = parentId {
      spanBuilder = spanBuilder.setParent(SpanContext.createFromRemoteParent(
        traceId: TraceId(fromHexString: traceId),
        spanId: SpanId(fromHexString: parentId),
        traceFlags: TraceFlags(),
        traceState: TraceState()))
    }
    
    let span = spanBuilder.startSpan()
    span.end()
  }
}
