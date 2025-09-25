package com.honeycombopentelemetryreactnative

import android.app.Application
import android.content.Context
import android.content.pm.PackageManager

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

  override fun getAppStartTime(): Double {
    return HoneycombOpentelemetryReactNativeModule.appStartTimeMillis.toDouble()
  }

  override fun getDebugSourceMapUUID(): String? {
    return HoneycombOpentelemetryReactNativeModule.sourceMapUuid
  }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"

    private var otelRum : OpenTelemetryRum? = null
    private var appStartTimeMillis = System.currentTimeMillis()
    private var sourceMapUuid: String? = null

    fun optionsBuilder(context: Context): HoneycombOptions.Builder {
      return HoneycombOptions.builder(context)
          .setResourceAttributes(mapOf(
              TELEMETRY_DISTRO_NAME.key to "@honeycombio/opentelemetry-react-native",
              "honeycomb.distro.runtime_version" to "react native",
              "telemetry.sdk.language" to "hermesjs"))
    }

    fun configure(app: Application, builder: HoneycombOptions.Builder) {
      val packageManager = app.packageManager
      val applicationInfo =
        packageManager.getApplicationInfo(
          app.packageName,
          PackageManager.GET_META_DATA,
        )
      sourceMapUuid = applicationInfo.metaData?.getString("app.debug.source_map_uuid")

      if (sourceMapUuid != null) {
        builder.setResourceAttributes(mapOf("app.debug.source_map_uuid" to sourceMapUuid as String))
      }

      val options = builder.build()
      otelRum = Honeycomb.configure(app, options)
    }
  }
}
