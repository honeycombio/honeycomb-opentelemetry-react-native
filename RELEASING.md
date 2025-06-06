# Releasing

This is the process to release the Honeycomb OpenTelemetry React Native SDK to NPM

- Create and checkout a release branch `release-x.y.z` for the release candidate.
- Make sure [CHANGELOG.md](CHANGELOG.md) is up to date with the changes since the last release and the next release version.
- Update the version in [src/version.ts](./src/version.ts).
- Make sure the version in package.json is updated.
- Commit changes, push, and open a release preparation pull request for review.
- Once all tests pass and the release is approved, you may merge the PR into main.
- pull the latest version of main locally `git pull`
- create a new tag for the release `git tag -a x.y.z -m x.y.z`
- Push the tag, this will kick off the CI for releasing to NPM and create a draft GH release if successful. `git push x.y.z`
- Once CI is completed, edit the draft release to match the changelog.
