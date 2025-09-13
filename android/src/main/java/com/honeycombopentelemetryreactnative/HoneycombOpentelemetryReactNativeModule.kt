package com.honeycombopentelemetryreactnative

import android.app.Application
import android.content.Context

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

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

  override fun getResource(): WritableMap {
      val resourceMap: WritableMap = Arguments.createMap()
      Honeycomb.resource.attributes.forEach { key, value ->
        when (value) {
          is String -> resourceMap.putString(key.key, value.toString())
          is Int -> resourceMap.putInt(key.key, value)
          is Double -> resourceMap.putDouble(key.key, value)
          is Boolean -> resourceMap.putBoolean(key.key, value)
          else -> {} // Skip unsupported types
      }
      }

      return resourceMap;
  }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"

    private var otelRum : OpenTelemetryRum? = null

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
