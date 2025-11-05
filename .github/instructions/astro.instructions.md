---
description: 'Astro component patterns for pages, layouts, and routing'
applyTo: '**/*.astro'
---

# Astro Component Instructions

## Astro Component Patterns

Astro is used for page routing, layouts, and static content. Svelte components handle interactivity.

### Component Structure

```astro
---
// Frontmatter: Server-side code (runs at build time)
import Layout from '../layouts/Layout.astro';
import Component from '../components/Component.svelte';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<Layout title={title}>
  <!-- HTML content -->
  <Component client:only="svelte" />
</Layout>
```

## Layouts

- Create reusable layout components in `src/layouts/`
- Use `<slot />` for content injection
- Include common elements: `<head>`, navigation, footer
- Import global styles in layouts

### Layout Example

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Pages

- Create pages in `src/pages/`
- File-based routing: `src/pages/about.astro` → `/about`
- Dynamic routes: `src/pages/game/[id].astro`

### Dynamic Routes

For dynamic routes, export `getStaticPaths()`:

```astro
---
export async function getStaticPaths() {
  const games = await fetchGames();
  
  return games.map(game => ({
    params: { id: game.id },
    props: { game }
  }));
}

const { game } = Astro.props;
---

<Layout title={game.title}>
  <!-- Game details -->
</Layout>
```

## Svelte Integration

Use client directives to control hydration:

- `client:only="svelte"` - Only runs on client (use for most interactive components)
- `client:load` - Hydrates immediately on page load
- `client:visible` - Hydrates when component becomes visible
- `client:idle` - Hydrates when browser is idle

### Example

```astro
---
import GameList from '../components/GameList.svelte';
---

<Layout>
  <GameList client:only="svelte" />
</Layout>
```

## TypeScript

- Use TypeScript for type-safe props
- Define `Props` interface in frontmatter
- Type component imports

## Best Practices

- Keep Astro components for static content and routing
- Use Svelte for interactivity and client-side state
- Minimize client-side JavaScript by using Astro's static rendering where possible
- Import and use global CSS styles from layouts
