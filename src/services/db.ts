import { Ingredient, Recipe, ShoppingItem, FilterOptions, UploadedPhoto, User, UserAccountData } from '../types';

const USERS_STORAGE_KEY = 'kulkas_db_users';
const CURRENT_USER_KEY = 'kulkas_db_current_user_id';
const DATA_PREFIX = 'kulkas_db_data_';

// Default empty filters
export const DEFAULT_FILTERS: FilterOptions = {
  budget: 'Bebas',
  cookingTime: 'Maks. 30 menit',
  servings: '2',
  preferences: 'suka pedas'
};

// Default empty account data (Starts with 0 ingredients as requested by user)
export function createEmptyAccountData(userId: string): UserAccountData {
  return {
    userId,
    ingredients: [], // EMPTY FRIDGE BY DEFAULT
    selectedFridgeIds: {},
    shoppingItems: [],
    favoriteRecipes: [],
    filters: { ...DEFAULT_FILTERS },
    photos: [],
    updatedAt: Date.now()
  };
}

/**
 * Hash password simply using subtle crypto for local database security
 */
async function hashPassword(plainText: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback if crypto.subtle is restricted
    return btoa(plainText);
  }
}

/**
 * Database Service for Multi-User Refrigerator & Recipe management
 */
class DatabaseService {
  private memoryCache: Map<string, UserAccountData> = new Map();

  constructor() {
    this.initDatabase();
  }

  /**
   * Initializes database with initial structure if empty.
   * Purges any legacy "user_keluarga" or "Dapur Keluarga" demo data.
   */
  private initDatabase(): void {
    try {
      // Purge legacy demo "user_keluarga" / "Dapur Keluarga" completely if it exists
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        try {
          const users: User[] = JSON.parse(raw);
          const filtered = users.filter(u => 
            u.id !== 'user_keluarga' && 
            u.name.toLowerCase() !== 'dapur keluarga' && 
            !u.email.toLowerCase().includes('keluarga')
          );
          if (filtered.length !== users.length) {
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
            localStorage.removeItem('kulkas_user_data_user_keluarga');
            localStorage.removeItem('kulkas_db_auth_user_keluarga');
          }
        } catch {
          // ignore
        }
      }

      // If active user was user_keluarga, clear it
      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentId === 'user_keluarga') {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (err) {
      console.warn('Failed to clean up legacy data in localStorage:', err);
    }

    // Synchronize accounts from central server (Multi-Device Sync)
    this.syncWithServer();
  }

