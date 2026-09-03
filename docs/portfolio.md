# **Portfolio Current State of AI**

| **Roos Hogervorst** | 101484 |
|---------------|----------|
| **Mika van Os** | 088553 |

## Summaries (individual)

### Tuesday, Lecture 1 
> *Introduction to AI* - given by Greg

1. **Summary**  
    AI is in a major hype curve right now, it makes it tough for us as users to separate facts from fictions regarding this "new" tech. This lecture explored the history of AI, as well as what it can/can't do. AI learns through a form of loss-directed teaching, this means that whenever it makes a "wrong" assumption, it will lose a point. At the end of learning, the AI will know what assumptions yield the least point loss (and usually act upon them)
    Additionally, Greg shared his personal opinions on AI and what he consideres good/bad use of it.

2. **Key insights**
    - AI systems infer things. The technology behind it is entirely based on input data by means of predictions and assumptions.
    - There is Artificial Narrow Intelligence (ANI), Artificial General Intelligence (AGI) and Artificial Super Intelligence (ASI), currently only ANI exists truthfully.
    - There are two primary paradigmns of AI. Connectionist AI and "GOFAI"(Good old fasion AI). GOFAI is made by humans adding a buttload of data into the AI. The AI answers by repeating the data given. Connectionist AI functions by means of inferring and finding connections/and correlations within the data- to form new answers.
    - Correlation is not causation. Just because two things correlate does not mean one causes the other (i.e. ice cream sales & drowning reports) - There is infinitely more non-causal relationships. AI does not understand causation.
    - There is far more examples of AI that don't work- than AI that do.
    - The benchmark for intelligence is biological intelligence, whether or not AI is intelligent is something to research for yourself.

3. **Questions**
    - What is AI?
    - What can AI do?
    - What can't AI do?
    - Does AI even work?
    - Is AI intelligent?

4. **Reccomendations**
    - "The Signal and the Noise" - *Nate Silver*
    - "Fooled by Randomness" - *Nassim Nicolas Taleb*
    - [Spurious Correlations](https://tylervigen.com/spurious-correlations) - *Tyler Vigen*

### Tuesday, Lecture 2
> *Humans, Tech and AI* - given by Andrew

1. **Summary**
    AI exists! How do we as humans interact with it and what're things we ought to consider when interacting? Andrew tries to give some questions and considerations to keep in mind when working with AI and thinking about AI. Technology is so engrained within our day-to-day life, what happens when AI embedds itself like that and how may we respond?  
    The integration and development of AI is quick as-is and rapidly growing faster by the day. However, AI is efficient, and humans need inefficiency to learn. The growth curve is experienced through trial and error. What cognitive strenghts may you lose when AI takes the learning curve from you?  
    And most of all, how can this technology exist in a way that it is actually accessible to all humans equally? Can it do that to begin with? (Is equality even real?)

2. **Key Insights**
    - Technological change is always a trade-off, we traded a strong memory for the ability to read and write, for example.
    - The advantages and disadvantages of new tech never distribute evenly among population. Often, people with more money will have more access.
    - The medium is the message, to a person with a camera everything looks like an image. To AI everything looks like a problem to make more efficient.
    - Technological change is not additive, but ecological. When you add something new to a stack, it will change the way you interact with it.
    - New technologies tend to become mythic, unquestioned and taken as fact very quickly.

3. **Questions**
    - What cognitive abilities will diminish with use of AI?
    - Who will benefit the ost of this tech, and who will be disadvantaged?
    - How much human inneficiency will I sacrifice for this tech?
    - What could be unpredictable and possibly irreversible effects?
    - How can I ensure I see AI not as mythic, fact or truth, but as human-made, biased and with flaws?

4. **Reccomendations**
    - [Arte Tracks](https://simonweckert.com/arte.html) - *Simon Weckert*
    - [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) - *Polo Club of Data Science, Georgia Tech*

### Tuesday, Lecture 3
> *State of AI in Zeeland* - given by Mischa

1. **Summary**

2. **Key Points**

3. **Questions**

## You, Human, Technology and AI (individual)


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
