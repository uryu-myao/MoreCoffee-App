/**
 * Cross-screen requests that do not fit the tab state: today, 5c's "See this
 * record" asking Records to open one cup (2c). AppShell switches the tab;
 * RecordsScreen listens and opens the cup.
 */
const listeners = new Set();

export function requestOpenCup(id) {
  listeners.forEach((l) => l(id));
}

export function onOpenCupRequest(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
