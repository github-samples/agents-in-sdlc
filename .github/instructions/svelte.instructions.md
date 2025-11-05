---
description: 'Svelte 5 component development with runes-based reactivity'
applyTo: '**/*.svelte'
---

# Svelte 5 Component Instructions

## Svelte 5 Runes Syntax

All Svelte components MUST use Svelte 5 runes-based reactivity patterns:

### State Management

- Use `$state()` for reactive state: `let count = $state(0);`
- Use `$derived()` for computed values: `let doubled = $derived(count * 2);`
- Use `$effect()` for side effects (DOM manipulation, subscriptions)
- Never use legacy Svelte 4 patterns (`export let`, `$:`, `on:click`)

### Props

- Use `$props()` with destructuring: `let { title, description } = $props();`
- Add TypeScript types to props: `let { title }: { title: string } = $props();`
- Use `$bindable()` for two-way binding: `let { value = $bindable() } = $props();`

### Events

- Use event attributes (not directives): `onclick={handler}` not `on:click={handler}`
- Arrow functions for inline handlers: `onclick={() => count++}`

### Snippets (not slots)

- Use `{@render children?.()}` instead of `<slot />`
- For named snippets, use snippet syntax

## Component Structure

```svelte
<script>
  // Props with types
  let { prop1, prop2 }: { prop1: string; prop2: number } = $props();
  
  // State
  let localState = $state(initialValue);
  
  // Derived values
  let computed = $derived(localState * 2);
  
  // Effects for side effects only
  $effect(() => {
    // Side effect logic
  });
</script>

<!-- Template with event attributes -->
<div onclick={handler}>
  {computed}
</div>
```

## Testing Requirements

- Every interactive element MUST have a `data-testid` attribute
- Use descriptive test IDs: `data-testid="game-card-{game.id}"`, `data-testid="submit-button"`

## Component Integration

- Use `client:only="svelte"` directive in Astro pages when including Svelte components
- Import components normally: `import Component from './Component.svelte';`
