## Summary

<!-- One- to two-sentence description of what this PR changes and why. -->

## Type of change

<!-- Check all that apply. -->

- [ ] Workshop content (lesson Markdown, images)
- [ ] Site shell (`website/` Astro + Starlight wrapper)
- [ ] Copilot configuration (`.github/copilot-instructions.md`, instructions, agents, skills)
- [ ] Repo housekeeping (CI, dependabot, README, license)
- [ ] Other:

## Verification

<!-- Confirm the build + link checks pass before requesting review. -->

- [ ] `cd website && rm -rf dist && npm run build` succeeds (target: 37 routes × 6 locales + 1 redirect = 223 built pages excluding 404; build reports 224 HTML files including 404, or note any intentional change)
- [ ] Lychee link check passes:
      `mkdir -p /tmp/lychee-root && ln -sfn $PWD/website/dist /tmp/lychee-root/copilot-workshops && lychee --offline --no-progress --root-dir /tmp/lychee-root 'website/dist/**/*.html'`
- [ ] External GitHub URLs that I changed have been clicked manually (lychee runs offline)

## Screenshots

<!-- For visual changes only. Otherwise delete this section. -->

## Notes for reviewers

<!-- Anything reviewers should know: areas of uncertainty, follow-ups intentionally deferred, etc. -->
