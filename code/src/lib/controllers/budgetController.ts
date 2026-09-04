import { getCategoryChoicesForType, normalizeImportedCategory } from '../categories.ts';
import type { CategorySettings } from '../types';
import type { CategoryBreakdownEntry, ImportRow, SummaryTotals, Transaction, TransactionForm, TransactionType, TrendChartData } from '../types';

export function makeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function updateFormType(form: TransactionForm, settings?: CategorySettings): TransactionForm {
  const validCategories = getCategoryChoicesForType(form.type, settings);

  if (!validCategories.includes(form.category)) {
    return { ...form, category: validCategories[0] };
  }

  return form;
}

export function confirmImports(transactions: Transaction[], pendingImportRows: ImportRow[], settings?: CategorySettings): Transaction[] {
  const imported: Transaction[] = pendingImportRows.map((row) => ({
    id: makeId(),
    type: row.type,
    category: normalizeImportedCategory(row.type, row.category, settings),
    amount: Number(Math.abs(Number(row.amount)).toFixed(2)),
    date: row.date,
    note: row.note.trim() || 'Imported transaction',
    recurring: false,
  }));

  return [...imported, ...transactions];
}

export function calculateMonthSummary(items: Transaction[], targetMonth = new Date()): SummaryTotals {
  const start = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const end = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59, 999);

  const monthEntries = items.filter((entry) => {
    const date = new Date(entry.date);
    return date >= start && date <= end;
  });

  const income = monthEntries
    .filter((entry) => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const expenses = monthEntries
    .filter((entry) => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return { income, expenses, net: income - expenses };
}

export function calculateYearSummary(items: Transaction[], targetYear = new Date().getFullYear()): SummaryTotals {
  const yearEntries = items.filter((entry) => {
    const date = new Date(entry.date);
    return date.getFullYear() === targetYear;
  });

  const income = yearEntries
    .filter((entry) => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const expenses = yearEntries
    .filter((entry) => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return { income, expenses, net: income - expenses };
}

export function calculateCategoryBreakdown(items: Transaction[]): CategoryBreakdownEntry[] {
  const map = new Map<string, number>();

  items
    .filter((entry) => entry.type === 'expense')
    .forEach((entry) => {
      const current = map.get(entry.category) ?? 0;
      map.set(entry.category, current + entry.amount);
    });

  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((left, right) => right.total - left.total);
}

export function calculateTrendData(items: Transaction[]): TrendChartData {
  const labels: string[] = [];
  const income: number[] = [];
  const expense: number[] = [];
  const now = new Date();

  for (let offset = 11; offset >= 0; offset -= 1) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);

    labels.push(monthDate.toLocaleDateString('en-GB', { month: 'short' }));

    const monthItems = items.filter((entry) => {
      const date = new Date(entry.date);
      return date >= monthStart && date <= monthEnd;
    });

    income.push(monthItems.filter((entry) => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0));
    expense.push(monthItems.filter((entry) => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0));
  }

  return { labels, income, expense };
}

export function getCategoryOptions(type: TransactionType, settings?: CategorySettings): string[] {
  return getCategoryChoicesForType(type, settings);
}
