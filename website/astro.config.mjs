// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkGithubAdmonitionsToDirectives from 'remark-github-admonitions-to-directives';

// Lesson callouts are authored in GitHub admonition syntax (`> [!NOTE]`). This
// remark plugin rewrites them into Starlight aside directives before Starlight
// renders them, so the same syntax used in the repo's READMEs and on github.com
// also produces styled callouts on the published site. The mapping targets
// Starlight's aside types (note / tip / caution / danger).
const githubAdmonitionMapping = {
  NOTE: 'note',
  TIP: 'tip',
  IMPORTANT: 'note',
  WARNING: 'caution',
  CAUTION: 'caution',
};

// https://astro.build/config
export default defineConfig({
  site: 'https://github-samples.github.io',
  base: '/copilot-workshops',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [
      [remarkGithubAdmonitionsToDirectives, { mapping: githubAdmonitionMapping }],
    ],
  },
  integrations: [
    starlight({
      title: 'Copilot Workshops',
      description:
        'A hands-on workshop exploring GitHub Copilot agents across VS Code, the Copilot CLI, the GitHub Copilot app, and the Copilot cloud agent.',
      locales: {
        root: { label: 'English', lang: 'en' },
        'es-es': { label: 'Español', lang: 'es-ES' },
        'ja-jp': { label: '日本語', lang: 'ja-JP' },
        'ko-kr': { label: '한국어', lang: 'ko-KR' },
        'pt-br': { label: 'Português (Brasil)', lang: 'pt-BR' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/github-samples/copilot-workshops',
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/github-samples/copilot-workshops/edit/main/docs/',
      },
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'VS Code',
          items: [
            { label: 'Overview', link: '/vscode/' },
            { label: '0. Prerequisites', link: '/vscode/0-prerequisites/' },
            { label: '1. Custom instructions', link: '/vscode/1-custom-instructions/' },
            { label: '2. Agent mode', link: '/vscode/2-agent-mode/' },
            { label: '3. Testing with Playwright MCP', link: '/vscode/3-mcp/' },
            { label: '4. Custom agents', link: '/vscode/4-custom-agents/' },
            { label: '5. Managing agents', link: '/vscode/5-managing-agents/' },
            { label: '6. Iterating', link: '/vscode/6-iterating/' },
          ],
        },
        {
          label: 'Copilot CLI',
          items: [
            { label: 'Overview', link: '/cli/' },
            { label: '0. Prerequisites', link: '/cli/0-prerequisites/' },
            { label: '1. Install Copilot CLI', link: '/cli/1-install-copilot-cli/' },
            { label: '2. Custom instructions', link: '/cli/2-custom-instructions/' },
            { label: '3. Generating code', link: '/cli/3-generating-code/' },
            { label: '4. Testing with Playwright MCP', link: '/cli/4-mcp/' },
            { label: '5. Agent skills', link: '/cli/5-agent-skills/' },
            { label: '6. Custom agents', link: '/cli/6-custom-agents/' },
            { label: '7. Slash commands', link: '/cli/7-slash-commands/' },
            { label: 'Optional: Microsoft Foundry', link: '/cli/8-foundry-agent/' },
            { label: '9. Review', link: '/cli/9-review/' },
          ],
        },
        {
          label: 'Copilot App',
          items: [
            { label: 'Overview', link: '/app/' },
            { label: '0. Prerequisites', link: '/app/0-prerequisites/' },
            { label: '1. Install the Copilot app', link: '/app/1-install-copilot-app/' },
            { label: '2. Running your first agent session', link: '/app/2-add-star-rating/' },
            { label: '3. Guiding Copilot with custom instructions', link: '/app/3-custom-instructions/' },
            { label: '4. Building a feature with Autopilot', link: '/app/4-build-filtering/' },
            { label: '5. Testing with Playwright MCP', link: '/app/5-mcp-playwright/' },
            { label: '6. Merging with Agent Merge', link: '/app/6-agent-merge/' },
            { label: '7. Planning with canvases', link: '/app/7-canvases/' },
            { label: '8. Review', link: '/app/8-review/' },
          ],
        },
        {
          label: 'Copilot Cloud Agent',
          items: [
            { label: 'Overview', link: '/cloud/' },
            { label: '0. Prerequisites', link: '/cloud/0-prerequisites/' },
            { label: '1. Custom instructions', link: '/cloud/1-custom-instructions/' },
            { label: '2. Cloud agent', link: '/cloud/2-cloud-agent/' },
            { label: '3. Custom agents', link: '/cloud/3-custom-agents/' },
            { label: '4. Managing agents', link: '/cloud/4-managing-agents/' },
            { label: '5. Iterating', link: '/cloud/5-iterating/' },
          ],
        },
      ],
    }),
  ],
});
