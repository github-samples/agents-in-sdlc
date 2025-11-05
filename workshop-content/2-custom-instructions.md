# Exercise 2 - Providing context to Copilot with instruction files

| [← Previous lesson: Model Context Protocol (MCP)][previous-lesson] | [Next lesson: Copilot agent mode →][next-lesson] |
|:--|--:|

Context is key across many aspects of life, and when working with generative AI. If you're performing a task which needs to be completed a particular way, or if a piece of background information is important, you want to ensure Copilot has access to that information. You can use [instruction files][instruction-files] to provide guidance so that Copilot not only understands what you want it to do but also how you want it to be done.

In this exercise, you will learn how to:

- provide Copilot with project-specific context, coding guidelines and documentation standards using [repository custom instructions][repository-custom-instructions] **.github/copilot-instructions.md**.
- provide path instruction files to guide Copilot for repetitive or templated tasks on specific types of files.
- implement both repository-wide instructions and task-specific instructions.

> [!IMPORTANT]
> Note that the code generated may diverge from some of the standards you set. AI tools like Copilot are non-deterministic, and may not always provide the same result. The other files in the codebase do not contain docstrings or comment headers, which could lead Copilot in another direction. Consistency is key, so making sure that your code follows the established patterns is important. You can always follow-up in chat and ask Copilot to follow your coding standards, which will help guide it in the right direction.

## Scenario

As any good dev shop, Tailspin Toys has a set of guidelines and requirements for development practices. These include:

- API always needs unit tests.
- UI should be in dark mode and have a modern feel.
- Documentation should be added to code in the form of docstrings.
- A block of comments should be added to the head of each file describing what the file does.

Through the use of instruction files you'll ensure Copilot has the right information to perform the tasks in alignment with the practices highlighted.

## Before you begin

You're going to be making some code changes, so you should follow the usual practice of creating a new branch to work in. This will allow you to make changes without affecting the main branch until you're ready.

