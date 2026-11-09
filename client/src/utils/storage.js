/**
 * Pokedesk Storage — user-scoped localStorage helpers.
 * All keys are namespaced with the current user's ID so multiple users
 * can share one browser without overwriting each other's data.
 */

export const GLOBAL_PREFIX = 'pokedesk:v1:';
export const SESSION_KEY = 'pokedesk:session';

export function getUserId() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return 'anon';
    return JSON.parse(raw).userId || 'anon';
  } catch {
    return 'anon';
  }
}

export function buildKey(key) {
  return `${GLOBAL_PREFIX}${getUserId()}:${key}`;
}

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(buildKey(key));
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  try {
    localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save Pokedesk data for ${key}`, error);
  }
}

export function clearPokedeskData() {
  const userId = getUserId();
  const prefix = `${GLOBAL_PREFIX}${userId}:`;
  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => localStorage.removeItem(key));
}

