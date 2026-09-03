# **Portfolio Current State of AI**

| **Student 1** | Team 16 |
|---------------|----------|
| **Student 2** | Team 16 |

## Summaries (individual)

For every guest lecture make a summary (individually) and combine them later. Use this structure to make the summary.

### Lecture 1: AI in general

1. Summary

   The guest lectures introduced AI as a powerful set of tools for pattern recognition, language generation, content creation, and decision support. A key lesson was that AI does not replace human thinking, but it can accelerate exploration, draft work, and improve productivity when guided with clear prompts and context.

2. Key insights

   - AI is best used as a co-pilot, not as an autonomous decision-maker.
   - Quality depends strongly on prompt quality, task framing, and domain understanding.
   - AI can speed up ideation, coding, documentation, and prototyping.
   - Human review remains essential because AI can make confident mistakes.

3. Questions

   - How do we evaluate when an AI-generated result is trustworthy enough to use in a real product?
   - What are the risks of relying too heavily on AI-generated code without understanding it deeply?

### Lecture 2: Applying AI within our field

1. Summary

   The lectures related to applying AI in a specific field highlighted the importance of context. AI works best when it is grounded in real tasks, clear requirements, and professional standards. In a development context, this means using AI to support design decisions, coding tasks, testing, and documentation while keeping the project goals in view.

2. Key insights

   - AI is most valuable when it is tailored to a field or workflow.
   - Reusable structures such as prompts, guidelines, and project files help produce more consistent AI output.
   - Domain knowledge remains crucial for assessing usefulness and correctness.

3. Questions

   - How can we design workflows that make AI output consistent and repeatable?
   - How much context is necessary before AI becomes genuinely useful for complex tasks?

### Lecture 3: Applying AI yourself in a case study

1. Summary

   The hackathon work showed that AI can support rapid product creation when the team has a clear project scope and working process. In our case, we used AI to help transform a specification into a functional Svelte app, refine the UI, and improve the project’s operational setup.

2. Key insights

   - Breaking a problem into small steps helps AI deliver useful results.
   - Iteration matters: prototypes and refinements improve the final outcome.
   - Good prompts and clear constraints produce better code more efficiently.

3. Questions

   - How do we know when a generated solution is “good enough” versus when we need to redesign it?
   - What is the optimal balance between AI speed and maintaining engineering quality?

### Lecture 4: AI in education and Demo day

1. Summary

   AI in education is not just about automation; it is about teaching people how to think critically with intelligent tools. The demo day perspective also made clear that business value, user experience, and process quality matter as much as technical implementation.

2. Key insights

   - Technical quality is necessary, but communication and relevance are equally important.
   - Products should be understandable to non-technical stakeholders.
   - Demonstrating the process and human oversight is part of the value of AI work.

3. Questions

   - How do we communicate AI-assisted work in a way that builds trust rather than suspicion?
   - What evidence should be shown to prove that AI was used responsibly?

## You, Human, Technology and AI (individual)

Our position is that humans should remain at the centre of technology and AI systems. AI is a powerful amplifier of productivity, but it does not replace human judgment, responsibility, or critical thinking. In the guest lectures, a recurring point was that AI works best when combined with clear goals, domain knowledge, and evaluation. This is particularly important in software development, where AI can generate code quickly but still requires understanding to validate correctness, quality, and user value.

We see technology as a tool that should extend human capability rather than replace it. AI can help with research, brainstorming, coding, testing, and documentation, but it cannot fully replace the human abilities of reflection, ethics, problem framing, and real-world judgment. This view is especially relevant in a team project like ours, where we used AI to turn a specification into a working app, improve UI details, and automate deployment setup. The work was faster and more structured because of AI, but the final decisions still depended on us understanding the code, verifying the output, and shaping the product to meet the user’s needs.

We believe the most responsible use of AI is one that is transparent, intentional, and critically evaluated. That means using it to accelerate work, not to blindly accept results. In our project, this included reviewing generated code, checking build and runtime behaviour, and making design decisions based on usability and clarity.

Sources (example format; replace with final individual references as needed):

- Guest lectures, Current State of AI course, HZ University of Applied Sciences.
- OpenAI. (2024). ChatGPT and AI productivity overview. (General reference to AI adoption and productivity trends.)
- Russell, S., & Norvig, P. (2021). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.

