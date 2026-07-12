"use client";

import { formatRelativeTime } from "@/services/time-format";

export default function RelativeTime({ datetime }: { datetime: string }) {
  return formatRelativeTime(datetime);
}
