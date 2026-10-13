/**
 * Cross-screen requests that do not fit the tab state. AppShell owns the tabs
 * and the Record sheet; screens ask through here.
 *   requestOpenCup(id)   Records opens one cup (2c) — 5c's "See this record",
 *                        Home's recently sipped rows
 *   requestShell(req)    AppShell: { tab } switches tab, { record: true }
 *                        opens the Record sheet (1b "Record a coffee")
 *   requestPush(entry)   ShellStack pushes a screen over everything, the
 *                        bottom bar included: { name: 'beans' | 'addBag' |
 *                        'addGear' } from Home, { name: 'editCup', cup } from 2c
 *   requestCloseCup()    Records closes its open cup (after a delete in 11a)
 *   requestNotice(text)  AppShell shows 13b's one-line notice above the bar
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

const pushListeners = new Set();
const closeListeners = new Set();

export function requestPush(entry) {
  pushListeners.forEach((l) => l(entry));
}

export function onPushRequest(listener) {
  pushListeners.add(listener);
  return () => pushListeners.delete(listener);
}

export function requestCloseCup() {
  closeListeners.forEach((l) => l());
}

export function onCloseCupRequest(listener) {
  closeListeners.add(listener);
  return () => closeListeners.delete(listener);
}

const noticeListeners = new Set();

export function requestNotice(notice) {
  noticeListeners.forEach((l) => l(notice));
}

export function onNoticeRequest(listener) {
  noticeListeners.add(listener);
  return () => noticeListeners.delete(listener);
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
