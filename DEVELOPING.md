# Local Development

## Prerequisites

**Required:**

You must have `npm` and `yarn` installed.

You can install `yarn` with:
```sh
npm install -g yarn
```

## Formatting

To lint the code:
```sh
yarn lint
```

To auto-format code:
```sh
yarn lint --fix
```

## Example app

To run the example app on iOS in a simulator:
```sh
yarn install
yarn example ios
```

or Android in an emulator:
```sh
yarn install
yarn example android
```

## Smoke Tests

Smoke tests are run by automatically:
1. starting a local collector in a container that exports to a file,
2. launching the react native service in a container,
3. launching the app in an iOS simulator / Android emulator,
3. controlling the app using `detox` UI tests, and then 
4. testing assertions against the telemetry output using `bats-core` and `jq`.

**Required for Smoke Tests:**

- Xcode Command-line Tools
- [Android SDK Command-line Tools](https://developer.android.com/tools)
- [`bats-core`](https://bats-core.readthedocs.io/en/stable/)
- [`jq`](https://jqlang.github.io/jq/)
- Docker & Docker Compose
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) is a reliable choice if you don't have your own preference.

**iOS SDK Setup**

To install the Xcode Command Line Tools, first install and run Xcode. Then run:

```sh
xcode-select --install
```

`detox` requires `applesimutils'.

```sh
brew tap wix/brew
brew install applesimutils
```

**Android SDK Setup**

After installing Android Studio, set `ANDROID_HOME` to the location of your Android SDK, which is usually something like `$HOME/Library/Android/sdk`.

```sh
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

If you don't already have Java, no need to install it separately: Android Studio includes it.

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
```

To install Command-line Tools go to Tools > SDK Manager > Android SDK > SDK Tools.

**Bash Tools Setup**

Install `bats-core` and `jq` for local testing:

```sh
brew install bats-core
brew install jq
```

**Running Tests**

Smoke tests can be run with `make` targets.

```sh
make smoke-ios
make smoke-android
```

The results of both the tests themselves and the telemetry collected by the collector are in a file `data.json` in the `smoke-tests/collector/` directory.

After smoke tests are done, tear down docker containers:

```sh
make unsmoke
```
