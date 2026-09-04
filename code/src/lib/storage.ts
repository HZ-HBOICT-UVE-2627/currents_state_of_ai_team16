import type { AppThemeSettings } from './colorTheme';
import { DEFAULT_THEME_SETTINGS, normalizeThemeSettings } from './colorTheme';
import type { Transaction } from './types';
import type { CategorySettings } from './types';
import { DEFAULT_CATEGORY_SETTINGS, normalizeCategorySettings } from './categories';

export const STORAGE_KEYS = {
  transactions: 'budget-tracker-transactions-v1',
  theme: 'budget-tracker-theme-v1',
  appTheme: 'budget-tracker-custom-theme-v1',
  categories: 'budget-tracker-categories-v1',
} as const;

export function readStorageValue<T>(storage: Storage, key: string, fallbackValue: T): T {
  try {
    const rawValue = storage.getItem(key);
    if (rawValue === null) {
      return fallbackValue;
    }
    return JSON.parse(rawValue) as T;
  } catch {
    return fallbackValue;
  }
}

export function writeStorageValue(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures so UI remains usable in restricted environments.
  }
}

export function loadTransactions(storage: Storage, fallbackTransactions: Transaction[]): Transaction[] {
  return readStorageValue(storage, STORAGE_KEYS.transactions, fallbackTransactions);
}

export function saveTransactions(storage: Storage, transactions: Transaction[]): void {
  writeStorageValue(storage, STORAGE_KEYS.transactions, transactions);
}

export function loadTheme(storage: Storage, fallbackDarkMode = false): boolean {
  const value = storage.getItem(STORAGE_KEYS.theme);
  if (value === null) {
    return fallbackDarkMode;
  }

  return value === 'dark';
}

export function saveTheme(storage: Storage, darkMode: boolean): void {
  storage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
}

export function loadCustomTheme(storage: Storage, fallbackTheme: AppThemeSettings = DEFAULT_THEME_SETTINGS): AppThemeSettings {
  const rawValue = storage.getItem(STORAGE_KEYS.appTheme);
  if (rawValue === null) {
    return normalizeThemeSettings(fallbackTheme);
  }

  try {
    return normalizeThemeSettings(JSON.parse(rawValue) as Partial<AppThemeSettings>);
  } catch {
    return normalizeThemeSettings(fallbackTheme);
  }
}

export function saveCustomTheme(storage: Storage, theme: AppThemeSettings): void {
  writeStorageValue(storage, STORAGE_KEYS.appTheme, normalizeThemeSettings(theme));
}

export function loadCategorySettings(storage: Storage, fallback: CategorySettings = DEFAULT_CATEGORY_SETTINGS): CategorySettings {
  return normalizeCategorySettings(readStorageValue<Partial<CategorySettings>>(storage, STORAGE_KEYS.categories, fallback));
}

export function saveCategorySettings(storage: Storage, settings: CategorySettings): void {
  writeStorageValue(storage, STORAGE_KEYS.categories, normalizeCategorySettings(settings));
}
