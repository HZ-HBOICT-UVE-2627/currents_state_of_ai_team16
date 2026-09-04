import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryChoicesForType } from '../categories.ts';
import type { CategorySettings, TransactionForm, TransactionType } from '../types';

export function validateTransactionInput(form: TransactionForm, settings?: CategorySettings): {
  valid: boolean;
  error: string | null;
  normalized: {
    id: string | null;
    type: TransactionType;
    category: string;
    amount: number;
    date: string;
    note: string;
    recurring: boolean;
  };
} {
  const amount = Number(form.amount);

  if (!form.date) {
    return {
      valid: false,
      error: 'A transaction date is required.',
      normalized: { ...form, amount: Number.NaN },
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      valid: false,
      error: 'Amount must be a positive number.',
      normalized: { ...form, amount: Number.NaN },
    };
  }

  const validCategories = settings ? getCategoryChoicesForType(form.type, settings) : (form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES);
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

export function validateImportedCsvRows(importedRows: unknown[]): {
  valid: boolean;
  error: string | null;
  rows: Array<Record<string, unknown>>;
} {
  if (!Array.isArray(importedRows)) {
    return { valid: false, error: 'No rows were imported.', rows: [] };
  }

  const validRows = importedRows.filter((row) => {
    if (!row || typeof row !== 'object') return false;
    return Number.isFinite(Number((row as Record<string, unknown>).amount)) && Number((row as Record<string, unknown>).amount) > 0 && (row as Record<string, unknown>).date;
  });

  if (validRows.length === 0) {
    return { valid: false, error: 'Imported CSV data was missing valid date or amount fields.', rows: [] };
  }

  return { valid: true, error: null, rows: validRows as Array<Record<string, unknown>> };
}

export function getDefaultTransactionType(): TransactionType {
  return 'expense';
}

