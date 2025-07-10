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

  assert_equal "$result" '"device.id"
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
"telemetry.sdk.version"'
}

@test "Resources attributes are correct value" {
  assert_not_empty "$(resource_attribute_named 'honeycomb.distro.version' 'string')"
  assert_equal "$(resource_attribute_named 'honeycomb.distro.runtime_version' 'string' | uniq)" '"react native"'

  assert_equal "$(resource_attribute_named 'telemetry.distro.name' 'string' | uniq)" '"@honeycombio/opentelemetry-react-native"'
  assert_not_empty "$(resource_attribute_named 'telemetry.distro.version' 'string')"
  assert_equal "$(resource_attribute_named 'telemetry.sdk.language' 'string' | uniq)" '"hermesjs"'

  assert_equal_or "$(resource_attribute_named 'os.name' 'string' | awk '{print tolower($0)}' | uniq)" '"android"' '"ios"'

  assert_not_empty "$(resource_attribute_named 'os.version' 'string')"
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
