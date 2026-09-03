import { parseCsv, serializeCsv } from './csv.js';
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryChoicesForType,
  getDefaultCategoryForType,
  normalizeImportedCategory,
} from './categories.js';

export const categories = [...ALL_CATEGORIES];
export const incomeCategories = [...INCOME_CATEGORIES];
export const expenseCategories = [...EXPENSE_CATEGORIES];
export const defaultImportType = /** @type {'expense'} */ ('expense');
export const defaultImportCategory = /** @type {'Groceries'} */ (getDefaultCategoryForType(defaultImportType));

export function formatMoney(value) {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(numericValue);
}

export function toIsoDate(value = new Date()) {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export { getCategoryChoicesForType, normalizeImportedCategory };

export function parseImportAmount(value) {
  const sanitized = String(value ?? '').replace(/[$€£,\s]/g, '').trim();
  const numericValue = Number(sanitized);
  return Number.isFinite(numericValue) ? numericValue : NaN;
}

export function normalizeCsvHeader(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '');
}

export function findRequiredColumnIndexes(row) {
  const headers = row.map((header) => normalizeCsvHeader(header));

  return {
    dateIndex: headers.findIndex((header) => header === 'date'),
    amountIndex: headers.findIndex((header) => header === 'amount'),
    noteIndex: headers.findIndex((header) => header === 'note'),
  };
}

export function createDefaultImportRow(dateValue, amountValue, noteValue) {
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

export function buildImportRowsFromCsv(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) return [];

  const { dateIndex, amountIndex, noteIndex } = findRequiredColumnIndexes(rows[0]);
  if (dateIndex === -1 || amountIndex === -1 || noteIndex === -1) {
    return [];
  }

  /** @type {Array<{ id: string, date: string, amount: number, note: string, type: 'income' | 'expense', category: string }>} */
  const importRows = [];

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

export function serializeTransactionsCsv(transactions) {
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
