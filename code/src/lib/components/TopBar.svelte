<script>
  export let darkMode = false;
  export let onImportClick = () => {};
  export let onExportClick = () => {};
  export let onToggleTheme = () => {};
</script>

<header class="topbar">
  <div>
    <p class="eyebrow">Private finance dashboard</p>
    <h1>Budget Tracker</h1>
  </div>

  <div class="topbar-actions">
    <button class="action-button file-picker" type="button" on:click={onImportClick}>
      Import CSV
    </button>

    <button class="action-button" type="button" on:click={onExportClick}>Export CSV</button>

    <button class="action-button theme-toggle" type="button" on:click={onToggleTheme}>
      {darkMode ? 'Light mode' : 'Dark mode'}
    </button>
  </div>
</header>
