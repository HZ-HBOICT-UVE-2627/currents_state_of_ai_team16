<script lang="ts">
  import {
    DARK_THEME_SETTINGS, DEFAULT_THEME_SETTINGS, FOREST_THEME_SETTINGS, LIGHT_THEME_SETTINGS,
    MINIMAL_DARK_THEME_SETTINGS, OCEAN_THEME_SETTINGS, SUNSET_THEME_SETTINGS,
    type AppThemeSettings, type ThemePresetName, getCategoryColor,
  } from '../colorTheme';
  import type { CategorySettings } from '../types';

  export let isOpen = false;
  export let settings: AppThemeSettings = DEFAULT_THEME_SETTINGS;
  export let onClose: () => void = () => {};
  export let onSave: (nextSettings: AppThemeSettings) => void = () => {};
  export let onReset: () => void = () => {};
  export let onApplyPreset: (mode: ThemePresetName) => void = () => {};
  export let categorySettings: CategorySettings = { income: [], expense: [], colors: {} };
  export let onSaveCategories: (nextSettings: CategorySettings) => void = () => {};
  export let categoryPalette: string[] = [];

  let draft = { ...settings };
  let categoryDraft: CategorySettings = categorySettings;
  let newCategoryNames: Record<'income' | 'expense', string> = { income: '', expense: '' };

  $: if (isOpen) {
    draft = { ...settings };
    categoryDraft = { income: [...categorySettings.income], expense: [...categorySettings.expense], colors: { ...categorySettings.colors } };
    newCategoryNames = { income: '', expense: '' };
  }

  function updateField(field: keyof AppThemeSettings, value: string): void {
    draft = { ...draft, [field]: value };
  }

  function applyPreset(mode: ThemePresetName): void {
    const presetMap: Record<ThemePresetName, AppThemeSettings> = {
      light: LIGHT_THEME_SETTINGS, dark: DARK_THEME_SETTINGS, ocean: OCEAN_THEME_SETTINGS,
      sunset: SUNSET_THEME_SETTINGS, 'minimal-dark': MINIMAL_DARK_THEME_SETTINGS, forest: FOREST_THEME_SETTINGS,
    };
    draft = { ...presetMap[mode] };
    onApplyPreset(mode);
  }

  function save(): void {
    onSave({ ...draft });
    onSaveCategories(categoryDraft);
  }

  function updateCategory(type: 'income' | 'expense', index: number, name: string): void {
    const previousName = categoryDraft[type][index];
    const names = [...categoryDraft[type]];
    names[index] = name;
    const colors = { ...categoryDraft.colors };
    if (colors[previousName] && !colors[name]) colors[name] = colors[previousName];
    delete colors[previousName];
    categoryDraft = { ...categoryDraft, [type]: names, colors };
  }

  function updateCategoryColor(name: string, color: string): void {
    categoryDraft = { ...categoryDraft, colors: { ...categoryDraft.colors, [name]: color } };
  }

  function getCategoryDisplayColor(name: string): string {
    return categoryDraft.colors[name] ?? getCategoryColor(name, categoryPalette);
  }

  function addCategory(type: 'income' | 'expense'): void {
    const name = newCategoryNames[type].trim();
    if (!name || categoryDraft[type].includes(name)) return;
    categoryDraft = { ...categoryDraft, [type]: [...categoryDraft[type], name] };
    newCategoryNames = { ...newCategoryNames, [type]: '' };
  }

  function removeCategory(type: 'income' | 'expense', index: number): void {
    if (categoryDraft[type].length <= 1) return;
    const name = categoryDraft[type][index];
    const names = categoryDraft[type].filter((_, categoryIndex) => categoryIndex !== index);
    const colors = { ...categoryDraft.colors };
    delete colors[name];
    categoryDraft = { ...categoryDraft, [type]: names, colors };
  }
</script>

