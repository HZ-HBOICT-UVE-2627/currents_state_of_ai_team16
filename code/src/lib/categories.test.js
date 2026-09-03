import test from 'node:test';
import assert from 'node:assert/strict';

import { getCategoryChoicesForType, normalizeImportedCategory, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './categories.js';

test('income categories are returned for income transactions', () => {
  assert.deepEqual(getCategoryChoicesForType('income'), INCOME_CATEGORIES);
});

test('expense categories are returned for expense transactions', () => {
  assert.deepEqual(getCategoryChoicesForType('expense'), EXPENSE_CATEGORIES);
});

test('invalid imported categories are normalized to the first valid option', () => {
  assert.equal(normalizeImportedCategory('expense', 'Unknown'), 'Housing');
  assert.equal(normalizeImportedCategory('income', 'Unknown'), 'Salary');
});
