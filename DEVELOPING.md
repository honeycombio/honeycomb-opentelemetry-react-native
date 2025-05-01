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

### Prerequisites

In order to run detox tests, you'll need `applesimutils`.
```sh
brew tap wix/brew
brew install applesimutils
```

To run the tests, first start metro.
```sh
npm start
```

Then run the `detox` tests.
```sh
detox test --configuration ios.sim.debug
detox test --configuration android.emu.debug
```