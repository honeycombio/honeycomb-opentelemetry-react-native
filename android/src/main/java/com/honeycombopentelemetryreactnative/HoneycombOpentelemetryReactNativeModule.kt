package com.honeycombopentelemetryreactnative

import android.app.Application
import android.content.Context

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

import io.opentelemetry.android.OpenTelemetryRum
import io.opentelemetry.semconv.incubating.TelemetryIncubatingAttributes.TELEMETRY_DISTRO_NAME

import io.honeycomb.opentelemetry.android.Honeycomb
import io.honeycomb.opentelemetry.android.HoneycombOptions
import java.time.Instant

@ReactModule(name = HoneycombOpentelemetryReactNativeModule.NAME)
class HoneycombOpentelemetryReactNativeModule(reactContext: ReactApplicationContext) :
  NativeHoneycombOpentelemetryReactNativeSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun getSessionId(): String? {
    return HoneycombOpentelemetryReactNativeModule.otelRum?.rumSessionId
  }

    override fun getAppStartTime(): Double {
        val seconds = HoneycombOpentelemetryReactNativeModule.appStartTime.epochSecond.toDouble()
        val nanos = HoneycombOpentelemetryReactNativeModule.appStartTime.nano.toDouble()
        return seconds + nanos / 1_000_000_000.0
    }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"

    private var otelRum : OpenTelemetryRum? = null
      private var appStartTime: Instant = Instant.now()

    fun optionsBuilder(context: Context): HoneycombOptions.Builder {
        return HoneycombOptions.builder(context)
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
