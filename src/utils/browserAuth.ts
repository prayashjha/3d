export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatarColor: string;
  createdAt: number;
  bio?: string;
  website?: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

const AUTH_KEY = 'toolsx_auth_user';
const USERS_KEY = 'toolsx_users_db';

// Quick hash for browser storage
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_toolsx_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getStoredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      // Seed initial default demo user
      const defaultUser: StoredUser = {
        id: 'usr-toolsx-founder',
        email: 'aitoolslabindia@gmail.com',
        displayName: 'TOOLSX Creator',
        username: 'toolsx_founder',
        avatarColor: '#00f5a0',
        createdAt: Date.now() - 86400000,
        bio: 'Founder at toolsx.in • Spatial Web & 3D Engineering',
        website: 'https://toolsx.in',
        passwordHash: 'seeded_demo_hash',
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (err) {
    console.error('Failed to set current user', err);
  }
}

export async function loginUser(email: string, password?: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const users = getStoredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    // If user doesn't exist yet, we can create automatically or return error
    // For browser convenience, if password matches or is guest:
    return { success: false, error: 'User not found. Please click Sign Up or use 1-Click Guest Login.' };
  }

  if (password && found.passwordHash !== 'seeded_demo_hash') {
    const hash = await hashPassword(password);
    if (hash !== found.passwordHash) {
      return { success: false, error: 'Incorrect password entered.' };
    }
  }

  const userObj: AuthUser = {
    id: found.id,
    email: found.email,
    displayName: found.displayName,
    username: found.username,
    avatarColor: found.avatarColor,
    createdAt: found.createdAt,
    bio: found.bio,
    website: found.website,
  };

  setCurrentUser(userObj);
  return { success: true, user: userObj };
}

export async function signupUser(
  email: string,
  password: string,
  displayName: string,
  username: string,
  avatarColor: string = '#00f5a0'
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const users = getStoredUsers();
  const cleanEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    email: cleanEmail,
    displayName: displayName.trim() || 'Spatial Creator',
    username: username.trim().toLowerCase() || `user_${Date.now().toString().slice(-4)}`,
    avatarColor,
    createdAt: Date.now(),
    bio: 'Spatial Computing Engineer on toolsx.in',
    website: 'https://toolsx.in',
    passwordHash,
  };

  users.push(newUser);
  saveStoredUsers(users);

  const authUser: AuthUser = {
    id: newUser.id,
    email: newUser.email,
    displayName: newUser.displayName,
    username: newUser.username,
    avatarColor: newUser.avatarColor,
    createdAt: newUser.createdAt,
    bio: newUser.bio,
    website: newUser.website,
  };

  setCurrentUser(authUser);
  return { success: true, user: authUser };
}

export function quickGuestLogin(): AuthUser {
  const guestUser: AuthUser = {
    id: `guest-${Date.now().toString().slice(-4)}`,
    email: 'aitoolslabindia@gmail.com',
    displayName: 'TOOLSX Guest Architect',
    username: 'toolsx_guest',
    avatarColor: '#00f5a0',
    createdAt: Date.now(),
    bio: 'Browser-based verified session • toolsx.in',
    website: 'https://toolsx.in',
  };
  setCurrentUser(guestUser);
  return guestUser;
}

export function logoutUser() {
  setCurrentUser(null);
}
