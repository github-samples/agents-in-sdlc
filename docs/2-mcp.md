# Exercise 1 - Setting up the backlog with Copilot Agent Mode and GitHub's MCP Server

| [← Previous lesson: GitHub Copilot coding agent][previous-lesson] | [Next lesson: Custom instructions →][next-lesson] |
|:--|--:|

There's more to writing code than just writing code. Issues need to be filed, external services need to be called, and information needs to be gathered. Typically this involves interacting with external tools, which can break a developer's flow. Through the power of Model Context Protocol (MCP), you can access all of this functionality right from Copilot!

## Scenario

You are a part-time developer for Tailspin Toys - a crowdfunding platform for board games with a developer theme. You've been assigned various tasks to introduce new functionality to the website. Being a good team member, you want to file issues to track your work. To help future you, you've decided to enlist the help of Copilot. You will set up your backlog of work for the rest of the lab, using GitHub Copilot Chat Agent Mode and the GitHub Model Context Protocol (MCP) server to create the issues for you. 

To achieve this, you will:

- use Model Context Protocol (MCP), which provides access to external tools and capabilities.
- set up the GitHub MCP server in your repository.
- use GitHub Copilot Chat agent mode to create issues in your repository.

By the end of this exercise, you will have created a backlog of GitHub issues for use throughout the remainder of the lab.

## What is agent mode and Model Context Protocol (MCP)?

Agent mode in GitHub Copilot Chat transforms Copilot into an AI agent that can perform actions on your behalf. This mode allows you to interact with Copilot in a more dynamic way, enabling it to use tools and execute tasks, like running tests or terminal commands, reading problems from the editor, and using those insights to update your code. This allows for a more interactive and collaborative workflow, enabling you to leverage the capabilities of AI in your development process.

[Model Context Protocol (MCP)][mcp-blog-post] provides AI agents with a way to communicate with external tools and services. By using MCP, AI agents can communicate with external tools and services in real-time. This allows them to access up-to-date information (using resources) and perform actions on your behalf (using tools).

These tools and resources are accessed through an MCP server, which acts as a bridge between the AI agent and the external tools and services. The MCP server is responsible for managing the communication between the AI agent and the external tools (such as existing APIs or local tools like NPM packages). Each MCP server represents a different set of tools and resources that the AI agent can access.

![Diagram showing the inner works of agent mode and how it interacts with context, LLM and tools - including tools contributed by MCP servers and VS Code extensions](images/mcp-diagram.png)

Popular existing MCP servers include:

- **[GitHub MCP Server][github-mcp-server]**: This server provides access to a set of APIs for managing your GitHub repositories. It allows the AI agent to perform actions such as creating new repositories, updating existing ones, and managing issues and pull requests.
- **[Playwright MCP Server][playwright-mcp-server]**: This server provides browser automation capabilities using Playwright. It allows the AI agent to perform actions such as navigating to web pages, filling out forms, and clicking buttons.
- **Additional reference servers**: There are many other MCP servers available that provide access to different tools and resources. Anthropic [has a list][anthropic-mcp-servers] of reference implementations, third-party implementations, and community implementations of MCP servers. 

> [!IMPORTANT]
> MCP servers are like any other dependency in your project. Before using an MCP server, carefully review its source code, verify the publisher, and consider the security implications. Only use MCP servers that you trust and be cautious about granting access to sensitive resources or operations.

## Ensure your codespace is ready

In a [prior exercise][prereqs-lesson] you launched the codespace you'll use for the remainder of the coding exercises in this lab. Let's put the final touches on it before we begin using it.

The setup process for the codespace installed and setup many [VS Code extensions][vscode-extensions]. As with any software, updates may be needed. When your codespace is created we'll need to ensure everything is up-to-date.

1. Select **Extensions** on the workbench on the left side of your codespace.

    ![Screenshot of the extensions window with multiple extensions showing either Update or Reload Window buttons](images/extensions-updates.png)

