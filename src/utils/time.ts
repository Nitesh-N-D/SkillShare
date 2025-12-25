export function timeAgoFromTimestamp(timestamp: any): string {
  if (!timestamp?.seconds) return "just now";

  const secondsAgo = Math.floor(
    (Date.now() - timestamp.seconds * 1000) / 1000
  );

  if (secondsAgo < 60) return "just now";
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} min ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hrs ago`;
  return `${Math.floor(secondsAgo / 86400)} days ago`;
}
