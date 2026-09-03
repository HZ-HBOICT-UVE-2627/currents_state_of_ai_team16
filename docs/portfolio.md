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

### Wednesday, lecture 1

1. Summary

   Jerry Keirsmaeker is an AI transformation leader at Aceve. Aceve refers to themselves as an “AI first” company. By this they mean that they actively use AI in each process that happens within the company. During his lecture Jerry specifically referred to three key fields, in the product, in how they work and in who they hire. In the product they claim to use AI-driven insight for an industry that’s currently driven on paper, gut feel and one very load-bearing spreadsheet. In how they work he talked about how agents are the default first attempt, not the innovation-lab experiment. Then in who they hire, they specifically look for people who can direct and verify ai – not who can type the fastest.

   For the next part of the lecture the subject moved away from Aceve specifically and more into general AI definition and opinions. AI agents were defined to consist of three things: A model, tools and loop + content. The model reasons, plans and writes while the tools edit files and run the actual code. The loop + content functions as the memory.
   During the lecture the different opinions on AI were discussed. Two main sides were posed, one side has an extremely negative view on AI, claiming that it will take all jobs and the world is going to end while the other is rather on the extreme positive side, which claims that AI is going to be the solution to all current problems. Jerry Keirsmaeker, had proposed the opinion that the trust was more in the middle of those, where AI would be a helpful tool but not a complete answer on its own.

   In the final part of the lecture, the lecturer advised us as future junior software engineers that the most important thing for the future job market would be to be adaptable. He suggested that during our study we should try out different roles within our teams, and learn to master each as well as keeping up with the newest changes within the tech industry. That way, by the time we are ready to graduate and enter the job market, we are the best possible candidates for the current industry.


2. Key insights

   - The job of a software developer is going to shift from manually writing code, to managing and reviewing AI written code.
   - AI doesn’t replace the function of a software developer, it replaces the most time costly procedures.
   - For future software developers, it is more important to learn how to properly direct and review AI, rather than to learn how to code fast.


3. Questions

   - What is AI going to do to the software developer career?
   - Is AI going to replace software engineers?
   - What tasks are AI agents usefull for and which ones are they less usefull for?

### Wednesday, lecture 2

1. Summary

   The lecture began with the lecturer talking about his experience working with AI assistants. He explained how in his own personal life he uses a fitness AI assistant to help him plan schedules and discuss his health. With this example he explained why an AI assistant can be so much more useful that simply talking to an AI chatbot and sending individual prompts. With an assistant, the AI has the proper context and background knowledge to know exactly how to help you best. When using individual prompts, the AI doesn't know you, your lifestyle and your preferences. 

   For this same reason, his marketing company also makes use of AI assistants, and actually has a whole team of AI assistants, including one called Marketing Mike. This team manages things like, marketing strategy, social media and other important aspects of the company. 

   For the next part of the lecture we were taught how to create our own AI assistant to help with a specific task using the BUILD format, in which each letter describes an individual phase. The first is Begin, which is where you pick your task. Second is Unpack, which is where you work out the skills. Then the third is Input where you map the knowledge. Fourth is Layout which is where you write the instructions. Finally there is the Debug phase which is for testing and improving.The first two stages, building and unpacking is where you work out what your are building and the last three: input, layout and debug is where you actually build it. 

   After the theoretical explanation we were given the link to a website with instruction to actually make our own AI assistant. In the first stage we’re given a prompt we have to copy and paste into an ai chat. After that the AI in return asks questions about what regular problems you might want an assistant for. After answering what kind of task you need an assistant for, the AI inquires more about what the AI should keep in mind to perform your task to the best of its abilities. When you are done answering questions you get a text file with all the information about what task your AI assistant should perform and what to keep in mind while doing so. After that you move onto phase 2, here you have to once again pase a prompt into the chatbox along wit the file you received last time. Here again more detailed questions are asked about how to perform the task as best as possible. At the end of these questions you once again get a text file with the detailed information all structured and written down. The next and last phase we were able to get to this lecture, in this chat you once again paste the two previous files and a new prompt.  It reads your two files, asks three clarifying questions, and then writes the instructions: a role, the task, how it works, what it knows about you, the style, and the opening question it should ask you. It also explains how to install it, paid or free. You end up with assistant-instructions.md, deliberately short, because the detail already sits in your other two files. 

   Then because of a lack of time we weren’t able to get to the last prompt. In the last phase  you give it your instructions plus one example of output that disappointed you. It works out whether the problem lies in the instructions, in the knowledge, or in how you asked, and it names the exact line to change and where. You get a rewritten version back. Use it this week, on real work. After this the only step left is to actually install the assistant.


2. Key insights

   - AI assistants are more useful for long term problems/tasks than single prompts.
   - AI assistant are relatively easy to build and can assist with day to day problems.


3. Questions

   - What are the benefits of building and using an AI assistent?
   - What is the diffrence between an AI assisnt and sending individual prompt to an AI chat?

### Wednesday, lecture 3

1. Summary

   During this lecture we learned about local LLM’s. Local LLM’s mean that you are not dependent on an existing service, you are dependent on your own hardware. All the data you send this LLM stays on your own computer, your data cannot be leaked or saved or stored. This also means that the costs are predictable since you need to invest in the hardware, where with a whole organization its is harder to measure. This also means that the only latency is based on what your hardware can support. 

   A model has a number of parameters. Parameters transform data, which entails that data goes through a lot of tensors and something comes out. The more of these parameters you have, the bigger your model is going to be.

   Most models are provided in a format called safetensors, the community produced their own GGUF’s. 

   Python pickles are effectively serialization. Most models are trained using python. 

   What happens is that when a model is trained, it gets output in a .bin format, which is then a pickle, which is just a data street.

   Quantization is the process of reducing the numbers of bits to represent one of those numbers. Which means you will still have the same number but just slightly less accurate.

   Then after explaining this theory, the lecturer continued by showing where to download these models, as well as the quantizations. After this he demo'd the LLM by asking it questions even while the internet was turned off.


2. Key insights

   - Local LLM’s run on your own hardware, and therefore don’t need internet.

3. Questions

   - What are local LLM’s?
   - What is quantization?
   - What are safetensors?


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

1. Dont implement code you dont understand.
2. Dont let ai write new code, only improve original code.
3. Try yourself before consulting ai.
4. Have specific and actionable.
5. Work with one ai consistently throughout the project.
6. Document all prompts.
7. Push to git between ai additions, and specify ai usage.
8. Never use ai for reasoning.
9. Dont use ai for documentation.
10. Allow ai for dummy data & testing.


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
