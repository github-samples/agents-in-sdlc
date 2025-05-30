# Exercise 3 - Providing context to Copilot with instruction files

| [← Previous lesson: Model Context Protocol (MCP)][previous-lesson] | [Next lesson: Copilot agent mode →][next-lesson] |
|:--|--:|

Context is key across many aspects of life, and when working with generative AI. If you're performing a task which needs to be completed a particular way, or if a piece of background information is important, we want to ensure Copilot has access to that information. We can use [instruction files][instruction-files] to provide guidance so that Copilot not only understands what we want it to do but also how we want it to be done.

In this exercise, you will learn how to:

- provide Copilot with project-specific context, coding guidelines and documentation standards using custom instructions (.github/copilot-instructions.md).
- use instruction files to guide Copilot for repetitive or templated tasks.
- implement both repository-wide instructions and task-specific instructions.

## Scenario

As any good dev shop, Tailspin Toys has a set of guidelines and requirements for development practices. These include:

- API always needs unit tests.
- UI should be in dark mode and have a modern feel.
- Documentation should be added to code in the form of docstrings.
- All newly created files should have a comment header describing what it does.

Through the use of instruction files you'll ensure Copilot has the right information to perform the tasks in alignment with the practices highlighted.

## Before you begin

We're going to be making some code changes, so we should follow our usual practice of creating a new branch to work in. This will allow us to make changes without affecting the main branch until we're ready.

1. Return to your codespace from the previous exercise.
2. Open a new terminal window inside your codespace by selecting <kbd>Ctl</kbd>+<kbd>\`</kbd>.
3. Create and switch to a new branch by running the following command in the terminal:

   ```bash
   git checkout -b add-filters
   ```

## Custom instructions

Custom instructions allow you to provide context and preferences to Copilot chat, so that it can better understand your coding style and requirements. This is a powerful feature that can help you steer Copilot to get more relevant suggestions and code snippets. You can specify your preferred coding conventions, libraries, and even the types of comments you like to include in your code. You can create instructions for your entire repository, or for specific types of files for task-level context.

There are two types of instructions files:

- `.github/copilot-instructions.md`, a single instruction file sent to Copilot for **every** chat prompt. This file should contain project-level information, context which is relevant for every message. This could include the tech stack being used, an overview of what's being built, or global guidance for Copilot.
- `.instructions.md` can be created for specific tasks or file types. You can use `.instructions.md` files to provide guidelines for particular languages (like Python or TypeScript), or for tasks like creating a React component or a new instance of a repository pattern.

> [!NOTE]
> When working in your IDE, instructions files are only used for code generation in Copilot Chat, and not used for code completions.

## Use GitHub Copilot Chat before updating custom instructions

To see the impact of custom instructions, we will start by sending a prompt with the current version of the files. We'll then make some updates, send the same prompt again, and note the difference.

1. Open the GitHub codespace if not already open.
2. Close any open files in your codespace from the previous exercises.
3. Open **server/routes/publishers.py**, an empty file.
4. Open **Copilot chat**.
5. Create a new chat session by selecting the **New Chat** button, which will remove any previous context.

   ![Screenshot of the New Chat button being highlighted in the Copilot Chat panel](images/copilot-new-chat.png)

6. Select **Ask** from the modes dropdown.

   ![Screenshot of the Ask mode being highlighted in the Copilot Chat panel](images/copilot-chat-ask.png)

7. Send the following prompt to create a new endpoint to return all publishers:

   ```plaintext
   Create a new endpoint to return a list of all publishers. It should return the name and id for all publishers.
   ```

8. Notice the generated code includes [type hints][python-type-hints] because, as we'll see, our custom instructions includes the directive to include them.
9. Notice the generated code **is missing** either a docstring or a comment header - or both!

> [!IMPORTANT]
> As highlighted previously, GitHub Copilot and LLM tools are probabilistic, not deterministic. As a result, the exact code generated may vary, and there's even a chance it'll abide by our rules without us spelling it out! But to help with consistency, we should always document anything we want to ensure Copilot should understand about how we want our code generated.

## Add global standards to copilot-instructions.md

As highlighted previously, `copilot-instructions.md` is designed to provide project-level information to Copilot. Let's ensure global coding standards are documented to improve code suggestions from Copilot chat.

1. Open **.github/copilot-instructions.md**.
2. Explore the file, noting the brief description of the project and sections for `Code standards`, `Scripts` and `GitHub Actions Workflows`. These are applicable to any interactions we'd have with Copilot, are robust, and provide clear guidance on what we're doing and how we want to accomplish it.
3. Locate the `###Global language guidance` section, which should be around like 16. Note how it contains a note to use type hints. That's why we saw those in the code generated previously.
4. Add the following lines below the note about type hints to instruct Copilot to add comment headers to files and docstrings:

   ```markdown
   - Include a comment block at the top of each new file to describe what it does
   - Every function should have docstrings or the language equivalent
   ```

