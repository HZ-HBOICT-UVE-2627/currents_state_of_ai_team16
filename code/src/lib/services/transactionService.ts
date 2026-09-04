import { getCategoryChoicesForType, normalizeImportedCategory } from '../categories.ts';
import { toIsoDate } from '../finance.ts';
import type { CategorySettings, Transaction, TransactionForm } from '../types';
import { validateTransactionInput } from './validationService.ts';

export function makeId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createBlankForm(settings?: CategorySettings): TransactionForm {
  return { id: null, type: 'expense', category: getCategoryChoicesForType('expense', settings)[0], amount: '', date: toIsoDate(new Date()), note: '', recurring: false };
}

export function applyTransactionMutation({
  transactions, form, formMode, settings,
}: {
  transactions: Transaction[];
  form: TransactionForm;
  formMode: 'add' | 'edit';
  settings?: CategorySettings;
}): { transactions: Transaction[]; changed: boolean; nextForm: TransactionForm; nextMode: 'add' | 'edit' } {
  const validation = validateTransactionInput(form, settings);
  if (!validation.valid) return { transactions, changed: false, nextForm: createBlankForm(settings), nextMode: formMode };

  const submitted: Transaction = {
    id: form.id ?? makeId(), type: form.type,
    category: normalizeImportedCategory(form.type, validation.normalized.category, settings),
    amount: Number(Number(validation.normalized.amount).toFixed(2)), date: form.date,
    note: validation.normalized.note, recurring: !!validation.normalized.recurring,
  };
  const nextTransactions = formMode === 'edit'
    ? transactions.map((item) => (item.id === submitted.id ? submitted : item))
    : [submitted, ...transactions];
  return { transactions: nextTransactions, changed: true, nextForm: createBlankForm(settings), nextMode: 'add' };
}

export function startEditingTransaction(item: Transaction): { formMode: 'edit'; form: TransactionForm } {
  return { formMode: 'edit', form: { id: item.id, type: item.type, category: item.category, amount: String(item.amount), date: item.date, note: item.note, recurring: item.recurring } };
}

export function removeTransactionById(transactions: Transaction[], id: string): Transaction[] {
  return transactions.filter((item) => item.id !== id);
}