  /**
   * Pull latest users and current user data from server
   */
  public async syncWithServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users)) {
          const localUsers = this.getUsers();
          const userMap = new Map<string, User>();
          localUsers.forEach(u => userMap.set(u.id, u));
          data.users.forEach((u: User) => userMap.set(u.id, u));
          const merged = Array.from(userMap.values());
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
        }
      }

      // Sync active user data from server if available
      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      if (currentId) {
        const dataRes = await fetch(`/api/user-data/${currentId}`);
        if (dataRes.ok) {
          const dataJson = await dataRes.json();
          if (dataJson.data && Array.isArray(dataJson.data.ingredients)) {
            this.memoryCache.set(currentId, dataJson.data);
            localStorage.setItem(`${DATA_PREFIX}${currentId}`, JSON.stringify(dataJson.data));
          }
        }
      }
    } catch (err) {
      // Offline fallback - ignore
    }
  }

  /**
   * Get all registered users on this device
   */
  public getUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get currently logged-in user. Returns null if user is logged out or hasn't logged in.
   */
  public getCurrentUser(): User | null {
    try {
      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      if (!currentId) {
        return null;
      }
      const users = this.getUsers();
      return users.find(u => u.id === currentId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Set the active user ID
   */
  public setCurrentUser(userId: string): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, userId);
      // Update last login
      const users = this.getUsers();
      const updated = users.map(u => u.id === userId ? { ...u, lastLoginAt: Date.now() } : u);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error setting current user:', err);
    }
  }

  /**
   * Register a new user account with completely empty fridge
   * Saves to server for multi-device support + local cache
   */
  public async registerUser(
    name: string,
    email: string,
    password: string,
    avatar: string = '🍳'
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      const trimmedPassword = password.trim();

      if (!trimmedPassword || trimmedPassword.length < 8) {
        return { 
          success: false, 
          error: 'Kata sandi minimal 8 karakter (bisa berupa huruf, angka, atau simbol) agar akun Anda aman dan dapat login di perangkat lain.' 
        };
      }

      // 1. Try registering on central server for multi-device access
      try {
        const resp = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedName, email: normalizedEmail, password: trimmedPassword, avatar })
        });

        if (resp.ok) {
          const result = await resp.json();
          if (result.success && result.user) {
            const serverUser: User = result.user;
            const users = this.getUsers();
            if (!users.some(u => u.id === serverUser.id)) {
              users.push(serverUser);
              localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
            }
            if (result.accountData) {
              this.memoryCache.set(serverUser.id, result.accountData);
              localStorage.setItem(`${DATA_PREFIX}${serverUser.id}`, JSON.stringify(result.accountData));
            }
            const passwordHash = await hashPassword(trimmedPassword);
            localStorage.setItem(`kulkas_db_auth_${serverUser.id}`, passwordHash);
            this.setCurrentUser(serverUser.id);
            return { success: true, user: serverUser };
          }
        } else {
          const errData = await resp.json().catch(() => ({}));
          if (errData.error) {
            return { success: false, error: errData.error };
          }
        }
      } catch (netErr) {
        console.warn('Central server register failed, falling back to local DB:', netErr);
      }

      // 2. Local fallback registration
      const users = this.getUsers();
      if (users.some(u => u.email.toLowerCase() === normalizedEmail || u.name.toLowerCase() === trimmedName.toLowerCase())) {
        return { 
          success: false, 
          error: `Email atau ID "${email.trim()}" sudah digunakan oleh akun lain. Silakan gunakan email atau ID yang lain.` 
        };
      }

      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const passwordHash = await hashPassword(trimmedPassword);

      const newUser: User = {
        id,
        name: trimmedName,
        email: normalizedEmail,
        avatar,
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      };

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(`kulkas_db_auth_${id}`, passwordHash);

      const emptyData = createEmptyAccountData(id);
      this.saveUserData(id, emptyData);
      this.setCurrentUser(id);

      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal membuat akun baru.' };
    }
  }

  /**
   * Login with email or name and password
   * Checks central server first (allows logging in from HP 2 using account made on HP 1)
   */
  public async loginUser(
    emailOrName: string,
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const query = emailOrName.trim();
      const trimmedPassword = password.trim();

      if (!trimmedPassword) {
        return { success: false, error: 'Kata sandi harus diisi untuk masuk ke akun Anda.' };
      }

      // 1. Try central server login (enables multi-device cross-login)
      try {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrName: query, password })
        });

        if (resp.ok) {
          const result = await resp.json();
          if (result.success && result.user) {
            const serverUser: User = result.user;
            // Update local user list
            const users = this.getUsers();
            const existingIdx = users.findIndex(u => u.id === serverUser.id);
            if (existingIdx >= 0) {
              users[existingIdx] = serverUser;
            } else {
              users.push(serverUser);
            }
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

            // Cache password and account data
            const passwordHash = await hashPassword(password);
            localStorage.setItem(`kulkas_db_auth_${serverUser.id}`, passwordHash);
            if (result.accountData) {
              this.memoryCache.set(serverUser.id, result.accountData);
              localStorage.setItem(`${DATA_PREFIX}${serverUser.id}`, JSON.stringify(result.accountData));
            }

            this.setCurrentUser(serverUser.id);
            return { success: true, user: serverUser };
          }
        } else {
          const errData = await resp.json().catch(() => ({}));
          if (errData.error) {
            return { success: false, error: errData.error };
          }
        }
      } catch (netErr) {
        console.warn('Central server login unavailable, trying local database:', netErr);
      }

      // 2. Local database fallback
      const users = this.getUsers();
      const norm = query.toLowerCase();
      const user = users.find(u => 
        u.email.toLowerCase() === norm || 
        u.name.toLowerCase() === norm
      );

      if (!user) {
        return { success: false, error: 'Akun dengan email/nama ini tidak ditemukan. Silakan periksa kembali atau buat akun baru.' };
      }

      // Check password if stored locally
      const storedHash = localStorage.getItem(`kulkas_db_auth_${user.id}`);
      if (storedHash) {
        const inputHash = await hashPassword(password);
        if (storedHash !== inputHash) {
          return { success: false, error: 'Kata sandi / PIN tidak cocok. Silakan coba lagi.' };
        }
      }

      this.setCurrentUser(user.id);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal masuk akun.' };
    }
  }

  /**
   * Change password for user (updates on central server and local device)
   */
  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!newPassword || newPassword.trim().length < 8) {
        return { success: false, error: 'Kata sandi baru minimal 8 karakter (bisa berupa huruf, angka, atau simbol).' };
      }

      // 1. Try updating on central server
      try {
        const resp = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, oldPassword, newPassword })
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          return { success: false, error: errData.error || 'Gagal mengubah kata sandi di server.' };
        }
      } catch (netErr) {
        console.warn('Server change-password failed, updating local storage:', netErr);
        // Verify local password
        const storedHash = localStorage.getItem(`kulkas_db_auth_${userId}`);
        if (storedHash && oldPassword) {
          const oldHash = await hashPassword(oldPassword);
          if (storedHash !== oldHash) {
            return { success: false, error: 'Kata sandi lama tidak cocok.' };
          }
        }
      }

      // 2. Update local password hash
      const newHash = await hashPassword(newPassword);
      localStorage.setItem(`kulkas_db_auth_${userId}`, newHash);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal memperbarui kata sandi.' };
    }
  }

  /**
   * Delete an account and its saved data
   */
  public deleteUser(userId: string): boolean {
    try {
      // Fire-and-forget server sync to clean up centralized records and free up email
      fetch('/api/auth/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      }).catch(err => console.warn('Could not sync user deletion to server:', err));

      let users = this.getUsers();
      users = users.filter(u => u.id !== userId);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.removeItem(`${DATA_PREFIX}${userId}`);
      localStorage.removeItem(`kulkas_db_auth_${userId}`);
      this.memoryCache.delete(userId);
      if (localStorage.getItem(CURRENT_USER_KEY) === userId) {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Switch directly to another existing user on device
   */
  public switchUser(userId: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      this.setCurrentUser(userId);
      return user;
    }
    return null;
  }

  /**
   * Logout current user
   */
  public logout(): void {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  }

  /**
   * Get account-specific data (Ingredients, Shopping, Favorites, Filters)
   */
  public getUserData(userId: string): UserAccountData {
    if (this.memoryCache.has(userId)) {
      return this.memoryCache.get(userId)!;
    }

    try {
      const raw = localStorage.getItem(`${DATA_PREFIX}${userId}`);
      if (raw) {
        const parsed: UserAccountData = JSON.parse(raw);
        this.memoryCache.set(userId, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn(`Error reading data for user ${userId}:`, err);
    }

    // Default to empty data
    const emptyData = createEmptyAccountData(userId);
    this.memoryCache.set(userId, emptyData);
    this.saveUserData(userId, emptyData);
    return emptyData;
  }

  /**
   * Save account-specific data
   */
  public saveUserData(userId: string, data: UserAccountData): void {
    const updated = { ...data, userId, updatedAt: Date.now() };
    this.memoryCache.set(userId, updated);
    try {
      localStorage.setItem(`${DATA_PREFIX}${userId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn(`Error saving data for user ${userId} to localStorage:`, err);
    }

    // Sync to server for multi-device cross updates
    if (typeof window !== 'undefined') {
      fetch(`/api/user-data/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updated })
      }).catch(() => {});
    }
  }

  /**
   * Completely empty a user's fridge (kosongkan kulkas)
   */
  public clearUserFridge(userId: string): UserAccountData {
    const current = this.getUserData(userId);
    const updated: UserAccountData = {
      ...current,
      ingredients: [],
      selectedFridgeIds: {},
      updatedAt: Date.now()
    };
    this.saveUserData(userId, updated);
    return updated;
  }

  /**
   * Export all account data as JSON string for backup
   */
  public exportBackup(userId: string): string {
    const user = this.getUsers().find(u => u.id === userId);
    const data = this.getUserData(userId);
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      data
    };
    return JSON.stringify(backup, null, 2);
  }

  /**
   * Import data from JSON string backup
   */
  public importBackup(userId: string, jsonString: string): { success: boolean; data?: UserAccountData; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data || !Array.isArray(parsed.data.ingredients)) {
        return { success: false, error: 'Format berkas cadangan JSON tidak valid.' };
      }

      const importedData: UserAccountData = {
        userId,
        ingredients: parsed.data.ingredients || [],
        selectedFridgeIds: parsed.data.selectedFridgeIds || {},
        shoppingItems: parsed.data.shoppingItems || [],
        favoriteRecipes: parsed.data.favoriteRecipes || [],
        filters: parsed.data.filters || { ...DEFAULT_FILTERS },
        photos: parsed.data.photos || [],
        updatedAt: Date.now()
      };

      this.saveUserData(userId, importedData);
      return { success: true, data: importedData };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal memproses berkas JSON.' };
    }
  }
}

export const db = new DatabaseService();
