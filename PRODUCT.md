# Gymaura product context

Gymaura is a workout planning, logging and progress tool. The mobile interface is React/Vite/CSS in Capacitor, with native Watch, widget, health and notification integrations. It is not React Native or Expo.

## Users
People planning sessions and logging sets at the gym, including people using large text, assistive technology, different units/languages, offline storage and optional advanced training modules.

## Primary outcome
Understand the exercise, edit load/reps, complete a set, see rest feedback, and continue with minimal effort.

## Constraints confirmed for this redesign
- Preserve capabilities and stored training/body data, calculations, timestamps, units, progression, supersets, backup formats, sync merge and compatibility identifiers.
- Preserve the name Gymaura and all eight saved palette choices, light/dark/system behavior, solid/glass choice and optional cards now accessed through Training overview.
- New visual/layout direction is authorized. Use restrained materials, readable content surfaces and purposeful, interruptible feedback.
- Reuse the existing React components, native bridges and CSS system. No new UI or animation dependency.
- Do not upload real data, publish a release or alter billing/signing. The user subsequently authorized an unsigned IPA for personal sideload testing through the existing build workflow.

Design decisions and the feature destination map live in [docs/GYMAURA.md](docs/GYMAURA.md).

## Approved navigation direction
Home is the newest-first workout journal. Workout is the routine/empty-session launcher. Profile contains training charts, dashboard destinations and the journal. Settings replaces the former You tab and opens from Home’s top-right gear. The continuous List logger is the new-profile default; existing layout and control preferences remain saved.
