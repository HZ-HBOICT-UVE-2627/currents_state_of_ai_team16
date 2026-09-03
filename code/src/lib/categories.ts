import type { TransactionType } from './types';

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Savings', 'Other'] as const;
export const EXPENSE_CATEGORIES = ['Housing', 'Groceries', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Savings', 'Other'] as const;
export const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export function getCategoryChoicesForType(type: TransactionType): string[] {
  return type === 'income' ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES];
}

export function normalizeImportedCategory(type: TransactionType, currentCategory: string): string {
  const choices = getCategoryChoicesForType(type);
  return choices.includes(currentCategory) ? currentCategory : choices[0];
}

export function getDefaultCategoryForType(type: TransactionType): string {
  return getCategoryChoicesForType(type)[0];
}
