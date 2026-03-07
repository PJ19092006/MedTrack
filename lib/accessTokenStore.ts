// In-memory store for access tokens (replaces MongoDB for temp doc access codes)

export interface StoredAccess {
  token: string;
  patientId: string;
  expiresAt: Date;
  revoked?: boolean;
}

const store = new Map<string, StoredAccess>();

export function saveAccess(access: StoredAccess) {
  const key = access.token.trim();
  store.set(key, { ...access, token: key });
}

export function findAccessByToken(token: string): StoredAccess | undefined {
  const key = token?.trim();
  return key ? store.get(key) : undefined;
}

export function revokeAccess(token: string) {
  const key = token?.trim();
  if (key) {
    const access = store.get(key);
    if (access) {
      store.set(key, { ...access, revoked: true });
    }
  }
}
