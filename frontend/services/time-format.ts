export function formatRelativeTime(
  date: string | Date,
  now: number = Date.now(),
): string {
  const target = new Date(date).getTime();
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

export function shortRelativeTime(
  date: string | Date,
  now: number = Date.now(),
): string {
  const diff = Math.max(0, Math.floor((now - new Date(date).getTime()) / 1000));
  if (diff < 60) {
    return `${diff}s`;
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  }
  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  }
  if (diff < 604800) {
    return `${Math.floor(diff / 86400)}d`;
  }
  if (diff < 2592000) {
    return `${Math.floor(diff / 604800)}w`;
  }
  if (diff < 31536000) {
    return `${Math.floor(diff / 2592000)}mo`;
  }
  return `${Math.floor(diff / 31536000)}y`;
}
