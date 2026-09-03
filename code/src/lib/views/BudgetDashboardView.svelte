<script lang="ts">
  import TopBar from '../components/TopBar.svelte';
  import SummaryBar from '../components/SummaryBar.svelte';
  import ImportReviewList from '../components/ImportReviewList.svelte';
  import type { CustomChartDefinition } from '../charts/budgetCharts';
  import type { CategoryBreakdownEntry, ImportRow, SummaryTotals, Transaction, TransactionForm } from '../types';

  export let monthSummary: SummaryTotals = { income: 0, expenses: 0, net: 0 };
  export let runningBalance = 0;
  export let pendingImportRows: ImportRow[] = [];
  export let formMode: 'add' | 'edit' = 'add';
  export let form: TransactionForm = { id: null, type: 'expense', category: 'Groceries', amount: '', date: '', note: '', recurring: false };
  export let sortedTransactions: Transaction[] = [];
  export let recentTransactions: Transaction[] = [];
  export let customCharts: CustomChartDefinition[] = [];
  export let onRemoveCustomChart: (chartId: string) => void = () => {};
  export let customChartCanvases: Record<string, HTMLCanvasElement | undefined> = {};
  export let yearSummary: SummaryTotals = { income: 0, expenses: 0, net: 0 };
  export let categoryBreakdown: CategoryBreakdownEntry[] = [];
  export let onImportClick: () => void = () => {};
  export let onExportClick: () => void = () => {};
  export let onShowHelp: () => void = () => {};
  export let onShowCustomize: () => void = () => {};
  export let onShowCustomizeCharts: () => void = () => {};
  export let onShowAllTransactions: () => void = () => {};
  export let onCloseAllTransactions: () => void = () => {};
  export let showAllTransactions = false;
  export let onSubmit: () => void = () => {};
  export let onResetForm: () => void = () => {};
  export let onStartEditTransaction: (item: Transaction) => void = () => {};
  export let onRemoveTransaction: (id: string) => void = () => {};
  export let onConfirmPendingImport: () => void = () => {};
  export let onCancelPendingImport: () => void = () => {};
  export let onFormTypeChange: () => void = () => {};
  export let categoryOptions: string[] = [];
  export let formatMoney: (value: number | string) => string = (value) => `${value}`;
  export let palette: string[] = [];
  export let showDoughnutChart = true;
  export let showTrendChart = true;
  export let doughnutCanvas: HTMLCanvasElement | undefined;
  export let trendCanvas: HTMLCanvasElement | undefined;
</script>

<div class="app-shell">
  <TopBar
    onImportClick={onImportClick}
    onExportClick={onExportClick}
    onShowHelp={onShowHelp}
    onShowCustomize={onShowCustomize}
    onShowCustomizeCharts={onShowCustomizeCharts}
    onShowAllTransactions={onShowAllTransactions}
  />

  <SummaryBar monthSummary={monthSummary} runningBalance={runningBalance} />

  {#if showAllTransactions}
    <div class="all-transactions-view" role="dialog" aria-modal="true" aria-label="All transactions" tabindex="0">
      <div class="all-transactions-header">
        <div>
          <p class="eyebrow">Overview</p>
          <h2>All transactions</h2>
        </div>
        <button class="secondary-button" type="button" on:click={onCloseAllTransactions}>Close</button>
      </div>

      <div class="all-transactions-list">
        {#if sortedTransactions.length === 0}
          <p class="empty-state">No transactions yet.</p>
        {:else}
          {#each sortedTransactions as entry}
            <article class="transaction-item all-transaction-row">
              <div class="transaction-main">
                <div
                  class="transaction-type"
                  class:income={entry.type === 'income'}
                  class:expense={entry.type === 'expense'}
                  style={entry.type === 'income'
                    ? 'background: var(--card-income); color: var(--income-color);'
                    : 'background: var(--card-expense); color: var(--expense-color);'}
                >
                  {entry.type}
                </div>
                <div>
                  <h3>{entry.category}</h3>
                  <p>{entry.note || 'No note'}</p>
                </div>
              </div>

              <div class="transaction-meta">
                <strong
                  class:income={entry.type === 'income'}
                  class:expense={entry.type === 'expense'}
                  style={entry.type === 'income' ? 'color: var(--income-color);' : 'color: var(--expense-color);'}
                >
                  {entry.type === 'income' ? '+' : '-'}{formatMoney(entry.amount)}
                </strong>
                <span>{new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <div class="item-actions page-actions">
                  <button type="button" class="secondary-button" on:click={() => {
                    onStartEditTransaction(entry);
                    onCloseAllTransactions();
                  }}>Edit</button>
                  <button type="button" class="danger-button" on:click={() => onRemoveTransaction(entry.id)}>Delete</button>
                </div>
              </div>
            </article>
          {/each}
        {/if}
      </div>
    </div>
  {/if}

  {#if pendingImportRows.length > 0}
    <ImportReviewList rows={pendingImportRows} onConfirm={onConfirmPendingImport} onCancel={onCancelPendingImport} />
  {/if}

  <main class="dashboard-grid" class:single-chart={(!showDoughnutChart && showTrendChart) || (showDoughnutChart && !showTrendChart)}>
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
        <span class="muted">{recentTransactions.length} entries</span>
      </div>

      <div class="transaction-list">
        {#if recentTransactions.length === 0}
          <p class="empty-state">No transactions yet. Add your first one to get started.</p>
        {:else}
          {#each recentTransactions as entry}
            <article class="transaction-item">
              <div class="transaction-main">
                <div
                  class="transaction-type"
                  class:income={entry.type === 'income'}
                  class:expense={entry.type === 'expense'}
                  style={entry.type === 'income'
                    ? 'background: var(--card-income); color: var(--income-color);'
                    : 'background: var(--card-expense); color: var(--expense-color);'}
                >
                  {entry.type}
                </div>
                <div>
                  <h3>{entry.category}</h3>
                  <p>{entry.note}</p>
                </div>
              </div>

              <div class="transaction-meta">
                <strong
                  class:income={entry.type === 'income'}
                  class:expense={entry.type === 'expense'}
                  style={entry.type === 'income' ? 'color: var(--income-color);' : 'color: var(--expense-color);'}
                >
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

    {#if showDoughnutChart}
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
    {/if}

    {#if showTrendChart}
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
    {/if}

  </main>

  {#if customCharts.some((chart) => chart.visible !== false)}
    <section class="custom-charts-grid">
      {#each customCharts.filter((chart) => chart.visible !== false) as chart}
        <article class="panel custom-chart-panel">
          <div class="panel-header">
            <h2>{chart.title}</h2>
            <button class="secondary-button compact-button" type="button" on:click={() => onRemoveCustomChart(chart.id)}>Remove</button>
          </div>
          <div class="chart-wrap custom-chart-wrap">
            <canvas bind:this={customChartCanvases[chart.id]}></canvas>
          </div>
        </article>
      {/each}
    </section>
  {/if}
</div>

<style>
  .all-transactions-view {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 24px;
    box-shadow: var(--shadow);
    padding: 18px;
    margin-bottom: 24px;
  }

  .all-transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .all-transactions-list {
    display: grid;
    gap: 12px;
  }

  .all-transaction-row {
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 12px 14px;
  }

  .page-actions {
    margin-top: 10px;
    justify-content: flex-end;
  }

  .custom-charts-grid {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
  }

  .custom-chart-panel {
    min-height: 320px;
  }

  .compact-button {
    min-width: unset;
    width: auto;
    padding: 0.5rem 0.8rem;
  }
</style>
