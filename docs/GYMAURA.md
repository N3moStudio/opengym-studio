# Gymaura

Gymaura reorganizes the app around Today, Train, Progress, and You. Today focuses on the next session, Train contains routines, exercises and programmes, Progress separates its charts into selectable panes, and You groups settings into expandable sections.

The interface uses translucent controls, a floating navigation bar and eight palettes, with Bloom as the initial palette. Solid surfaces, reduced motion, reduced transparency and higher contrast remain supported. Active sessions stay reachable from the navigation bar. Existing workouts, routines, exports, backups, integrations and account behavior are retained.

Names and icons are updated across the iPhone interface, notifications, widgets, Live Activities and Apple Watch. The existing bundle identifiers, app-group identifier, stored data keys and old URL scheme remain for compatibility. New widget links use `gymaura://`; older `opengym://` links continue to work. Upstream licensing and attribution remain in NOTICE.md.

## Build

The `Gymaura iOS build` workflow runs on the `gymaura-redesign` branch using the existing public repository's macOS runner. It installs locked dependencies, runs navigation and appearance regression checks, builds the mobile frontend, stages exercise media, synchronizes Capacitor, and adds the Watch and widget targets.

`scripts/ios/build-gymaura-unsigned.sh` archives the App scheme for a physical iPhone and preserves the complete compiler log. Packaging fails if the app executable, expected extension bundles, Gymaura display names, Live Activity support, frontend, or offline exercise media are missing. The artifact includes the IPA, its checksum and the exact source commit.

The IPA is unsigned and requires the user's sideloading signature. A successful archive and browser checks do not verify physical-device gestures, HealthKit permissions, Watch pairing, widget entitlements, or LiveContainer behavior.
