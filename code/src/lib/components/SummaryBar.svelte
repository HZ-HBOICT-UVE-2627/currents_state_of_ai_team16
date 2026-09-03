<script>
  import { formatMoney } from '../finance.js';

  export let monthSummary = { income: 0, expenses: 0, net: 0 };
  export let runningBalance = 0;
</script>

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
