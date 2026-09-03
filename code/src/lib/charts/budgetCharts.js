import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * @typedef {{ category: string, total: number }} BudgetCategoryBreakdownEntry
 * @typedef {{ labels: string[], income: number[], expense: number[] }} TrendChartData
 * @typedef {{ doughnutCanvas: HTMLCanvasElement | undefined, trendCanvas: HTMLCanvasElement | undefined, transactions: Array<Record<string, unknown>> | undefined, darkMode: boolean, formatMoney: (value: number | string) => string, categoryBreakdown: BudgetCategoryBreakdownEntry[], trendData: TrendChartData }} BudgetChartsConfig
 */

/**
 * @param {boolean} darkMode
 * @returns {{ text: string, grid: string }}
 */
export function getChartThemeColors(darkMode) {
  const styles = getComputedStyle(document.body);
  const text = styles.getPropertyValue('--text-color').trim() || '#1f2937';
  const grid = darkMode ? 'rgba(148, 163, 184, 0.18)' : 'rgba(100, 116, 139, 0.18)';

  return { text, grid };
}

/**
 * @param {BudgetChartsConfig} config
 * @returns {{ doughnutChart: Chart | null, trendChart: Chart | null }}
 */
export function renderBudgetCharts({ doughnutCanvas, trendCanvas, transactions, darkMode, formatMoney, categoryBreakdown, trendData }) {
  if (!doughnutCanvas || !trendCanvas) {
    return { doughnutChart: null, trendChart: null };
  }

  /** @type {string[]} */
  const palette = ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'];
  const theme = getChartThemeColors(darkMode);

  const doughnutChart = new Chart(doughnutCanvas, {
    type: 'doughnut',
    data: {
      labels: categoryBreakdown.map(/** @param {BudgetCategoryBreakdownEntry} entry */ (entry) => entry.category),
      datasets: [
        {
          data: categoryBreakdown.map(/** @param {BudgetCategoryBreakdownEntry} entry */ (entry) => entry.total),
          backgroundColor: categoryBreakdown.map(/** @param {unknown} _ @param {number} index */ (_, index) => palette[index % palette.length]),
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

  const trendChart = new Chart(trendCanvas, {
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

  return { doughnutChart, trendChart };
}

/**
 * @param {Chart | null | undefined} chart
 */
export function destroyChart(chart) {
  if (chart) {
    chart.destroy();
  }
}
