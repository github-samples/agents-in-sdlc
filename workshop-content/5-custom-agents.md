# Exercise 5 - Custom agents

| [← Previous lesson: GitHub Copilot coding agent][previous-lesson] | [Next lesson: Managing agents →][next-lesson] |
|:--|--:|

[Custom agents][custom-agents] in GitHub Copilot allow you to create specialized AI assistants tailored to specific tasks or domains within your development workflow. By defining agents through markdown files in the `.github/agents` folder of your repository, you can provide Copilot with focused instructions, best practices, coding patterns, and domain-specific knowledge that guide it to perform particular types of work more effectively. This allows teams to codify their expertise and standards into reusable agents. You might create an accessibility agent that ensures [WCAG][wcag] compliance, a security agent that follows secure coding practices, or a testing agent that maintains consistent test patterns—enabling developers to leverage these specialized capabilities on-demand for faster, more consistent implementations.

You'll explore the following with custom agents:

- how to create a custom agent.
- assigning a task to a custom agent.

## Scenario

Tailspin Toys is committed to ensuring their crowdfunding platform is accessible to all users, regardless of their visual abilities or preferences. Recent user feedback has highlighted that some users find the current dark theme difficult to read due to insufficient contrast between text and background colors. To address this accessibility concern, the design team has requested the implementation of a high-contrast mode that users can toggle on and off.

Because accessibility is critical, you want to ensure this is implemented as quickly as possible. You're going to utilize a custom agent to generate the functionality.

## Custom agents

Custom agents are defined by markdown files in the **.github/agents** folder of your project. The markdown files will contain guidance for Copilot on how best to perform at task.

## Reviewing the accessibility custom agent

A custom agent has already been created for you for accessibility. Let's review the contents to understand how it will guide Copilot.

1. Return to your codespace.
2. Open **.github/agents/accessibility.md**.
3. Note the header section with the name and description of the agent.

> [!IMPORTANT]
> This section is required for custom agents.

4. From there, scan and review the next sections which highlight:
    - Core responsibilities when generating code for an accessible website.
    - Best practices for accessibility.
    - Code examples for HTML, CSS and JavaScript.
    - A list of common pitfalls and mistakes.

> [!NOTE]
> There is no "best markdown" for a custom agent. As with anything in AI, you will want to test and explore to determine what works best for your environments and scenarios.

## Create and assign an issue

Mission control is the central location for working with all agents for your environment. You can assign tasks to Copilot coding agent, monitor tasks, and even redirect and provide additional guidance. Let's start by assigning a task to create the high contrast mode to Copilot.

1. Navigate to your repository.
2. Select the issues tab.
3. Select **New issue** to open the new issue dialog.
4. Select **Blank issue** to create the new issue.
5. Set the **Title** to `Add high contrast mode to website`.
6. Set the **Description** to:
   
    ```plaintext
    We need a high contrast mode for the site. There should be a toggle for high contrast which the user can set. It should store the setting in local storage on the browser.
    ```

7. Select **Create** to create the issue.
8. On the right side, select **Assign to Copilot** to open the assignment dialog.
9.  Select **Accessibility agent** from the list of custom agents.

  ![Screenshot of coding agent assignment, with custom agent and accessibility highlighted](./images/ex5-select-custom-agent.png)

10. Select **Assign**.
11. Copilot gets to work on the task in the background!

## Summary and next steps

This lesson explored [custom agents][custom-agents] in GitHub Copilot, specialized AI assistants tailored to specific tasks and domains. With custom agents you can codify your team's expertise and standards into reusable agents that guide Copilot to perform particular types of work more effectively.

You explored these concepts:

- how to create a custom agent.
- assigning a task to a custom agent.

With Copilot working on implementing the high contrast mode, we can now turn our attention to our next lesson, [using Copilot HQ to monitor and guide agent sessions][next-lesson]. Custom agents help ensure that Copilot follows your organization's best practices and domain-specific requirements, enabling faster and more consistent implementations across your team.

## Resources

- [Custom agents][custom-agents]
- [Preparing to use custom agents in your organization][org-custom-agents]
- [Preparing to use custom agents in your enterprise][enterprise-custom-agents]

---

| [← Previous lesson: GitHub Copilot coding agent][previous-lesson] | [Next lesson: Managing agents →][next-lesson] |
|:--|--:|

[custom-agents]: https://docs.github.com/copilot/concepts/agents/coding-agent/about-custom-agents
[wcag]: https://www.w3.org/WAI/standards-guidelines/wcag/
[org-custom-agents]: https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents
[enterprise-custom-agents]: https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents
[next-lesson]: ./6-managing-agents.md
[previous-lesson]: ./4-copilot-coding-agent.md
