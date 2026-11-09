/**
 * Auth Service
 * Connects to the Express backend API (/api/auth) with seamless local-first fallback.
 * Ensures the app works continuously both online and offline.
 */

import api, { setAuthToken, getAuthToken } from './api';
import { SESSION_KEY } from '../utils/storage';

const AUTH_PREFIX = 'pokedesk:auth:';

export const STARTER_AVATARS = [25, 1, 4, 7, 133, 39];

// ── Local Fallback Helpers ──────────────────────────────────────────────────

async function hashPasswordLocal(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'pokedesk-salt-v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getAllLocalUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(AUTH_PREFIX + 'user:')) {
      try {
        users.push(JSON.parse(localStorage.getItem(key)));
      } catch {
        // skip corrupt entries
      }
    }
  }
  return users;
}

function saveLocalUser(user) {
  localStorage.setItem(AUTH_PREFIX + 'user:' + user.id, JSON.stringify(user));
}

// ── Public Auth API ─────────────────────────────────────────────────────────

export async function registerUser({ username, displayName, password }) {
  const trimmedUsername = username.trim().toLowerCase();
  if (!trimmedUsername || trimmedUsername.length < 3) {
    return { ok: false, error: 'Trainer ID must be at least 3 characters.' };
  }
  if (!password || password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' };
  }

  // Attempt backend registration
  try {
    const response = await api.post('/auth/register', {
      username: trimmedUsername,
      displayName: (displayName || trimmedUsername).trim(),
      password,
    });

    if (response?.success && response?.data) {
      const { user, token } = response.data;
      if (token) setAuthToken(token, true);

      // Cache locally for offline capability
      saveLocalUser(user);
      const session = { userId: user.id, username: user.username, loginAt: new Date().toISOString() };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, remember: true }));

      return { ok: true, user, token };
    }
  } catch (err) {
    // If backend provided a specific validation or business error, return it
    if (err.status && err.message) {
      return { ok: false, error: err.message };
    }
    // If network error, proceed with local registration fallback
  }

  // Local fallback registration
  const existingUsers = getAllLocalUsers();
  if (existingUsers.some((u) => u.username === trimmedUsername)) {
    return { ok: false, error: 'That Trainer ID is already taken. Choose another!' };
  }

  const passwordHash = await hashPasswordLocal(password);
  const user = {
    id: 'u_' + (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    username: trimmedUsername,
    displayName: (displayName || trimmedUsername).trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
    avatar: Math.floor(Math.random() * 6),
  };

  saveLocalUser(user);
  const session = { userId: user.id, username: user.username, loginAt: new Date().toISOString() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, remember: true }));

  return { ok: true, user };
}

export async function loginUser({ username, password }) {
  const trimmedUsername = username.trim().toLowerCase();

  // Attempt backend login
  try {
    const response = await api.post('/auth/login', {
      username: trimmedUsername,
      password,
    });

    if (response?.success && response?.data) {
      const { user, token } = response.data;
      if (token) setAuthToken(token, true);

      saveLocalUser(user);
      const session = { userId: user.id, username: user.username, loginAt: new Date().toISOString() };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, remember: true }));

      return { ok: true, user, token };
    }
  } catch (err) {
    if (err.status && err.message) {
      return { ok: false, error: err.message };
    }
  }

  // Local fallback login
  const users = getAllLocalUsers();
  const user = users.find((u) => u.username === trimmedUsername);

  if (!user) {
    return { ok: false, error: "We couldn't find that Trainer ID. Check your spelling or register." };
  }

  const passwordHash = await hashPasswordLocal(password);
  if (passwordHash !== user.passwordHash) {
    return { ok: false, error: 'Wrong password. Try again, trainer!' };
  }

  const session = { userId: user.id, username: user.username, loginAt: new Date().toISOString() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, remember: true }));

  return { ok: true, user };
}

export function getCurrentSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const userRaw = localStorage.getItem(AUTH_PREFIX + 'user:' + session.userId);
    if (!userRaw) return null;
    return { session, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export function logoutUser() {
  setAuthToken(null);
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function getRegisteredUsers() {
  return getAllLocalUsers().map(({ id, username, displayName, createdAt, avatar }) => ({
    id,
    username,
    displayName,
    createdAt,
    avatar,
  }));
}
