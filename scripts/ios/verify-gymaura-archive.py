#!/usr/bin/env python3
"""Fail packaging when the fork, extensions or offline media are missing."""
import plistlib
import sys
from pathlib import Path


def verify(app: Path) -> None:
    expected = {
        "Info.plist": "org.opengymstudio.app",
        "PlugIns/GymauraWidgets.appex/Info.plist": "org.opengymstudio.app.widgets",
        "Watch/GymauraWatch.app/Info.plist": "org.opengymstudio.app.watchkitapp",
        "Watch/GymauraWatch.app/PlugIns/GymauraWatchWidgets.appex/Info.plist":
            "org.opengymstudio.app.watchkitapp.widgets",
        "Extensions/AnimationPacksDownloader.appex/Info.plist":
            "org.opengymstudio.app.AnimationPacksDownloader",
    }
    for relative, bundle_id in expected.items():
        info = plistlib.loads((app / relative).read_bytes())
        if info.get("CFBundleIdentifier") != bundle_id:
            raise ValueError(f"Incorrect bundle identifier: {relative}")
        if info.get("CFBundleDisplayName") != "Gymaura" and "AnimationPacksDownloader" not in relative:
            raise ValueError(f"Incorrect app display name: {relative}")
        executable = (app / relative).parent / info["CFBundleExecutable"]
        if not executable.is_file() or not executable.stat().st_size:
            raise ValueError(f"Bundle executable is missing: {relative}")
        if relative == "Info.plist":
            if "iPhoneOS" not in info.get("CFBundleSupportedPlatforms", []):
                raise ValueError("Archive is not an iPhone device build")
            if not info.get("NSSupportsLiveActivities"):
                raise ValueError("Live Activities are not enabled")
    public = app / "public"
    if not (public / "index.html").is_file():
        raise ValueError("Frontend bundle is missing")
    media = public / "exercise-media"
    if not (media / "NOTICE.md").is_file():
        raise ValueError("Exercise media notice is missing")
    for folder, pattern in [("still", "*.webp"), ("clip", "*.mp4")]:
        entries = list((media / folder).glob(pattern))
        if not entries or any(p.stat().st_size == 0 for p in entries):
            raise ValueError(f"Offline exercise {folder} files are missing or empty")
    print("Archive verified: Gymaura identity, device executable, widgets, Live Activities, Watch, and offline media.")


if __name__ == "__main__":
    try:
        verify(Path(sys.argv[1]))
    except (IndexError, OSError, ValueError, KeyError, plistlib.InvalidFileException) as exc:
        sys.exit(f"Archive verification failed: {exc}")
