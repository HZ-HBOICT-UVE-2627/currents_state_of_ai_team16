import type { CategorySettings, TransactionType } from './types';

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Savings', 'Other'] as const;
export const EXPENSE_CATEGORIES = ['Housing', 'Groceries', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Savings', 'Other'] as const;
export const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export const DEFAULT_CATEGORY_SETTINGS: CategorySettings = {
  income: [...INCOME_CATEGORIES],
  expense: [...EXPENSE_CATEGORIES],
  colors: {},
};

export function getCategoryChoicesForType(type: TransactionType, settings: CategorySettings = DEFAULT_CATEGORY_SETTINGS): string[] {
  return type === 'income' ? [...settings.income] : [...settings.expense];
}

export function normalizeImportedCategory(type: TransactionType, currentCategory: string, settings: CategorySettings = DEFAULT_CATEGORY_SETTINGS): string {
  const choices = getCategoryChoicesForType(type, settings);
  return choices.includes(currentCategory) ? currentCategory : choices[0];
}

export function getDefaultCategoryForType(type: TransactionType, settings: CategorySettings = DEFAULT_CATEGORY_SETTINGS): string {
  return getCategoryChoicesForType(type, settings)[0];
}

export function normalizeCategorySettings(value: Partial<CategorySettings> | null | undefined): CategorySettings {
  const income = Array.isArray(value?.income) ? value.income.filter((name): name is string => typeof name === 'string' && name.trim().length > 0).map((name) => name.trim()) : DEFAULT_CATEGORY_SETTINGS.income;
  const expense = Array.isArray(value?.expense) ? value.expense.filter((name): name is string => typeof name === 'string' && name.trim().length > 0).map((name) => name.trim()) : DEFAULT_CATEGORY_SETTINGS.expense;
  const colors = value?.colors && typeof value.colors === 'object' ? value.colors : {};

  return {
    income: income.length > 0 ? [...new Set(income)] : [...DEFAULT_CATEGORY_SETTINGS.income],
    expense: expense.length > 0 ? [...new Set(expense)] : [...DEFAULT_CATEGORY_SETTINGS.expense],
    colors: Object.fromEntries(Object.entries(colors).filter(([name, color]) => typeof name === 'string' && typeof color === 'string')),
  };
}
