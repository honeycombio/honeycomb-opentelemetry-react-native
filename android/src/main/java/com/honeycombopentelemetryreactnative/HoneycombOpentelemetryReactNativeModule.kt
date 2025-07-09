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
  }
}
