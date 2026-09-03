export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Savings', 'Other'];
export const EXPENSE_CATEGORIES = ['Housing', 'Groceries', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Savings', 'Other'];
export const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export function getCategoryChoicesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function normalizeImportedCategory(type, currentCategory) {
  const choices = getCategoryChoicesForType(type);
  return choices.includes(currentCategory) ? currentCategory : choices[0];
}

export function getDefaultCategoryForType(type) {
  return getCategoryChoicesForType(type)[0];
}
