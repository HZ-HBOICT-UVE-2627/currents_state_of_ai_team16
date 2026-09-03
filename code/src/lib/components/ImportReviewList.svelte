<script lang="ts">
  import { getCategoryChoicesForType } from '../finance.ts';
  import type { ImportRow } from '../types';

  export let rows: ImportRow[] = [];
  export let onConfirm: () => void = () => {};
  export let onCancel: () => void = () => {};

  function syncImportedRowCategory(row: ImportRow): void {
    const choices = getCategoryChoicesForType(row.type);
    row.category = choices.includes(row.category) ? row.category : choices[0];
  }
</script>

<section class="panel" style="margin: 1rem 0; padding: 1.25rem;">
  <div class="panel-header" style="margin-bottom: 1rem;">
    <h2>Review imported rows</h2>
    <span class="muted">Choose income/expense and category for each row</span>
  </div>

  <div class="import-review-list" style="display: grid; gap: 1rem;">
    {#each rows as row, index}
      <div class="import-review-row" style="display: grid; grid-template-columns: 1.2fr 1.1fr 1.1fr 1.5fr; gap: 0.75rem; align-items: end; border: 1px solid rgba(148, 163, 184, 0.28); border-radius: 12px; padding: 0.9rem; background: rgba(15, 23, 42, 0.02);">
        <div>
          <label>
            <span>Row {index + 1}</span>
            <input value={row.date} type="date" readonly />
          </label>
        </div>

        <div>
          <label>
            <span>Amount</span>
            <input value={row.amount} type="number" step="0.01" readonly />
          </label>
        </div>

        <div>
          <label>
            <span>Type</span>
            <select bind:value={row.type} on:change={() => syncImportedRowCategory(row)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            <span>Category</span>
            <select bind:value={row.category}>
              {#each getCategoryChoicesForType(row.type) as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </label>
        </div>

        <div style="grid-column: 1 / -1;">
          <label>
            <span>Note</span>
            <input bind:value={row.note} type="text" />
          </label>
        </div>
      </div>
    {/each}
  </div>

  <div class="form-actions" style="margin-top: 1rem;">
    <button class="primary-button" type="button" on:click={onConfirm}>Import rows</button>
    <button class="secondary-button" type="button" on:click={onCancel}>Cancel</button>
  </div>
</section>
