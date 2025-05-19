set -e

# The system image and device name to use.
# These should match an entry in testOptions.managedDevices.localDevices in build.gradle.kts.
UNAME=$(uname -o)
if [[ "$UNAME" == "Darwin" ]]; then
    ABI="arm64-v8a"
else
    # ABI="x86_64"
    ABI="arm64-v8a"
fi
SYSTEM_IMAGE="system-images;android-35;google_apis;$ABI"
DEVICE_NAME="Pixel_8_API_35"

echo ""
echo "+++ Verifying the Android SDK Command-line Tools are properly installed."
echo ""
if [ -n "$ANDROID_HOME" ]; then
  echo "Adding $ANDROID_HOME/cmdline-tools/latest/bin from \$ANDROID_HOME to \$PATH"
  export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
else
  echo "\$ANDROID_HOME is not set."
fi

if ! command -v avdmanager &> /dev/null; then
    echo "avdmanager is missing."
    echo "Please install the Android SDK Command-line Tools and set \$ANDROID_HOME."
    exit 1
fi
if ! command -v sdkmanager &> /dev/null; then
    echo "sdkmanager is missing."
    echo "Please install the Android SDK Command-line Tools and set \$ANDROID_HOME."
    exit 1
fi

echo ""
echo "+++ Verifying the licenses have been accepted."
echo ""
bash -c 'yes || true' | sdkmanager --licenses >/dev/null

echo ""
echo "+++ Downloading the correct system image, if needed."
echo ""
echo "The following SDKs are available."
sdkmanager --list
echo "Installing $SYSTEM_IMAGE"
bash -c 'yes || true' | sdkmanager --verbose --install "$SYSTEM_IMAGE"
sdkmanager --update
avdmanager list target

echo ""
echo "+++ Creating the virtual device."
echo ""
# Ignore errors in case the device already exists.
echo "avdmanager create avd -n \"$DEVICE_NAME\" -k \"$SYSTEM_IMAGE\""
yes no | avdmanager create avd -n "$DEVICE_NAME" -k "$SYSTEM_IMAGE" || true
avdmanager list avd

