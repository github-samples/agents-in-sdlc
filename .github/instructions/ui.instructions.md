---
description: 'Instructions for code generation for UI components'
applyTo: '**/*.svelte,**/*.astro,**/*.css'
---

# UI Development Guidelines

## Svelte patterns

- Keep components small, focused on reusability and readability

```typescript
<script lang="ts">
  import { onMount } from "svelte";
  
  interface Item { id: number; name: string; }
  export let items: Item[] = [];
  let loading = true;
  let error: string | null = null;
  
  const fetchData = async () => {
    loading = true;
    try {
      const res = await fetch('/api/endpoint');
      if (res.ok) items = await res.json();
      else error = `Failed: ${res.status} ${res.statusText}`;
    } catch (err) {
      error = `Error: ${err instanceof Error ? err.message : String(err)}`;
    } finally { loading = false; }  // ALWAYS
  };
  
  onMount(() => { fetchData(); });
</script>

{#if loading}
  <div class="animate-pulse bg-slate-700 rounded h-6"></div>
{:else if error}
  <div class="text-red-400">{error}</div>
{:else if items.length === 0}
  <p class="text-slate-300">No items found</p>
{:else}
  {#each items as item (item.id)}
    <div data-testid="item-card">...</div>
  {/each}
{/if}
```

## Testability (NEVER SKIP)

- All new functionality requires new end to end Playwright tests
- Follow [Playwright testing guidelines](./playwright.instructions.md)
- Ensure attributes are discoverable in Playwright tests
- Explore existing tests and IDs, and follow existing discovery patterns

**MUST add `data-testid` to:**
- Interactive: buttons, links, inputs
- Containers: grids, lists, cards
- Assertions: titles, descriptions, status

```svelte
✅ <div data-testid="games-grid">
     <a data-testid="game-card" data-game-id={id}>
       <h3 data-testid="game-title">{title}</h3>
     </a>
   </div>

❌ <div><a><h3>{title}</h3></a></div>
```

## Styling (Tailwind - Dark)

- BG: `bg-slate-800/60 bg-slate-900`
- Text: `text-slate-100` (primary), `text-slate-300/400` (secondary)
- Cards: `rounded-xl shadow-lg backdrop-blur-sm`
- Hover: `hover:translate-y-[-6px] transition-all duration-300`
- Loading: `animate-pulse bg-slate-700`

## Accessibility

- Semantic: `<button>`, `<a>`, `<h1-h6>`, `<nav>`, `<main>`
- Heading hierarchy: One `<h1>`, then `<h2>`, `<h3>`
- Keyboard: All interactive = focusable