{#if isOpen}
  <div class="settings-page">
    <div class="settings-content" role="dialog" aria-modal="true" aria-label="Customize colors" tabindex="0" on:keydown={(event) => event.key === 'Escape' && onClose()}>
      <header class="settings-header">
        <div><p class="eyebrow">Personalize</p><h2>Customize appearance</h2></div>
        <button type="button" class="back-button" on:click={onClose}>Back to dashboard</button>
      </header>

      <main class="settings-body">
        <section>
          <p class="section-label">Theme presets</p>
          <div class="preset-row">
            {#each [['light', 'Light'], ['dark', 'Dark'], ['ocean', 'Ocean'], ['sunset', 'Sunset'], ['minimal-dark', 'Minimal dark'], ['forest', 'Forest']] as preset}
              <button type="button" class="preset-button" class:active={settings.background === preset[0]} on:click={() => applyPreset(preset[0] as ThemePresetName)}>{preset[1]}</button>
            {/each}
          </div>
        </section>

        <section class="color-grid">
          {#each [['accent', 'Accent'], ['income', 'Income'], ['expense', 'Expense'], ['background', 'Background'], ['panel', 'Panel'], ['text', 'Text']] as field}
            <label><span>{field[1]}</span><input type="color" value={draft[field[0] as keyof AppThemeSettings] as string} on:input={(event) => updateField(field[0] as keyof AppThemeSettings, event.currentTarget.value)} /></label>
          {/each}
        </section>

        <section class="category-settings">
          <p class="section-label">Categories</p>
          {#each ['income', 'expense'] as type}
            <div class="category-group">
              <h3>{type === 'income' ? 'Income categories' : 'Expense categories'}</h3>
              {#each categoryDraft[type] as category, index}
                <div class="category-row">
                  <input aria-label={`${type} category name`} value={category} on:input={(event) => updateCategory(type as 'income' | 'expense', index, event.currentTarget.value)} />
                  <input aria-label={`${category} category color`} type="color" value={getCategoryDisplayColor(category)} on:input={(event) => updateCategoryColor(category, event.currentTarget.value)} />
                  <button type="button" class="remove-category" disabled={categoryDraft[type].length <= 1} on:click={() => removeCategory(type as 'income' | 'expense', index)}>Remove</button>
                </div>
              {/each}
              <div class="add-category-row">
                <input aria-label={`New ${type} category name`} placeholder="New category" value={newCategoryNames[type as 'income' | 'expense']} on:input={(event) => newCategoryNames = { ...newCategoryNames, [type]: event.currentTarget.value }} on:keydown={(event) => event.key === 'Enter' && addCategory(type as 'income' | 'expense')} />
                <button type="button" class="add-category" on:click={() => addCategory(type as 'income' | 'expense')}>Add category</button>
              </div>
            </div>
          {/each}
        </section>
      </main>

      <footer class="settings-actions">
        <button type="button" class="secondary-button" on:click={onReset}>Reset theme</button>
        <button type="button" class="primary-button" on:click={save}>Apply changes</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .settings-page { position: fixed; inset: 0; overflow-y: auto; background: var(--bg, #f4f7fb); z-index: 40; }
  .settings-content { width: min(920px, 100%); min-height: 100vh; margin: 0 auto; display: flex; flex-direction: column; background: var(--panel-strong, #fff); color: var(--text, #0f172a); }
  .settings-header { position: sticky; top: 0; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border, rgba(148,163,184,.25)); background: var(--panel-strong, #fff); }
  .settings-body { flex: 1; display: grid; gap: 1.5rem; padding: 1.5rem; }
  .preset-row { display: flex; gap: .75rem; flex-wrap: wrap; }
  .preset-button, .back-button { border: 1px solid var(--border, rgba(148,163,184,.35)); border-radius: 8px; padding: .55rem .85rem; background: transparent; color: inherit; font-weight: 600; cursor: pointer; }
  .preset-button.active { background: var(--accent-soft, #eef2ff); border-color: var(--accent, #4f46e5); }
  .color-grid { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 1rem; }
  .color-grid label { display: grid; gap: .55rem; color: inherit; }
  .color-grid input[type='color'] { width: 100%; height: 48px; border: 1px solid var(--border); border-radius: 8px; padding: .25rem; background: transparent; }
  .category-settings { display: grid; gap: .75rem; border-top: 1px solid var(--border); padding-top: 1rem; }
  .category-group { display: grid; gap: .55rem; }
  .category-group h3 { margin: 0; font-size: .95rem; }
  .category-row { display: grid; grid-template-columns: minmax(0, 1fr) 48px auto; gap: .55rem; align-items: center; }
  .category-row input:not([type='color']) { min-width: 0; border: 1px solid var(--border); border-radius: 8px; padding: .55rem .65rem; background: transparent; color: inherit; }
  .category-row input[type='color'] { width: 48px; height: 36px; padding: .15rem; border: 1px solid var(--border); border-radius: 8px; }
  .remove-category, .add-category { border: 1px solid var(--border); border-radius: 8px; padding: .55rem .7rem; background: transparent; color: inherit; cursor: pointer; font-weight: 600; }
  .remove-category:disabled { opacity: .45; cursor: not-allowed; }
  .add-category-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .55rem; }
  .add-category-row input { min-width: 0; border: 1px solid var(--border); border-radius: 8px; padding: .55rem .65rem; background: transparent; color: inherit; }
  .settings-actions { display: flex; justify-content: flex-end; gap: .75rem; padding: 1rem 1.5rem 1.5rem; border-top: 1px solid var(--border); }
  h2 { margin: 0; font-size: 1.4rem; }
  .eyebrow { margin: 0 0 .15rem; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--accent, #4f46e5); font-weight: 700; }
  @media (min-width: 700px) { .settings-content { min-height: calc(100vh - 48px); margin: 24px auto; border: 1px solid var(--border); border-radius: 20px; box-shadow: var(--shadow); overflow: hidden; } }
  @media (max-width: 520px) { .settings-header { align-items: flex-start; flex-direction: column; } .color-grid { grid-template-columns: 1fr; } .category-row { grid-template-columns: minmax(0, 1fr) 48px; } .remove-category { grid-column: 1 / -1; } .add-category-row { grid-template-columns: 1fr; } .settings-actions { position: sticky; bottom: 0; background: var(--panel-strong, #fff); } }
</style>
