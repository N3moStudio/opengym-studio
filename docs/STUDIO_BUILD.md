# OpenGym Studio builds

Studio is a non-commercial community fork of [openGym](https://github.com/DuarteSantos8/openGym), based on v1.4.4. The app code remains under the GNU AGPL v3.0 and its original notices are retained. This project is not an official openGym release.

## Interface

The Studio interface adds a quieter Home screen, an editable selection of Home cards, three color palettes, solid or translucent surfaces, a floating tab bar, and directional navigation with an interruptible edge-swipe gesture. Reduced-motion and reduced-transparency preferences are respected. Hiding a Home card does not delete its data or remove its feature elsewhere in the app.

## Free public GitHub build

The `Studio iOS build` workflow uses the standard `macos-26` GitHub-hosted runner and runs only for a public repository. Start it from **Actions → Studio iOS build → Run workflow**, or push to `studio` or `main`. It does not require Apple signing credentials to compile an unsigned IPA.

The workflow installs dependencies, checks navigation and Home customization, builds the mobile frontend, adds the existing WidgetKit, Live Activity, Apple Watch and asset-downloader targets, then archives a real iPhone build. Packaging checks the bundle identifiers, native extensions and bundled exercise illustrations. Compiler failures fail the job.

Successful builds are published as prereleases under the repository’s **Releases** page, with the unsigned IPA, its SHA-256 checksum, and the exact source commit. These release assets remain available after the temporary Actions artifact expires. You can also download the **OpenGym-Studio-unsigned** artifact from the successful run. It contains `OpenGym-Studio-unsigned.ipa`, its SHA-256 checksum and the exact source commit. Artifacts expire after one day to limit storage use. Public standard-runner compute is free; artifact storage and GitHub usage policies still apply. This workflow does not select paid larger runners or publish to an app store.

## Installation and capabilities

The IPA is unsigned and needs a compatible signing/sideloading setup. The fork's bundle ID is `org.opengymstudio.app`; its extensions use that prefix, and its shared App Group is `group.org.opengymstudio.app`. It has a separate data container from official openGym. Export/import an openGym backup to move data; installing Studio does not automatically transfer another app's data.

Widgets, Live Activities, Watch integration, HealthKit and NFC depend on supported iOS versions, hardware and correctly signed entitlements. Their sources are included, but an unsigned archive alone cannot prove that those features work after sideloading. Some free signing setups cannot preserve all capabilities. The upstream `opengym://` URL scheme is retained for routine/widget compatibility; having both apps installed may make link routing ambiguous. The official website's associated-domain entitlement is not claimed by this fork.

## Exercise media

The workflow keeps the unmodified 180 px exercise stills and animations already permitted for a non-commercial openGym fork. They work offline. They are **not AGPL/open-source assets**; retain [NOTICE.md](../NOTICE.md) and `catalogue/media/NOTICE.md`. The official app's larger licensed media packs and App Store-hosted downloads are not distributed or configured by this fork.

## Local development and validation

Use Node 22 and run `npm ci` in `frontend`. `npm run dev` starts development; `VITE_MOBILE=1 npm run build` validates the mobile frontend without Xcode. A full native build requires macOS and Xcode, CocoaPods, `npm run build:mobile`, the three `frontend/ios/ci/add-*.rb` extension scripts named in the workflow, then `bash scripts/ios/build-studio-unsigned.sh` from the repository root.

The redesign has passed automated checks for Home card persistence, navigation, gesture cancellation, existing workout flows and translation coverage. Native device layout, motion performance and signed extensions still require a successful native build and physical-device testing; this document is not a claim of completed device validation.
