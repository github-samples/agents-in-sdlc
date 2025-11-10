# Exercise 0: Prerequisites

Before you get started on the lab, there's a few tasks you need to complete to get everything ready. You need to get a copy of the repository which includes the code, then spin up a [codespace][codespaces] to use to create your code.

## Setting up the Lab Repository

To create a copy of the repository for the code you'll create an instance from the [template][template-repository]. The new instance will contain all of the necessary files for the lab, and you'll use it as you work through the exercises. 

1. In a new browser window, navigate to the GitHub repository for this lab: `https://github.com/github-samples/agents-in-sdlc`.
2. Create your own copy of the repository by selecting the **Use this template** button on the lab repository page. Then select **Create a new repository**.

    ![Use this template button](images/ex0-use-template.png)

3. If you are completing the workshop as part of an event being led by GitHub or Microsoft, follow the instructions provided by the mentors. Otherwise, you can create the new repository in an organization where you have access to Copilot coding agent and can assign issues to Copilot.

    ![Input the repository template settings](images/ex0-repository-settings.png)

4. Make a note of the repository path you created (**organization-or-user-name/repository-name**), as you will be referring to this later in the lab.

## Creating a codespace

Next up, you'll be using a codespace to complete the lab exercises. [GitHub Codespaces][codespaces] are a cloud-based development environment that allows you to write, run, and debug code directly in your browser. It provides a fully-featured IDE with support for multiple programming languages, extensions, and tools.

1. Navigate to your newly created repository.
2. Select the green **Code** button.

    ![Select the Code button](images/ex0-code-button.png)

3. Select the **Codespaces** tab and select the **+** button to create a new Codespace.

    ![Create a new codespace](images/ex0-create-codespace.png)

The creation of the codespace will take several minutes, although it's still far quicker than having to manually install all the services! That said, you can use this time to explore other features of GitHub Copilot, which we'll turn your attention to next!

> [!IMPORTANT]
> You'll return to the codespace in a future exercise. For the time being, leave it open in a tab in your browser.

## Summary

Congratulations, you have created a copy of the lab repository! You also began the creation process of your codespace, which you'll use when you begin writing code.

## Next step

Let's explore how you can use Model Context Protocol (MCP) to interact with external services! You can do this by [setting up the backlog with Copilot agent mode and GitHub's MCP Server](./1-mcp.md).

[codespaces]: https://github.com/features/codespaces
[template-repository]: https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-template-repository
