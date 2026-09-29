const UNITS = [
  ["w", 7 * 24 * 60 * 60 * 1000],
  ["d", 24 * 60 * 60 * 1000],
  ["h", 60 * 60 * 1000],
  ["m", 60 * 1000],
];

export function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  for (const [label, ms] of UNITS) {
    if (diff >= ms) return `${Math.floor(diff / ms)}${label}`;
  }
  return "Just now";
}

// machine-readable value for a <time dateTime>, or undefined when the timestamp is missing
export function isoTime(timestamp) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}
