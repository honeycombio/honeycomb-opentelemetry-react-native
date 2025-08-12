package com.honeycombopentelemetryreactnative

import android.app.Application
import android.content.Context
import io.honeycomb.opentelemetry.android.HoneycombOptions
import io.honeycomb.opentelemetry.android.OtlpProtocol
import io.opentelemetry.sdk.logs.LogRecordProcessor
import io.opentelemetry.sdk.trace.SpanProcessor
import kotlin.time.Duration

class HoneycombConfig(private val context: Application) {
    private val builder : HoneycombOptions.Builder

    init {
        builder = HoneycombOptions.builder(context)
    }

    fun setApiKey(apiKey: String): HoneycombConfig {
        builder.setApiKey(apiKey)
        return this
    }

    fun setTracesApiKey(apiKey: String): HoneycombConfig {
        builder.setTracesApiKey(apiKey)
        return this
    }

    fun setMetricsApiKey(apiKey: String): HoneycombConfig {
        builder.setMetricsApiKey(apiKey)
        return this
    }

    fun setLogsApiKey(apiKey: String): HoneycombConfig {
        builder.setLogsApiKey(apiKey)
        return this
    }

    fun setDataset(dataset: String): HoneycombConfig {
        builder.setDataset(dataset)
        return this
    }

    fun setMetricsDataset(dataset: String): HoneycombConfig {
        builder.setMetricsDataset(dataset)
        return this
    }

    fun setApiEndpoint(endpoint: String): HoneycombConfig {
        builder.setApiEndpoint(endpoint)
        return this
    }

    fun setTracesApiEndpoint(endpoint: String): HoneycombConfig {
        builder.setTracesApiEndpoint(endpoint)
        return this
    }

    fun setMetricsApiEndpoint(endpoint: String): HoneycombConfig {
        builder.setMetricsApiEndpoint(endpoint)
        return this
    }

    fun setLogsApiEndpoint(endpoint: String): HoneycombConfig {
        builder.setLogsApiEndpoint(endpoint)
        return this
    }

    fun setLogRecordProcessor(logRecordProcessor: LogRecordProcessor): HoneycombConfig {
        builder.setLogRecordProcessor(logRecordProcessor)
        return this
    }

    fun setSpanProcessor(spanProcessor: SpanProcessor): HoneycombConfig {
        builder.setSpanProcessor(spanProcessor)
        return this
    }

    fun setSampleRate(sampleRate: Int): HoneycombConfig {
        builder.setSampleRate(sampleRate)
        return this
    }

    fun setDebug(debug: Boolean): HoneycombConfig {
        builder.setDebug(debug)
        return this
    }

    fun setServiceName(serviceName: String): HoneycombConfig {
        builder.setServiceName(serviceName)
        return this
    }

    fun setServiceVersion(appVersion: String): HoneycombConfig {
        builder.setServiceVersion(appVersion)
        return this
    }

    fun setResourceAttributes(resources: Map<String, String>): HoneycombConfig {
        builder.setResourceAttributes(resources)
        return this
    }

    fun setHeaders(headers: Map<String, String>): HoneycombConfig {
        builder.setHeaders(headers)
        return this
    }

    fun setTracesHeaders(headers: Map<String, String>): HoneycombConfig {
        builder.setTracesHeaders(headers)
        return this
    }

    fun setMetricsHeaders(headers: Map<String, String>): HoneycombConfig {
        builder.setMetricsHeaders(headers)
        return this
    }

    fun setLogsHeaders(headers: Map<String, String>): HoneycombConfig {
        builder.setLogsHeaders(headers)
        return this
    }

    fun setTimeout(timeout: Duration): HoneycombConfig {
        builder.setTimeout(timeout)
        return this
    }

    fun setTracesTimeout(timeout: Duration): HoneycombConfig {
        builder.setTracesTimeout(timeout)
        return this
    }

    fun setMetricsTimeout(timeout: Duration): HoneycombConfig {
        builder.setMetricsTimeout(timeout)
        return this
    }

    fun setLogsTimeout(timeout: Duration): HoneycombConfig {
        builder.setLogsTimeout(timeout)
        return this
    }

    fun setProtocol(protocol: OtlpProtocol): HoneycombConfig {
        builder.setProtocol(protocol)
        return this
    }

    fun setTracesProtocol(protocol: OtlpProtocol): HoneycombConfig {
        builder.setTracesProtocol(protocol)
        return this
    }

    fun setMetricsProtocol(protocol: OtlpProtocol): HoneycombConfig {
        builder.setMetricsProtocol(protocol)
        return this
    }

    fun setLogsProtocol(protocol: OtlpProtocol): HoneycombConfig {
        builder.setLogsProtocol(protocol)
        return this
    }

    fun setOfflineCachingEnabled(enabled: Boolean): HoneycombConfig {
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
