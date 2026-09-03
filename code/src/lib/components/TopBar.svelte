<script lang="ts">
  let menuOpen = false;

  export let onImportClick: () => void = () => {};
  export let onExportClick: () => void = () => {};
  export let onShowHelp: () => void = () => {};
  export let onShowCustomize: () => void = () => {};
  export let onShowCustomizeCharts: () => void = () => {};
  export let onShowAllTransactions: () => void = () => {};

  function toggleMenu(): void {
    menuOpen = !menuOpen;
  }

  function closeMenu(): void {
    menuOpen = false;
  }

  function handleAction(action: () => void): void {
    action();
    closeMenu();
  }
</script>

<header class="topbar">
  <div>
    <p class="eyebrow">Private finance dashboard</p>
    <h1>Budget Tracker</h1>
  </div>

  <div class="topbar-actions">
    <div class="menu-wrapper">
      <button class="gear-button" type="button" on:click={toggleMenu} aria-label="Open dashboard menu" aria-expanded={menuOpen}>
        ⚙
      </button>

      {#if menuOpen}
        <div class="menu-panel" role="menu" aria-label="Dashboard actions">
          <button class="menu-button" type="button" role="menuitem" on:click={() => handleAction(onShowHelp)}>
            CSV formatting guide
          </button>
          <button class="menu-button" type="button" role="menuitem" on:click={() => handleAction(onShowCustomize)}>
            Customize colors
          </button>
          <button class="menu-button" type="button" role="menuitem" on:click={() => handleAction(onShowCustomizeCharts)}>
            Customize charts
          </button>
          <button class="menu-button" type="button" role="menuitem" on:click={() => handleAction(onShowAllTransactions)}>
            All transactions
          </button>
          <button class="menu-button" type="button" role="menuitem" on:click={() => handleAction(onImportClick)}>
            Import CSV
          </button>
          <button class="menu-button" type="button" role="menuitem" on:click={() => handleAction(onExportClick)}>
            Export CSV
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .topbar-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
  }

  .menu-wrapper {
    position: relative;
  }

  .gear-button {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    color: #0f172a;
    font-size: 1.25rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
  }

  .gear-button:hover {
    transform: rotate(20deg);
  }

  .menu-panel {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 220px;
    background: white;
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
    padding: 0.5rem;
    display: grid;
    gap: 0.35rem;
    z-index: 30;
  }

  .menu-button {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    color: #0f172a;
    padding: 0.7rem 0.8rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
  }

  .menu-button:hover {
    background: #f3f4f6;
  }
</style>
