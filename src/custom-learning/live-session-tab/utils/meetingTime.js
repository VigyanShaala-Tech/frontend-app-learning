/**
 * Meeting end-time math for the live-session list.
 *
 * Mirrors the same start_time + duration arithmetic used by
 * vigyanshaala-custom-extensions/zoom_xblock/static/js/src/zoom_xblock.js
 * (getMeetingEndTime / disableJoinIfEnded) for its "Join Meeting" ->
 * "Meeting Ended" button state, applied here to the live-classes list API's
 * per-occurrence fields (session.startTime + duration_hours/duration_minutes)
 * instead of the XBlock's own single "Xh Ym" duration string.
 *
 * Note: session.startTime is a display-formatted string ("MMM DD, YYYY,
 * hh:mm A", e.g. "Jul 19, 2026, 05:25 PM") in the meeting's configured
 * timezone -- the API doesn't expose a raw ISO timestamp. Parsed here via
 * the JS Date constructor, which interprets it in the *browser's* local
 * timezone. This matches zoom_xblock's own existing assumption (browser
 * timezone == meeting timezone) rather than introducing a new one -- correct
 * for this platform's expected usage (Asia/Kolkata throughout), not
 * rigorously timezone-safe in the general case.
 */

/**
 * Returns a Date for when a live-session occurrence is expected to end, or
 * null if startTime/duration are missing or unparseable. Callers must treat
 * null as "unknown end time", not "already ended".
 */
export function getMeetingEndTime(session) {
  if (!session?.startTime) {
    return null;
  }
  const start = new Date(session.startTime);
  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const minutes = (Number(session.duration_hours) || 0) * 60 + (Number(session.duration_minutes) || 0);
  if (minutes <= 0) {
    return null;
  }

  return new Date(start.getTime() + minutes * 60000);
}

/** Returns true only when the occurrence's computed end time is known and has passed. */
export function isMeetingEnded(session) {
  const endTime = getMeetingEndTime(session);
  return !!endTime && new Date() >= endTime;
}
