#!/bin/bash
set -e

# Upload React Native JS sourcemaps to cloud storage
# This script implements steps 3-5 from the README.md JavaScript Source Map Symbolication guide

upload_android() {

  if [[ ! -f "android/app/src/main/AndroidManifest.xml" ]]; then
    echo "❌ AndroidManifest.xml not found at android/app/src/main/AndroidManifest.xml"
    exit 1
  fi
  uuid=$(xpath -q -e "string(//meta-data[@android:name='app.debug.source_map_uuid']/@android:value)" android/app/src/main/AndroidManifest.xml)

  if [[ -z "$uuid" ]]; then
    echo "❌ UUID not found in AndroidManifest.xml"
    exit 1
  fi

  if [[ ! -f "index.android.bundle.map" ]]; then
    print_error "Android sourcemap not found: index.android.bundle.map"
    exit 1
  fi

  # create staging dir if none exists
  local staging_dir="sourcemaps_staging/$uuid"

  print_info "Creating staging directory: $staging_dir"
  mkdir -p "$staging_dir"

  print_info "Copying Android sourcemap"
  cp "index.android.bundle.map" "$staging_dir/"

  echo "Creating Android stub file"
  echo "//# sourceMappingURL=index.android.bundle.map" > "$staging_dir/index.android.bundle"
  echo "Android sourcemaps prepared"

  aws s3 cp "$staging_dir/index.android.bundle" "s3://my-app-artifacts/$uuid/index.android.bundle"
  aws s3 cp "$staging_dir/index.android.bundle.map" "s3://my-app-artifacts/$uuid/index.android.bundle.map"
}

upload_ios() {

  local app_name="$1"
  local uuid=$(defaults read $PWD/$app_name/Info app.debug.source_map_uuid)

  if [[ -z "$uuid" ]]; then
    echo "❌ UUID not found in info.plist"
    exit 1
  fi

  if [[ ! -f "main.jsbundle.map" ]]; then
    print_error "iOS sourcemap not found: main.jsbundle.map"
    exit 1
  fi

  # create staging dir if none exists
  local staging_dir="sourcemaps_staging/$uuid"

  print_info "Creating staging directory: $staging_dir"
  mkdir -p "$staging_dir"

  print_info "Copying iOS sourcemap"
  cp "main.jsbundle.map" "$staging_dir/"

  print_info "Creating iOS stub file"
  echo "//# sourceMappingURL=main.jsbundle.map" > "$staging_dir/main.jsbundle"
  print_success "iOS sourcemaps prepared"

  aws s3 cp "$staging_dir/main.jsbundle" "s3://my-app-artifacts/$uuid/main.jsbundle"
  aws s3 cp "$staging_dir/main.jsbundle.map" "s3://my-app-artifacts/$uuid/main.jsbundle.map"
}

# Main execution
main() {
  local app_name="my_app_name"

  upload_ios $app_name
  upload_android $app_name
}

main "$@"
