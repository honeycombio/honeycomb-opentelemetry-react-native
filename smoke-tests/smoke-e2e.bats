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

@test "Uncaught Errors are recorded" {
  result=$(span_names_for "io.honeycomb.react-native.uncaught-exceptions")
  assert_equal "$result" "exception"
}