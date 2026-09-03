import test from 'node:test';
import assert from 'node:assert/strict';

import { validateTransactionInput } from './validationService.js';

test('valid transaction input is accepted', () => {
  const result = validateTransactionInput({
    id: null,
    type: 'expense',
    category: 'Groceries',
    amount: '42.50',
    date: '2026-09-03',
    note: 'Lunch',
    recurring: false,
  });

  assert.equal(result.valid, true);
  assert.equal(result.error, null);
  assert.equal(result.normalized.amount, 42.5);
});

test('invalid transaction input is rejected', () => {
  const result = validateTransactionInput({
    id: null,
    type: 'expense',
    category: 'Groceries',
    amount: '0',
    date: '',
    note: '',
    recurring: false,
  });

  assert.equal(result.valid, false);
  assert.ok(result.error);
});

test('category is checked against the active transaction type', () => {
  const result = validateTransactionInput({
    id: null,
    type: 'income',
    category: 'Groceries',
    amount: '150',
    date: '2026-09-03',
    note: 'Client payment',
    recurring: false,
  });

  assert.equal(result.valid, false);
  assert.match(result.error, /category/i);
});
