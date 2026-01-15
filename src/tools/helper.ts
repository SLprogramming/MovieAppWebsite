export function formatChatTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Today
  if (diffDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Days ago
  if (diffDays < 30) {
    return `${diffDays} days ago`;
  }

  // Months ago
  const diffMonths =
    now.getFullYear() * 12 +
    now.getMonth() -
    (date.getFullYear() * 12 + date.getMonth());

  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }

  // Years ago
  const diffYears = now.getFullYear() - date.getFullYear();
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}