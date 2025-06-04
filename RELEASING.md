# Releasing

This is a manual process for now, eventually this will move to CI without a manual `npm login` required.

- Create and checkout a release branch `release-x.y.z` for the release candidate.
- Make sure [CHANGELOG.md](CHANGELOG.md) is up to date with the changes since the last release and the next release version.
- Make sure the version in package.json is updated.
- Commit changes, push, and open a release preparation pull request for review.
- Once all tests pass and the release is approved, you may merge the PR into main.
- pull the latest version of main locally `git pull`
- create a new tag for the release `git tag -a x.y.z -m x.y.z`
- Push the tag, this will kick off the CI for releasing to NPM and create a draft GH release if successful. `git push x.y.z`
- Once CI is completed, edit the draft release to match the changelog.