## Design Principles for working with AI (as a group)

Based on the guest lectures create at least 10 design principles that you follow when using AI for coding.

1. Always understand before you paste. If you cannot explain what the generated code does line by line, you do not own it.
2. Start with a clear specification. A good prompt is built on a precise task and measurable constraints.
3. Use AI to accelerate iteration, not to replace reasoning. Drafts are starting points, not final answers.
4. Validate every output. Build, run, and test code before accepting AI-generated changes.
5. Keep prompts reusable and structured. Good prompts become repeatable workflows.
6. Store the project context in version-controlled files so the model sees the right information.
7. Break large tasks into smaller steps to improve accuracy and reduce confusion.
8. Prefer simple, readable code over clever but opaque solutions.
9. Keep responsibility with the human developer. AI should support, not excuse poor judgment.
10. Check for privacy and data-handling risks before sharing code, prompts, or project data with external AI services.
11. Use AI for exploration and refinement, but make final design decisions based on user value and product goals.
12. Document assumptions and trade-offs so future changes remain understandable.

## Tech Stack & Workflow (as a group)

### Tech stack

The project we built during the hackathon is a personal finance dashboard. The application uses a browser-first stack that keeps the tool private and easy to run locally.

- Frontend: Svelte + Vite
- UI and styling: HTML, CSS, Svelte component structure
- Charts: Chart.js
- Data persistence: localStorage in the browser
- Version control and collaboration: Git + GitHub
- Deployment: GitHub Pages via GitHub Actions

This stack was appropriate because the app is a lightweight, single-page dashboard with local state and no backend requirement. The user can add, edit, and delete transactions, view category breakdowns, and export/import CSV data without needing an account or server.

### Workflow

Our workflow for working with AI was intentionally structured:

1. Define the problem and required user functionality.
2. Turn the specification into a clear task list and acceptance criteria.
3. Use AI to help draft the initial implementation and UI structure.
4. Review and refine the generated code in a real project context.
5. Validate with build and runtime checks.
6. Iterate on UI and UX issues based on visual feedback.
7. Commit and push the verified work to GitHub.
8. Document key decisions and reusable patterns for future improvements.

This mirrors the course idea of using AI as part of a repeatable development workflow rather than as a one-off shortcut. Keeping the codebase in Git and validating regularly made the process more reliable.

## Prompting (as a group)

The first 5 (or the most important) prompts we used:

1. Prompt 1: “Turn the attached md guidelines into a functional svelte app.”

2. Prompt 2: “Ignore files and continue.”

3. Prompt 3: “In dark mode, the chart.js text remains black, which makes it illegible. How would you fix this?”

4. Prompt 4: “The ‘import csv’ button has a slightly different shape and size than the ‘export csv’ and ‘dark mode’ buttons do, how would you change this? Make them all the exact same size.”

5. Prompt 5: “App.svelte has some errors pertaining to type annotations, fix these using svelte writing standards, please.”

These prompts show the project workflow clearly: start from a specification, refine the design, fix implementation issues, and improve quality with targeted feedback.

## Feedback from experts (as a group)

During the demo you will be given feedback on the following elements. What was your score and what was the summary of your feedback?

### 1. AI usage

- Status: To be completed after the official demo / expert review.
- Expected evaluation focus: clear use of AI to support development, design iteration, and workflow efficiency; evidence of human oversight and critical review.

### 2. Tech stack and coding standards

- Status: Partially completed through our Svelte + Vite + Chart.js project.
- Summary: The stack was simple, coherent, and suitable for a browser-based productivity tool. The app was built in a maintainable way and refined with workable coding standards and validation.

### 3. Business value

- Status: To be completed after the demo.
- Summary: The project addresses a real user need: a private, no-sign-up personal budgeting tool with local persistence, category insights, and CSV support. That makes it relevant for students and individuals who want a simple finance tracker without a cloud account.

### 4. User experience

- Status: To be completed after the demo.
- Summary: The app focuses on clarity, visual summaries, and practical interaction. Key UX improvements included dark mode support, consistent button styling, and clear chart-based summaries for transactions and spending patterns.

### Final note

This portfolio is a solid draft for the course submission. The missing content that depends on the formal guest lectures and final expert feedback should be filled in individually and as a group before the final hand-in.
