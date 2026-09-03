export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  note: string;
  recurring: boolean;
}

export interface TransactionForm {
  id: string | null;
  type: TransactionType;
  category: string;
  amount: string | number;
  date: string;
  note: string;
  recurring: boolean;
}

export interface SummaryTotals {
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryBreakdownEntry {
  category: string;
  total: number;
}

export interface TrendChartData {
  labels: string[];
  income: number[];
  expense: number[];
}

export interface ImportRow {
  id: string;
  date: string;
  amount: number;
  note: string;
  type: TransactionType;
  category: string;
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
  normalized: {
    id?: string | null;
    type: TransactionType;
    category: string;
    amount: number;
    date: string;
    note: string;
    recurring: boolean;
  };
}
