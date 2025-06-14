package com.honeycombopentelemetryreactnative

import android.app.Application
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import io.honeycomb.opentelemetry.android.Honeycomb
import java.util.concurrent.Semaphore

private const val TAG = "HoneycombOpentelemetryReactNativeModule"

@ReactModule(name = HoneycombOpentelemetryReactNativeModule.NAME)
class HoneycombOpentelemetryReactNativeModule(val reactContext: ReactApplicationContext) :
  NativeHoneycombOpentelemetryReactNativeSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  // TODO: Document that developers have to open the example app in Android Studio.
  // TODO: Implement this properly.
  override fun configure(optionsMap: ReadableMap): Boolean {
    val options = createOptions(reactContext, optionsMap)
    val app = reactContext.applicationContext as? Application
    if (app == null) {
      Log.e(TAG, "Unable to configure Honeycomb Android SDK: context is not an Application")
      return false
    }
    val semaphore = Semaphore(1)
    semaphore.acquire()
    Handler(Looper.getMainLooper()).post {
      try {
        val _ = Honeycomb.configure(app, options)
      } catch (e: Throwable) {
        Log.e(TAG, "Unable to configure Honeycomb Android SDK: $e")
      } finally {
        semaphore.release()
      }
    }
    semaphore.acquire()
    return true
  }

  companion object {
    const val NAME = "HoneycombOpentelemetryReactNative"
  }
}
