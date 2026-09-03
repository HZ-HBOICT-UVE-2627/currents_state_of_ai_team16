import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryChoicesForType } from '../categories.js';

export function validateTransactionInput(form) {
  const amount = Number(form.amount);

  if (!form.date) {
    return {
      valid: false,
      error: 'A transaction date is required.',
      normalized: { ...form, amount: NaN },
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      valid: false,
      error: 'Amount must be a positive number.',
      normalized: { ...form, amount: NaN },
    };
  }

  const validCategories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  if (!validCategories.includes(form.category)) {
    return {
      valid: false,
      error: `Category is not valid for ${form.type} transactions.`,
      normalized: { ...form, amount },
    };
  }

  return {
    valid: true,
    error: null,
    normalized: {
      ...form,
      amount: Number(amount.toFixed(2)),
      category: form.category,
      note: String(form.note ?? '').trim() || 'No note',
      recurring: !!form.recurring,
    },
  };
}

export function validateImportedCsvRows(importedRows) {
  if (!Array.isArray(importedRows)) {
    return { valid: false, error: 'No rows were imported.', rows: [] };
  }

  const validRows = importedRows.filter((row) => {
    if (!row || typeof row !== 'object') return false;
    return Number.isFinite(Number(row.amount)) && Number(row.amount) > 0 && row.date;
  });

  if (validRows.length === 0) {
    return { valid: false, error: 'Imported CSV data was missing valid date or amount fields.', rows: [] };
  }

  return { valid: true, error: null, rows: validRows };
}

export function getDefaultTransactionType() {
  return 'expense';
}

export function getDefaultCategoryForType(type) {
  return getCategoryChoicesForType(type)[0];
}
