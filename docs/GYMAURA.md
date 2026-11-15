# Gymaura

Gymaura is a free workout planning, logging and progress tool. The mobile UI is React/Vite/CSS inside Capacitor; Swift, Watch and widget clients retain their existing native responsibilities.

## Reference-led redesign — 14 November 2026

**Principle: give the action and its data the space; use material to identify controls.**

The user rejected the earlier session-hero direction and supplied Hevy screenshots as the new layout reference. The resulting app has three tabs: **Home, Workout, Profile**. Home is a newest-first personal workout journal. Workout opens a clear launcher with Start empty workout, New routine, Explore and routine cards with Start routine. Profile contains the training chart, dashboard destinations and journal. The former You hub is now Settings, reached from Home's top-right gear.

The work preserves the current `gymaura-current` branch and all newer working-tree changes. HEAD was `82378e8636abb044f44fdd25fd06f315cc4dd02d`; no reset was performed.

### Composition decision

Two real-component compositions were considered over the redesign: the focused set workspace, and a continuous session ledger. The user's later screenshots and feedback select the **continuous ledger** as the default for new profiles. Exercise, notes, rest control, previous performance, editable load/reps/effort and set completion live together. The earlier Focus improvements remain available alongside Cards, List and Compact. Existing saved view and stepper preferences are preserved; only new-profile defaults use List and direct-entry fields.

The journal uses saved sessions and day notes, rather than social posts. There are no followers, suggested athletes, paywalls or copied Hevy assets. Routine detail uses the existing planned-entry and unit readers, then links to the original editor. Secondary tools remain discoverable without competing with Start workout.

### Feature destinations

| Capability | Destination |
| --- | --- |
| Start/resume/edit; choose/combine routines; freestyle/backfill | Home action; Workout launcher; active-session dock; Home + for a past workout |
| Routine CRUD, reorder, imports/exports/PDF | Workout → New routine / Manage routines; routine title → detail; Edit routine → original `/plan/r/:id` |
| Fixed week, rotations, queue and scheduling | Workout calendar button → `/plan?view=schedule`; Training overview for week/queue context |
| Exercises/custom exercises, details/media/history/equipment | Workout → Exercises; Profile → Exercises; Settings → Equipment |
| Programmes and week blocks | Workout → Explore; existing `/plan/programmes` and `/plan/prog/:id` |
| Cards, List, Compact, Focus; steppers | Active workout → Workout options → Layout/controls; saved preferences retained |
| Warm-up/work/failure, unilateral, timed/cardio, drops/rest-pause, supersets, notes, progression, filming | Existing set/exercise menus and specialized inputs in all layouts |
| Rest/work/count-in timers; adjust/skip/pause/alerts | Timer dock and Workout options; Settings → Workout / Timer alerts |
| History, edits, PRs, progression, charts | Home journal → session detail; Profile → Statistics / History / Exercises |
| Body weight/goals, measurements/photos, recovery | Profile → Measurements (Body pane); existing measurement/photo destinations; Training overview optional body/recovery cards |
| Muscle volume/balance | Statistics → Lifts; existing `/muscles` and `/structural-balance` links |
| Streaks, recaps, challenges, achievements/seasonal content | Statistics; Profile → Training overview; preserved module and card preferences |
| Optional modules, coach, gym check-in | Home gear → Modules/Coach settings; existing Plan coach entry; Training overview check-in card and `/checkin` |
| Themes, units/language, accessibility, workout preferences | Home gear → Look & Home / Units & language / Workout; Training overview → Customize |
| Backup/restore/import/export, accounts/sync/offline | Home gear → Data & backup / Account / Integrations |
| HealthKit/Health Connect, Watch, widgets/Live Activities, permissions | Existing Settings integrations/watch destinations and native system surfaces |

### Presentation and motion

- Typography: Apple system font first on iOS/macOS; bundled Inter Variable 4.1 for browser fallback. No runtime font service. Existing rem roles: 17px body, 20px exercise titles, 28px page titles at normal size; regular body weight and tabular numbers.
- Content: black/white canvas, neutral charcoal/light-gray controls, restrained saved accents. All eight palette IDs, custom accent choices, light/dark/system and solid/glass choices remain persistent. Miniatures now match the neutral surfaces and three-tab navigation.
- CSS ownership: `index.css` owns shared tokens/controls, `gymaura-themes.css` owns palette ramps, `gymaura.css` owns named compositions. No extra broad override stylesheet was added. `main.jsx` loads these in that order after admin/coach styles.
- The segmented-control gray underlay defect is removed by measuring the selected button and positioning one selection layer. Language direction changes are observed even when button dimensions stay the same.
- The bottom dock uses one reflective selection pill, a 320ms transform transition, direct pointer tracking and cancellation on pointer loss, blur, resize or visibility changes. Repeated selections retarget it. Reduced motion removes the transition; reduced transparency/solid mode removes blur/reflection.
- Glass remains a CSS approximation in the Capacitor web view, not native SwiftUI Liquid Glass. Blur is static; tab motion transforms the small selection layer rather than animating filters, shadows or full-screen surfaces. Physical-device frame pacing is not established by browser inspection.
- The active list uses flat exercise groups and 44px completion controls. Long header names clamp visually to two lines while retaining the full accessible text. Large text allows scrolling. A horizontally overflowing set table suppresses copy/delete swipes; the set-number menu still exposes those actions.
- Navigation and rest overlays reserve their measured height. Existing keyboard, safe-area, sheet, edge-back and workout scroll-restoration helpers remain in use. The shared chip reveal helper now handles RTL scrolling and partial DOM environments.

