<script>
  import TopBar from '../components/TopBar.svelte';
  import SummaryBar from '../components/SummaryBar.svelte';
  import ImportReviewList from '../components/ImportReviewList.svelte';

  export let darkMode = false;
  export let monthSummary = { income: 0, expenses: 0, net: 0 };
  export let runningBalance = 0;
  export let pendingImportRows = [];
  export let formMode = 'add';
  export let form = /** @type {{ id: string | null, type: 'income' | 'expense', category: string, amount: string | number, date: string, note: string, recurring: boolean }} */ ({ id: null, type: 'expense', category: 'Groceries', amount: '', date: '', note: '', recurring: false });
  export let sortedTransactions = [];
  export let yearSummary = { income: 0, expenses: 0, net: 0 };
  export let categoryBreakdown = [];
  export let onImportClick = () => {};
  export let onExportClick = () => {};
  export let onToggleTheme = () => {};
  export let onSubmit = () => {};
  export let onResetForm = () => {};
  export let onStartEditTransaction = (item) => {};
  export let onRemoveTransaction = (id) => {};
  export let onConfirmPendingImport = () => {};
  export let onCancelPendingImport = () => {};
  export let onFormTypeChange = () => {};
  export let categoryOptions = [];
  export let formatMoney = (value) => `${value}`;
  export let palette = [];
  export let doughnutCanvas;
  export let trendCanvas;
</script>

<div class="app-shell">
  <TopBar
    darkMode={darkMode}
    onImportClick={onImportClick}
    onExportClick={onExportClick}
    onToggleTheme={onToggleTheme}
  />

  <SummaryBar monthSummary={monthSummary} runningBalance={runningBalance} />

  {#if pendingImportRows.length > 0}
    <ImportReviewList rows={pendingImportRows} onConfirm={onConfirmPendingImport} onCancel={onCancelPendingImport} />
  {/if}

  <main class="dashboard-grid">
    <aside class="panel panel-left">
      <div class="panel-header">
        <h2>{formMode === 'edit' ? 'Edit transaction' : 'Add transaction'}</h2>
      </div>

      <form class="transaction-form" on:submit|preventDefault={onSubmit}>
        <div class="field-group inline-fields">
          <label>
            <span>Type</span>
            <select bind:value={form.type} on:change={onFormTypeChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            <span>Category</span>
            <select bind:value={form.category}>
              {#each categoryOptions as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </label>
        </div>

        <div class="field-group inline-fields">
          <label>
            <span>Amount</span>
            <input bind:value={form.amount} type="number" min="0.01" step="0.01" placeholder="0.00" />
          </label>

          <label>
            <span>Date</span>
            <input bind:value={form.date} type="date" />
          </label>
        </div>

        <label>
          <span>Note</span>
          <input bind:value={form.note} type="text" placeholder="Groceries, rent, freelance work..." />
        </label>

        <label class="checkbox-row">
          <input bind:checked={form.recurring} type="checkbox" />
          <span>Recurring transaction</span>
        </label>

        <div class="form-actions">
          <button class="primary-button" type="submit">
            {formMode === 'edit' ? 'Save changes' : 'Add transaction'}
          </button>
          {#if formMode === 'edit'}
            <button class="secondary-button" type="button" on:click={onResetForm}>Cancel</button>
          {/if}
        </div>
      </form>

      <div class="list-header">
        <h2>Recent transactions</h2>
        <span class="muted">{sortedTransactions.length} entries</span>
      </div>

      <div class="transaction-list">
        {#if sortedTransactions.length === 0}
          <p class="empty-state">No transactions yet. Add your first one to get started.</p>
        {:else}
          {#each sortedTransactions as entry}
            <article class="transaction-item">
              <div class="transaction-main">
                <div class="transaction-type" class:income={entry.type === 'income'} class:expense={entry.type === 'expense'}>
                  {entry.type}
                </div>
                <div>
                  <h3>{entry.category}</h3>
                  <p>{entry.note}</p>
                </div>
              </div>

              <div class="transaction-meta">
                <strong class:income={entry.type === 'income'} class:expense={entry.type === 'expense'}>
                  {entry.type === 'income' ? '+' : '-'}{formatMoney(entry.amount)}
                </strong>
                <span>{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <div class="item-actions">
                  <button type="button" on:click={() => onStartEditTransaction(entry)}>Edit</button>
                  <button type="button" class="danger" on:click={() => onRemoveTransaction(entry.id)}>Delete</button>
                </div>
              </div>
            </article>
          {/each}
        {/if}
      </div>
    </aside>

    <section class="panel panel-center">
      <div class="panel-header">
        <h2>Spending breakdown</h2>
        <span class="muted">Current month</span>
      </div>

      <div class="chart-wrap doughnut-wrap">
        <canvas bind:this={doughnutCanvas}></canvas>
      </div>

      <div class="legend-list">
        {#if categoryBreakdown.length === 0}
          <p class="empty-state small">No expense data yet.</p>
        {:else}
          {#each categoryBreakdown as item, index}
            <div class="legend-item">
              <span class="dot" style={`background:${palette[index % palette.length]};`}></span>
              <span>{item.category}</span>
              <strong>{formatMoney(item.total)}</strong>
            </div>
          {/each}
        {/if}
      </div>
    </section>

    <section class="panel panel-right">
      <div class="panel-header">
        <h2>Monthly trend</h2>
        <span class="muted">Last 12 months</span>
      </div>

      <div class="chart-wrap line-wrap">
        <canvas bind:this={trendCanvas}></canvas>
      </div>

      <div class="year-summary">
        <div>
          <span>YTD income</span>
          <strong>{formatMoney(yearSummary.income)}</strong>
        </div>
        <div>
          <span>YTD expenses</span>
          <strong>{formatMoney(yearSummary.expenses)}</strong>
        </div>
        <div>
          <span>YTD net</span>
          <strong>{formatMoney(yearSummary.net)}</strong>
        </div>
      </div>
    </section>
  </main>
</div>
