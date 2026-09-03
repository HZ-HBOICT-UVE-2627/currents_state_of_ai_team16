import test from 'node:test';
import assert from 'node:assert/strict';

// @ts-ignore - VS Code sometimes reports a false-positive resolution warning for this local JS module.
import { serializeCsv, parseCsv } from './csv.js';

test('serializeCsv writes a proper CSV table with one value per cell', () => {
  const rows = [
    ['id', 'type', 'category', 'note'],
    ['1', 'expense', 'Groceries', 'Milk, bread'],
    ['2', 'income', 'Salary', 'He said "hello"'],
  ];

  assert.equal(
    serializeCsv(rows),
    'id,type,category,note\r\n1,expense,Groceries,"Milk, bread"\r\n2,income,Salary,"He said ""hello"""'
  );
});

test('parseCsv reads quoted CSV values without breaking cells', () => {
  const csv = 'id,type,note\r\n1,expense,"Milk, bread"\r\n2,income,"He said ""hello"""';

  assert.deepEqual(parseCsv(csv), [
    ['id', 'type', 'note'],
    ['1', 'expense', 'Milk, bread'],
    ['2', 'income', 'He said "hello"'],
  ]);
});
