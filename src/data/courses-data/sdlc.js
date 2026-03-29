export const sdlcCourse = {
  id: 'sdlc',
  title: 'SDLC',
  description: 'Software Development Life Cycle phases and methodologies.',
  officialDocs: null,
  tutorialLink: 'https://www.tutorialspoint.com/sdlc/index.htm',
  exerciseLink: null,
  sections: [
    {
      title: 'What is SDLC',
      content: `SDLC stands for Software Development Life Cycle. It is a systematic process for planning, creating, testing, and deploying an information system. The SDLC provides a structured framework that defines tasks and deliverables at each stage of the development journey—from the initial concept through to the system's eventual retirement.

The purpose of the SDLC is to produce high-quality software that meets or exceeds customer expectations, reaches completion within time and cost estimates, and works effectively and efficiently in the current and planned information technology infrastructure. It is not a single methodology but rather a conceptual framework that teams adapt to their own needs.

Every software product, whether it is a mobile app, a website, or a massive enterprise system, goes through some version of the SDLC. Understanding SDLC helps developers, project managers, and stakeholders communicate clearly, set expectations, track progress, and deliver value predictably.`,
      image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=60',
      keyPoints: [
        'SDLC is a framework, not a rigid set of rules—it adapts to each team.',
        'It ensures software is developed predictably and with quality.',
        'Every phase has defined inputs, processes, and deliverables.',
        'Understanding SDLC is essential for all roles in a software team.'
      ]
    },
    {
      title: 'SDLC Phases Explained',
      content: `The SDLC is typically divided into six to seven core phases. Each phase feeds into the next, creating a pipeline from idea to deployed product.

Phase 1 — Planning: This is where the project scope is defined. Stakeholders, budget, timelines, feasibility studies, and resource allocation are established. The output is a Project Plan or a Software Requirements Specification (SRS) document.

Phase 2 — Requirements Analysis: Business analysts work closely with stakeholders to gather detailed functional and non-functional requirements. What should the system do? What quality attributes must it have (performance, security, scalability)? The output is a Requirements Document.

Phase 3 — Design: Architects and senior engineers translate requirements into a technical blueprint. This includes system architecture diagrams, database schemas, UI mockups, API contracts, and technology stack decisions. High-Level Design (HLD) defines the overall system, while Low-Level Design (LLD) details individual modules.

Phase 4 — Implementation (Coding): This is where developers write actual code. The design documents guide the team, and coding standards ensure consistency. Version control (Git), code reviews, and pair programming maintain quality during this phase.

Phase 5 — Testing: QA engineers verify the software against the requirements. This includes Unit Testing (individual components), Integration Testing (modules together), System Testing (full system), and User Acceptance Testing (UAT, by stakeholders). Bugs are logged, prioritized, and fixed.

Phase 6 — Deployment: The tested software is released to production. This can be a Big Bang deployment (all at once) or a phased rollout (canary, blue-green). Monitoring and alerting systems are set up to catch post-launch issues.

Phase 7 — Maintenance: After deployment, the software enters maintenance. Bug fixes, security patches, performance improvements, and new feature requests are handled iteratively. This phase often consumes the majority of a software project's total lifetime cost.`,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60',
      keyPoints: [
        'Each phase has clear entry and exit criteria.',
        'Requirements analysis is the most critical phase for project success.',
        'Testing is not a single phase—it should happen continuously.',
        'Maintenance is the longest and most expensive phase.'
      ]
    },
    {
      title: 'Waterfall Model',
      content: `The Waterfall Model is the oldest and most straightforward SDLC model. It follows a strict linear sequential flow—each phase must be fully completed before the next one begins. There is no going back to a previous phase once it is finished. Think of water flowing down a cliff: it cannot flow upward.

The phases in Waterfall are: Requirements → Design → Implementation → Testing → Deployment → Maintenance. Each phase produces a formal document that serves as the input for the next.

Waterfall works best when requirements are very well understood, stable, and unlikely to change. Examples include government projects, construction software, or projects with strict regulatory compliance where documentation is mandatory. It is also useful for short projects where the scope is crystal clear.

The biggest disadvantage of Waterfall is its inflexibility. If a requirement is misunderstood during the analysis phase, the error may not be discovered until the testing phase—by which time fixing it is extremely expensive. There is no opportunity for customer feedback until the very end, which makes Waterfall risky for projects with evolving needs.

Despite its limitations, Waterfall taught the industry the importance of documentation, planning, and structured phases. Many modern methodologies evolved as a direct response to Waterfall's weaknesses.`,
      keyPoints: [
        'Strictly linear: no going back to previous phases.',
        'Best for well understood, stable requirements.',
        'Produces extensive documentation at each phase.',
        'High risk of late discovery of errors.',
        'Not suitable for long, complex, or evolving projects.'
      ]
    },
    {
      title: 'V-Model (Verification & Validation)',
      content: `The V-Model (Verification and Validation Model) is an extension of the Waterfall Model. Instead of moving down in a linear fashion and testing only at the end, the V-Model maps each development phase to a corresponding testing phase. It is shaped like the letter "V"—development activities go down the left side, and testing activities come up the right side.

On the left side (Verification): Requirements Analysis → System Design → Architecture Design → Module Design. On the right side (Validation): Unit Testing → Integration Testing → System Testing → Acceptance Testing.

The key insight is that test planning happens in parallel with development. While analysts are writing requirements, QA testers are writing acceptance test cases. While architects design the system, integration test plans are created. This means defects are caught much earlier.

The V-Model is commonly used in safety-critical industries like medical devices, aviation software, and automotive systems where rigorous verification at every level is mandatory. It provides much higher confidence in quality than basic Waterfall.

However, the V-Model inherits Waterfall's biggest weakness: rigidity. Once a phase is completed, changes are difficult and costly. It also assumes requirements are stable and well-defined upfront.`,
      keyPoints: [
        'Every development phase has a corresponding test phase.',
        'Test planning starts early, reducing late-stage defects.',
        'Ideal for safety-critical and regulated industries.',
        'Still rigid—does not accommodate changing requirements well.',
        'Higher quality assurance than plain Waterfall.'
      ]
    },
    {
      title: 'Iterative & Spiral Models',
      content: `The Iterative Model breaks the project into repeated cycles (iterations). Each iteration goes through all SDLC phases—planning, design, coding, and testing—but for a small portion of the system. After each iteration, the product is reviewed, feedback is gathered, and the next iteration builds upon the previous one.

The benefit is that a working version (however incomplete) is available early. Stakeholders can see progress, provide feedback, and course-correct before significant investment is made. Risk is reduced because problems surface early.

The Spiral Model (proposed by Barry Boehm) combines iterative development with systematic risk analysis. Each cycle of the spiral contains four quadrants: 1) Determine Objectives, 2) Identify and Resolve Risks, 3) Develop and Test, 4) Plan the Next Iteration.

Risk analysis is the defining feature of the Spiral Model. Before committing resources to build something, the team evaluates what could go wrong and builds prototypes to mitigate those risks. This makes the Spiral Model particularly well-suited for large, expensive, and complicated projects where failure is not an option.

Both models are more flexible than Waterfall but require experienced project managers. Without careful control, iterations can spiral (pun intended) into scope creep or endless refinement cycles.`,
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
      content: `Agile is not a single methodology—it is a set of values and principles defined in the Agile Manifesto (2001). At its core, Agile emphasizes: Individuals and interactions over processes and tools, Working software over comprehensive documentation, Customer collaboration over contract negotiation, and Responding to change over following a plan.

Agile breaks work into small, manageable increments called Sprints (typically 1-4 weeks). At the end of each sprint, a potentially shippable product increment is delivered. The team reviews what was accomplished, gathers stakeholder feedback, reflects on how they worked, and plans the next sprint. This creates a continuous cycle of delivery and improvement.

Agile assumes that requirements will change. Instead of fighting change, Agile embraces it. The backlog—a prioritized list of features and tasks—is constantly refined. Items at the top are well-defined and ready for development; items at the bottom are rough ideas that will be refined later.

Key Agile frameworks include Scrum (the most popular, with defined roles, events, and artifacts), Kanban (continuous flow without fixed sprints), Extreme Programming (XP, focused on technical practices like TDD and pair programming), and SAFe (Scaled Agile Framework for large enterprises).

Agile has become the dominant methodology in modern software development because it delivers value quickly, reduces waste, and adapts to market changes. However, Agile requires genuine commitment from the entire organization. Doing "Agile in name only" (writing user stories but still following Waterfall thinking) is a common pitfall known as "Agile theater."`,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
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
      title: 'Scrum Framework Deep Dive',
      content: `Scrum is the most widely adopted Agile framework. It provides a lightweight structure for teams to deliver complex products incrementally. Scrum defines specific roles, events, and artifacts that work together to create transparency, inspection, and adaptation.

The Scrum Team consists of three roles: the Product Owner (owns the backlog, prioritizes features, represents the customer), the Scrum Master (facilitates the process, removes impediments, coaches the team on Scrum), and the Development Team (cross-functional group of 3-9 professionals who do the actual work). There is no project manager in Scrum—the team is self-organizing.

A Sprint is a time-boxed period (usually 2 weeks) during which the team commits to delivering a defined set of backlog items. Once a Sprint starts, the scope is locked—no new work can be added. If priorities change dramatically, the Sprint can be cancelled (this is rare).

The Sprint Backlog is the set of items the team has committed to for the current Sprint, plus a plan for delivering them. The Daily Standup (15 minutes, every day) keeps the team synchronized. Each person answers: What did I do yesterday? What will I do today? Are there blockers? This is a synchronization event—not a status report to management.

An important Scrum concept is the Definition of Done (DoD). This is a shared checklist that defines what "done" means for every backlog item—for example: code written, unit tests passing, code reviewed, deployed to staging, documentation updated. Without a clear DoD, quality becomes subjective and inconsistent.`,
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
      keyPoints: [
        'Three roles: Product Owner, Scrum Master, Development Team.',
        'Sprint: a time-boxed iteration (typically 2 weeks).',
        'Sprint scope is locked once the Sprint begins.',
        'Daily Standup: 15-minute synchronization event.',
        'Definition of Done (DoD) ensures consistent quality.'
      ]
    },
    {
      title: 'Agile Ceremonies (Meetings)',
      content: `Scrum defines five key Ceremonies (also called Events). Each serves a specific purpose to ensure the team stays aligned and continuously improves.

Sprint Planning (2-4 hours): The team selects items from the Product Backlog to work on during the upcoming Sprint. The Product Owner explains the highest-priority items, and the Development Team estimates effort and commits to a realistic amount of work. The output is the Sprint Backlog—a concrete plan for the Sprint.

Daily Standup / Daily Scrum (15 minutes): Every day, the team meets briefly. Each member shares what they did since the last standup, what they plan to do next, and any blockers. The Scrum Master helps resolve blockers. This is not a reporting session—it is for team coordination.

Sprint Review (1-2 hours): At the end of the Sprint, the team demonstrates the completed work to stakeholders. Feedback is collected, and the Product Backlog is updated based on new insights. This event ensures stakeholders see real, working software—not slides or promises.

Sprint Retrospective (1-1.5 hours): After the Sprint Review, the team reflects privately on how they worked. What went well? What could be improved? What will we commit to changing in the next Sprint? This is the most important ceremony for continuous improvement. A team that skips retrospectives will stagnate.

Backlog Refinement (ongoing, ~10% of Sprint time): The team and Product Owner review upcoming backlog items, break large items into smaller ones, add acceptance criteria, and estimate effort. Well-refined backlogs lead to smooth Sprint Planning sessions.`,
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop&q=60',
      keyPoints: [
        'Sprint Planning: select and commit to Sprint work.',
        'Daily Standup: 15-minute team synchronization.',
        'Sprint Review: demo working software to stakeholders.',
        'Sprint Retrospective: reflect and improve the process.',
        'Backlog Refinement: prepare items for future Sprints.'
      ]
    },
    {
      title: 'Agile Roles & Responsibilities',
      content: `Understanding roles in Agile is critical because misunderstanding them leads to dysfunction. A "Scrum Master" who acts like a traditional project manager, or a "Product Owner" who is actually a committee of stakeholders, will cause the team to fail.

The Product Owner (PO) is the single person responsible for maximizing the value of the product. They own the Product Backlog—the ordered list of everything that might be needed in the product. The PO decides what gets built and in what order. They must be available to clarify requirements and make decisions quickly. A PO who is absent or indecisive creates a bottleneck for the entire team.

The Scrum Master (SM) is a servant-leader. They do not manage the team—they serve the team by removing impediments, facilitating ceremonies, coaching on Agile practices, and shielding the team from external distractions. A great Scrum Master makes themselves unnecessary over time by building a self-organizing team.

The Development Team is a cross-functional group of professionals (developers, testers, designers, ops engineers) who collectively have all the skills needed to deliver a product increment. They self-organize: the team decides how to accomplish the work, not the Scrum Master or PO. Titles like "senior" or "junior" exist but do not affect Scrum accountability—the whole team is responsible.

In scaled environments, additional roles may appear: Release Train Engineer (SAFe), Agile Coach, and Chapter Lead (Spotify model). These roles help coordinate across multiple teams while preserving team autonomy.`,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
      keyPoints: [
        'Product Owner: owns the backlog, maximizes value.',
        'Scrum Master: servant-leader, removes impediments.',
        'Development Team: self-organizing, cross-functional.',
        'No traditional "project manager" role in Scrum.',
        'Clarity of roles prevents organizational dysfunction.'
      ]
    },
    {
      title: 'Kanban Methodology',
      content: `Kanban, originating from Toyota's manufacturing system, is a method for managing work by visualizing it, limiting work in progress, and maximizing flow efficiency. Unlike Scrum, Kanban does not have fixed-length sprints, defined roles, or mandatory ceremonies.

The heart of Kanban is the Kanban Board—a visual board with columns representing workflow stages (e.g., To Do → In Progress → Code Review → Testing → Done). Each work item is a card that moves across the board as it progresses.

The most important Kanban principle is limiting Work In Progress (WIP). Each column has a maximum number of cards allowed. For example, if the "In Progress" column has a WIP limit of 3, no new work can be started until one item is moved to the next stage. This prevents multitasking, reduces context switching, and exposes bottlenecks.

Kanban emphasizes flow metrics: Lead Time (total time from request to delivery), Cycle Time (time from work started to work completed), and Throughput (number of items completed per time period). By measuring these metrics, teams can objectively identify improvements and predict delivery dates.

Kanban is ideal for teams that handle a continuous stream of incoming work (support teams, operations, maintenance) rather than project-based work. Many teams combine Scrum and Kanban into "Scrumban"—using Scrum's ceremonies and roles with Kanban's visual board and WIP limits.`,
      keyPoints: [
        'Visualize workflow using a Kanban board.',
        'Limit Work In Progress (WIP) to eliminate bottlenecks.',
        'No fixed sprints—continuous flow of work.',
        'Key metrics: Lead Time, Cycle Time, Throughput.',
        'Ideal for support, operations, and maintenance teams.',
        'Can be combined with Scrum (Scrumban).'
      ]
    },
    {
      title: 'Choosing the Right SDLC Model',
      content: `No single SDLC model is universally "best." The right choice depends on project characteristics, team maturity, client relationships, regulatory requirements, and risk tolerance.

Use Waterfall when: Requirements are completely known and fixed. The project is short with a clear scope. Regulatory compliance demands thorough documentation at every stage. Examples: government contracts, embedded systems with hardware dependencies.

Use V-Model when: You need rigorous verification at every development level. Safety-critical projects where failure has severe consequences. Examples: medical device firmware, aviation control systems.

Use Agile (Scrum) when: Requirements are expected to evolve. You need to deliver working software frequently. Close collaboration with stakeholders is possible. The team is cross-functional and empowered. Examples: SaaS products, mobile apps, startups.

Use Kanban when: Work arrives as a continuous stream rather than in projects. You need to optimize flow and reduce wait times. Examples: customer support, DevOps, IT operations.

Use Spiral when: The project is large, expensive, and high-risk. Requirements are complex and not fully understood. Building prototypes to reduce risk is feasible. Examples: large defense projects, complex enterprise transformations.

In practice, many organizations use a hybrid approach. They might follow Agile for software development while using Waterfall-style stages for procurement and compliance. The key is to understand the principles behind each model and apply them thoughtfully rather than dogmatically.`,
      keyPoints: [
        'No single model is universally best.',
        'Match the model to project needs, team, and constraints.',
        'Stable requirements → Waterfall or V-Model.',
        'Evolving requirements → Agile (Scrum/Kanban).',
        'High-risk, complex projects → Spiral.',
        'Hybrid approaches are common and practical.'
      ]
    }
  ]
};
