<script>
  import { onMount } from 'svelte';
  import {
    buildImportRowsFromCsv,
    formatMoney,
    serializeTransactionsCsv,
  } from './lib/finance.js';
  import { loadTheme, saveTheme, loadTransactions as loadStoredTransactions, saveTransactions as saveStoredTransactions } from './lib/storage.js';
  import { destroyChart, renderBudgetCharts } from './lib/charts/budgetCharts.js';
  import {
    calculateCategoryBreakdown,
    calculateMonthSummary,
    calculateTrendData,
    calculateYearSummary,
    confirmImports,
    getCategoryOptions,
    makeBlankForm,
    removeTransactionFromList,
    startEditTransaction as startTransactionEdit,
    submitTransaction as submitBudgetTransaction,
    updateFormType,
  } from './lib/controllers/budgetController.js';
  import BudgetDashboardView from './lib/views/BudgetDashboardView.svelte';

  /** @type {Transaction[]} */
  const sampleTransactions = [
    { id: 'seed-1', type: 'income', category: 'Salary', amount: 3200, date: '2026-09-01', note: 'Monthly salary', recurring: true },
    { id: 'seed-2', type: 'expense', category: 'Housing', amount: 980, date: '2026-09-02', note: 'Rent', recurring: true },
    { id: 'seed-3', type: 'expense', category: 'Groceries', amount: 230, date: '2026-09-07', note: 'Weekly shop', recurring: false },
    { id: 'seed-4', type: 'expense', category: 'Transport', amount: 70, date: '2026-09-09', note: 'Train card', recurring: false },
    { id: 'seed-5', type: 'income', category: 'Freelance', amount: 540, date: '2026-08-18', note: 'Client work', recurring: false },
    { id: 'seed-6', type: 'expense', category: 'Entertainment', amount: 120, date: '2026-08-20', note: 'Cinema and dinner', recurring: false },
    { id: 'seed-7', type: 'expense', category: 'Utilities', amount: 160, date: '2026-07-04', note: 'Electricity + internet', recurring: true },
  ];

  /**
   * @typedef {'income' | 'expense'} TransactionType
   * @typedef {Object} Transaction
   * @property {string} id
   * @property {TransactionType} type
   * @property {string} category
   * @property {number} amount
   * @property {string} date
   * @property {string} note
   * @property {boolean} recurring
   * @typedef {Object} TransactionForm
   * @property {string | null} id
   * @property {TransactionType} type
   * @property {string} category
   * @property {string | number} amount
   * @property {string} date
   * @property {string} note
   * @property {boolean} recurring
   */

  /** @type {Transaction[]} */
  let transactions = [];
  let darkMode = false;
  /** @type {HTMLCanvasElement | undefined} */
  let doughnutCanvas;
  /** @type {HTMLCanvasElement | undefined} */
  let trendCanvas;
  /** @type {any} */
  let doughnutChart;
  /** @type {any} */
  let trendChart;
  let ready = false;
  /** @type {HTMLInputElement | undefined} */
  let fileInput;
  let formMode = 'add';
  /** @type {TransactionForm} */
  let form = /** @type {TransactionForm} */ (makeBlankForm());
  /** @type {Array<{ id: string, date: string, amount: number, note: string, type: TransactionType, category: string }>} */
  let pendingImportRows = [];

  function applyTheme() {
    document.body.classList.toggle('dark-theme', darkMode);
    saveTheme(localStorage, darkMode);
  }

  function loadTransactions() {
    const storedTransactions = loadStoredTransactions(localStorage, [...sampleTransactions]);
    transactions = Array.isArray(storedTransactions) && storedTransactions.length > 0 ? storedTransactions : [...sampleTransactions];

    if (!Array.isArray(storedTransactions) || storedTransactions.length === 0) {
      saveStoredTransactions(localStorage, transactions);
    }
  }

  function persistTransactions() {
    saveStoredTransactions(localStorage, transactions);
  }

  function resetForm() {
    formMode = 'add';
    form = /** @type {TransactionForm} */ (makeBlankForm());
  }

  function handleSubmit() {
    const result = submitBudgetTransaction({ transactions, form, formMode });

    if (!result.changed) {
      return;
    }

    transactions = result.transactions;
    persistTransactions();
    formMode = /** @type {'add' | 'edit'} */ (result.nextMode);
    form = /** @type {TransactionForm} */ (result.nextForm);
    renderCharts();
  }

  /** @param {Transaction} item */
  function startEditTransaction(item) {
    const result = startTransactionEdit(item);
    formMode = result.formMode;
    form = result.form;
  }

  /** @param {string} id */
  function removeTransaction(id) {
    transactions = removeTransactionFromList(transactions, id);
    persistTransactions();
    renderCharts();
  }

  function cancelPendingImport() {
    pendingImportRows = [];
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function confirmPendingImport() {
    if (pendingImportRows.length === 0) return;

    transactions = confirmImports(transactions, pendingImportRows);
    persistTransactions();
    renderCharts();
    pendingImportRows = [];
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function exportCsv() {
    const csv = serializeTransactionsCsv(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  /** @param {Event & { currentTarget: EventTarget & HTMLInputElement }} event */
  function importCsv(event) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readEvent) => {
      const content = String(readEvent.target?.result ?? '');
      const importedRows = /** @type {typeof pendingImportRows} */ (buildImportRowsFromCsv(content));

      if (importedRows.length === 0) {
        pendingImportRows = [];
        if (fileInput) {
          fileInput.value = '';
        }
        return;
      }

      pendingImportRows = importedRows;
    };

    reader.readAsText(file);
  }

  function renderCharts() {
    destroyChart(doughnutChart);
    destroyChart(trendChart);

    const chartResult = renderBudgetCharts({
      doughnutCanvas,
      trendCanvas,
      transactions,
      darkMode,
      formatMoney,
      categoryBreakdown: calculateCategoryBreakdown(transactions),
      trendData: calculateTrendData(transactions),
    });

    doughnutChart = chartResult.doughnutChart;
    trendChart = chartResult.trendChart;
  }

  onMount(() => {
    darkMode = loadTheme(localStorage, false);
    applyTheme();
    loadTransactions();
    ready = true;
    renderCharts();
  });

  $: if (ready && doughnutCanvas && trendCanvas && darkMode !== undefined) {
    renderCharts();
  }

  /** @type {{ income: number, expenses: number, net: number }} */
  $: monthSummary = calculateMonthSummary(transactions, new Date());
  /** @type {{ income: number, expenses: number, net: number }} */
  $: yearSummary = calculateYearSummary(transactions, new Date().getFullYear());
  /** @type {number} */
  $: runningBalance = transactions.reduce((sum, entry) => {
    if (entry.type === 'income') return sum + entry.amount;
    return sum - entry.amount;
  }, 0);
  /** @type {Transaction[]} */
  $: sortedTransactions = [...transactions].sort((left, right) => Number(new Date(right.date)) - Number(new Date(left.date)));
  $: categoryBreakdown = calculateCategoryBreakdown(transactions);
  $: trendData = calculateTrendData(transactions);
  $: categoryOptions = getCategoryOptions(form.type);
  $: palette = ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'];
</script>

<input bind:this={fileInput} type="file" accept=".csv,text/csv" hidden on:change={importCsv} />

<BudgetDashboardView
  bind:doughnutCanvas={doughnutCanvas}
  bind:trendCanvas={trendCanvas}
  darkMode={darkMode}
  monthSummary={monthSummary}
  runningBalance={runningBalance}
  pendingImportRows={pendingImportRows}
  formMode={formMode}
  form={form}
  sortedTransactions={sortedTransactions}
  yearSummary={yearSummary}
  categoryBreakdown={categoryBreakdown}
  onImportClick={() => fileInput?.click()}
  onExportClick={exportCsv}
  onToggleTheme={() => {
    darkMode = !darkMode;
    applyTheme();
  }}
  onSubmit={handleSubmit}
  onResetForm={resetForm}
  onStartEditTransaction={startEditTransaction}
  onRemoveTransaction={removeTransaction}
  onConfirmPendingImport={confirmPendingImport}
  onCancelPendingImport={cancelPendingImport}
  onFormTypeChange={() => {
    form = updateFormType(form);
  }}
  categoryOptions={categoryOptions}
  formatMoney={formatMoney}
  palette={palette}
/>
