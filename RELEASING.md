# Releasing

This is a manual process for now, eventually this will move to CI without a manual `npm login` required.

- Make sure [CHANGELOG.md](CHANGELOG.md) is up to date with the changes since the last release.
- Run `npm login` and follow the prompts to log into npm.
- Run `npm run release` and follow the prompts to release to GitHub and npm.
- Make sure the version in package.json is updated.
- Commit changes, push, and open a release preparation pull request for review.
- In the meantime, the release will go out so check the release notes in GitHub and publish the release.
- Merge the release PR so that the `package.json` version is up to date.
