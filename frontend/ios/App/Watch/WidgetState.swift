import Foundation
import SwiftUI

/*
 * What the watch app shows, for its complications and the Smart Stack widget (ios/App/Watch/
 * Widgets): written by the app whenever it changes, read by the widget through the App Group.
 * Compiled into both. Plain text and numbers, no media.
 *
 *   rest   the rest running, until restEndsAt
 *   set    the set up next: exercise and weight × reps
 *   today  no workout running, today's planned one ready to start
 *   idle   nothing to show but the app
 */
struct WidgetState: Codable, Equatable {
    var mode: String
    var title: String
    var detail: String
    var restEndsAt: Date?
    /// Work sets done and in all, today's session (the complications' ring).
    var done: Int = 0
    var total: Int = 0
    /// "2/4": the set up next, of its exercise's work sets.
    var setLabel: String = ""
    var updatedAt: Date = .distantPast
    /// The app's language (the phone's), so the complications speak it too.
    var lang: String?

    static let idle = WidgetState(mode: "idle", title: "Gymaura", detail: "", restEndsAt: nil)
    static let groupId = "group.org.opengymstudio.app"
    private static let key = "widgetState"

    static func == (a: WidgetState, b: WidgetState) -> Bool {
        a.mode == b.mode && a.title == b.title && a.detail == b.detail && a.restEndsAt == b.restEndsAt
            && a.done == b.done && a.total == b.total && a.setLabel == b.setLabel && a.lang == b.lang
    }

    /// The state as written, unless it is about a session the watch app has not touched for 45
    /// minutes (it was closed, or the workout runs on the phone alone): then nothing to show, and
    /// the iPhone's Live Activity has the Smart Stack to itself instead of two cards saying the same.
    static func read() -> WidgetState {
        guard let d = UserDefaults(suiteName: groupId)?.data(forKey: key),
              let s = try? JSONDecoder().decode(WidgetState.self, from: d) else { return .idle }
        if (s.mode == "set" || s.mode == "rest") && Date().timeIntervalSince(s.updatedAt) > 45 * 60 { return .idle }
        return s
    }

    func write() {
        var s = self
        s.updatedAt = Date()
        if let d = try? JSONEncoder().encode(s) { UserDefaults(suiteName: WidgetState.groupId)?.set(d, forKey: WidgetState.key) }
    }
}

extension WidgetState {
    /// The locale for the widget's words: the app's language where this bundle has it, else English
    /// (a phone in English never gets a German complication from a watch set to German).
    var locale: Locale {
        guard let l = lang else { return .current }
        if l == "en" { return Locale(identifier: "en") }
        let name = ["pt": "pt-PT", "zh": "zh-Hans", "zh-TW": "zh-Hant"][l] ?? l
        return Locale(identifier: Bundle.main.path(forResource: name, ofType: "lproj") != nil ? name : "en")
    }
}

/// Gymaura's orbit mark, tinted by the Watch face.
struct GymauraLogo: Shape {
    func path(in rect: CGRect) -> Path {
        let side = min(rect.width, rect.height)
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = side * 0.36
        var line = Path()
        line.addArc(center: center, radius: radius, startAngle: .degrees(-42), endAngle: .degrees(360), clockwise: true)
        line.addLine(to: CGPoint(x: center.x + radius, y: center.y))
        line.addLine(to: CGPoint(x: center.x + side * 0.04, y: center.y))
        var mark = line.strokedPath(StrokeStyle(lineWidth: side * 0.085, lineCap: .round, lineJoin: .round))
        mark.addEllipse(in: CGRect(x: center.x + radius * 0.70, y: center.y - radius * 0.85, width: side * 0.10, height: side * 0.10))
        return mark
    }
}
