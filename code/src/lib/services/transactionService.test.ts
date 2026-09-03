import test from 'node:test';
import assert from 'node:assert/strict';

import {
  applyTransactionMutation,
  startEditingTransaction,
} from './transactionService.ts';

test('applyTransactionMutation adds a valid transaction', () => {
  const result = applyTransactionMutation({
    transactions: [],
    form: {
      id: null,
      type: 'expense',
      category: 'Groceries',
      amount: '42.50',
      date: '2026-09-03',
      note: 'Lunch',
      recurring: false,
    },
    formMode: 'add',
  });

  assert.equal(result.changed, true);
  assert.equal(result.transactions.length, 1);
  assert.equal(result.nextMode, 'add');
  assert.equal(result.transactions[0].category, 'Groceries');
});

test('applyTransactionMutation rejects invalid transaction data', () => {
  const result = applyTransactionMutation({
    transactions: [],
    form: {
      id: null,
      type: 'expense',
      category: 'Groceries',
      amount: '0',
      date: '',
      note: '',
      recurring: false,
    },
    formMode: 'add',
  });

  assert.equal(result.changed, false);
  assert.equal(result.transactions.length, 0);
});

test('startEditingTransaction builds the edit form state from a transaction', () => {
  const result = startEditingTransaction({
    id: 'txn-1',
    type: 'income',
    category: 'Salary',
    amount: 1500,
    date: '2026-09-01',
    note: 'Payday',
    recurring: true,
  });

  assert.equal(result.formMode, 'edit');
  assert.equal(result.form.type, 'income');
  assert.equal(result.form.amount, '1500');
});
