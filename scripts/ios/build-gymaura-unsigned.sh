#!/usr/bin/env bash
# Run after build:mobile and the three ios/ci/add-*.rb extension scripts.
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
project="$root/frontend/ios/App"
build="$project/build"
archive="$build/Gymaura.xcarchive"
app="$archive/Products/Applications/App.app"
mkdir -p "$build"

if [[ "$(uname -s)" != Darwin ]]; then
  echo 'An iOS device archive requires macOS and Xcode.' >&2
  exit 1
fi

cd "$project"
# Record existing native builds before starting this isolated CI archive.
pgrep -lx xcodebuild || test "$?" -eq 1
set +e
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$archive" \
  CURRENT_PROJECT_VERSION="${GITHUB_RUN_NUMBER:-1}" \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY='' \
  archive > "$build/archive.log" 2>&1
archive_status=$?
set -e
if [[ "$archive_status" -ne 0 ]]; then
  tail -n 100 "$build/archive.log"
  exit "$archive_status"
fi
tail -n 8 "$build/archive.log"

# A successful compiler exit is not enough: check what will actually ship.
python3 "$root/scripts/ios/verify-gymaura-archive.py" "$app"

rm -rf "$build/Payload"
mkdir -p "$build/Payload"
ditto "$app" "$build/Payload/App.app"
git -C "$root" rev-parse HEAD > "$build/ci-commit.txt"
cd "$build"
rm -f Gymaura-unsigned.ipa
zip -qry Gymaura-unsigned.ipa Payload ci-commit.txt
shasum -a 256 Gymaura-unsigned.ipa > Gymaura-unsigned.ipa.sha256
echo 'Created Gymaura-unsigned.ipa. Sign with a compatible sideloading tool before installing.'
