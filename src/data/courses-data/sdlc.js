export const sdlcCourse = {
  id: 'sdlc',
  title: 'SDLC',
  description: 'Software Development Life Cycle phases and methodologies.',
  officialDocs: null,
  tutorialLink: 'https://www.tutorialspoint.com/sdlc/index.htm',
  exerciseLink: null,
  sections: [
    {
      title: 'Software Applications',
      content: `A **software application** (or "app") is a program that runs on a computer, phone, or device to help users do specific tasks. It's like a tool in your toolbox — designed for a job, such as editing photos or managing files. In our fast-paced digital world, software is everywhere — from the apps on your phone to the systems running businesses. Software applications **automate tasks**, solve problems, and make life easier.\n\nExamples include: **Mobile Applications** (*WhatsApp* for chatting, *Google Pay* for payments), **Web Applications** (*Gmail* for email, *Amazon* for shopping — accessed via a browser, no installation needed), and **Desktop Applications** (*Microsoft Word* for writing, *Excel* for spreadsheets — installed on your computer).\n\n### Three Main Types of Software\n\n**System Software** — Acts as the "boss" of your computer, managing **hardware and resources**. It's like the operating system of a car — handling the engine so you can drive. Examples: *Windows*, *Linux*, *macOS*.\n\n**Application Software** — Helps users with everyday tasks like creating reports or editing videos. These are the apps on your phone's home screen — each for a specific purpose. Examples: *Google Docs*, *QuickBooks*, *Photoshop*.\n\n**Embedded Software** — Lives inside hardware devices, controlling their functions without you noticing. It's the "brain" in smart gadgets. Examples: Software in **ATM machines**, washing machines, or car dashboards.`,
      image: '/images/sdlc/sdlc-software-types.svg',
      keyPoints: [
        'Software applications automate tasks and solve problems.',
        'Three categories: Mobile, Web, and Desktop applications.',
        'System Software manages hardware (Windows, Linux, macOS).',
        'Application Software helps with user tasks (Docs, Photoshop).',
        'Embedded Software controls hardware devices (ATMs, IoT gadgets).'
      ]
    },
    {
      title: 'What is SDLC',
      content: `**SDLC** stands for **Software Development Life Cycle**. It is like a recipe for baking a cake — it outlines steps to *design*, *build*, *test*, and *maintain* software. It's a **roadmap** that ensures the final product is high-quality, meets user needs, and stays within budget. The SDLC provides a **structured framework** that defines tasks and deliverables at each stage of the development journey — from the initial concept through to the system's eventual retirement.\n\n### Purpose of SDLC\n\n**Ensures Quality** — Catches errors early to avoid "half-baked" software.\n**Reduces Risks and Costs** — Planning ahead prevents expensive fixes later.\n**Clear Planning** — Helps teams know who's doing what and when.\n**Better Teamwork** — Everyone from developers to testers works together smoothly.\n\nImagine building a *Lego* tower without instructions — it's messy! SDLC is those instructions, making sure your tower doesn't collapse. Every software product, whether it is a mobile app, a website, or a massive enterprise system, goes through some version of the SDLC. Understanding SDLC helps **developers**, **project managers**, and **stakeholders** communicate clearly, set expectations, track progress, and deliver value predictably. See the [SDLC tutorial](https://www.tutorialspoint.com/sdlc/index.htm) for a comprehensive guide.`,
      image: '/images/sdlc/sdlc-overview.svg',
      keyPoints: [
        'SDLC is a framework, not a rigid set of rules — it adapts to each team.',
        'Ensures Quality: catches errors early to avoid broken software.',
        'Reduces Risks and Costs: planning ahead prevents expensive fixes.',
        'Clear Planning: teams know who does what and when.',
        'Understanding SDLC is essential for all roles in a software team.'
      ]
    },
    {
      title: 'SDLC Phases Explained',
      content: `SDLC has **six main phases**, like chapters in a story. Each builds on the last, creating a pipeline from idea to deployed product.\n\n### Phase 1 — Requirement Analysis\n\nGather what users want (e.g., "I need an app to track fitness"). Interview **stakeholders** and document needs. Use tools like surveys or mind maps. Goal: *Avoid building the wrong thing!*\n\n### Phase 2 — Design\n\nPlan the blueprint — how the app looks (**UI**), stores data (**database**), and works (**architecture**). **High-Level Design** (HLD) defines the overall system, while **Low-Level Design** (LLD) details individual modules. Tools like *Figma* help with UI design.\n\n### Phase 3 — Development (Coding)\n\nDevelopers write actual code, turning designs into working software. **Version control** (\`Git\`), **code reviews**, and **pair programming** maintain quality and consistency.\n\n### Phase 4 — Testing\n\nCheck for bugs — test **functionality**, **speed**, and **security**. This includes **Unit Testing** (individual components), **Integration Testing** (modules together), **System Testing** (full system), and **User Acceptance Testing** (UAT). Tools like *Selenium* automate this.\n\n### Phase 5 — Deployment\n\nLaunch the software! Put it on servers or app stores for users. This can be a **Big Bang** deployment (all at once) or a **phased rollout** (*canary*, *blue-green*). Cloud platforms like *AWS* simplify deployment.\n\n### Phase 6 — Maintenance\n\nFix issues post-launch, add features, or update for new tech. This phase **never ends** — software evolves! It often consumes the **majority** of a project's total lifetime cost.`,
      image: '/images/sdlc/sdlc-phases.svg',
      keyPoints: [
        'Six phases: Requirements → Design → Development → Testing → Deployment → Maintenance.',
        'Requirement Analysis is the most critical phase — avoid building the wrong thing.',
        'Testing should happen continuously, not just at the end.',
        'Maintenance is the longest and most expensive phase.',
        'Each phase has clear entry and exit criteria with defined deliverables.'
      ]
    },
    {
      title: 'Waterfall Model',
      content: `The **Waterfall Model** is the oldest and most straightforward SDLC model. It follows a strict **linear sequential flow** — finish one phase fully before the next, like a waterfall that cannot flow upward. Each phase produces a **formal document** that serves as the input for the next.\n\nThe phases in Waterfall are: \`Requirements → Design → Implementation → Testing → Deployment → Maintenance\`. There is **no going back** to a previous phase once it is finished.\n\n### Pros\n\n**Simple** for small projects with fixed needs. Produces **extensive documentation** at each phase. Good for projects with strict **regulatory compliance** where documentation is mandatory.\n\n### Cons\n\n**Hard to change midway.** If a requirement is misunderstood during the analysis phase, the error may not be discovered until the testing phase — by which time fixing it is *extremely expensive*. There is **no opportunity** for customer feedback until the very end.\n\n**Example:** Building a basic website with set features, government contracts, or embedded systems with hardware dependencies.\n\nDespite its limitations, Waterfall taught the industry the importance of **documentation**, **planning**, and **structured phases**. Many modern methodologies evolved as a direct response to Waterfall's weaknesses.`,
      image: '/images/sdlc/sdlc-waterfall.svg',
      keyPoints: [
        'Strictly linear: finish one phase fully before the next.',
        'Best for well understood, stable, fixed requirements.',
        'Produces extensive documentation at each phase.',
        'High risk of late discovery of errors — hard to change midway.',
        'Not suitable for long, complex, or evolving projects.'
      ]
    },
    {
      title: 'V-Model (Verification & Validation)',
      content: `The **V-Model** (Verification and Validation Model) is an extension of the Waterfall Model. Instead of moving down in a linear fashion and testing only at the end, the V-Model maps each **development phase** to a corresponding **testing phase**. It is shaped like the letter **"V"** — development activities go down the left side, and testing activities come up the right side.\n\n### Left Side — Verification\n\n\`Requirements Analysis → System Design → Architecture Design → Module Design\`\n\n### Right Side — Validation\n\n\`Unit Testing → Integration Testing → System Testing → Acceptance Testing\`\n\nThe key insight is that **test planning happens in parallel** with development. While analysts are writing requirements, **QA testers** are writing acceptance test cases. While architects design the system, **integration test plans** are created. This means defects are caught *much earlier*.\n\nThe V-Model is commonly used in **safety-critical industries** like *medical devices*, *aviation software*, and *automotive systems* where rigorous verification at every level is mandatory. It provides much higher confidence in quality than basic Waterfall.\n\nHowever, the V-Model inherits Waterfall's biggest weakness: **rigidity**. Once a phase is completed, changes are difficult and costly. It also assumes requirements are **stable and well-defined** upfront.`,
      image: '/images/sdlc/sdlc-v-model.svg',
      keyPoints: [
        'Every development phase has a corresponding test phase.',
        'Test planning starts early, reducing late-stage defects.',
        'Ideal for safety-critical and regulated industries.',
        'Still rigid — does not accommodate changing requirements well.',
        'Higher quality assurance than plain Waterfall.'
      ]
    },
    {
      title: 'Iterative & Spiral Models',
      content: `The **Iterative Model** breaks the project into repeated cycles (**iterations**). Each iteration goes through all SDLC phases — *planning*, *design*, *coding*, and *testing* — but for a small portion of the system. After each iteration, the product is reviewed, feedback is gathered, and the next iteration builds upon the previous one.\n\n### Iterative Model\n\n**Pros:** Early testing and flexibility. A *working version* (however incomplete) is available early. Stakeholders can see progress, provide feedback, and course-correct before significant investment is made.\n\n**Example:** Developing a game, adding levels one by one.\n\n### Spiral Model\n\nThe **Spiral Model** (proposed by *Barry Boehm*) combines iterative development with systematic **risk analysis**. Each cycle of the spiral contains four quadrants:\n\n**1)** Determine Objectives\n**2)** Identify and Resolve Risks\n**3)** Develop and Test\n**4)** Plan the Next Iteration\n\n**Risk analysis** is the defining feature. Before committing resources to build something, the team evaluates what could go wrong and builds **prototypes** to mitigate those risks. This makes the Spiral Model particularly well-suited for *large*, *expensive*, and *complicated* projects where failure is not an option.\n\n**Example:** High-security banking software, large defense projects.\n\nBoth models are more flexible than Waterfall but require **experienced project managers**. Without careful control, iterations can spiral into *scope creep* or endless refinement cycles.`,
      image: '/images/sdlc/sdlc-iterative-model.png',
      keyPoints: [
        'Iterative: build in small increments, gather feedback, repeat.',
        'Spiral: adds formal risk analysis to each iteration cycle.',
        'Working software is available early for review.',
        'Reduces risk of building the wrong thing.',
        'Requires experienced management to avoid scope creep.'
      ]
    },
    {
      title: 'Agile Methodology',
      content: `**Agile** is a flexible way to build software, focusing on **small, quick deliveries** instead of one big launch. It's like eating a pizza slice by slice — enjoy progress along the way. Agile is defined by the [Agile Manifesto](https://agilemanifesto.org/) (2001) which emphasizes:\n\n**Individuals and interactions** over processes and tools\n**Working software** over comprehensive documentation\n**Customer collaboration** over contract negotiation\n**Responding to change** over following a plan\n\n### Key Characteristics\n\n**Short Cycles** — Work in "sprints" (short bursts of **1-4 weeks**).\n**Frequent Releases** — Deliver working parts often.\n**Customer Feedback** — Involve users early and often.\n**Adaptability** — Change plans if needs evolve.\n**Team Collaboration** — Daily meetings (**stand-ups**) keep everyone aligned.\n\nAgile assumes that requirements **will change**. Instead of fighting change, Agile *embraces* it. The **backlog** — a prioritized list of features and tasks — is constantly refined. Items at the top are well-defined and ready for development; items at the bottom are rough ideas that will be refined later.\n\n### Popular Agile Frameworks\n\n**Scrum** — The most popular, with defined roles, events, and artifacts.\n**Kanban** — Continuous flow without fixed sprints.\n**Extreme Programming (XP)** — Focused on technical practices like *TDD* and *pair programming*.\n**SAFe** — Scaled Agile Framework for large enterprises. Agile is popular in companies like *Google*, *Spotify*, and *Netflix*.`,
      image: '/images/sdlc/sdlc-agile-scrum.svg',
      keyPoints: [
        '4 core values defined in the Agile Manifesto (2001).',
        'Work is delivered in short Sprint cycles (1-4 weeks).',
        'Embraces change rather than resisting it.',
        'The backlog is continuously prioritized and refined.',
        'Scrum, Kanban, and XP are popular Agile frameworks.',
        'Requires organizational commitment to succeed.'
      ]
    },
    {
      title: 'Agile Roles & Responsibilities',
      content: `In Agile, success depends on **clear roles** within the team. Unlike traditional setups with strict hierarchies, Agile promotes **collaboration**. Think of it as a sports team: everyone has a position, but they work together to win.\n\n### Product Owner (PO)\n\nRepresents the **customer** or stakeholders. They prioritize the **product backlog** (a list of features and tasks), define **user stories** (e.g., "As a user, I want to log in securely"), and ensure the team builds the most valuable features first. The PO must be available to clarify requirements and make decisions quickly. A PO who is absent or indecisive creates a **bottleneck** for the entire team.\n\n### Scrum Master (SM)\n\nActs as a **coach or facilitator**. They remove obstacles (e.g., tool issues or team conflicts), enforce Agile practices, run meetings like **daily stand-ups**, and help the team improve. A great Scrum Master makes themselves *unnecessary* over time by building a **self-organizing team**.\n\n### Development Team\n\nThe hands-on builders: **developers**, **designers**, **testers**, etc. They self-organize to complete sprint tasks, collaborate daily, and deliver working software. No titles like "lead developer" matter in Scrum — the *whole team* is accountable. Teams are **cross-functional** (mix of skills) and small (**5-9 people**) for efficiency.\n\nIn scaled environments, additional roles may appear: **Release Train Engineer** (SAFe), **Agile Coach**, and **Chapter Lead** (*Spotify model*). These roles help coordinate across multiple teams while preserving team autonomy.`,
      image: '/images/sdlc/sdlc-agile-scrum.svg',
      keyPoints: [
        'Product Owner: owns the backlog, represents customer, maximizes value.',
        'Scrum Master: servant-leader, removes impediments, facilitates ceremonies.',
        'Development Team: self-organizing, cross-functional (5-9 people).',
        'No traditional "project manager" role in Scrum.',
        'Clarity of roles prevents organizational dysfunction.'
      ]
    },
    {
      title: 'Agile Sprints & Ceremonies',
      content: `A **Sprint** is a **1-4 week time-box** where your team completes and delivers a chunk of work. It's like a mini-project with a deadline. Once a Sprint starts, the **scope is locked** — no new work can be added.\n\n### Sprint Workflow\n\n**1. Sprint Planning** (2-4 hours) — Decide what to build. The team selects items from the **Product Backlog** and commits to a realistic amount of work. The output is the **Sprint Backlog**.\n\n**2. Development** — Code and create. Developers build the planned features while following coding standards and doing **code reviews**.\n\n**3. Testing** — Check quality. QA verifies against requirements.\n\n**4. Sprint Review** (1-2 hours) — Show the work to users and stakeholders. Feedback is collected and the Product Backlog is updated.\n\n**5. Sprint Retrospective** (1-1.5 hours) — Discuss what went well and what could improve. This is the **most important ceremony** for continuous improvement.\n\n### Daily Standup\n\n**15 minutes, every day** — keeps the team synchronized. Each person answers: *What did I do yesterday? What will I do today? Are there blockers?*\n\n### Backlog Refinement\n\nOngoing (~10% of Sprint time) — The team reviews upcoming items, breaks large items into smaller ones, and estimates effort.\n\n**Example for an e-commerce app:** Sprint 1 — Build user login/registration. Sprint 2 — Add product listings. Sprint 3 — Implement cart and payment — users can buy!`,
      image: '/images/sdlc/sdlc-sprint-cycle.svg',
      keyPoints: [
        'Sprint: a 1-4 week time-boxed iteration with locked scope.',
        'Sprint Planning → Development → Testing → Review → Retrospective.',
        'Daily Standup: 15-minute team synchronization every day.',
        'Sprint Retrospective is key to continuous improvement.',
        'Definition of Done (DoD) ensures consistent quality across sprints.'
      ]
    },
    {
      title: 'Kanban Methodology',
      content: `**Kanban**, originating from *Toyota's* manufacturing system, is a method for managing work by **visualizing it**, **limiting work in progress**, and **maximizing flow efficiency**. Unlike Scrum, Kanban does *not* have fixed-length sprints, defined roles, or mandatory ceremonies.\n\n### The Kanban Board\n\nThe heart of Kanban is the **Kanban Board** — a visual board with columns representing workflow stages (e.g., \`To Do → In Progress → Code Review → Testing → Done\`). Each work item is a **card** that moves across the board as it progresses.\n\n### Work In Progress (WIP) Limits\n\nThe most important Kanban principle is **limiting WIP**. Each column has a maximum number of cards allowed. For example, if the "In Progress" column has a **WIP limit of 3**, no new work can be started until one item is moved to the next stage. This prevents *multitasking*, reduces *context switching*, and **exposes bottlenecks**.\n\n### Flow Metrics\n\nKanban emphasizes flow metrics: **Lead Time** (total time from request to delivery), **Cycle Time** (time from work started to work completed), and **Throughput** (number of items completed per time period). By measuring these metrics, teams can objectively identify improvements and predict delivery dates.\n\nKanban is ideal for teams that handle a **continuous stream** of incoming work (*support teams*, *operations*, *maintenance*) rather than project-based work. Many teams combine Scrum and Kanban into **"Scrumban"** — using Scrum's ceremonies and roles with Kanban's visual board and WIP limits.`,
      image: '/images/sdlc/sdlc-kanban.svg',
      keyPoints: [
        'Visualize workflow using a Kanban board.',
        'Limit Work In Progress (WIP) to eliminate bottlenecks.',
        'No fixed sprints — continuous flow of work.',
        'Key metrics: Lead Time, Cycle Time, Throughput.',
        'Ideal for support, operations, and maintenance teams.',
        'Can be combined with Scrum (Scrumban).'
      ]
    },
    {
      title: 'Traditional SDLC vs. Agile',
      content: `Many companies mix both approaches — use **Traditional** for planning, **Agile** for execution. Here's a comparison of the two approaches across key aspects:\n\n### Approach\n\n**Traditional SDLC** (e.g., Waterfall) follows a **sequential** process (one phase at a time), while **Agile** follows an **iterative** approach (loops of improvement).\n\n### Flexibility\n\nTraditional has **low flexibility** (hard to change requirements once a phase is complete), while Agile has **high flexibility** (adapts to changes easily at any point).\n\n### Feedback\n\nIn Traditional, feedback comes **at the end** of the project. In Agile, feedback is **continuous** — gathered after each sprint.\n\n### Delivery\n\nTraditional aims for **one big release** at the end. Agile delivers **frequent small releases**, each adding value.\n\n### Risk Management\n\nTraditional carries **higher risk** if requirements change mid-project. Agile has **lower risk** due to early and continuous feedback loops.\n\n### Best For\n\nTraditional works best for **fixed, simple projects** with stable requirements. Agile excels in **dynamic, complex projects** where requirements evolve.\n\nIn practice, many organizations use a **hybrid approach** — following Agile for software development while using Waterfall-style stages for procurement and compliance. The key is to understand the principles behind each model and apply them **thoughtfully** rather than *dogmatically*.`,
      image: '/images/sdlc/sdlc-sprint-example.png',
      keyPoints: [
        'Traditional: sequential, one big release. Agile: iterative, frequent releases.',
        'Agile offers higher flexibility and continuous feedback.',
        'Traditional is better for fixed requirements; Agile for evolving ones.',
        'Risk is lower in Agile due to early feedback loops.',
        'Hybrid approaches are common — mix both based on project needs.',
        'No single model is universally best — match to your context.'
      ]
    },
    { title: 'Best Practices & Code Standards', content: `**Define clear requirements and acceptance criteria** before writing any code. The most expensive bugs are the ones where you built the wrong thing. Invest time in understanding *what* to build before *how* to build it — even in Agile workflows with short iterations.\n\n### Automate Everything\n\n**Automate testing, builds, and deployments** with CI/CD pipelines. Manual processes are slow, error-prone, and don't scale. Every commit should trigger automated tests. Every merge to main should produce a deployable artifact. Use feature flags to decouple deployment from release.\n\n### Documentation & Learning\n\nDocument **architecture decisions** using ADRs (Architecture Decision Records) — future team members need to understand *why* choices were made, not just *what* was built. Conduct **retrospectives** regularly to identify process improvements. No single methodology is perfect — adapt Agile, Scrum, or Kanban to your team's actual needs.`, code: `# Development Lifecycle Checklist\n\n## Before Writing Code\n- [ ] Requirements documented and reviewed\n- [ ] Acceptance criteria defined for each story\n- [ ] Technical approach discussed with team\n- [ ] Edge cases and error scenarios identified\n\n## During Development\n- [ ] Feature branch created from latest main\n- [ ] Unit tests written alongside code\n- [ ] Code follows team coding standards\n- [ ] Self-review completed before PR\n\n## Before Merging\n- [ ] All CI tests pass (unit, integration, e2e)\n- [ ] Code reviewed and approved by peers\n- [ ] Documentation updated if API changes\n- [ ] No secrets or credentials in code\n\n## Before Release\n- [ ] Staging environment tested\n- [ ] Deployment plan and rollback strategy ready\n- [ ] Monitoring and alerting configured\n- [ ] Release notes prepared\n\n## After Release\n- [ ] Smoke tests pass in production\n- [ ] Monitoring dashboards checked\n- [ ] Retrospective items captured`, codeLabel: 'Lifecycle Checklist', keyPoints: ['Define clear requirements and acceptance criteria before coding.', 'Automate testing, builds, and deployments with CI/CD pipelines.', 'Document architecture decisions with ADRs for future developers.', 'Conduct retrospectives regularly to continuously improve processes.'] }
  ]
};
