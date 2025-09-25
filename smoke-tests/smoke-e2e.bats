#!/usr/bin/env bats

export LC_ALL=C

load test_helpers/utilities

SMOKE_TEST_SCOPE="honeycomb-react-native-example"

setup_file() {
  echo "# 🚧 preparing test" >&3
}

@test "SDK can send spans" {
  result=$(span_names_for ${SMOKE_TEST_SCOPE})
  assert_equal "$result" '"button-click"'
}

@test "Default resources are included on spans" {

  result=$(resource_attributes_received | jq '.key' | sort | uniq)

  ANDROID_RESOURCE_ATTR_LIST=$(cat <<'EOF'
"device.id"
"device.manufacturer"
"device.model.identifier"
"device.model.name"
"honeycomb.distro.runtime_version"
"honeycomb.distro.version"
"os.description"
"os.name"
"os.type"
"os.version"
"rum.sdk.version"
"service.name"
"telemetry.distro.name"
"telemetry.distro.version"
"telemetry.sdk.language"
"telemetry.sdk.name"
"telemetry.sdk.version"
EOF
)
# Because the pass through the resource attributes from the native layer to the RN layer, on ios, we'll have additional resource attributes that are not available on android.
IOS_RESOURCE_ATTR_LIST=$(cat <<'EOF'
"app.bundle.executable"
"app.bundle.shortVersionString"
"app.bundle.version"
"app.debug.binaryName"
"app.debug.build_uuid"
"device.id"
"device.model.identifier"
"honeycomb.distro.runtime_version"
"honeycomb.distro.version"
"os.description"
"os.name"
"os.type"
"os.version"
"service.name"
"service.version"
"telemetry.distro.name"
"telemetry.distro.version"
"telemetry.sdk.language"
"telemetry.sdk.name"
"telemetry.sdk.version"
EOF
)

  assert_any "$result" "$ANDROID_RESOURCE_ATTR_LIST" "$IOS_RESOURCE_ATTR_LIST"
}

@test "Resources attributes are correct value" {
  assert_not_empty "$(resource_attribute_named 'honeycomb.distro.version' 'string')"
  assert_not_empty "$(resource_attribute_named 'honeycomb.distro.runtime_version' 'string' | uniq)" '"0.78.1"'

  assert_equal "$(resource_attribute_named 'telemetry.distro.name' 'string' | uniq)" '"@honeycombio/opentelemetry-react-native"'
  assert_not_empty "$(resource_attribute_named 'telemetry.distro.version' 'string')"
  assert_not_empty "$(resource_attribute_named 'telemetry.sdk.language' 'string' | uniq)" '"hermesjs"'

  assert_equal_or "$(resource_attribute_named 'os.name' 'string' | uniq)" '"Android"' '"iOS"'

  assert_not_empty "$(resource_attribute_named 'os.version' 'string')"
}

@test "Session ID is synced between TypeScript and native SDKs" {
  result=$(spans_received \
    | jq .scopeSpans[]?.spans[]?.attributes[] \
    | jq 'select (.key == "session.id").value.stringValue' \
    | sort | uniq | wc -l | tr -d ' ')

  assert_equal "$result" "1"
}

@test "Uncaught Errors are recorded properly" {
  result=$(attribute_for_exception_trace_of_type "Error" "exception.message" "string")
  assert_equal "$result" '"test error"'
}

@test "Uncaught non-Error Objects recorded properly" {
  result=$(attribute_for_exception_trace_of_type "UnknownErrorType" "exception.message" "string")
  assert_equal "$result" '"string error"'
}

@test "Navigation events are recorded" {
  result=$(attribute_for_span_key "@honeycombio/navigation" "screen appeared" "screen.route" "string" | sort | uniq)
  assert_equal "$result" '"Errors"
"Main"'
}

@test "Slow event loop events are recorded" {
  result=$(span_names_for "@honeycombio/slow-event-loop" | uniq)
  assert_equal "$result" '"slow event loop"'
}

@test "Network auto-instrumentation sends spans" {
  result=$(attribute_for_span_key "@opentelemetry/instrumentation-fetch" "HTTP GET" "http.url" "string" \
    | sort \
    | uniq \
    | sed -e 's/10.0.2.2/localhost/')  # because android uses a different address
  assert_equal "$result" '"http://localhost:1080/simple-api"'
}

@test "App start sends span" {
  result=$(span_names_for "@honeycombio/app-startup" | uniq)
  assert_equal "$result" '"app start"'
}

@test "telemetry.sdk.language is correct for React Native (js) spans" {
  # React Native layer spans should have telemetry.sdk.language = "hermesjs"
  sdk_language=$(resource_attribute_value_from_scope_named "@honeycombio/slow-event-loop" "telemetry.sdk.language" "string" | uniq)
  runtime_version=$(resource_attribute_value_from_scope_named "@honeycombio/slow-event-loop" "honeycomb.distro.runtime_version" "string" | uniq)

  assert_equal "$sdk_language" '"hermesjs"'
  assert_equal "$runtime_version" '"0.78.1"'
}

@test "telemetry.sdk.language is correct for Native (ios/android) spans" {
  # Native layer spans should have telemetry.sdk.language = "android" or "ios"
  sdk_language=$(resource_attribute_value_from_scope_named "io.opentelemetry.lifecycle" "telemetry.sdk.language" "string" | uniq)
  runtime_version=$(resource_attribute_value_from_scope_named "io.opentelemetry.lifecycle" "honeycomb.distro.runtime_version" "string" | uniq)
  os_version=$(resource_attribute_named 'os.version' 'string' | uniq)

  assert_equal_or "$sdk_language" '"android"' '"swift"'
  assert_equal "$runtime_version" "$os_version"
}


