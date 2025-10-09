# Honeycomb React Native Development Guide for use by AI

# Humans should refer to README.md

## What AI Must Do

1. **Only modify tests when given permission** - Tests encode human intent, so unless directed to add/edit tests, you should ask before modifying them.
3. **Never commit secrets** - Use environment variables. Never run `git add .` or add all files to a commit—always add specific files you edited.
4. **Never assume business logic** - Always ask
5. **Never force push** - Use `--force-with-lease` instead

## General rules

- When creating pull requests, use the PR template in `.github/pull_request_template.md` (but exclude sections that don't apply).
- Use `yarn` instead of `npm` or `npx`
- Always update the `CHANGELOG.md`

## Project commands

### Library Build and Test Commands

- test: `yarn test`
- smoke test ios: `make smoke-ios`
- smoke test android: `make smoke-android`
- lint: `make lint`
- format: `make format`
- launch xcode: `xed example/ios`
- regenerate Native modules from JS: `yarn bob build --target codegen`

### Example App Run and Launch commands

- run ios: `yarn example ios`
- run android: `yarn example ios`
- launch ios: same as run ios
- launch android: same as run android

## Architecture

- iOS Native Modules: `ios`
- Android Native Modules: `android`
- Example app: `example`
- expo UUID plugin: `src/plugin`
- Tests: `smoke-test`
- Test helpers: `smoke-tests/test_helpers/utilities.bash`

### Example App architecture

The example app runs with our React Native library included and is used to manually test as well as by our smoke tests.

- iOS source: `example/ios`
- Android source: `example/android`
- TypeScript source: `example/src`
- Detox Test files: `example/e2e`

## Testing Guidelines

- Launch app and ask human to manually test
- If time permits, run the smoke test. This is time consuming though.
- do not create new testing files
- Most tests will only require updating `smoke-tests/smoke-e2e.bats`
- Smoke tests will launch the Example App and run the Detox tests at `example/e2e/starter.test.ts`

## Common Errors

#### Android Home not Set

**Problem**
`$ANDROID_HOME is not set.` 

**Explanation**
You need to have the Environment variable `ANDROID_HOME` set to be able to run android commands, including smoke tests, lint, and format.

**Solution**
needs to be set. Common value is `$HOME/Library/Android/sdk`. If you encounter this error, also check that `$JAVA_HOME` is set.

#### Java Home is not set

**Problem**
`$JAVA_HOME is not set.` 

**Explanation**
You need to have the Environment variable `JAVA_HOME` set to be able to run android commands, including smoke tests, lint, and format.

**Solution**
needs to be set. Common value is `/Applications/Android Studio.app/Contents/jbr/Contents/Home`. If you encounter this error, also check that `$ANDROID_HOME` is set.
