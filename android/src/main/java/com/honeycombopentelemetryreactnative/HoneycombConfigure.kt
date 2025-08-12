package com.honeycombopentelemetryreactnative

import android.app.Application
import io.honeycomb.opentelemetry.android.HoneycombOptions
import io.honeycomb.opentelemetry.android.OtlpProtocol
import io.opentelemetry.sdk.logs.LogRecordProcessor
import io.opentelemetry.sdk.trace.SpanProcessor
import kotlin.time.Duration

class HoneycombConfigure(private val context: Application) {
    private val builder : HoneycombOptions.Builder

    init {
        builder = HoneycombOptions.builder(context)
    }

    fun setApiKey(apiKey: String): HoneycombConfigure {
        builder.setApiKey(apiKey)
        return this
    }

    fun setTracesApiKey(apiKey: String): HoneycombConfigure {
        builder.setTracesApiKey(apiKey)
        return this
    }

    fun setMetricsApiKey(apiKey: String): HoneycombConfigure {
        builder.setMetricsApiKey(apiKey)
        return this
    }

    fun setLogsApiKey(apiKey: String): HoneycombConfigure {
        builder.setLogsApiKey(apiKey)
        return this
    }

    fun setDataset(dataset: String): HoneycombConfigure {
        builder.setDataset(dataset)
        return this
    }

    fun setMetricsDataset(dataset: String): HoneycombConfigure {
        builder.setMetricsDataset(dataset)
        return this
    }

    fun setApiEndpoint(endpoint: String): HoneycombConfigure {
        builder.setApiEndpoint(endpoint)
        return this
    }

    fun setTracesApiEndpoint(endpoint: String): HoneycombConfigure {
        builder.setTracesApiEndpoint(endpoint)
        return this
    }

    fun setMetricsApiEndpoint(endpoint: String): HoneycombConfigure {
        builder.setMetricsApiEndpoint(endpoint)
        return this
    }

    fun setLogsApiEndpoint(endpoint: String): HoneycombConfigure {
        builder.setLogsApiEndpoint(endpoint)
        return this
    }

    fun setLogRecordProcessor(logRecordProcessor: LogRecordProcessor): HoneycombConfigure {
        builder.setLogRecordProcessor(logRecordProcessor)
        return this
    }

    fun setSpanProcessor(spanProcessor: SpanProcessor): HoneycombConfigure {
        builder.setSpanProcessor(spanProcessor)
        return this
    }

    fun setSampleRate(sampleRate: Int): HoneycombConfigure {
        builder.setSampleRate(sampleRate)
        return this
    }

    fun setDebug(debug: Boolean): HoneycombConfigure {
        builder.setDebug(debug)
        return this
    }

    fun setServiceName(serviceName: String): HoneycombConfigure {
        builder.setServiceName(serviceName)
        return this
    }

    fun setServiceVersion(appVersion: String): HoneycombConfigure {
        builder.setServiceVersion(appVersion)
        return this
    }

    fun setResourceAttributes(resources: Map<String, String>): HoneycombConfigure {
        builder.setResourceAttributes(resources)
        return this
    }

    fun setHeaders(headers: Map<String, String>): HoneycombConfigure {
        builder.setHeaders(headers)
        return this
    }

    fun setTracesHeaders(headers: Map<String, String>): HoneycombConfigure {
        builder.setTracesHeaders(headers)
        return this
    }

    fun setMetricsHeaders(headers: Map<String, String>): HoneycombConfigure {
        builder.setMetricsHeaders(headers)
        return this
    }

    fun setLogsHeaders(headers: Map<String, String>): HoneycombConfigure {
        builder.setLogsHeaders(headers)
        return this
    }

    fun setTimeout(timeout: Duration): HoneycombConfigure {
        builder.setTimeout(timeout)
        return this
    }

    fun setTracesTimeout(timeout: Duration): HoneycombConfigure {
        builder.setTracesTimeout(timeout)
        return this
    }

    fun setMetricsTimeout(timeout: Duration): HoneycombConfigure {
        builder.setMetricsTimeout(timeout)
        return this
    }

    fun setLogsTimeout(timeout: Duration): HoneycombConfigure {
        builder.setLogsTimeout(timeout)
        return this
    }

    fun setProtocol(protocol: OtlpProtocol): HoneycombConfigure {
        builder.setProtocol(protocol)
        return this
    }

    fun setTracesProtocol(protocol: OtlpProtocol): HoneycombConfigure {
        builder.setTracesProtocol(protocol)
        return this
    }

    fun setMetricsProtocol(protocol: OtlpProtocol): HoneycombConfigure {
        builder.setMetricsProtocol(protocol)
        return this
    }

    fun setLogsProtocol(protocol: OtlpProtocol): HoneycombConfigure {
        builder.setLogsProtocol(protocol)
        return this
    }

    fun setOfflineCachingEnabled(enabled: Boolean): HoneycombConfigure {
        builder.setOfflineCachingEnabled(enabled)
        return this
    }

    internal fun getContext() : Application {
        return context
    }

    internal fun build() : HoneycombOptions {
        return builder.build()
    }
}
