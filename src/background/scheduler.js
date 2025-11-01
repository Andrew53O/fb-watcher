// Scheduler module
// Handles time-based logic for scanning

export function shouldSkipScan() {
  const now = new Date();
  const hour = now.getHours();
  
  // Skip between 2 AM and 8 AM
  return hour >= 2 && hour < 8;
}

export function getNextScanTime() {
  const now = new Date();
  const next = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
  
  const hour = next.getHours();
  
  // If next scan falls in quiet hours, schedule for 8 AM
  if (hour >= 2 && hour < 8) {
    const skipTo = new Date(next);
    skipTo.setHours(8, 0, 0, 0);
    return skipTo;
  }
  
  return next;
}

export function isQuietHours() {
  return shouldSkipScan();
}
