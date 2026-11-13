#!/usr/bin/env bash
# Run after build:mobile and the three ios/ci/add-*.rb extension scripts.
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
project="$root/frontend/ios/App"
build="$project/build"
archive="$build/Studio.xcarchive"
app="$archive/Products/Applications/App.app"
mkdir -p "$build"

if [[ "$(uname -s)" != Darwin ]]; then
  echo 'An iOS device archive requires macOS and Xcode.' >&2
  exit 1
fi

cd "$project"
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$archive" \
  CURRENT_PROJECT_VERSION="${GITHUB_RUN_NUMBER:-1}" \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY='' \
  archive 2>&1 | tee "$build/archive.log"

# A successful compiler exit is not enough: check what will actually ship.
python3 "$root/scripts/ios/verify-studio-archive.py" "$app"

rm -rf "$build/Payload"
mkdir -p "$build/Payload"
ditto "$app" "$build/Payload/App.app"
git -C "$root" rev-parse HEAD > "$build/ci-commit.txt"
cd "$build"
rm -f OpenGym-Studio-unsigned.ipa
zip -qry OpenGym-Studio-unsigned.ipa Payload ci-commit.txt
shasum -a 256 OpenGym-Studio-unsigned.ipa > OpenGym-Studio-unsigned.ipa.sha256
echo 'Created OpenGym-Studio-unsigned.ipa. Sign with a compatible sideloading tool before installing.'
