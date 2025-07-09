package com.honeycombopentelemetryreactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = HoneycombOpentelemetryReactNativeModule.NAME)
class HoneycombOpentelemetryReactNativeModule(reactContext: ReactApplicationContext) :
  NativeHoneycombOpentelemetryReactNativeSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"

    const val otelRum = null;

    fun configure() : void {
                val options =
            HoneycombOptions
                .builder()
                .setApiKey("test-key")
                .setApiEndpoint("http://10.0.2.2:4318")
                .setServiceName("reactnative-example")
                .setMetricsDataset("reactnative-example-metrics")
                .setDebug(true)
                .build()

        otelRum = Honeycomb.configure(this, options)
    }
  }
}
