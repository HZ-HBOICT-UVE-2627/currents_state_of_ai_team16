export type ChartPresetName = 'both' | 'doughnut' | 'line' | 'none';

export type AppThemeSettings = {
  accent: string;
  income: string;
  expense: string;
  background: string;
  panel: string;
  text: string;
  palette: string[];
  chartPreset: ChartPresetName;
  showDoughnutChart: boolean;
  showTrendChart: boolean;
};

export type ThemePresetName = 'light' | 'dark' | 'ocean' | 'sunset' | 'minimal-dark' | 'forest';

export const LIGHT_THEME_SETTINGS: AppThemeSettings = {
  accent: '#4f46e5',
  income: '#10b981',
  expense: '#f97316',
  background: '#f4f7fb',
  panel: '#ffffff',
  text: '#1f2937',
  palette: ['#6ee7b7', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#34d399', '#2dd4bf', '#f97316', '#a78bfa'],
  chartPreset: 'both',
  showDoughnutChart: true,
  showTrendChart: true,
};

export const DARK_THEME_SETTINGS: AppThemeSettings = {
  accent: '#8b5cf6',
  income: '#34d399',
  expense: '#f97316',
  background: '#07111f',
  panel: '#0f172a',
  text: '#e2e8f0',
  palette: ['#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#c084fc', '#f59e0b', '#2dd4bf', '#f97316', '#a78bfa', '#a5b4fc'],
  chartPreset: 'both',
  showDoughnutChart: true,
  showTrendChart: true,
};

export const OCEAN_THEME_SETTINGS: AppThemeSettings = {
  accent: '#0ea5e9',
  income: '#22c55e',
  expense: '#f59e0b',
  background: '#e0f2fe',
  panel: '#f8fdff',
  text: '#0f172a',
  palette: ['#38bdf8', '#2dd4bf', '#34d399', '#a5f3fc', '#60a5fa', '#22c55e', '#0ea5e9', '#7dd3fc', '#fbbf24', '#a78bfa'],
  chartPreset: 'both',
  showDoughnutChart: true,
  showTrendChart: true,
};

export const SUNSET_THEME_SETTINGS: AppThemeSettings = {
  accent: '#f97316',
  income: '#f59e0b',
  expense: '#ef4444',
  background: '#fff7ed',
  panel: '#fffaf5',
  text: '#431407',
  palette: ['#fb7185', '#f59e0b', '#f97316', '#fdba74', '#fca5a5', '#facc15', '#f472b6', '#fb923c', '#ef4444', '#c084fc'],
  chartPreset: 'both',
  showDoughnutChart: true,
  showTrendChart: true,
};

export const MINIMAL_DARK_THEME_SETTINGS: AppThemeSettings = {
  accent: '#a78bfa',
  income: '#4ade80',
  expense: '#fda4af',
  background: '#111827',
  panel: '#1f2937',
  text: '#f3f4f6',
  palette: ['#d8b4fe', '#93c5fd', '#86efac', '#f9a8d4', '#fca5a5', '#c4b5fd', '#67e8f9', '#fcd34d', '#f9a8d4', '#a7f3d0'],
  chartPreset: 'both',
  showDoughnutChart: true,
  showTrendChart: true,
};

export const FOREST_THEME_SETTINGS: AppThemeSettings = {
  accent: '#22c55e',
  income: '#16a34a',
  expense: '#f59e0b',
  background: '#ecfdf5',
  panel: '#f7fff9',
  text: '#14532d',
  palette: ['#22c55e', '#84cc16', '#4ade80', '#a3e635', '#10b981', '#34d399', '#14b8a6', '#84cc16', '#facc15', '#65a30d'],
  chartPreset: 'both',
  showDoughnutChart: true,
  showTrendChart: true,
};

export const DEFAULT_THEME_SETTINGS: AppThemeSettings = LIGHT_THEME_SETTINGS;

export const THEME_PRESETS = {
  light: LIGHT_THEME_SETTINGS,
  dark: DARK_THEME_SETTINGS,
  ocean: OCEAN_THEME_SETTINGS,
  sunset: SUNSET_THEME_SETTINGS,
  'minimal-dark': MINIMAL_DARK_THEME_SETTINGS,
  forest: FOREST_THEME_SETTINGS,
} as const;

export function normalizeThemeSettings(value?: Partial<AppThemeSettings>): AppThemeSettings {
  const fallback = DEFAULT_THEME_SETTINGS;
  const chartPreset = value?.chartPreset === 'doughnut' || value?.chartPreset === 'line' || value?.chartPreset === 'both' || value?.chartPreset === 'none'
    ? value.chartPreset
    : fallback.chartPreset;

  const derivedShowDoughnut = value?.showDoughnutChart ?? (chartPreset === 'both' || chartPreset === 'doughnut');
  const derivedShowTrend = value?.showTrendChart ?? (chartPreset === 'both' || chartPreset === 'line');

  return {
    accent: value?.accent ?? fallback.accent,
    income: value?.income ?? fallback.income,
    expense: value?.expense ?? fallback.expense,
    background: value?.background ?? fallback.background,
    panel: value?.panel ?? fallback.panel,
    text: value?.text ?? fallback.text,
    palette: Array.isArray(value?.palette) && value.palette.length > 0 ? value.palette : fallback.palette,
    chartPreset,
    showDoughnutChart: derivedShowDoughnut,
    showTrendChart: derivedShowTrend,
  };
}

export function toRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((char) => char + char).join('')
    : cleaned;

  const number = Number.parseInt(full, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function getCategoryColor(category: string, palette: string[], fallback = '#4f46e5'): string {
  if (!palette.length) {
    return fallback;
  }

  const normalized = category.trim().toLowerCase();
  const derived = normalized.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[derived % palette.length] ?? fallback;
}
