---
applyTo: '**/*.svelte,**/*.astro,**/*.css'
---

# UI Development Guidelines

## Svelte Component Structure

- Define TypeScript interfaces for all data structures at top of `<script lang="ts">` block
- Export component props with proper types: `export let games: Game[] = []`
- Use state variables for `loading`, `error`, and data with appropriate types
- Implement proper error handling with try-catch in async functions
- Use `onMount` for data fetching operations

## Async/Data Fetching Patterns

- Create named async functions (e.g., `fetchGames`) for API calls
- Set loading state before fetch, update in finally block
- Check `response.ok` before parsing JSON
- Store error messages with context: `Failed to fetch: ${response.status}`
- Handle both network errors and HTTP errors

## Template Rendering

- Use Svelte conditionals: `{#if loading}...{:else if error}...{:else}...{/if}`
- Always provide loading, error, and empty state UIs
- Use keyed `{#each}` blocks: `{#each items as item (item.id)}`
- Add `data-testid` attributes for testing: `data-testid="game-card"`

## Styling Standards

- Use Tailwind CSS utility classes exclusively
- Dark mode theme: slate-800/900 backgrounds, slate-100/300 text
- Rounded corners: `rounded-xl` for cards, `rounded` for buttons
- Backdrop blur for depth: `backdrop-blur-sm` on card backgrounds
- Hover effects: border color changes, translations, shadow animations
- Loading skeletons: `animate-pulse` with slate-700 backgrounds

## Accessibility & UX

- Use semantic HTML elements (`<a>`, `<button>`, `<h1>-<h6>`)
- Provide meaningful text alternatives for states
- Add transition effects: `transition-all duration-300`
- Use proper heading hierarchy
- Support keyboard navigation

## Astro Page Patterns

- Import layouts and components at frontmatter top
- Use `client:only="svelte"` for interactive Svelte components
- Keep Astro pages focused on layout and static content
- Import global styles when needed: `import "../styles/global.css"`
