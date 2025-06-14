package com.honeycombopentelemetryreactnative

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import io.honeycomb.opentelemetry.android.HoneycombOptions

private const val TAG = "HoneycombOptions"

// Various helper methods for safely getting optional values out of JavaScript objects.

private fun ReadableMap.optDouble(key: String): Double? {
  if (!this.hasKey(key)) {
    return null
  }
  if (this.getType(key) != ReadableType.Number) {
    return null
  }
  return this.getDouble(key)
}

private fun ReadableMap.optInt(key: String): Int? {
  return this.optDouble(key)?.toInt()
}

private fun ReadableMap.optString(key: String): String? {
  if (!this.hasKey(key)) {
    return null
  }
  if (this.getType(key) != ReadableType.String) {
    return null
  }
  return this.getString(key)
}

private fun ReadableMap.optBoolean(key: String): Boolean? {
  if (!this.hasKey(key)) {
    return null
  }
  if (this.getType(key) != ReadableType.Boolean) {
    return null
  }
  return this.getBoolean(key)
}

private fun ReadableMap.optMap(key: String): ReadableMap? {
  if (!this.hasKey(key)) {
    return null
  }
  if (this.getType(key) != ReadableType.Map) {
    return null
  }
  return this.getMap(key)
}

// Gets an optional Map and converts it to a String->String.
private fun ReadableMap.optStringMap(key: String): Map<String, String>? {
  val map = this.optMap(key)
  return map?.keySetIterator()?.let {
    val result = hashMapOf<String, String>()
    while (it.hasNextKey()) {
      val k = it.nextKey()
      val v = map.optString(k)
      v?.let { result.put(k, it) }
    }
    return result
  }
}

// TODO: Implement this properly or delete it.
// The key names and types are based on HoneycombOptions in:
// https://github.com/honeycombio/honeycomb-opentelemetry-web/blob/69b14d1e3a11fea98ed3a7b491cabc527c46d4b0/packages/honeycomb-opentelemetry-web/src/types.ts#L57
private class HoneycombOptionsJS(val map: ReadableMap) {
  val logLevel = map.optInt("logLevel")
  val debug = map.optBoolean("debug")
  val dataset = map.optString("dataset")
  val serviceName = map.optString("serviceName")
  val apiKey = map.optString("apiKey")
  val endpoint = map.optString("endpoint")
  val tracesApiKey = map.optString("tracesApiKey")
  val tracesEndpoint = map.optString("tracesEndpoint")
  val headers = map.optStringMap("headers")
  val sampleRate = map.optInt("sampleRate")

  // TODO: Figure out if we need to use these fields when configuring the native SDK.
  /*
    textMapPropagator: TextMapPropagator;
    resource: Resource;
    sampler: Sampler;
    spanProcessor?: SpanProcessor;
    spanProcessors?: SpanProcessor[];
    traceExporter: SpanExporter;
    spanProcessors?: SpanProcessor[];
    traceExporters?: SpanExporter[];
    disableDefaultTraceExporter?: boolean;
    resourceAttributes?: DetectedResourceAttributes;
    skipOptionsValidation?: boolean;
    globalErrorsInstrumentationConfig?: GlobalErrorsInstrumentationConfig;
    sessionProvider?: SessionProvider;
  */
}

fun createOptions(context: Context, optionsMap: ReadableMap): HoneycombOptions {
  val options = HoneycombOptionsJS(optionsMap)
  val builder = HoneycombOptions.builder(context)

  options.debug?.let {
    if (it) {
      Log.d(TAG, "options from JS: $optionsMap")
    }
    builder.setDebug(it)
  }

  options.dataset?.let { builder.setDataset(it) }
  options.serviceName?.let { builder.setServiceName(it) }
  options.apiKey?.let { builder.setApiKey(it) }
  options.endpoint?.let { builder.setApiEndpoint(it) }
  options.tracesApiKey?.let { builder.setTracesApiKey(it) }
  options.tracesEndpoint?.let { builder.setTracesApiEndpoint(it) }
  options.headers?.let { builder.setHeaders(it) }
  options.sampleRate?.let { builder.setSampleRate(it) }

  // TODO: Figure out if we should set any of these values.
  /*
    .setMetricsDataset()
    .setServiceVersion()
    .setResourceAttributes()
    .setLogRecordProcessor()
    .setSpanProcessor()
    .setProtocol()
    .setTimeout()
    .setLogsApiEndpoint()
    .setLogsApiKey()
    .setLogsHeaders()
    .setLogsProtocol()
    .setLogsTimeout()
    .setMetricsApiEndpoint()
    .setMetricsApiKey()
    .setMetricsHeaders()
    .setMetricsProtocol()
    .setMetricsTimeout()
    .setTracesHeaders()
    .setTracesProtocol()
    .setTracesTimeout()
    .setOfflineCachingEnabled()
  */

  return builder.build()
}
