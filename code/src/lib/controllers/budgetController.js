import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryChoicesForType,
  normalizeImportedCategory,
} from '../categories.js';
import { toIsoDate } from '../finance.js';
import { validateTransactionInput } from '../services/validationService.js';

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function makeBlankForm() {
  return {
    id: null,
    type: 'expense',
    category: 'Groceries',
    amount: '',
    date: toIsoDate(new Date()),
    note: '',
    recurring: false,
  };
}

export function updateFormType(form) {
  const validCategories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!validCategories.includes(form.category)) {
    return { ...form, category: getCategoryChoicesForType(form.type)[0] };
  }

  return form;
}

export function submitTransaction({ transactions, form, formMode }) {
  const validation = validateTransactionInput(form);

  if (!validation.valid) {
    return { transactions, changed: false, nextForm: makeBlankForm(), nextMode: formMode };
  }

  const submitted = {
    id: form.id ?? makeId(),
    type: form.type,
    category: validation.normalized.category,
    amount: Number(validation.normalized.amount.toFixed(2)),
    date: form.date,
    note: validation.normalized.note,
    recurring: !!validation.normalized.recurring,
  };

  const nextTransactions = formMode === 'edit'
    ? transactions.map((item) => (item.id === submitted.id ? submitted : item))
    : [submitted, ...transactions];

  return {
    transactions: nextTransactions,
    changed: true,
    nextForm: makeBlankForm(),
    nextMode: 'add',
  };
}

export function startEditTransaction(item) {
  return {
    formMode: 'edit',
    form: {
      id: item.id,
      type: item.type,
      category: item.category,
      amount: String(item.amount),
      date: item.date,
      note: item.note,
      recurring: item.recurring,
    },
  };
}

export function removeTransactionFromList(transactions, id) {
  return transactions.filter((item) => item.id !== id);
}

export function confirmImports(transactions, pendingImportRows) {
  const imported = pendingImportRows.map((row) => ({
    id: makeId(),
    type: row.type,
    category: normalizeImportedCategory(row.type, row.category),
    amount: Number(Math.abs(Number(row.amount)).toFixed(2)),
    date: row.date,
    note: row.note.trim() || 'Imported transaction',
    recurring: false,
  }));

  return [...imported, ...transactions];
}

export function calculateMonthSummary(items, targetMonth = new Date()) {
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

export function calculateYearSummary(items, targetYear = new Date().getFullYear()) {
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

export function calculateCategoryBreakdown(items) {
  const map = new Map();

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

export function calculateTrendData(items) {
  const labels = [];
  const income = [];
  const expense = [];
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

export function getCategoryOptions(type) {
  return getCategoryChoicesForType(type);
}
