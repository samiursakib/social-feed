"use client";

import { formatRelativeTime, shortRelativeTime } from "@/services/time-format";

export default function RelativeTime({
  datetime,
  isShortForm = false,
}: {
  datetime: string;
  isShortForm?: boolean;
}) {
  return (
    <time dateTime={datetime} suppressHydrationWarning>
      {!isShortForm
        ? formatRelativeTime(datetime)
        : shortRelativeTime(datetime)}
    </time>
  );
}
