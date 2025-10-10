# Honeycomb React Native SDK Changelog

## v.Next

- docs: Add CLAUDE.md development guide for AI assistants

## v0.7.0

- feat: Allow differentiation of telemetry based on build type.
- maint: Update Android SDK from 0.0.16 to 0.0.19
- maint: Update Swift SDK from 2.1.0 to 2.1.2

## v0.6.1

- Update `app startup` event name to `react native startup`

## v0.6.0

- feat: Sync Resource attributes between native extensions and JavaScript
- feat: Add app startup instrumentation
- feat: Adds an expo plugin which inserts embeds a unique build id to be used for source map symbolication
- fix: OS name capitalization are now consistent across modules and JS
- docs: Native Module documentation updated to include important configuration steps
- maint: Update Web SDK from 0.0.17 to 1.0.2
- maint: Update Android SDK from 0.0.16 to 0.0.18
- maint: Update Swift SDK from 0.0.16 to 2.1.0

## v0.5.0

- feat: Sync session ID between TypeScript and native SDKs
- feat: configurable native extensions

## v0.4.0

- feat: `fetch` and `uncaught exception` instrumentation are included and enabled by default
- feat: Resources Attributes now match React native environment
- feat: OS name and version now included in resource attributes
- feat: Slow event loop auto-instrumentation

## v0.3.0

- feat: Automatic Releasing via CI
- feat: Navigation Instrumentation for Expo Router and React Native Router
- feat: Create `HoneycombReactNativeSDK` and `HoneycombReactNativeOptions`
- feat: Uncaught Exception handler
- feat: Create `HoneycombReactNativeSDK` and `HoneycombReactNativeOptions`
- chore: Need to specify that this is a public npm package
