<script>
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  const STORAGE_KEY = 'budget-tracker-transactions-v1';
  const THEME_KEY = 'budget-tracker-theme-v1';

  const categories = [
    'Housing',
    'Groceries',
    'Transport',
    'Utilities',
    'Health',
    'Entertainment',
    'Savings',
    'Salary',
    'Freelance',
    'Other',
  ];

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
  let form = makeBlankForm();

  /** @returns {TransactionForm} */
  function makeBlankForm() {
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

  /** @param {Date} [value=new Date()] */
  function toIsoDate(value = new Date()) {
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function makeId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `txn-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  /** @param {number | string} value */
  function formatMoney(value) {
    const numericValue = Number(value) || 0;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(numericValue);
  }

  function applyTheme() {
    document.body.classList.toggle('dark-theme', darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }

  function loadTransactions() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        transactions = JSON.parse(raw);
        return;
      } catch {
        transactions = [...sampleTransactions];
      }
    }

    transactions = [...sampleTransactions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  function persistTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }

  function resetForm() {
    formMode = 'add';
    form = makeBlankForm();
  }

  function updateFormType() {
    if (form.type === 'income' && !['Salary', 'Freelance', 'Savings', 'Other'].includes(form.category)) {
      form.category = 'Salary';
    }

    if (form.type === 'expense' && !['Housing', 'Groceries', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Savings', 'Other'].includes(form.category)) {
      form.category = 'Groceries';
    }
  }

  function handleSubmit() {
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0 || !form.date) {
      return;
    }

    const submitted = {
      id: form.id ?? makeId(),
      type: form.type,
      category: form.category,
      amount: Number(amount.toFixed(2)),
      date: form.date,
      note: form.note.trim() || 'No note',
      recurring: !!form.recurring,
    };

    if (formMode === 'edit') {
      transactions = transactions.map((item) => (item.id === submitted.id ? submitted : item));
    } else {
      transactions = [submitted, ...transactions];
    }

    persistTransactions();
    resetForm();
    renderCharts();
  }

  /** @param {Transaction} item */
  function startEditTransaction(item) {
    formMode = 'edit';
    form = {
      id: item.id,
      type: item.type,
      category: item.category,
      amount: String(item.amount),
      date: item.date,
      note: item.note,
      recurring: item.recurring,
    };
  }

  /** @param {string} id */
  function removeTransaction(id) {
    transactions = transactions.filter((item) => item.id !== id);
    persistTransactions();
    renderCharts();
  }

  function exportCsv() {
    const headers = ['id', 'type', 'category', 'amount', 'date', 'note', 'recurring'];
    const rows = transactions.map((entry) => [
      entry.id,
      entry.type,
      entry.category,
      entry.amount,
      entry.date,
      entry.note,
      entry.recurring ? 'true' : 'false',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  /** @param {string} line */
  function parseCsvLine(line) {
    const cells = [];
    let current = '';
    let insideQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];

      if (char === '"') {
        if (insideQuotes && line[index + 1] === '"') {
          current += '"';
          index += 1;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    cells.push(current);
    return cells.map((cell) => cell.trim());
  }

  /** @param {Event & { currentTarget: EventTarget & HTMLInputElement }} event */
  function importCsv(event) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readEvent) => {
      const content = String(readEvent.target?.result ?? '');
      const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length < 2) return;

      const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
      /** @type {Transaction[]} */
      const imported = [];

      for (const line of lines.slice(1)) {
        const values = parseCsvLine(line);
        /** @type {Record<string, string>} */
        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index] ?? '';
        });

        const amount = Number(row.amount ?? 0);
        const type = String(row.type ?? '').toLowerCase();
        const hasValidData = ['income', 'expense'].includes(type) && Number.isFinite(amount) && amount > 0;

        if (!hasValidData) continue;

        const normalizedType = /** @type {TransactionType} */ (type);

        imported.push({
          id: makeId(),
          type: normalizedType,
          category: row.category || 'Other',
          amount: Number(amount.toFixed(2)),
          date: row.date || toIsoDate(new Date()),
          note: row.note || 'Imported transaction',
          recurring: String(row.recurring || '').toLowerCase() === 'true',
        });
      }

      if (imported.length > 0) {
        transactions = [...imported, ...transactions];
        persistTransactions();
        renderCharts();
      }

      if (fileInput) {
        fileInput.value = '';
      }
    };

    reader.readAsText(file);
  }

  /** @param {Transaction[]} items @param {Date} [targetMonth=new Date()] */
  function calculateMonthSummary(items, targetMonth = new Date()) {
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

  /** @param {Transaction[]} items @param {number} [targetYear=new Date().getFullYear()] */
  function calculateYearSummary(items, targetYear = new Date().getFullYear()) {
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

  /** @param {Transaction[]} items */
  function calculateCategoryBreakdown(items) {
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

  /** @param {Transaction[]} items */
  function calculateTrendData(items) {
    /** @type {string[]} */
    const labels = [];
    /** @type {number[]} */
    const income = [];
    /** @type {number[]} */
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

  function getChartThemeColors() {
    const styles = getComputedStyle(document.body);
    const text = styles.getPropertyValue('--text-color').trim() || '#1f2937';
    const grid = darkMode ? 'rgba(148, 163, 184, 0.18)' : 'rgba(100, 116, 139, 0.18)';

    return { text, grid };
  }

  function renderCharts() {
    if (!doughnutCanvas || !trendCanvas) return;

    if (doughnutChart) doughnutChart.destroy();
    if (trendChart) trendChart.destroy();

    const breakdown = calculateCategoryBreakdown(transactions);
    const trendData = calculateTrendData(transactions);
    const palette = ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'];
    const theme = getChartThemeColors();

    doughnutChart = new Chart(doughnutCanvas, {
      type: 'doughnut',
      data: {
        labels: breakdown.map((entry) => entry.category),
        datasets: [
          {
            data: breakdown.map((entry) => entry.total),
            backgroundColor: breakdown.map((_, index) => palette[index % palette.length]),
            borderColor: darkMode ? '#0f172a' : '#ffffff',
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme.text,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.label}: ${formatMoney(context.parsed)}`;
              },
            },
          },
        },
      },
    });

    trendChart = new Chart(trendCanvas, {
      type: 'line',
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: 'Income',
            data: trendData.income,
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.18)',
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Expenses',
            data: trendData.expense,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.18)',
            tension: 0.4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme.text,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              color: theme.text,
              callback(value) {
                return formatMoney(Number(value));
              },
            },
            grid: {
              color: theme.grid,
            },
          },
          x: {
            ticks: {
              color: theme.text,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  onMount(() => {
    darkMode = localStorage.getItem(THEME_KEY) === 'dark';
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
</script>

<div class="app-shell">
  <header class="topbar">
    <div>
      <p class="eyebrow">Private finance dashboard</p>
      <h1>Budget Tracker</h1>
    </div>

    <div class="topbar-actions">
      <button class="action-button file-picker" type="button" on:click={() => fileInput?.click()}>
        Import CSV
      </button>
      <input bind:this={fileInput} type="file" accept=".csv,text/csv" hidden on:change={importCsv} />
      <button class="action-button" type="button" on:click={exportCsv}>Export CSV</button>
      <button
        class="action-button theme-toggle"
        type="button"
        on:click={() => {
          darkMode = !darkMode;
          applyTheme();
        }}
      >
        {darkMode ? 'Light mode' : 'Dark mode'}
      </button>
    </div>
  </header>

  <section class="summary-bar">
    <div class="summary-card income">
      <span>This month income</span>
      <strong>{formatMoney(monthSummary.income)}</strong>
    </div>
    <div class="summary-card expense">
      <span>This month expenses</span>
      <strong>{formatMoney(monthSummary.expenses)}</strong>
    </div>
    <div class="summary-card net">
      <span>Net balance</span>
      <strong>{formatMoney(monthSummary.net)}</strong>
    </div>
    <div class="summary-card balance">
      <span>Running balance</span>
      <strong>{formatMoney(runningBalance)}</strong>
    </div>
  </section>

  <main class="dashboard-grid">
    <aside class="panel panel-left">
      <div class="panel-header">
        <h2>{formMode === 'edit' ? 'Edit transaction' : 'Add transaction'}</h2>
      </div>

      <form class="transaction-form" on:submit|preventDefault={handleSubmit}>
        <div class="field-group inline-fields">
          <label>
            <span>Type</span>
            <select bind:value={form.type} on:change={updateFormType}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label>
            <span>Category</span>
            <select bind:value={form.category}>
              {#each categories as category}
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
            <button class="secondary-button" type="button" on:click={resetForm}>Cancel</button>
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
                  <button type="button" on:click={() => startEditTransaction(entry)}>Edit</button>
                  <button type="button" class="danger" on:click={() => removeTransaction(entry.id)}>Delete</button>
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
        {#if calculateCategoryBreakdown(transactions).length === 0}
          <p class="empty-state small">No expense data yet.</p>
        {:else}
          {#each calculateCategoryBreakdown(transactions) as item}
            <div class="legend-item">
              <span class="dot" style={`background:${['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'][calculateCategoryBreakdown(transactions).findIndex((entry) => entry.category === item.category) % 10]};`}></span>
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
