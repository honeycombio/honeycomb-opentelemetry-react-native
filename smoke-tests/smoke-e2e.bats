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

  assert_equal "$result" '"honeycomb.distro.runtime_version"
"honeycomb.distro.version"
"os.name"
"os.version"
"service.name"
"telemetry.distro.name"
"telemetry.distro.version"
"telemetry.sdk.language"'
}

@test "Resources attributes are correct value" {

  assert_not_empty "$(resource_attribute_named 'honeycomb.distro.version' 'string')"
  assert_equal "$(resource_attribute_named 'honeycomb.distro.runtime_version' 'string' | uniq)" '"react native"'

  assert_equal "$(resource_attribute_named 'telemetry.distro.name' 'string' | uniq)" '"@honeycombio/opentelemetry-react-native"'
  assert_not_empty "$(resource_attribute_named 'telemetry.distro.version' 'string')"
  assert_equal "$(resource_attribute_named 'telemetry.sdk.language' 'string' | uniq)" '"hermiesjs"'

  osName=$(resource_attribute_named 'os.name' 'string' | uniq)
  if [[ "$osName" == '"android"' ]]; then
    assert_equal "$osname" '"android"'
  else
    assert_equal "$osName" '"ios"'
  fi

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