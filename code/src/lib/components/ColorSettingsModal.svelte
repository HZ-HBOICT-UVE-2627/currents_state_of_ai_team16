<script lang="ts">
  import {
    DARK_THEME_SETTINGS,
    DEFAULT_THEME_SETTINGS,
    FOREST_THEME_SETTINGS,
    LIGHT_THEME_SETTINGS,
    MINIMAL_DARK_THEME_SETTINGS,
    OCEAN_THEME_SETTINGS,
    SUNSET_THEME_SETTINGS,
    type AppThemeSettings,
    type ThemePresetName,
  } from '../colorTheme';

  export let isOpen = false;
  export let settings: AppThemeSettings = DEFAULT_THEME_SETTINGS;
  export let onClose: () => void = () => {};
  export let onSave: (nextSettings: AppThemeSettings) => void = () => {};
  export let onReset: () => void = () => {};
  export let onApplyPreset: (mode: ThemePresetName) => void = () => {};

  let draft = { ...settings };

  $: if (isOpen) {
    draft = { ...settings };
  }

  function updateField(field: keyof AppThemeSettings, value: string): void {
    draft = { ...draft, [field]: value };
  }

  function applyPreset(mode: ThemePresetName): void {
    const presetMap: Record<ThemePresetName, AppThemeSettings> = {
      light: LIGHT_THEME_SETTINGS,
      dark: DARK_THEME_SETTINGS,
      ocean: OCEAN_THEME_SETTINGS,
      sunset: SUNSET_THEME_SETTINGS,
      'minimal-dark': MINIMAL_DARK_THEME_SETTINGS,
      forest: FOREST_THEME_SETTINGS,
    };

    const nextPreset = presetMap[mode];
    draft = { ...nextPreset };
    onApplyPreset(mode);
  }

  function save(): void {
    onSave({ ...draft });
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={onClose} role="presentation">
    <div class="settings-modal" on:click|stopPropagation role="dialog" aria-modal="true" aria-label="Customize colors" tabindex="0" on:keydown={(event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    }}>
      <div class="modal-header">
        <div>
          <p class="eyebrow">Personalize</p>
          <h2>Customize colors</h2>
        </div>
        <button type="button" class="close-button" on:click={onClose} aria-label="Close customization panel">×</button>
      </div>

      <div class="modal-body">
        <div class="preset-group">
          <p class="section-label">Theme presets</p>
          <div class="preset-row">
            <button type="button" class="preset-button" class:active={settings.background === LIGHT_THEME_SETTINGS.background} on:click={() => applyPreset('light')}>
              Light
            </button>
            <button type="button" class="preset-button" class:active={settings.background === DARK_THEME_SETTINGS.background} on:click={() => applyPreset('dark')}>
              Dark
            </button>
            <button type="button" class="preset-button" class:active={settings.background === OCEAN_THEME_SETTINGS.background} on:click={() => applyPreset('ocean')}>
              Ocean
            </button>
            <button type="button" class="preset-button" class:active={settings.background === SUNSET_THEME_SETTINGS.background} on:click={() => applyPreset('sunset')}>
              Sunset
            </button>
            <button type="button" class="preset-button" class:active={settings.background === MINIMAL_DARK_THEME_SETTINGS.background} on:click={() => applyPreset('minimal-dark')}>
              Minimal dark
            </button>
            <button type="button" class="preset-button" class:active={settings.background === FOREST_THEME_SETTINGS.background} on:click={() => applyPreset('forest')}>
              Forest
            </button>
          </div>
        </div>

        <div class="color-grid">
          <label>
            <span>Accent</span>
            <input type="color" value={draft.accent} on:input={(event) => updateField('accent', event.currentTarget.value)} />
          </label>

          <label>
            <span>Income</span>
            <input type="color" value={draft.income} on:input={(event) => updateField('income', event.currentTarget.value)} />
          </label>

          <label>
            <span>Expense</span>
            <input type="color" value={draft.expense} on:input={(event) => updateField('expense', event.currentTarget.value)} />
          </label>

          <label>
            <span>Background</span>
            <input type="color" value={draft.background} on:input={(event) => updateField('background', event.currentTarget.value)} />
          </label>

          <label>
            <span>Panel</span>
            <input type="color" value={draft.panel} on:input={(event) => updateField('panel', event.currentTarget.value)} />
          </label>

          <label>
            <span>Text</span>
            <input type="color" value={draft.text} on:input={(event) => updateField('text', event.currentTarget.value)} />
          </label>
        </div>

        <div class="swatch-preview">
          <div class="swatch" style={`background:${draft.accent};`}></div>
          <div class="swatch" style={`background:${draft.income};`}></div>
          <div class="swatch" style={`background:${draft.expense};`}></div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="secondary-button" on:click={onReset}>Reset</button>
        <button type="button" class="primary-button" on:click={save}>Apply colors</button>
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
    width: min(620px, 100%);
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
    padding: 1.35rem 1.5rem 0.75rem;
    display: grid;
    gap: 1rem;
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
    padding: 0.5rem 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }

  .preset-button.active {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #312e81;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 1fr));
    gap: 1rem;
  }

  .color-grid label {
    display: grid;
    gap: 0.55rem;
    color: #334155;
  }

  .color-grid input[type='color'] {
    width: 100%;
    height: 48px;
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 12px;
    background: white;
    padding: 0.25rem;
  }

  .swatch-preview {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid rgba(15, 23, 42, 0.12);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem 1.5rem;
  }

  .primary-button,
  .secondary-button {
    min-width: 120px;
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
    font-size: 1.4rem;
  }

  .close-button {
    border: none;
    background: transparent;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    color: #334155;
  }
</style>
