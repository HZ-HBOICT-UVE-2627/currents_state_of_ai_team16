export const STORAGE_KEYS = {
  transactions: 'budget-tracker-transactions-v1',
  theme: 'budget-tracker-theme-v1',
};

export function readStorageValue(storage, key, fallbackValue) {
  try {
    const rawValue = storage.getItem(key);
    if (rawValue === null) {
      return fallbackValue;
    }
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export function writeStorageValue(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write failures so UI remains usable in restricted environments.
  }
}

export function loadTransactions(storage, fallbackTransactions) {
  return readStorageValue(storage, STORAGE_KEYS.transactions, fallbackTransactions);
}

export function saveTransactions(storage, transactions) {
  writeStorageValue(storage, STORAGE_KEYS.transactions, transactions);
}

export function loadTheme(storage, fallbackDarkMode = false) {
  const value = storage.getItem(STORAGE_KEYS.theme);
  if (value === null) {
    return fallbackDarkMode;
  }

  return value === 'dark';
}

export function saveTheme(storage, darkMode) {
  storage.setItem(STORAGE_KEYS.theme, darkMode ? 'dark' : 'light');
}
