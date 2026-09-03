<script lang="ts">
  export let isOpen = false;
  export let onClose: () => void = () => {};
</script>

{#if isOpen}
  <div class="help-overlay" on:click={onClose} role="presentation">
    <div
      class="help-panel"
      on:click|stopPropagation
      on:keydown={(event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="CSV import export format guide"
      tabindex="0"
    >
      <div class="help-header">
        <div>
          <p class="eyebrow">CSV guide</p>
          <h2>Import and export format</h2>
        </div>
        <button type="button" class="close-button" on:click={onClose} aria-label="Close CSV help">×</button>
      </div>

      <div class="help-content">
        <section>
          <h3>Required columns for importing</h3>
          <p>
            Create a file with these headers: <strong>date</strong>, <strong>amount</strong>, and <strong>note</strong>.
            Each row is one transaction.
          </p>

          <pre>date,amount,note
2026-09-01,1200.00,Monthly salary
2026-09-02,85.50,Groceries
2026-09-04,42.00,Train ticket</pre>
        </section>

        <section>
          <h3>What happens after import</h3>
          <ul>
            <li>The app reads each row and checks the values.</li>
            <li>You choose whether it is an income or an expense.</li>
            <li>You select a category from the dropdown for each entry.</li>
            <li>The transaction is added only after you confirm the review.</li>
          </ul>
        </section>

        <section>
          <h3>Export format</h3>
          <p>
            Exports are normal spreadsheet CSV files. They contain one value per cell and are safe to open in Excel, Google Sheets, or LibreOffice.
          </p>
          <pre>id,type,category,amount,date,note,recurring
seed-1,income,Salary,3200,2026-09-01,Monthly salary,true</pre>
        </section>
      </div>
    </div>
  </div>
{/if}

<style>
  .help-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.56);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 30;
  }

  .help-panel {
    width: min(720px, 100%);
    background: #fff;
    color: #0f172a;
    border-radius: 20px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
    border: 1px solid rgba(148, 163, 184, 0.35);
    overflow: hidden;
  }

  .help-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  }

  .help-content {
    padding: 1.5rem;
    display: grid;
    gap: 1.35rem;
  }

  .help-content section {
    display: grid;
    gap: 0.55rem;
  }

  .help-content h3 {
    margin: 0;
    font-size: 1.05rem;
  }

  .help-content p,
  .help-content li {
    margin: 0;
    line-height: 1.55;
  }

  .help-content ul {
    margin: 0;
    padding-left: 1.25rem;
    display: grid;
    gap: 0.45rem;
  }

  .help-content pre {
    margin: 0;
    padding: 0.9rem 1rem;
    border-radius: 12px;
    background: #0f172a;
    color: #e2e8f0;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .close-button {
    border: none;
    background: transparent;
    color: #334155;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
  }

  .eyebrow {
    margin: 0 0 0.15rem;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6366f1;
    font-weight: 700;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
</style>