5. Close **copilot-instructions.md**.
6. Select **New Chat** in Copilot chat to clear the buffer and start a new conversation.
7. Return to **server/routes/publishers.py** to ensure focus is set correctly.
8. Send the same prompt as before to create the endpoint.

   ```plaintext
   Create a new endpoint to return a list of all publishers. It should return the name and id for all publishers.
   ```

> [!TIP]
> You can cycle through previous prompts by using the up and down arrows on your keyboard.

8. Notice how the newly generated code includes a comment header at the top of the file which resembles the following:

   ```python
   """
   Publisher API routes for the Tailspin Toys Crowd Funding platform.
   This module provides endpoints to retrieve publisher information.
   """
   ```

9.  Notice how the newly generated code includes a docstring inside the function which resembles the following:

   ```python
   """
   Returns a list of all publishers with their id and name.
    
   Returns:
      Response: JSON response containing an array of publisher objects
   """
   ```

10. Also note how the existing code isn't updated, but of course we could ask Copilot to perform that operation if we so desired!
11. **Don't implement the suggested changes**, as we will be doing that in the next section.

From this section, you explored how the custom instructions file has provided Copilot with the context it needs to generate code that follows the established guidelines.

## Instruction files for tasks

Coding is often repetitive, with developers performing similar tasks on a regular basis. Copilot is wonderful for allowing you to offload these types of tasks. But these types of tasks, like adding an endpoint, creating a component, or adding a new service pattern implementation often require a particular template or structure to be followed. Instruction files allow you to provide specific requirements for these types of tasks. They can be added manually when using Copilot Chat, or can have an `applyTo:` tag added to the top of the file to have Copilot automatically use them for specific files.

We want to create a new endpoint to list all publishers, and to follow the same pattern we used for the existing [games endpoints][games-endpoints], and to create tests which follow the same pattern as the existing [games endpoints tests][games-tests]. An instruction file has already been created; let's explore it and see the difference in code it generates.

1. Open **.github/instructions/python-tests.instructions.md**.
2. Note the `applyTo:` section at the top, which contains a filter for all files in the **server/tests** directory which start with **test_** and have a **.py** extension. Whenever Copilot Chat interacts with a file which matches this pattern it will automatically use the guidance provided in this file.
3. Note the file contains guidance about how tests should be created, and how to utilize SQLite when testing database functionality.
4. Open **.github/instructions/flask-endpoint.instructions.md**.
5. Review the following entries inside the instruction file, which includes:

   - an overview of requirements, including that tests must be created, and endpoints are created in Flask using blueprints.
   - a link to another the above mentioned **python-tests.instructions.md** file.
   - links to two existing files which follow the patterns we want - both the games blueprint and tests. Notice how these are setup as normal markdown links, allowing an instruction file to incorporate additional files for context.