1. Return to your codespace from the previous exercise.
2. Open a new terminal window inside your codespace by selecting <kbd>Ctl</kbd>+<kbd>\`</kbd>.
3. Create and switch to a new branch by running the following command in the terminal:

   ```bash
   git checkout -b add-filters
   ```

## Custom instructions

Custom instructions allow you to provide context and preferences to Copilot chat, so that it can better understand your coding style and requirements. This is a powerful feature that can help you steer Copilot to get more relevant suggestions and code snippets. You can specify your preferred coding conventions, libraries, and even the types of comments you like to include in your code. You can create instructions for your entire repository, or for specific types of files for task-level context.

There are two types of instructions files:

- **.github/copilot-instructions.md**, a single instruction file sent to Copilot for **every** chat prompt for the repository. This file should contain project-level information, context which is relevant for most chat requests sent to Copilot. This could include the tech stack being used, an overview of what's being built and best practices, and other global guidance for Copilot.
- **\*.instructions.md** files can be created for specific tasks or file types. You can use **\*.instructions.md** files to provide guidelines for particular languages (like Python or TypeScript), or for tasks like creating a React component or a new set of unit tests.

> [!NOTE]
> When working in your IDE, instructions files are only used for code generation in Copilot Chat, and not used for code completions or next edit suggestions.
>
> Copilot coding agent will utilize both repository level and \*.instructions with `applyTo` header matter when generating code.

## Best practices for managing instructions files

A full conversation about creating instructions files is beyond the scope of the workshop. However, the examples provided in the sample project provide a representative example of how to approach their management. At a high level:

- Keep instructions in **copilot-instructions.md** focused on project-level guidance, such as a description of what's being built, the structure of the project, and global coding standards.
- Use **\*.instructions.md** files to provide specific instructions for file types (unit tests, React components, API endpoints), or for specific tasks.
- Use natural language in your instructions files. Keep guidance clear. Provide examples of how code should (and shouldn't) look.

There isn't one specific way to create instructions files, just as there isn't one specific way to use AI. You will find through experimentation what works best for your project. The guidance provided here and the [resources](#resources) below should help you get started.

> [!TIP]
> Every project using GitHub Copilot should have a robust collection of instructions files to provide context and best guide code generation. As you explore the instructions files in the project, you may notice there are ones for numerous types of files and tasks, including [UI updates](../.github/instructions/ui.instructions.md) and [Astro](../.github/instructions/astro.instructions.md). The investment made in instructions files will greatly enhance the quality of code suggestion from Copilot, ensuring it better matches the style and requirements your organization has.
> 
> You can even have Copilot aid in generating instructions files by selecting the gear icon for **Configure Chat** in Copilot chat and selecting **Generate Agent Instructions**.
> 
> ![Screenshot of option in GitHub Copilot chat with configure chat highlighted and generate agent instructions highlighted](./images/ex2-generate-instructions.png)

## Use GitHub Copilot Chat before updating custom instructions

To see the impact of custom instructions, you'll start by sending a prompt with the current version of the files. You'll then make some updates, send the same prompt again, and note the difference.

1. Return to your codespace.
2. Close any open files in your codespace from the previous exercises. This will ensure Copilot has the context you want it to have.
3. Open `server/routes/publishers.py`, an empty file.
4. If **Copilot chat** is not already open, open it by selecting the Copilot icon towards the top of your codespace.
5. Create a new chat session by typing `/clear` into the chat window and selecting <kbd>Enter</kbd> (or <kbd>return</kbd> on a Mac).
6. Select **Ask** from the modes dropdown.

   ![Chat mode selection dialog with Ask mode highlighted](./images/ex2-select-chat-mode.png)

7. Send the following prompt to create a new endpoint to return all publishers:

   ```plaintext
   Create a new endpoint to return a list of all publishers. It should return the name and id for all publishers.
   ```

8. Copilot explores the project to learn how best to implement the code, and generates a list of suggestions, which may include code for `publishers.py`, `app.py`, and tests to ensure the new code runs correctly.
9.  Explore the code, noticing the generated code includes [type hints][python-type-hints] because, as you'll see, the custom instructions includes the directive to include them.
10. Notice the generated code **is missing** either a docstring or a comment header - or both!

> [!IMPORTANT]
> As highlighted previously, GitHub Copilot and LLM tools are probabilistic, not deterministic. As a result, the exact code generated may vary, and there's even a chance it'll abide by your rules without you spelling it out! But to aid consistency in code you should always document anything you want to ensure Copilot should understand about how you want your code generated.

## Add new repository standards to copilot-instructions.md

As highlighted previously, `copilot-instructions.md` is designed to provide project-level information to Copilot. Let's ensure repository coding standards are documented to improve code suggestions from Copilot chat.

1. Return to your codespace.
2. Open `.github/copilot-instructions.md`.
3. Explore the file, noting the brief description of the project and sections for **Code standards**, **Scripts** and **GitHub Actions Workflows**. These are applicable to any interactions you'd have with Copilot, are robust, and provide clear guidance on what you're doing and how you want to accomplish it.
4. Locate the **Code formatting requirements** section, which should be near line 27. Note how it contains a note to use type hints. That's why you saw those in the code generated previously.
5. Add the following lines of markdown right below the note about type hints to instruct Copilot to add comment headers to files and docstrings (which should be near line 27):

   ```markdown
   - Every function should have docstrings or the language equivalent.
   - Before imports or any code, add a comment block to the file that explains its purpose.
   ```

6. Close **copilot-instructions.md**.
7. Select **New Chat** in Copilot chat to clear the buffer and start a new conversation.
8. Return to **server/routes/publishers.py** to ensure focus is set correctly.
9. Send the same prompt as before to create the endpoint.

   ```plaintext
   Create a new endpoint to return a list of all publishers. It should return the name and id for all publishers.
   ```

10. Notice how the newly generated code includes a comment header at the top of the file which resembles the following:

   ```python
   """
   Publisher API routes for the Tailspin Toys Crowd Funding platform.
   This module provides endpoints to retrieve publisher information.
   """
   ```

11. Notice how the newly generated code includes a docstring inside the function which resembles the following:

   ```python
   """
   Returns a list of all publishers with their id and name.
    
   Returns:
      Response: JSON response containing an array of publisher objects
   """
   ```

12. Notice the generated code now includes a docstring as well as a comment block at the top!
13. Also note how the existing code isn't updated, but of course you could ask Copilot to perform that operation if you so desired!
14. **Don't implement the suggested changes**, as you'll be doing that in the next section.

> [!NOTE]
> If you accepted the changes, you can always select the **Undo** button towards the top right of the Copilot chat window.

From this section, you explored how the custom instructions file has provided Copilot with the context it needs to generate code that follows the established guidelines.

## Instructions for specific tasks or files

Coding is often repetitive, with developers performing similar tasks on a regular basis. Copilot is wonderful for allowing you to offload the mundane, like adding endpoints, generating tests, or building a new component. But all code has a set of requirements, and often require a particular template or structure to be followed. **\*.instructions.md** files allow you to provide tailored guidance for these types of tasks and files. They can be added manually when using Copilot Chat, or can have an `applyTo:` tag added to the top of the file to have Copilot automatically use them for specific files.

## Explore a task-specific custom instructions file

You want to create a new endpoint to list all publishers, and to follow the same pattern used for the existing [games endpoints][games-endpoints], and to create tests which follow the same pattern as the existing [games endpoints tests][games-tests]. An instruction file has already been created; let's explore it and see the difference in code it generates.

1. Open `.github/instructions/python-tests.instructions.md`.
2. Note the `applyTo:` section at the top, which contains a filter for all files in the `server/tests` directory which start with `test_` and have a `.py` extension. Whenever Copilot Chat interacts with a file which matches this pattern it will automatically use the guidance provided in this file.
3. Note the file contains guidance about how tests should be created, and how to utilize SQLite when testing database functionality.
4. Open `.github/instructions/flask-endpoint.instructions.md`.
5. Review the following entries inside the instruction file, which includes:

   - an overview of requirements, including that tests must be created, and endpoints are created in Flask using blueprints.
   - a link to another the previously mentioned `python-tests.instructions.md` file.
   - links to two existing files which follow the patterns you want - both the games blueprint and tests. Notice how these are setup as normal markdown links, allowing an instruction file to incorporate additional files for context.

6. Return to `server/routes/publishers.py` to ensure focus is set correctly.
7. Return to Copilot Chat and select **New Chat** to start a new session.
8. Select **Edit** from the mode dropdown, which will allow Copilot to update multiple files.

   ![Copilot Chat mode selector with Edit chosen and highlighted](./images/ex2-select-edit-mode.png)

> [!NOTE]
> If you have any issues running the tests in this part of the exercise, please undo your changes and retry from the above step using **Agent** mode instead.

9. Select the **Add Context** button to open the context dialog
10. If prompted to allow the codespace to see text and images copied to the clipboard, select **Allow**.
11. Select **Instructions** from the dropdown at the top of your codespace.

> [!TIP]
> If the list of options is long, you can type **instructions** to filter to the Instructions option then select **Instructions**.

12.  Select **flask-endpoint .github/instructions** to add the instruction file to the context.

   ![Screenshot showing the instruction file being added into Copilot Chat](images/ex2-add-instructions-file.png)

13. Send the same prompt as before to generate the desired endpoint:

   ```plaintext
   Create a new endpoint to return a list of all publishers. It should return the name and id for all publishers.
   ```

> [!NOTE]
> While the up-arrow shortcut to resend a prior command is handy, it will reset any context you might add as well. If you added in the instructions file as context, then use the up arrow, it will remove the instructions file. For this particular step, make sure you copy/paste (or type) the command to avoid accidentally removing context.

14. Note the **References** section and how it uses the **flask-endpoint.instructions.md** file to provide context. If you use instructions files with Copilot agent mode, you will notice that Copilot explores and reads the files referenced in the instructions file.

   ![Screenshot of the references section, showing the included instructions file](./images/ex2-copilot-instructions-references.png)

15. Copilot generates the files. Notice how it generates updates across multiple files, like **publishers.py** and **test_publishers.py**

> [!NOTE]
> Note that the code generated may diverge from some of the standards we set. AI tools like Copilot are non-deterministic, and may not always provide the same result. The other files in our codebase do not contain docstrings or comment headers, which could lead Copilot in another direction. Consistency is key, so making sure that your code follows the established patterns is important. You can always follow-up in chat and ask Copilot to follow your coding standards, which will help guide it in the right direction.

16. After reviewing the code, select **Keep** in Copilot Chat to accept the changes.
17. Open a terminal window by selecting <kbd>Ctl</kbd>+<kbd>\`</kbd>.
18. Run the tests by running the script with the following command:

   ```sh
   ./scripts/run-server-tests.sh
   ```

19. Once the code is correct, and all tests pass, open the **Source Control** panel on the left of the Codespace and review the changes made by Copilot.
20. Stage the changes by selecting the **+** icon in the **Source Control** panel.
21. Generate a commit message using the **Sparkle** button.

    ![Screenshot of the Source Control panel showing the changes made](images/ex2-source-control-changes.png)

22. Commit the changes to your repository by selecting **Commit**.

## Summary and next steps

Congratulations! You explored how to ensure Copilot has the right context to generate code following the practices your organization has set forth. This can be done at a repository level with the **.github/copilot-instructions.md** file, or on a task basis with instruction files. You explored how to:

- provide Copilot with project-specific context, coding guidelines and documentation standards using custom instructions (.github/copilot-instructions.md).
- use instruction files to guide Copilot for repetitive or templated tasks.
- implement both repository-wide instructions and task-specific instructions.

Next we'll use [agent mode to add functionality to the site][next-lesson].

## Resources

- [Instruction files for GitHub Copilot customization][instruction-files]
- [5 tips for writing better custom instructions for Copilot][copilot-instructions-five-tips]
- [Best practices for creating custom instructions][instructions-best-practices]
- [Personal custom instructions for GitHub Copilot][personal-instructions]
- [Awesome Copilot - a collection of instructions files and other resources][awesome-copilot]

---

| [← Previous lesson: Model Context Protocol (MCP)][previous-lesson] | [Next lesson: Copilot agent mode →][next-lesson] |
|:--|--:|

[previous-lesson]: ./1-mcp.md
[next-lesson]: ./3-copilot-agent-mode-vscode.md
[instruction-files]: https://code.visualstudio.com/docs/copilot/copilot-customization
[python-type-hints]: https://docs.python.org/3/library/typing.html
[games-endpoints]: ../server/routes/games.py
[games-tests]: ../server/tests/test_games.py
[instructions-best-practices]: https://docs.github.com/enterprise-cloud@latest/copilot/using-github-copilot/coding-agent/best-practices-for-using-copilot-to-work-on-tasks#adding-custom-instructions-to-your-repository
[personal-instructions]: https://docs.github.com/copilot/customizing-copilot/adding-personal-custom-instructions-for-github-copilot
[copilot-instructions-five-tips]: https://github.blog/ai-and-ml/github-copilot/5-tips-for-writing-better-custom-instructions-for-copilot/
[awesome-copilot]: https://github.com/github/awesome-copilot
