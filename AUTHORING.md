# Authoring Guide

This is the entry point for **content authors and maintainers** of **Copilot Workshops**. If you arrived here looking to *take* the workshop, head to the published site at <https://github-samples.github.io/copilot-workshops/>.

## Project overview model

- **All lesson content is plain Markdown** under the repo-root `docs/` directory. That's the source of truth, and it's browsable directly on github.com with no build required.
- **Optional publisher.** The Astro + Starlight site in `website/` builds the published GitHub Pages site from those Markdown files (loader `base: '../docs'`). You only need it to self-host or preview the rendered pages.
- **Reusable prose is copied inline.** There is no import-based shared content system; keep duplicated lesson sections aligned with the content-alignment safety nets described below.

```
copilot-workshops/
├── docs/                        ← Markdown source. EDIT HERE. Browsable on github.com.
│   ├── README.md                ← Workshop landing page (also site home via slug: index)
│   ├── cli/                     ← Copilot CLI lessons (0-prerequisites.md + numbered exercises)
│   ├── vscode/                  ← VS Code lessons (0-prerequisites.md + numbered exercises)
│   ├── cloud/                   ← Cloud agent lessons (0-prerequisites.md + numbered exercises)
│   ├── app/                     ← GitHub Copilot app lessons (setup folded into Exercise 1)
│   ├── es-es/ ja-jp/ ...        ← Translated locale trees (currently the app harness)
│   └── _images/                 ← Screenshots and diagrams (shared across locales)
├── website/                     ← Optional Astro + Starlight publisher
│   ├── astro.config.mjs         ← Site URL, base path, locales, sidebar
│   └── src/content.config.ts    ← Content loader (base: '../docs')
└── .github/
    ├── copilot-instructions.md   ← AI authoring guide (humans can read it too)
    ├── instructions/             ← Per-file-type conventions (auto-applied to Copilot)
    └── workflows/                ← CI for site build + Pages deploy, plus content-alignment workflow
```

## Step-by-step recipes

### Add a new lesson

1. **Pick a path and number.** Lessons live under `docs/{cli,vscode,app,cloud}/N-name.md`. `N` is the next available integer in that path; the number drives the URL slug (`/cli/3-generating-code/`).
2. **Create the file** with frontmatter:
   ```markdown
   ---
   title: "Exercise N - Short descriptive title"
   ---

   Body starts here.
   ```
   Only `title` is required; it becomes the H1 and the page title. Don't add a body H1 — Starlight renders the title automatically.
3. **Write the body.** Use Markdown and GitHub admonition syntax (`> [!NOTE]`) for callouts. See **Style essentials** below.
4. **Add prev/next navigation.** Define `[previous-lesson]` and `[next-lesson]` reference links at the bottom of the page, pointing at the adjacent lessons in the same path:
   ```markdown
   [previous-lesson]: ../2-custom-instructions/
   [next-lesson]: ../4-mcp/
   ```
   Then surface them in the body using **the same style as the other lessons in your path** — don't mix styles within a path:
   - **Woven into prose** (common in the CLI path): end the lesson with a sentence like ``the next step is to [create the PR][next-lesson]``.
   - **Explicit nav table** (common in the cloud and VS Code paths): a single-cell table just below the frontmatter and again at the end of the body.
     ```markdown
     | [← Previous lesson: Custom instructions][previous-lesson] |
     |:--|
     ```
     ```markdown
     | [Next lesson: Custom agents →][next-lesson] |
     |--:|
     ```
   The first lesson in a path omits `[previous-lesson]`; the last omits `[next-lesson]`.
