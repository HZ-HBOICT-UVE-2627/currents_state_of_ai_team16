<script lang="ts">
  import type { ChartPresetName } from '../colorTheme';
  import type { CustomChartDefinition, CustomChartGroupBy, CustomChartMetric, CustomChartType } from '../charts/budgetCharts';

  export let isOpen = false;
  export let chartPreset: ChartPresetName = 'both';
  export let showDoughnutChart = true;
  export let showTrendChart = true;
  export let onClose: () => void = () => {};
  export let onApplyChartPreset: (preset: ChartPresetName) => void = () => {};
  export let onToggleChart: (chartName: 'doughnut' | 'trend') => void = () => {};
  export let customCharts: CustomChartDefinition[] = [];
  export let onToggleCustomChart: (chartId: string) => void = () => {};
  export let onAddCustomChart: (chart: CustomChartDefinition) => void = () => {};

  let title = 'Custom chart';
  let chartType: CustomChartType = 'bar';
  let groupBy: CustomChartGroupBy = 'category';
  let metric: CustomChartMetric = 'amount';

  function handleAddCustomChart(): void {
    onAddCustomChart({
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      title: title.trim() || 'Custom chart', chartType, groupBy, metric,
    });
    title = 'Custom chart'; chartType = 'bar'; groupBy = 'category'; metric = 'amount';
  }
</script>

{#if isOpen}
  <div class="settings-page">
    <div class="settings-content" role="dialog" aria-modal="true" aria-label="Customize charts" tabindex="0" on:keydown={(event) => event.key === 'Escape' && onClose()}>
      <header class="settings-header">
        <div><p class="eyebrow">Dashboard</p><h2>Customize charts</h2></div>
        <button type="button" class="back-button" on:click={onClose}>Back to dashboard</button>
      </header>

      <main class="settings-body">
        <section class="settings-section">
          <p class="section-label">Visible charts</p>
          <div class="preset-row">
            <button type="button" class="preset-button" class:active={showDoughnutChart} on:click={() => onToggleChart('doughnut')}>{showDoughnutChart ? 'Hide donut' : 'Show donut'}</button>
            <button type="button" class="preset-button" class:active={showTrendChart} on:click={() => onToggleChart('trend')}>{showTrendChart ? 'Hide line' : 'Show line'}</button>
            <button type="button" class="preset-button" class:active={chartPreset === 'both'} on:click={() => onApplyChartPreset('both')}>Show both</button>
          </div>
        </section>

        <section class="settings-section custom-chart-group">
          <p class="section-label">Custom charts</p>
          {#if customCharts.length > 0}
            <div class="custom-chart-list">
              {#each customCharts as chart}
                <button type="button" class="preset-button" class:active={chart.visible !== false} on:click={() => onToggleCustomChart(chart.id)}>{chart.visible === false ? `Show ${chart.title}` : `Hide ${chart.title}`}</button>
              {/each}
            </div>
          {/if}

          <label class="field-label"><span>Title</span><input bind:value={title} type="text" placeholder="My custom chart" /></label>
          <div class="field-grid">
            <label class="field-label"><span>Chart type</span><select bind:value={chartType}><option value="bar">Bar</option><option value="line">Line</option><option value="doughnut">Doughnut</option></select></label>
            <label class="field-label"><span>Group by</span><select bind:value={groupBy}><option value="category">Category</option><option value="month">Month</option><option value="type">Income / expense</option></select></label>
          </div>
          <label class="field-label"><span>Metric</span><select bind:value={metric}><option value="amount">Amount</option><option value="count">Count</option></select></label>
          <button type="button" class="add-custom-button" on:click={handleAddCustomChart}>Add chart</button>
        </section>
      </main>
    </div>
  </div>
{/if}

<style>
  .settings-page { position: fixed; inset: 0; overflow-y: auto; background: var(--bg, #f4f7fb); z-index: 40; }
  .settings-content { width: min(920px, 100%); min-height: 100vh; margin: 0 auto; display: flex; flex-direction: column; background: var(--panel-strong, #fff); color: var(--text, #0f172a); }
  .settings-header { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border, rgba(148,163,184,.25)); background: var(--panel-strong, #fff); }
  .settings-body { flex: 1; display: grid; align-content: start; gap: 1.5rem; padding: 1.5rem; }
  .settings-section, .custom-chart-group { display: grid; gap: .9rem; }
  .preset-row, .custom-chart-list { display: flex; gap: .75rem; flex-wrap: wrap; }
  .preset-button, .back-button { border: 1px solid var(--border, rgba(148,163,184,.35)); border-radius: 8px; padding: .6rem 1rem; background: transparent; color: inherit; font-weight: 600; cursor: pointer; }
  .preset-button.active { background: var(--accent-soft, #eef2ff); border-color: var(--accent, #4f46e5); }
  .custom-chart-group { border-top: 1px solid var(--border); padding-top: 1rem; }
  .field-label { display: grid; gap: .45rem; font-size: .8rem; color: inherit; font-weight: 600; }
  .field-label input, .field-label select { width: 100%; padding: .7rem .8rem; border-radius: 8px; border: 1px solid var(--border); background: transparent; color: inherit; }
  .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
  .add-custom-button { border: 0; border-radius: 8px; padding: .8rem 1rem; background: var(--accent, #4f46e5); color: white; font-weight: 700; cursor: pointer; }
  .section-label { margin: 0; font-size: .8rem; font-weight: 700; color: var(--muted, #475569); text-transform: uppercase; letter-spacing: .08em; }
  .eyebrow { margin: 0 0 .15rem; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--accent, #4f46e5); font-weight: 700; }
  h2 { margin: 0; font-size: 1.4rem; }
  @media (min-width: 700px) { .settings-content { min-height: calc(100vh - 48px); margin: 24px auto; border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); overflow: hidden; } }
  @media (max-width: 520px) { .settings-header { align-items: flex-start; flex-direction: column; } .field-grid { grid-template-columns: 1fr; } }
</style>
