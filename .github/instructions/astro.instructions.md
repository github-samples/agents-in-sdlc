---
description: 'Astro + Starlight site wrapper conventions'
applyTo: 'website/**/*.{astro,mjs,ts,js}'
---

# Astro + Starlight Wrapper

`website/` is the Astro + Starlight project that publishes the workshop to GitHub Pages. It is **not** an application; it is a thin site shell. Lesson content lives in the repo-root `docs/` directory (sourced via the loader's `base: '../docs'`) — author there, not in the project files under `website/`.

## Site config

- Base path: `/copilot-workshops` (the repo's GitHub Pages slug).
- Site URL: `https://github-samples.github.io/copilot-workshops/`.
- **Sidebar: manually maintained** in `astro.config.mjs`. The `sidebar` array drives both the order learners see and which pages appear in navigation. New lessons must be added explicitly.
- **Content collection** is sourced from the repo-root `docs/` directory via the custom `glob()` loader in `src/content.config.ts` (`base: '../docs'`). That loader excludes underscore-prefixed files and directories so support assets such as `_images/` don't get routed as pages. Folder landing pages are `README.md` files (so they render on github.com) rather than Starlight's default `index.md`; each carries a `slug:` in its frontmatter to reproduce the route it would otherwise get from an index file — `docs/README.md` → `slug: index` (site home `/`), `docs/<harness>/README.md` → `slug: <harness>`, and localized landings use the locale-prefixed slug (`docs/<locale>/README.md` → `slug: <locale>`, `docs/<locale>/<harness>/README.md` → `slug: <locale>/<harness>`).

## Don't add app-style components

This is a docs wrapper. Don't add interactive framework islands (Svelte, React, etc.), Tailwind utility-class styling layers, custom routing, or other application-style code. Anything beyond Starlight defaults should be justified.

## Building and verifying

After changing `astro.config.mjs` or anything under `website/src/`, build and verify the site with the [`build-and-verify-docs`](../skills/build-and-verify-docs/SKILL.md) skill. Its page-count invariant is the tripwire for unexpected routed pages: Starlight emits each of the 37 workshop routes for the root language and five configured locales, then adds the legacy redirect, for 223 built `index.html` pages excluding the 404 page. If the count changes without a corresponding route or locale change, check the locale layout under `docs/` and the underscore-directory exclude in `src/content.config.ts`.