2. Select **Update** on any extensions with an **Update** button. Repeat as necessary.
3. Select **Reload Window** on any extensions with a **Reload Window** button to reload the codespace.
4. When prompted by a dialog, select **Reload** to reload the window. This will ensure the latest version is being used.

## Using GitHub Copilot Chat and agent mode

To access GitHub Copilot Chat agent mode, you need to have the GitHub Copilot Chat extension installed in your IDE, which should already be the case if you are using a GitHub Codespace.

> [!TIP]
> If you do not have the GitHub Copilot Chat extension installed, you can [install it from the Visual Studio Code Marketplace][copilot-chat-extension]. Or open the Extensions view in Visual Studio Code, search for **GitHub Copilot Chat**, and select **Install**.

Once you have the extension installed, you may need to authenticate with your GitHub account to enable it.

1. Select the **Copilot Chat** icon at the top of your Visual Studio Code window.
2. Type a message like "Hello there" in the Copilot Chat window and press enter. This should activate Copilot Chat.

    ![Example of Copilot Chat activation](images/copilot-chat-activation.png)

3. Alternatively, if you are not authenticated you will be prompted to sign in to your GitHub account. Follow the instructions to authenticate.

    ![Example of Copilot Chat authentication prompt](images/copilot-authentication.png)

4. After authentication, you should see the Copilot Chat window appear.

    ![Example of Copilot Chat window](images/copilot-chat-window.png)

5. Switch to agent mode by selecting the dropdown in the Copilot Chat window and selecting **Agent**.

    ![Example of switching to agent mode](images/copilot-agent-mode-dropdown.png)

6. Set the model to **Claude 3.5 Sonnet**.

    ![Example of selecting the Claude 3.5 Sonnet model](images/copilot-agent-mode-model.png)

> [!IMPORTANT]
> The authors of this lab are not indicating a preference towards one model or another. When building this lab, we used Claude 3.5, and as such are including that in the instructions. The hope is the code suggestions you receive will be relatively consistent to ensure a good experience. However, because LLMs are probabilistic, you may notice the suggestions received differ from what is indicated in the lab. This is perfectly normal and expected.

1. The chat pane should update to indicate that you are now in agent mode. You should see a tools icon, showing that we can configure tools for GitHub Copilot to use.

    ![Example of Copilot Chat agent mode with tools icon](images/copilot-agent-mode.png)

Typically, the number of tools available will be set to 0 when setting up a new project, as we have not configured any MCP servers yet. But to help you get started, we have created a **.vscode/mcp.json** file with an example configuration for the [GitHub MCP server][github-mcp-server]. Let's go and explore that next.

## Setting up the GitHub MCP server

The **.vscode/mcp.json** file is used to configure the MCP servers that are available in this Visual Studio Code workspace. The MCP servers provide access to external tools and resources that GitHub Copilot can use to perform actions on your behalf.

1. Open **.vscode/mcp.json** file in your repository.
2. You should see a JSON structure similar to the following:

    ```json
    {
        "inputs": [
            {
                "type": "promptString",
                "id": "github_token",
                "description": "GitHub Personal Access Token",
                "password": true
            }
        ],
        "servers": {
            "github": {
                "command": "docker",
                "args": [
                    "run",
                    "-i",
                    "--rm",
                    "-e",
                    "GITHUB_PERSONAL_ACCESS_TOKEN",
                    "ghcr.io/github/github-mcp-server"
                ],
                "env": {
                    "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github_token}"
                }
            }
        }
    }
    ```

The `inputs` section defines the inputs that the MCP server will require. In this case, we are asking for a GitHub Personal Access Token, which is required to authenticate with the GitHub API. The `password` field is set to `true`, which means that the input will be masked when you enter it.

