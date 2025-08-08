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

  override fun getSessionId(): String? {
    return HoneycombOpentelemetryReactNativeModule.otelRum?.rumSessionId
  }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"

    var otelRum : OpenTelemetryRum? = null

    fun builder(app: Application): HoneycombOptions.Builder {
        return HoneycombOptions.builder(app)
          .setResourceAttributes(mapOf(
            TELEMETRY_DISTRO_NAME.key to "@honeycombio/opentelemetry-react-native",
            "honeycomb.distro.runtime_version" to "react native",
            "telemetry.sdk.language" to "hermesjs"))
    }

    fun configure(app: Application, builder: HoneycombOptions.Builder) {

      val options = builder.build()

      otelRum = Honeycomb.configure(app, options)
    }
  }
}
