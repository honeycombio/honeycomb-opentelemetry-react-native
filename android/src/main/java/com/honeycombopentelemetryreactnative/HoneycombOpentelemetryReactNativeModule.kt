package com.honeycombopentelemetryreactnative

import android.app.Application

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

import io.opentelemetry.android.OpenTelemetryRum
import io.opentelemetry.semconv.incubating.TelemetryIncubatingAttributes.TELEMETRY_DISTRO_NAME

import io.honeycomb.opentelemetry.android.Honeycomb
import io.honeycomb.opentelemetry.android.HoneycombOptions

@ReactModule(name = HoneycombOpentelemetryReactNativeModule.NAME)
class HoneycombOpentelemetryReactNativeModule(reactContext: ReactApplicationContext) :
  NativeHoneycombOpentelemetryReactNativeSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"

    var otelRum : OpenTelemetryRum? = null

    fun configure(app: Application) {
      val options =
        HoneycombOptions
          .builder(app)
          .setApiKey("test-key")
          .setApiEndpoint("http://10.0.2.2:4318")
          .setServiceName("reactnative-example")
          .setMetricsDataset("reactnative-example-metrics")
          .setResourceAttributes(mapOf( 
            TELEMETRY_DISTRO_NAME.key to "@honeycombio/opentelemetry-react-native",
            "honeycomb.distro.runtime_version" to "react native",
            "telemetry.sdk.language" to "hermesjs"))
          .setDebug(true)
          .build()

      otelRum = Honeycomb.configure(app, options)
    }
  }
}
