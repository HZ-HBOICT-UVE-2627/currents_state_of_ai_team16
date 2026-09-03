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
    const safeTitle = title.trim() || 'Custom chart';
    onAddCustomChart({
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      title: safeTitle,
      chartType,
      groupBy,
      metric,
    });
    title = 'Custom chart';
    chartType = 'bar';
    groupBy = 'category';
    metric = 'amount';
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={onClose} role="presentation">
    <div class="settings-modal" on:click|stopPropagation role="dialog" aria-modal="true" aria-label="Customize charts" tabindex="0" on:keydown={(event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    }}>
      <div class="modal-header">
        <div>
          <p class="eyebrow">Dashboard</p>
          <h2>Customize charts</h2>
        </div>
        <button type="button" class="close-button" on:click={onClose} aria-label="Close chart customization panel">×</button>
      </div>

      <div class="modal-body">
        <div class="preset-group">
          <p class="section-label">Visible charts</p>
          <div class="preset-row">
            <button type="button" class="preset-button" class:active={showDoughnutChart} on:click={() => onToggleChart('doughnut')}>
              {showDoughnutChart ? 'Hide donut' : 'Show donut'}
            </button>
            <button type="button" class="preset-button" class:active={showTrendChart} on:click={() => onToggleChart('trend')}>
              {showTrendChart ? 'Hide line' : 'Show line'}
            </button>
            <button type="button" class="preset-button" class:active={chartPreset === 'both'} on:click={() => onApplyChartPreset('both')}>
              Show both
            </button>
          </div>
        </div>

        <div class="custom-chart-group">
          <p class="section-label">Custom charts</p>

          {#if customCharts.length > 0}
            <div class="custom-chart-list">
              {#each customCharts as chart}
                <button type="button" class="preset-button" class:active={chart.visible !== false} on:click={() => onToggleCustomChart(chart.id)}>
                  {chart.visible === false ? `Show ${chart.title}` : `Hide ${chart.title}`}
                </button>
              {/each}
            </div>
          {/if}

          <label class="field-label">
            <span>Title</span>
            <input bind:value={title} type="text" placeholder="My custom chart" />
          </label>

          <div class="field-grid">
            <label class="field-label">
              <span>Chart type</span>
              <select bind:value={chartType}>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="doughnut">Doughnut</option>
              </select>
            </label>

            <label class="field-label">
              <span>Group by</span>
              <select bind:value={groupBy}>
                <option value="category">Category</option>
                <option value="month">Month</option>
                <option value="type">Income / expense</option>
              </select>
            </label>
          </div>

          <label class="field-label">
            <span>Metric</span>
            <select bind:value={metric}>
              <option value="amount">Amount</option>
              <option value="count">Count</option>
            </select>
          </label>

          <button type="button" class="add-custom-button" on:click={handleAddCustomChart}>Add chart</button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.56);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 40;
  }

  .settings-modal {
    width: min(520px, 100%);
    background: white;
    color: #0f172a;
    border-radius: 20px;
    box-shadow: 0 22px 60px rgba(15, 23, 42, 0.26);
    border: 1px solid rgba(148, 163, 184, 0.35);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  }

  .modal-body {
    padding: 1.35rem 1.5rem 1.5rem;
    display: grid;
    gap: 1rem;
  }

  .eyebrow {
    margin: 0 0 0.15rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #4f46e5;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .close-button {
    border: none;
    background: transparent;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    color: #334155;
  }

  .preset-group {
    display: grid;
    gap: 0.75rem;
  }

  .section-label {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .preset-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .preset-button {
    border: 1px solid rgba(148, 163, 184, 0.35);
    background: white;
    color: #0f172a;
    border-radius: 999px;
    padding: 0.6rem 1rem;
    font-weight: 600;
    cursor: pointer;
  }

  .preset-button.active {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #312e81;
  }

  .custom-chart-group {
    display: grid;
    gap: 0.9rem;
    border-top: 1px solid rgba(148, 163, 184, 0.22);
    padding-top: 1rem;
  }

  .field-label {
    display: grid;
    gap: 0.45rem;
    font-size: 0.8rem;
    color: #475569;
    font-weight: 600;
  }

  .field-label input,
  .field-label select {
    width: 100%;
    padding: 0.7rem 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.35);
    background: white;
    color: #0f172a;
  }

  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }

  .custom-chart-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .add-custom-button {
    border: none;
    border-radius: 12px;
    padding: 0.8rem 1rem;
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    font-weight: 700;
    cursor: pointer;
  }
</style>