### Data and compatibility boundaries

The display reads canonical history, volume, duration, completed-rep, planned-entry and per-exercise-unit helpers. Workout calculations, progression, supersets, finish timestamps, backup formats, merge rules and native bridge implementations were not rewritten. New read-only charts have tests for warm-ups, one-sided sets, drops/rest-pause, canonical dates and the user's week start.

`gym_state_v1`, `opengym-state.json`, `gymaura.appearance.v1`, `gym_plan_view`, native bundle/app-group IDs and old URLs remain compatible. Existing `/home`, `/plan`, `/stats`, `/settings` and `opengym://` links still work. The optional Home-card preference keys now control Training overview; they are not reset. All new labels and tour copy use the existing localization system (19 locale packs).

### Research and tools actually used

[Hevy workout tracking](https://www.hevyapp.com/features/track-workouts/) informed the adjacent previous/current set data and obvious routine launch. [Hevy rest timers](https://www.hevyapp.com/features/workout-rest-timer/) reinforced immediate rest feedback after a set. [Hevy profiles](https://www.hevyapp.com/features/user-profiles/) and [progress](https://www.hevyapp.com/features/gym-progress/) informed the chart/dashboard/journal grouping. The user's screenshots are the primary composition reference; Gymaura's branding and non-social product remain its own.

[Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials), [motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Capacitor Keyboard](https://capacitorjs.com/docs/apis/keyboard) and [WebKit viewport guidance](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/) inform the platform boundaries. Awwwards' bounded typography/minimal search returned mainly marketing/portfolio references; its element corpus was empty. These did not dictate the workout UI.

The Codebase Memory MCP transport returned **Transport closed** in this iteration. The installed CLI refreshed the index and checked coverage; graph findings were verified against owning source. Sixteen native/build files remain partially parsed by the index; that is not a native correctness claim. App routes, Zustand persisted/ephemeral state, workout/history helpers and native bridge boundaries were mapped before edits.

REA's `reverse-engineer-anything` skill was installed from [morluto/rea](https://github.com/morluto/rea). Its routing guidance skips ordinary complete-source repositories, so its engine/MCP was not installed or used. Oil UI/Impeccable led composition and simplification; Emil, mobile-native, break-ui and motion specialists supplied scoped implementation/review guidance. No UI or animation dependency was introduced.

### Evidence and verification

Current screenshots and logs: `analysis/2026-11-14-hevy-direction/`; detailed record: `verification.md` there. Earlier baseline/first-pass evidence remains in `analysis/2026-11-14-redesign/` and the user-provided sibling analysis folder. All runtime tests used isolated synthetic data with licensed exercise-media requests blocked in AI-visible screenshots.

At 390×844, the initial complete-set checkbox is at **y=392–436**, versus the original Complete set action at **y=822–880**. This is a changed interaction (row checkbox), not merely a resized old button. Narrow/large phones, long names/notes, 200% text, light/dark, palette persistence, RTL, empty/loading/error states, offline edits and interrupted navigation/rest were inspected. A start → edit → log → rest → minimize/resume → finish → saved journal/detail flow succeeded, including cancelling Finish and discarding an empty session.

The regression run passed **101 files / 1,581 tests**. Post-review focused checks, including two new selection-motion tests, passed. Web and mobile-flavor frontend builds and the mobile bundle asset check passed. Native implementation and signing settings were not edited. This browser review preceded the user's subsequent authorization to build a personal unsigned IPA; it is not native-build evidence.

Remaining: physical iPhone WKWebView keyboard/safe-area/Dynamic Type/VoiceOver, native background alarms, HealthKit permissions, Watch pairing, widgets/Live Activities and frame pacing. Browser simulations, JS bridge tests and compilation do not prove those device behaviors.

## Build

The `Gymaura iOS build` workflow runs on the `gymaura-redesign` branch using the existing public repository's macOS runner. It installs locked dependencies, runs navigation and appearance regression checks, builds the mobile frontend, stages exercise media, synchronizes Capacitor, and adds the Watch and widget targets.

`scripts/ios/build-gymaura-unsigned.sh` archives the App scheme for a physical iPhone and preserves the complete compiler log. Packaging fails if the app executable, expected extension bundles, Gymaura display names, Live Activity support, frontend, or offline exercise media are missing. The artifact includes the IPA, its checksum and the exact source commit.

The IPA is unsigned and requires the user's sideloading signature. A successful archive and browser checks do not verify physical-device gestures, HealthKit permissions, Watch pairing, widget entitlements, or LiveContainer behavior.