> [!IMPORTANT]
> Make sure that you do not share your GitHub Personal Access Token with anyone, as it provides access to your GitHub account and repositories. Treat it like a password and keep it secure. That means you should not check it into source control or share it with anyone else.
>
> Because it is a sensitive password, **DO NOT** paste it into the **mcp.json** file, is an artifact of the source code. Published tokens is the leading cause of security breaches. Instead, you'll securely add it to your codespace in a later step.

The `servers` section defines the MCP server that you want to use. In this case, we are using the GitHub MCP server, which is run in a Docker container. The `command` field specifies the command to run the MCP server, and the `args` field specifies the arguments to pass to the command. The `env` field specifies the environment variables to set when running the MCP server. The `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable is set to the value of the `github_token` input, which is provided by the user when prompted.

## Obtain the token

In order to interact with GitHub via the MCP server you'll need to have a token. This can either be done by [creating a personal access token (PAT)][github-pat-docs], or (as in our case) using the GitHub token from the codespace. Let's obtain the GitHub token.

1. Open the terminal in your Codespace by selecting <kbd>Ctl</kbd>+<kbd>\`</kbd>.
2. Run the following command to print the value of the GITHUB_TOKEN environment variable:

    ```bash
    echo $GITHUB_TOKEN
    ```

3. Highlight the token and copy it to the clipboard.

## Start the MCP server

To utilize an MCP server it needs to be "started". This will allow GitHub Copilot to communicate with the server and perform the tasks you request.

1. Inside VS Code, open **.vscode/mcp.json**.
2. To start the GitHub MCP server, select **Start** above the GitHub server.
3. You should see a prompt asking for the GitHub personal access token.
4. Paste the token you copied previously.

    ![Example of the start button and the prompt asking for the GitHub personal access token](images/copilot-github-mcp-token-prompt.png)

> [!IMPORTANT]
> Do not share your PAT with anyone, as it provides access to your GitHub account and repositories. Treat it like a password and keep it secure. That includes not checking it into source control. **Do not paste it directly into the .vscode/mcp.json file.**

4. The GitHub MCP server should start up, and you should now see the number of tools available in the Copilot Chat window increase from 0. This indicates that the AI agent is now able to access the GitHub MCP server and perform actions on your behalf.

    ![Example of the Copilot Chat Pane showing tools available](images/copilot-agent-mode-mcp-tools.png)

5. You can select the tools icon to see the list of available tools that the GitHub MCP server provides. This includes tools for creating and managing repositories, issues, pull requests, and more.

## Creating a backlog of tasks

Now that you have set up the GitHub MCP server, you can use Copilot Agent mode to create a backlog of tasks for use in the rest of the lab.

1. Return to the Copilot Chat pane. Select **Agent** from the dropdown list. Set the model to **Claude 3.5 Sonnet**.

    ![Example of the Copilot Chat pane with Agent Mode selected](images/copilot-agent-mode-dropdown.png)

2. Type or paste the following prompt to create the issues we'll be working on in the lab, replacing **<YOUR_REPOSITORY_PATH>** with the organization/name of your repository:

    ```markdown
    In <YOUR_REPOSITORY_PATH>, create GitHub issues for our Tailspin Toys backlog in the repo. Each issue should include:
    - A clear title
    - A brief description of the task and why it is important to the project
    - A checkbox list of acceptance criteria

    From our recent planning meeting, the upcoming backlog includes the following tasks:

    1. Allow users to filter games by category and publisher
    2. Update our repository coding standards (including rules about Python formatting and docstrings) in a custom instructions file
    3. Stretch Goal: Implement pagination on the game list page
    ```

3. Press <kbd>enter</kbd> or select the **Send** button to send the prompt to Copilot.
4. GitHub Copilot should process the request and respond with a dialog box asking you to confirm the creation of the issues.

    ![Example of Copilot Chat dialog box asking for confirmation to run the create issue command](images/create-issue-dialog.png)

> [!IMPORTANT]
> Remember, AI can make mistakes, so make sure to review the issues before confirming.

5. Select **see more** in **Run open new issue** box to see the details of the issue that will be created.
6. Ensure the details in the **owner** and **repo**, **title** and **body** of the issue look correct. You can make any desired edits by double clicking the body and updating the content with the correct information.
7. After reviewing the generated content, select **Continue** to create the issue.

    ![Example of the expanded dialog box showing the GitHub Issue that will be created](images/create-issue-review.png)

8. Repeat steps 4-6 for the remainder of the issues. Alternatively, if you are comfortable with Copilot automatically creating the issues you can select the down-arrow next to **Continue** and select **Allow in this session** to allow Copilot to create the issues for this session (the current chat).

    ![Example of allowing Copilot to automatically create issues](images/create-issue-allow.png)

> [!IMPORTANT]
> Ensure you are comfortable with Copilot automatically performing tasks on your behalf before you selecting **Allow in this session** or a similar option.

9. In a separate browser tab, navigate to your GitHub repository and select the issues tab.
10. You should see a list of issues that have been created by Copilot. Each issue should include a clear title and a checkbox list of acceptance criteria.

You should notice that the issues are fairly detailed. This is where we benefit from the power of Large Language Models (LLMs) and Model Context Protocol (MCP), as it has been able to create a clear initial issue description.

![Example of issues created in GitHub](images/github-issues-created.png)

## Summary and next steps

Congratulations, you have created issues on GitHub using Copilot Chat and MCP!

To recap, in this exercise we:

- used Model Context Protocol (MCP), which provides access to external tools and capabilities.
- set up the GitHub MCP server in your repository.
- used GitHub Copilot Chat agent mode to create issues in your repository.

With the GitHub MCP server configured, you can now use GitHub Copilot Chat Agent Mode to perform additional actions on your behalf, like creating new repositories, managing pull requests, and searching for information across your repositories.

You can now continue to the next exercise, where you will learn how to [provide Copilot guidance with custom instructions][next-lesson] to ensure code is generated following your organization's defined patterns and practices.

### Optional exploration exercise – Set up the Microsoft Playwright MCP server

If you are feeling adventurous, you can try installing and configuring another MCP server, such as the [Microsoft Playwright MCP server][playwright-mcp-server]. This will allow you to use GitHub Copilot Chat Agent Mode to perform browser automation tasks, such as navigating to web pages, filling out forms, and clicking buttons.

You can find the instructions for installing and configuring the Playwright MCP server in the [Playwright MCP repository][playwright-mcp-server].

Notice that the setup process is similar to the GitHub MCP server, but you do not need to provide any credentials like the GitHub Personal Access Token. This is because the Playwright MCP server does not require authentication to access its capabilities.

## Resources

- [What the heck is MCP and why is everyone talking about it?][mcp-blog-post]
- [GitHub MCP Server][github-mcp-server]
- [Microsoft Playwright MCP Server][playwright-mcp-server]
- [Anthropic MCP Servers][anthropic-mcp-servers]
- [VS Code Extensions][vscode-extensions]
- [GitHub Copilot Chat Extension][copilot-chat-extension]
- [Creating a fine-grained personal access token][github-pat-docs]

---

| [← Previous lesson: GitHub Copilot coding agent][previous-lesson] | [Next lesson: Custom instructions →][next-lesson] |
|:--|--:|

[previous-lesson]: ./1-copilot-coding-agent.md
[next-lesson]: ./3-custom-instructions.md
[prereqs-lesson]: ./0-prereqs.md
[mcp-blog-post]: https://github.blog/ai-and-ml/llms/what-the-heck-is-mcp-and-why-is-everyone-talking-about-it/
[github-mcp-server]: https://github.com/github/github-mcp-server
[playwright-mcp-server]: https://github.com/microsoft/playwright-mcp
[anthropic-mcp-servers]: https://github.com/modelcontextprotocol/servers
[vscode-extensions]: https://code.visualstudio.com/docs/configure/extensions/extension-marketplace
[copilot-chat-extension]: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
[github-pat-docs]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token
