<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    buildImportRowsFromCsv,
    formatMoney,
    serializeTransactionsCsv,
  } from './lib/finance.ts';
  import { loadTheme, saveTheme, loadTransactions as loadStoredTransactions, saveTransactions as saveStoredTransactions, loadCategorySettings, saveCategorySettings, loadCustomTheme, saveCustomTheme } from './lib/storage.ts';
  import { DEFAULT_CATEGORY_SETTINGS, normalizeCategorySettings } from './lib/categories.ts';
  import {
    destroyChart,
    getVisibleCustomCharts,
    renderBudgetCharts,
    renderCustomChart,
    type CustomChartDefinition,
  } from './lib/charts/budgetCharts.ts';
  import {
    calculateCategoryBreakdown,
    calculateMonthSummary,
    calculateTrendData,
    calculateYearSummary,
    confirmImports,
    getCategoryOptions,
    updateFormType,
  } from './lib/controllers/budgetController.ts';
  import {
    applyTransactionMutation,
    createBlankForm,
    removeTransactionById,
    startEditingTransaction as startTransactionEdit,
  } from './lib/services/transactionService.ts';
  import type { CategorySettings, Transaction, TransactionForm, TransactionType } from './lib/types';
  import BudgetDashboardView from './lib/views/BudgetDashboardView.svelte';
  import CsvFormatHelp from './lib/components/CsvFormatHelp.svelte';
  import ColorSettingsModal from './lib/components/ColorSettingsModal.svelte';
  import ChartSettingsModal from './lib/components/ChartSettingsModal.svelte';
  import type { AppThemeSettings } from './lib/colorTheme';
  import {
    DARK_THEME_SETTINGS,
    DEFAULT_THEME_SETTINGS,
    FOREST_THEME_SETTINGS,
    LIGHT_THEME_SETTINGS,
    MINIMAL_DARK_THEME_SETTINGS,
    OCEAN_THEME_SETTINGS,
    SUNSET_THEME_SETTINGS,
    type ChartPresetName,
    type ThemePresetName,
    getCategoryColor,
    normalizeThemeSettings,
    toRgba,
  } from './lib/colorTheme';

  const sampleTransactions: Transaction[] = [
    { id: 'seed-1', type: 'income', category: 'Salary', amount: 3200, date: '2026-09-01', note: 'Monthly salary', recurring: true },
    { id: 'seed-2', type: 'expense', category: 'Housing', amount: 980, date: '2026-09-02', note: 'Rent', recurring: true },
    { id: 'seed-3', type: 'expense', category: 'Groceries', amount: 230, date: '2026-09-07', note: 'Weekly shop', recurring: false },
    { id: 'seed-4', type: 'expense', category: 'Transport', amount: 70, date: '2026-09-09', note: 'Train card', recurring: false },
    { id: 'seed-5', type: 'income', category: 'Freelance', amount: 540, date: '2026-08-18', note: 'Client work', recurring: false },
    { id: 'seed-6', type: 'expense', category: 'Entertainment', amount: 120, date: '2026-08-20', note: 'Cinema and dinner', recurring: false },
    { id: 'seed-7', type: 'expense', category: 'Utilities', amount: 160, date: '2026-07-04', note: 'Electricity + internet', recurring: true },
  ];

  let transactions: Transaction[] = [];
  let darkMode = false;
  let doughnutCanvas: HTMLCanvasElement | undefined;
  let trendCanvas: HTMLCanvasElement | undefined;
  let doughnutChart: ReturnType<typeof renderBudgetCharts>['doughnutChart'];
  let trendChart: ReturnType<typeof renderBudgetCharts>['trendChart'];
  let ready = false;
  let fileInput: HTMLInputElement | undefined;
  let formMode: 'add' | 'edit' = 'add';
  let categorySettings: CategorySettings = DEFAULT_CATEGORY_SETTINGS;
  let form: TransactionForm = createBlankForm(categorySettings);
  let showCsvHelp = false;
  let showCustomizeColors = false;
  let showCustomizeCharts = false;
  let showAllTransactions = false;
  let themeSettings: AppThemeSettings = DEFAULT_THEME_SETTINGS;
  let pendingImportRows: Array<{ id: string; date: string; amount: number; note: string; type: TransactionType; category: string }> = [];
  let customCharts: CustomChartDefinition[] = [];
  let customChartCanvases: Record<string, HTMLCanvasElement | undefined> = {};
  let customChartInstances: Record<string, ReturnType<typeof renderCustomChart> | null> = {};

  function applyTheme(): void {
    document.body.classList.toggle('dark-theme', darkMode);
    saveTheme(localStorage, darkMode);
  }

  function applyCustomTheme(): void {
    const root = document.documentElement;
    root.style.setProperty('--bg', themeSettings.background);
    root.style.setProperty('--panel', themeSettings.panel);
    root.style.setProperty('--panel-strong', themeSettings.panel);
    root.style.setProperty('--card-income', toRgba(themeSettings.income, darkMode ? 0.18 : 0.12));
    root.style.setProperty('--card-expense', toRgba(themeSettings.expense, darkMode ? 0.18 : 0.12));
    root.style.setProperty('--card-net', toRgba(themeSettings.accent, darkMode ? 0.14 : 0.1));
    root.style.setProperty('--income-color', themeSettings.income);
    root.style.setProperty('--expense-color', themeSettings.expense);
    root.style.setProperty('--accent', themeSettings.accent);
    root.style.setProperty('--accent-soft', toRgba(themeSettings.accent, darkMode ? 0.18 : 0.12));
    root.style.setProperty('--text', themeSettings.text);
    root.style.setProperty('--muted', darkMode ? '#94a3b8' : '#64748b');
    root.style.setProperty('--border', darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.25)');
    root.style.setProperty('--text-color', themeSettings.text);
    saveCustomTheme(localStorage, themeSettings);
  }

  function loadTransactions(): void {
    const storedTransactions = loadStoredTransactions(localStorage, [...sampleTransactions]);
    transactions = Array.isArray(storedTransactions) && storedTransactions.length > 0 ? storedTransactions : [...sampleTransactions];

    if (!Array.isArray(storedTransactions) || storedTransactions.length === 0) {
      saveStoredTransactions(localStorage, transactions);
    }
  }

  function persistTransactions(): void {
    saveStoredTransactions(localStorage, transactions);
  }

  function saveCategories(nextSettings: CategorySettings): void {
    const normalized = normalizeCategorySettings(nextSettings);
    const renameMap = new Map<string, string>();
    for (const type of ['income', 'expense'] as const) {
      const oldNames = categorySettings[type];
      const newNames = normalized[type];
      if (oldNames.length === newNames.length) {
        oldNames.forEach((oldName, index) => {
          const newName = newNames[index];
          if (newName && oldName !== newName) renameMap.set(`${type}:${oldName}`, newName);
        });
      }
      const fallback = newNames[0];
      const remaining = new Set(newNames);
      oldNames.filter((oldName) => !remaining.has(oldName)).forEach((removedName) => renameMap.set(`${type}:${removedName}`, fallback));
    }
    transactions = transactions.map((item) => ({ ...item, category: renameMap.get(`${item.type}:${item.category}`) ?? item.category }));
    categorySettings = normalized;
    saveCategorySettings(localStorage, categorySettings);
    form = updateFormType(form, categorySettings);
    persistTransactions();
    renderCharts();
  }

  function getEffectiveCategoryColors(): Record<string, string> {
    const colors = { ...categorySettings.colors };
    for (const category of [...categorySettings.income, ...categorySettings.expense]) {
      colors[category] ??= getCategoryColor(category, themeSettings.palette);
    }
    return colors;
  }

  function resetForm(): void {
    formMode = 'add';
    form = createBlankForm(categorySettings);
  }

  function isDarkThemeBackground(hex: string): boolean {
    const value = hex.replace('#', '');
    const fullHex = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
    const parsed = Number.parseInt(fullHex, 16);
    const red = (parsed >> 16) & 255;
    const green = (parsed >> 8) & 255;
    const blue = parsed & 255;
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness < 160;
  }

  function saveThemeSettings(nextSettings: AppThemeSettings): void {
    themeSettings = normalizeThemeSettings(nextSettings);
    darkMode = isDarkThemeBackground(themeSettings.background);
    applyTheme();
    applyCustomTheme();
    renderCharts();
    showCustomizeColors = false;
  }

  function resetThemeSettings(): void {
    themeSettings = DEFAULT_THEME_SETTINGS;
    categorySettings = { ...categorySettings, colors: {} };
    saveCategorySettings(localStorage, categorySettings);
    darkMode = false;
    applyTheme();
    applyCustomTheme();
    renderCharts();
    showCustomizeColors = false;
  }

  function applyThemePreset(mode: ThemePresetName): void {
    const presetMap: Record<ThemePresetName, AppThemeSettings> = {
      light: LIGHT_THEME_SETTINGS,
      dark: DARK_THEME_SETTINGS,
      ocean: OCEAN_THEME_SETTINGS,
      sunset: SUNSET_THEME_SETTINGS,
      'minimal-dark': MINIMAL_DARK_THEME_SETTINGS,
      forest: FOREST_THEME_SETTINGS,
    };

    const nextTheme = presetMap[mode];
    themeSettings = normalizeThemeSettings(nextTheme);
    darkMode = isDarkThemeBackground(themeSettings.background);
    applyTheme();
    applyCustomTheme();
    renderCharts();
  }

  function applyChartPreset(preset: ChartPresetName): void {
    const showDoughnut = preset === 'both' || preset === 'doughnut';
    const showTrend = preset === 'both' || preset === 'line';

    themeSettings = normalizeThemeSettings({
      ...themeSettings,
      chartPreset: preset,
      showDoughnutChart: showDoughnut,
      showTrendChart: showTrend,
    });
    applyCustomTheme();
    renderCharts();
    showCustomizeCharts = false;
  }

  function toggleChartVisibility(chartName: 'doughnut' | 'trend'): void {
    const nextShowDoughnut = chartName === 'doughnut' ? !themeSettings.showDoughnutChart : themeSettings.showDoughnutChart;
    const nextShowTrend = chartName === 'trend' ? !themeSettings.showTrendChart : themeSettings.showTrendChart;

    const nextPreset: ChartPresetName = !nextShowDoughnut && !nextShowTrend
      ? 'none'
      : nextShowDoughnut && nextShowTrend
        ? 'both'
        : nextShowDoughnut
          ? 'doughnut'
          : 'line';

    themeSettings = normalizeThemeSettings({
      ...themeSettings,
      chartPreset: nextPreset,
      showDoughnutChart: nextShowDoughnut,
      showTrendChart: nextShowTrend,
    });
    applyCustomTheme();
    renderCharts();
  }

  async function addCustomChart(chart: CustomChartDefinition): Promise<void> {
    customCharts = [...customCharts, { ...chart, visible: true }];
    await tick();
    renderCharts();
  }

  function toggleCustomChartVisibility(chartId: string): void {
    customCharts = customCharts.map((chart) => {
      if (chart.id !== chartId) {
        return chart;
      }

      return {
        ...chart,
        visible: chart.visible !== false,
      };
    });
    renderCharts();
  }

  async function removeCustomChart(chartId: string): Promise<void> {
    customCharts = customCharts.filter((chart) => chart.id !== chartId);
    const instance = customChartInstances[chartId];
    destroyChart(instance);
    delete customChartInstances[chartId];
    delete customChartCanvases[chartId];
    await tick();
    renderCharts();
  }

  function handleSubmit(): void {
    const result = applyTransactionMutation({ transactions, form, formMode, settings: categorySettings });

    if (!result.changed) {
      return;
    }

    transactions = result.transactions;
    persistTransactions();
    formMode = result.nextMode;
    form = result.nextForm;
    renderCharts();
  }

  function startEditTransaction(item: Transaction): void {
    const result = startTransactionEdit(item);
    formMode = result.formMode;
    form = result.form;
  }

  function removeTransaction(id: string): void {
    transactions = removeTransactionById(transactions, id);
    persistTransactions();
    renderCharts();
  }

  function cancelPendingImport(): void {
    pendingImportRows = [];
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function confirmPendingImport(): void {
    if (pendingImportRows.length === 0) return;

    transactions = confirmImports(transactions, pendingImportRows, categorySettings);
    persistTransactions();
    renderCharts();
    pendingImportRows = [];
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function exportCsv(): void {
    const csv = serializeTransactionsCsv(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function toggleCsvHelp(): void {
    showCsvHelp = !showCsvHelp;
  }

  function toggleCustomizeMenu(): void {
    showCustomizeColors = !showCustomizeColors;
    if (showCustomizeColors) {
      showCustomizeCharts = false;
    }
  }

  function toggleCustomizeChartsMenu(): void {
    showCustomizeCharts = !showCustomizeCharts;
    if (showCustomizeCharts) {
      showCustomizeColors = false;
    }
  }

  function toggleAllTransactionsView(): void {
    showAllTransactions = !showAllTransactions;
  }

  function importCsv(event: Event & { currentTarget: EventTarget & HTMLInputElement }): void {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readEvent) => {
      const content = String(readEvent.target?.result ?? '');
      const importedRows = buildImportRowsFromCsv(content);

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

  function renderCharts(): void {
    destroyChart(doughnutChart);
    destroyChart(trendChart);

    const showDoughnut = themeSettings.showDoughnutChart;
    const showTrend = themeSettings.showTrendChart;

    const chartResult = renderBudgetCharts({
      doughnutCanvas: showDoughnut ? doughnutCanvas : undefined,
      trendCanvas: showTrend ? trendCanvas : undefined,
      darkMode,
      formatMoney,
      categoryBreakdown: calculateCategoryBreakdown(transactions),
      trendData: calculateTrendData(transactions),
      palette: themeSettings.palette,
      categoryColors: getEffectiveCategoryColors(),
      incomeColor: themeSettings.income,
      expenseColor: themeSettings.expense,
    });

    doughnutChart = chartResult.doughnutChart;
    trendChart = chartResult.trendChart;

    for (const [chartId, instance] of Object.entries(customChartInstances)) {
      destroyChart(instance);
    }

    const nextCustomChartInstances: Record<string, ReturnType<typeof renderCustomChart> | null> = {};
    const visibleCustomCharts = getVisibleCustomCharts(customCharts);

    for (const chart of visibleCustomCharts) {
      const canvas = customChartCanvases[chart.id];
      const instance = renderCustomChart(canvas, chart, transactions, darkMode, formatMoney, themeSettings.palette);
      nextCustomChartInstances[chart.id] = instance;
    }

    customChartInstances = nextCustomChartInstances;
  }

  onMount(() => {
    darkMode = loadTheme(localStorage, false);
    themeSettings = loadCustomTheme(localStorage, DEFAULT_THEME_SETTINGS);
    categorySettings = loadCategorySettings(localStorage);
    form = createBlankForm(categorySettings);
    applyTheme();
    applyCustomTheme();
    loadTransactions();
    ready = true;
    renderCharts();
  });

  $: if (ready && (doughnutCanvas || trendCanvas) && (darkMode !== undefined || themeSettings)) {
    renderCharts();
  }

  $: monthSummary = calculateMonthSummary(transactions, new Date());
  $: yearSummary = calculateYearSummary(transactions, new Date().getFullYear());
  $: runningBalance = transactions.reduce((sum, entry) => {
    if (entry.type === 'income') return sum + entry.amount;
    return sum - entry.amount;
  }, 0);
  $: sortedTransactions = [...transactions].sort((left, right) => Number(new Date(right.date)) - Number(new Date(left.date)));
  $: recentTransactions = sortedTransactions.slice(0, 5);
  $: categoryBreakdown = calculateCategoryBreakdown(transactions);
  $: trendData = calculateTrendData(transactions);
  $: categoryOptions = getCategoryOptions(form.type, categorySettings);
  $: palette = themeSettings.palette;
</script>

<input bind:this={fileInput} type="file" accept=".csv,text/csv" hidden on:change={importCsv} />

<BudgetDashboardView
  bind:doughnutCanvas={doughnutCanvas}
  bind:trendCanvas={trendCanvas}
  bind:customChartCanvases={customChartCanvases}
  monthSummary={monthSummary}
  runningBalance={runningBalance}
  pendingImportRows={pendingImportRows}
  formMode={formMode}
  form={form}
  sortedTransactions={sortedTransactions}
  recentTransactions={recentTransactions}
  customCharts={customCharts}
  onRemoveCustomChart={removeCustomChart}
  yearSummary={yearSummary}
  categoryBreakdown={categoryBreakdown}
  onImportClick={() => fileInput?.click()}
  onExportClick={exportCsv}
  onShowHelp={toggleCsvHelp}
  onShowCustomize={toggleCustomizeMenu}
  onShowCustomizeCharts={toggleCustomizeChartsMenu}
  onShowAllTransactions={toggleAllTransactionsView}
  onCloseAllTransactions={() => (showAllTransactions = false)}
  showAllTransactions={showAllTransactions}
  onSubmit={handleSubmit}
  onResetForm={resetForm}
  onStartEditTransaction={startEditTransaction}
  onRemoveTransaction={removeTransaction}
  onConfirmPendingImport={confirmPendingImport}
  onCancelPendingImport={cancelPendingImport}
  onFormTypeChange={() => {
    form = updateFormType(form, categorySettings);
  }}
  categoryOptions={categoryOptions}
  categoryColors={getEffectiveCategoryColors()}
  formatMoney={formatMoney}
  palette={palette}
  showDoughnutChart={themeSettings.showDoughnutChart}
  showTrendChart={themeSettings.showTrendChart}
/>

<CsvFormatHelp isOpen={showCsvHelp} onClose={() => (showCsvHelp = false)} />
<ColorSettingsModal
  isOpen={showCustomizeColors}
  settings={themeSettings}
  onClose={() => (showCustomizeColors = false)}
  onSave={saveThemeSettings}
  onReset={resetThemeSettings}
  onApplyPreset={(mode: ThemePresetName) => {
    applyThemePreset(mode);
    showCustomizeColors = false;
  }}
  categorySettings={categorySettings}
  categoryPalette={themeSettings.palette}
  onSaveCategories={saveCategories}
/>

<ChartSettingsModal
  isOpen={showCustomizeCharts}
  chartPreset={themeSettings.chartPreset}
  showDoughnutChart={themeSettings.showDoughnutChart}
  showTrendChart={themeSettings.showTrendChart}
  customCharts={customCharts}
  onClose={() => (showCustomizeCharts = false)}
  onApplyChartPreset={(preset) => {
    applyChartPreset(preset);
  }}
  onToggleChart={(chartName) => {
    toggleChartVisibility(chartName);
  }}
  onToggleCustomChart={(chartId) => {
    toggleCustomChartVisibility(chartId);
  }}
  onAddCustomChart={(chart) => {
    addCustomChart(chart);
    showCustomizeCharts = false;
  }}
/>
