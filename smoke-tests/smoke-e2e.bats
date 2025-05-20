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

@test "Uncaught Errors are recorded properly" {
  result=$(attribute_for_exception_trace_of_type "Error" "error.message" "string")
  assert_equal "$result" "test error"
}

@test "Uncaught non-Error Objects recorded properly" {
  result=$(attribute_for_exception_trace_of_type "UnknownErrorType" "error.message" "string")
  assert_equal "$result" "string error"
}