export function formatDurationHYM(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0 && m > 0) {
    return `${h}h${m.toString().padStart(2, '0')}m`;
  }

  if (h > 0) {
    return `${h}h`;
  }

  return `${m}m`;
}
