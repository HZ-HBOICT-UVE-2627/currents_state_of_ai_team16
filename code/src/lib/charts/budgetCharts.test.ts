import test from 'node:test';
import assert from 'node:assert/strict';

import { getVisibleCustomCharts, type CustomChartDefinition } from './budgetCharts.ts';

const charts: CustomChartDefinition[] = [
  {
    id: 'visible-chart',
    title: 'Visible chart',
    chartType: 'bar',
    groupBy: 'category',
    metric: 'amount',
    visible: true,
  },
  {
    id: 'hidden-chart',
    title: 'Hidden chart',
    chartType: 'line',
    groupBy: 'month',
    metric: 'count',
    visible: false,
  },
  {
    id: 'default-visible-chart',
    title: 'Default visible chart',
    chartType: 'doughnut',
    groupBy: 'type',
    metric: 'amount',
  },
];

test('custom charts default to visible and hidden charts are filtered out', () => {
  const visibleCharts = getVisibleCustomCharts(charts);

  assert.deepEqual(visibleCharts.map((chart) => chart.id), ['visible-chart', 'default-visible-chart']);
});