5. **Register in the sidebar.** Open `website/astro.config.mjs` and add an entry to the appropriate `items: []` block. The sidebar is *manually* maintained — order in the file is the order learners see.
6. **Preview and verify, then open a PR.** Preview locally and run the verification sequence before committing — see [Building and verifying](#building-and-verifying) below. CI runs the Astro build and the lychee link check; both must pass.

### Landing pages (folder `README.md`)

Every folder's landing page is a `README.md` so it renders directly when someone browses that folder on github.com. Because Starlight normally derives a folder's index route from an `index.md`, each landing carries an explicit `slug:` in its frontmatter that reproduces the route:

- `docs/README.md` → `slug: index` (site home `/`).
- `docs/<harness>/README.md` → `slug: <harness>` (e.g. `slug: app` → `/app/`).
- `docs/<locale>/README.md` → `slug: <locale>` (e.g. `slug: es-es` → `/es-es/`).
- `docs/<locale>/<harness>/README.md` → `slug: <locale>/<harness>` (e.g. `slug: es-es/app` → `/es-es/app/`).

When you add a new harness or locale landing, name it `README.md` and set its `slug:` to match the folder path. Localized landings must use the locale-prefixed slug, never the English one.

### Add an image

1. **Drop the file** in `docs/_images/` (or a path-scoped `cli/_images/` etc. when the image is path-specific). Use lowercase-with-hyphens filenames; prefix with `shared-` if the image is referenced from multiple harnesses.
2. **Reference it** with a relative path from the consuming Markdown page:
   ```markdown
   ![Description of the screenshot](../_images/my-screenshot.png)
   ```
3. **Always include alt text.** Starlight treats the alt text as required.
4. **Preview locally** to confirm the image resolves.

### Edit an existing lesson

1. **Find the file** under `docs/` (use the published URL as a hint — `/cli/3-generating-code/` lives at `docs/cli/3-generating-code.md`).
2. **Edit the Markdown.** Same conventions apply — see **Style essentials** below.
3. **Preview** with `npm run dev` in `website/`.
4. **Commit, PR, merge.**

### Reuse prose across paths

When the same lesson text applies to multiple harnesses (CLI, VS Code, Cloud), copy the prose inline into each consuming `.md` lesson. There is intentionally no single-source import layer: each lesson should be readable and editable as standalone Markdown.

Because copied prose can drift, run the `check-content-alignment` skill when you change a duplicated section so it can scan the diff for related content that needs the same update. The `.github/workflows/content-alignment.md` agentic workflow runs the same analysis on PRs as an additional safety net, but authors still own keeping aligned copies consistent.

## Building and verifying

Before opening a PR, preview the site and run the full verification sequence. The canonical commands live in the [`build-and-verify-docs`](./.github/skills/build-and-verify-docs/SKILL.md) skill — the summary below mirrors it.

**Preview** with the Astro dev server (hot reload):

```bash
cd website
npm install
npm run dev
```

The site runs at <http://localhost:4321/copilot-workshops/>.

**Verify** before committing:

1. **Build** — `cd website && rm -rf dist && npm run build`. Must succeed.
2. **Page-count invariant** — Starlight emits 37 workshop routes for English and each of the five configured locales, then adds the legacy redirect. This equals 223 built `index.html` pages when excluding the 404 page; the build reports 224 HTML files including the 404 page.
3. **Link check** — lychee (offline) against the built `website/dist/`. Catches broken internal links/images.

**What CI enforces vs. what you run locally:** CI (`pages.yml`) runs the **build** and the **lychee** link check on every PR. It does not run browser validation or the content-alignment agentic workflow as part of the Pages build job. After merge to `main`, `pages.yml` deploys the site to GitHub Pages.

**Consistency pass.** When a change renames a file or folder, adds or removes a skill or instruction file, touches duplicated prose, or changes how the build works, also sweep for stale references — the structure trees and cross-doc pointers in `README.md`, `AUTHORING.md`, and `.github/copilot-instructions.md` aren't checked by the Astro build. The [`build-and-verify-docs`](./.github/skills/build-and-verify-docs/SKILL.md) skill has the full checklist, and the `check-content-alignment` skill plus `.github/workflows/content-alignment.md` help catch prose that needs aligned updates.

## Style essentials

A short cheat sheet. For deeper conventions, see [`.github/instructions/`](./.github/instructions/).

- **Reference-style links** for in-workshop pages and external docs. Define refs at the bottom of the page:
  ```markdown
  See [Exercise 1][exercise-1] for context. The [Copilot CLI docs][cli-docs] explain.

  [exercise-1]: ../1-install-copilot-cli/
  [cli-docs]: https://docs.github.com/copilot/github-copilot-in-the-cli
  ```
- **Admonitions everywhere use GitHub syntax** — published lessons *and* repo docs. The `[!TYPE]` marker goes on its own quoted line, body on following quoted lines:
  ```markdown
  > [!NOTE]
  > Use NOTE, TIP, IMPORTANT, WARNING, or CAUTION.
  ```
  In published lessons under `docs/`, a remark plugin (wired in `website/astro.config.mjs`) converts these to Starlight asides at build time. GitHub syntax has no custom-title or nesting form, so put a heading on a **bold lead-in line** (`> **Title**`, then a blank `>` line, then the body), and emit "nested" callouts as sibling blockquotes separated by a blank line. See [`markdown.instructions.md`](.github/instructions/markdown.instructions.md) for the full mapping and patterns.
- **No hard-wrapping** in repo-level Markdown files (READMEs, this file). Editors soft-wrap. Hard breaks are reserved for actual structural breaks.
- **Cross-repo links** (the demo app): always use `https://github.com/github-samples/tailspin-toys/...`. Don't link to files in *this* repo as if they were the template.

## Troubleshooting

- **"Module not found: `@astrojs/starlight/components`"** — run `npm install` inside `website/` if the site shell imports a Starlight component.
- **Sidebar entry doesn't appear** — confirm you added it to `website/astro.config.mjs` (it's manually maintained).
- **A new page appears in build output unexpectedly** — confirm the file belongs in the content collection and that underscore-prefixed support directories such as `_images/` are still excluded by `website/src/content.config.ts`.
- **Lychee reports a broken link** — most often a renamed lesson breaking a `[ref]: ../old-name/` definition. Update both the link target and any cross-page refs.

## Deeper conventions

The `.github/instructions/*.md` files have `applyTo` frontmatter that targets specific file globs. Read these when you need depth on a specific area:

- [`markdown.instructions.md`](./.github/instructions/markdown.instructions.md) — Markdown conventions: no hard-wrap, admonitions, headings, filenames/UI formatting, and link style.
- [`markdown-accessibility.instructions.md`](./.github/instructions/markdown-accessibility.instructions.md) — accessibility conventions: descriptive links, alt text, heading hierarchy, plain language, input-agnostic action verbs (**select** not "click").
- [`astro.instructions.md`](./.github/instructions/astro.instructions.md) — `website/` site wrapper.
- [`instructions.instructions.md`](./.github/instructions/instructions.instructions.md) — how to write and maintain the instruction files themselves.

Reusable task playbooks (build/verify, browser validation, contribution flow, content alignment) live as **skills** under `.github/skills/` — see the [skills index](./.github/skills/README.md) for what each one does and when to use it.

For the AI authoring playbook, see [`.github/copilot-instructions.md`](./.github/copilot-instructions.md).
