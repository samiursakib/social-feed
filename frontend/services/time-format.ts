export function formatRelativeTime(date: string | Date): string {
  const target = new Date(date).getTime();
  const now = Date.now();

  const diffInSeconds = Math.floor((target - now) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const units = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ] as const;

  for (const { unit, seconds } of units) {
    const value = Math.trunc(diffInSeconds / seconds);

    if (Math.abs(value) >= 1) {
      return rtf.format(value, unit);
    }
  }

  return "just now";
}
