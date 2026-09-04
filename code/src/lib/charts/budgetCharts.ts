import { Chart, registerables } from 'chart.js';
import type { CategoryBreakdownEntry, Transaction, TrendChartData } from '../types';

Chart.register(...registerables);

export type CustomChartType = 'bar' | 'line' | 'doughnut';
export type CustomChartGroupBy = 'category' | 'month' | 'type';
export type CustomChartMetric = 'amount' | 'count';

export interface CustomChartDefinition {
  id: string;
  title: string;
  chartType: CustomChartType;
  groupBy: CustomChartGroupBy;
  metric: CustomChartMetric;
  visible?: boolean;
}

export function getVisibleCustomCharts(charts: CustomChartDefinition[]): CustomChartDefinition[] {
  return charts.filter((chart) => chart.visible !== false);
}

export interface BudgetChartsConfig {
  doughnutCanvas: HTMLCanvasElement | undefined;
  trendCanvas: HTMLCanvasElement | undefined;
  darkMode: boolean;
  formatMoney: (value: number | string) => string;
  categoryBreakdown: CategoryBreakdownEntry[];
  trendData: TrendChartData;
  palette?: string[];
  categoryColors?: Record<string, string>;
  incomeColor?: string;
  expenseColor?: string;
}

export function getChartThemeColors(darkMode: boolean): { text: string; grid: string } {
  const styles = getComputedStyle(document.body);
  const text = styles.getPropertyValue('--text-color').trim() || '#1f2937';
  const grid = darkMode ? 'rgba(148, 163, 184, 0.18)' : 'rgba(100, 116, 139, 0.18)';

  return { text, grid };
}

export function buildCustomChartData(
  transactions: Transaction[],
  groupBy: CustomChartGroupBy,
  metric: CustomChartMetric,
): { labels: string[]; values: number[] } {
  const totals = new Map<string, number>();

  for (const entry of transactions) {
    let key = 'Unknown';

    if (groupBy === 'category') {
      key = entry.category;
    } else if (groupBy === 'month') {
      key = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } else {
      key = entry.type;
    }

    const valueToAdd = metric === 'amount' ? entry.amount : 1;
    totals.set(key, (totals.get(key) ?? 0) + valueToAdd);
  }

  return {
    labels: Array.from(totals.keys()),
    values: Array.from(totals.values()),
  };
}

export function renderCustomChart(
  canvas: HTMLCanvasElement | undefined,
  definition: CustomChartDefinition,
  transactions: Transaction[],
  darkMode: boolean,
  formatMoney: (value: number | string) => string,
  palette: string[] = ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'],
): Chart | null {
  if (!canvas || transactions.length === 0) {
    return null;
  }

  const theme = getChartThemeColors(darkMode);
  const { labels, values } = buildCustomChartData(transactions, definition.groupBy, definition.metric);

  const backgroundColors = labels.map((_, index) => palette[index % palette.length]);
  const borderColors = labels.map((_, index) => palette[index % palette.length]);

  const chartType = definition.chartType === 'line' ? 'line' : definition.chartType === 'doughnut' ? 'doughnut' : 'bar';

  return new Chart(canvas, {
    type: chartType,
    data: {
      labels,
      datasets: [{
        label: definition.title,
        data: values,
        borderColor: borderColors,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        fill: chartType === 'line' ? false : true,
        tension: chartType === 'line' ? 0.35 : 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: chartType === 'doughnut' ? 'bottom' : 'top',
          labels: {
            color: theme.text,
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: ${definition.metric === 'amount' ? formatMoney(context.parsed) : `${context.parsed} items`}`;
            },
          },
        },
      },
      scales: chartType === 'doughnut' ? undefined : {
        x: {
          ticks: { color: theme.text },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: theme.text,
            callback(value) {
              return definition.metric === 'amount' ? formatMoney(Number(value)) : String(value);
            },
          },
          grid: {
            color: theme.grid,
          },
        },
      },
    },
  });
}

export function renderBudgetCharts({
  doughnutCanvas,
  trendCanvas,
  darkMode,
  formatMoney,
  categoryBreakdown,
  trendData,
  palette = ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'],
  categoryColors = {},
  incomeColor = '#34d399',
  expenseColor = '#f97316',
}: BudgetChartsConfig): { doughnutChart: Chart | null; trendChart: Chart | null } {
  if (!doughnutCanvas && !trendCanvas) {
    return { doughnutChart: null, trendChart: null };
  }

  const chartPalette = palette.length > 0 ? palette : ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'];
  const theme = getChartThemeColors(darkMode);

  const doughnutChart = doughnutCanvas
    ? new Chart(doughnutCanvas, {
        type: 'doughnut',
        data: {
          labels: categoryBreakdown.map((entry) => entry.category),
          datasets: [
            {
              data: categoryBreakdown.map((entry) => entry.total),
              backgroundColor: categoryBreakdown.map((entry, index) => categoryColors[entry.category] ?? chartPalette[index % chartPalette.length]),
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
      })
    : null;

  const trendChart = trendCanvas
    ? new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: trendData.labels,
          datasets: [
            {
              label: 'Income',
              data: trendData.income,
              borderColor: incomeColor,
              backgroundColor: `${incomeColor}33`,
              tension: 0.4,
              fill: false,
            },
            {
              label: 'Expenses',
              data: trendData.expense,
              borderColor: expenseColor,
              backgroundColor: `${expenseColor}33`,
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
      })
    : null;

  return { doughnutChart, trendChart };
}

export function destroyChart(chart: Chart | null | undefined): void {
  if (chart) {
    chart.destroy();
  }
}
