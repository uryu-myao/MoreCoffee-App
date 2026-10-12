/**
 * Cross-screen requests that do not fit the tab state. AppShell owns the tabs
 * and the Record sheet; screens ask through here.
 *   requestOpenCup(id)   Records opens one cup (2c) — 5c's "See this record",
 *                        Home's recently sipped rows
 *   requestShell(req)    AppShell: { tab } switches tab, { record: true }
 *                        opens the Record sheet (1b "Record a coffee")
 */
const cupListeners = new Set();
const shellListeners = new Set();

export function requestOpenCup(id) {
  cupListeners.forEach((l) => l(id));
}

export function onOpenCupRequest(listener) {
  cupListeners.add(listener);
  return () => cupListeners.delete(listener);
}

export function requestShell(request) {
  shellListeners.forEach((l) => l(request));
}

export function onShellRequest(listener) {
  shellListeners.add(listener);
  return () => shellListeners.delete(listener);
}

/**
 * A tab's icon pressed while that tab is already showing: the tab returns to
 * its root (iOS's convention) — Records closes an open cup.
 */
const tabResetListeners = new Set();

export function requestTabReset(tab) {
  tabResetListeners.forEach((l) => l(tab));
}

export function onTabReset(listener) {
  tabResetListeners.add(listener);
  return () => tabResetListeners.delete(listener);
}
