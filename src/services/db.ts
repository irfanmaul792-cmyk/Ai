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
   * Initializes database with initial structure if empty
   */
  private initDatabase(): void {
    try {
      const existingUsers = this.getUsers();
      if (existingUsers.length === 0) {
        // Pre-create initial user "Akun Utama" with EMPTY fridge
        const defaultUser: User = {
          id: 'user_irfan',
          name: 'Irfan Maulana',
          email: 'irfanmaul792@gmail.com',
          avatar: '👨‍🍳',
          createdAt: Date.now(),
          lastLoginAt: Date.now()
        };

        // Also create a second demo family account so the user can immediately test multi-account switching!
        const familyUser: User = {
          id: 'user_keluarga',
          name: 'Dapur Keluarga',
          email: 'keluarga@dapur.id',
          avatar: '🏡',
          createdAt: Date.now(),
          lastLoginAt: Date.now()
        };

        const users = [defaultUser, familyUser];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

        // Initial empty account data for both (KULKAS KOSONG)
        this.saveUserData(defaultUser.id, createEmptyAccountData(defaultUser.id));
        this.saveUserData(familyUser.id, createEmptyAccountData(familyUser.id));

        // Set default logged in user
        localStorage.setItem(CURRENT_USER_KEY, defaultUser.id);
      }
    } catch (err) {
      console.warn('Failed to initialize database in localStorage:', err);
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
   * Get currently logged-in user
   */
  public getCurrentUser(): User | null {
    try {
      const currentId = localStorage.getItem(CURRENT_USER_KEY);
      const users = this.getUsers();
      if (!currentId && users.length > 0) {
        return users[0];
      }
      return users.find(u => u.id === currentId) || users[0] || null;
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
   */
  public async registerUser(
    name: string,
    email: string,
    password: string,
    avatar: string = '🍳'
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const normalizedEmail = email.trim().toLowerCase();

      // Check duplicate email
      if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, error: 'Email atau username ini sudah terdaftar. Silakan login atau gunakan nama lain.' };
      }

      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const passwordHash = await hashPassword(password);

      const newUser: User = {
        id,
        name: name.trim(),
        email: normalizedEmail,
        avatar,
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      };

      // Save password hash alongside user
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(`kulkas_db_auth_${id}`, passwordHash);

      // Create completely EMPTY fridge for this new account
      const emptyData = createEmptyAccountData(id);
      this.saveUserData(id, emptyData);

      // Set as active user
      this.setCurrentUser(id);

      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal membuat akun baru.' };
    }
  }

  /**
   * Login with email and password
   */
  public async loginUser(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return { success: false, error: 'Akun dengan email/nama ini tidak ditemukan. Silakan periksa kembali atau buat akun baru.' };
      }

      // Check password if stored
      const storedHash = localStorage.getItem(`kulkas_db_auth_${user.id}`);
      if (storedHash) {
        const inputHash = await hashPassword(password);
        if (storedHash !== inputHash) {
          return { success: false, error: 'Kata sandi / PIN tidak cocok. Silakan coba lagi.' };
        }
      }

      // Set active user
      this.setCurrentUser(user.id);

      return { success: true, user };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Gagal masuk akun.' };
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
