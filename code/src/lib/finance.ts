import { parseCsv, serializeCsv } from './csv.ts';
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryChoicesForType,
  getDefaultCategoryForType,
  normalizeImportedCategory,
} from './categories.ts';
import type { ImportRow, Transaction, TransactionType } from './types';

export const categories: string[] = [...ALL_CATEGORIES];
export const incomeCategories: string[] = [...INCOME_CATEGORIES];
export const expenseCategories: string[] = [...EXPENSE_CATEGORIES];
export const defaultImportType: TransactionType = 'expense';
export const defaultImportCategory = getDefaultCategoryForType(defaultImportType);

export function formatMoney(value: number | string): string {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(numericValue);
}

export function toIsoDate(value: Date = new Date()): string {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export { getCategoryChoicesForType, normalizeImportedCategory };

export function parseImportAmount(value: string | number): number {
  const sanitized = String(value ?? '').replace(/[$€£,\s]/g, '').trim();
  const numericValue = Number(sanitized);
  return Number.isFinite(numericValue) ? numericValue : Number.NaN;
}

export function normalizeCsvHeader(value: string | null | undefined): string {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '');
}

export function findRequiredColumnIndexes(row: string[]): {
  dateIndex: number;
  amountIndex: number;
  noteIndex: number;
} {
  const headers = row.map((header) => normalizeCsvHeader(header));

  return {
    dateIndex: headers.findIndex((header) => header === 'date'),
    amountIndex: headers.findIndex((header) => header === 'amount'),
    noteIndex: headers.findIndex((header) => header === 'note'),
  };
}

export function createDefaultImportRow(dateValue: string, amountValue: number, noteValue: string): ImportRow | null {
  const parsedDate = new Date(dateValue);

  if (!dateValue || !Number.isFinite(amountValue) || amountValue <= 0 || Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return {
    id: `import-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: toIsoDate(parsedDate),
    amount: Number(amountValue.toFixed(2)),
    note: noteValue.trim() || 'Imported transaction',
    type: defaultImportType,
    category: normalizeImportedCategory(defaultImportType, defaultImportCategory),
  };
}

export function buildImportRowsFromCsv(csvText: string): ImportRow[] {
  const rows = parseCsv(csvText);
  if (rows.length < 2) return [];

  const { dateIndex, amountIndex, noteIndex } = findRequiredColumnIndexes(rows[0]);
  if (dateIndex === -1 || amountIndex === -1 || noteIndex === -1) {
    return [];
  }

  const importRows: ImportRow[] = [];

  for (const values of rows.slice(1)) {
    const dateValue = values[dateIndex] ?? '';
    const amountValue = parseImportAmount(values[amountIndex] ?? '');
    const noteValue = values[noteIndex] ?? '';

    const row = createDefaultImportRow(dateValue, amountValue, noteValue);
    if (row) {
      importRows.push(row);
    }
  }

  return importRows;
}

export function serializeTransactionsCsv(transactions: Transaction[]): string {
  const headers = ['id', 'type', 'category', 'amount', 'date', 'note', 'recurring'];
  const rows = transactions.map((entry) => [
    entry.id,
    entry.type,
    entry.category,
    entry.amount,
    entry.date,
    entry.note,
    entry.recurring ? 'true' : 'false',
  ]);

  return serializeCsv([headers, ...rows]);
}