6. Return to **server/routes/publishers.py** to ensure focus is set correctly.
7. Return to Copilot Chat and select **New Chat** to start a new session.
8. Select **Edit** from the mode dropdown, which will allow Copilot to update multiple files.

   ![Screenshot of the Edit mode being highlighted in the Copilot Chat panel](images/copilot-edits.png)

9. Select the **Add Context** button to open the context dialog
10. If prompted to allow the codespace to see text and images copied to the clipboard, select **Allow**.
11. Select **Instructions** from the dropdown at the top of your codespace.

> [!TIP]
> If the list of options is long, you can type **instructions** to filter to the Instructions option then select **Instructions**.

9.  Select **flask-endpoint .github/instructions** to add the instruction file to the context.

   ![Screenshot showing the instruction file being added into Copilot Chat](images/copilot-add-instructions-file.png)

10. Send the same prompt as before to generate the desired endpoint:

   ```plaintext
   Create a new endpoint to return a list of all publishers. It should return the name and id for all publishers.
   ```

11. Note the **References** section, and how **games.py**, **test_games.py**, and **python-tests.instructions.md** were all included in call to Copilot.

   ![Screenshot of the references section, showing the included files of games.py, test_games.py, and python-tests.instructions.md](./images/copilot-instructions-references.png)

12. Copilot generates the files. Notice how it generates updates across multiple files, like **games.py** and **test_games.py**.
13. After reviewing the code, select **Keep** and **Done** in Copilot Chat to accept the changes.
14. Open a terminal window by selecting <kbd>Ctl</kbd>+<kbd>\`</kbd>.
15. Run the tests by running the script with the following command:

   ```sh
   ./scripts/run-server-tests.sh
   ```

16. Ensure all tests pass. If any tests fail, feel free to prompt Copilot Chat as needed, asking it to update the code based on the error messages you see.

> [!TIP]
> Copy and paste the error message from the console window into the chat window to provide context!

17. Once correct, and all tests pass, open the **Source Control** panel on the left of the Codespace and review the changes made by Copilot.
18. Stage the changes by selecting the **+** icon in the **Source Control** panel.
19. Generate a commit message using the **Sparkle** button.

   ![Screenshot of the Source Control panel showing the changes made](images/source-control-changes.png)

20. Commit the changes to your repository by selecting **Commit**.

## Summary

Congratulations! You explored how to ensure Copilot has the right context to generate code following the practices your organization has set forth. This can be done at a repository level with the `.github/copilot-instructions.md` file, or on a task basis with instruction files. You explored how to:

- provide Copilot with project-specific context, coding guidelines and documentation standards using custom instructions (.github/copilot-instructions.md).
- use instruction files to guide Copilot for repetitive or templated tasks.
- implement both repository-wide instructions and task-specific instructions.

Next we'll use [agent mode to add functionality to the site][next-lesson].

## Resources

- [Instruction files for GitHub Copilot customization][instruction-files]
- [Best practices for creating custom instructions][instructions-best-practices]
- [Personal custom instructions for GitHub Copilot][personal-instructions]

---

| [← Previous lesson: Model Context Protocol (MCP)][previous-lesson] | [Next lesson: Copilot agent mode →][next-lesson] |
|:--|--:|

[previous-lesson]: ./2-mcp.md
[next-lesson]: ./4-copilot-agent-mode-vscode.md
[instruction-files]: https://code.visualstudio.com/docs/copilot/copilot-customization
[python-type-hints]: https://docs.python.org/3/library/typing.html
[games-endpoints]: ../server/routes/games.py
[games-tests]: ../server/tests/test_routes/test_games.py
[instructions-best-practices]: https://docs.github.com/en/enterprise-cloud@latest/copilot/using-github-copilot/coding-agent/best-practices-for-using-copilot-to-work-on-tasks#adding-custom-instructions-to-your-repository
[personal-instructions]: https://docs.github.com/en/copilot/customizing-copilot/adding-personal-custom-instructions-for-github-copilot
