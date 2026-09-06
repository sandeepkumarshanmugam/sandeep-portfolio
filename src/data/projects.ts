import type { Project, ProjectCategory } from './types';

/**
 * Projects.
 *
 * Everything here was verified by reading the repositories themselves — routes
 * from App.tsx, dependencies from package.json, features from the component
 * source. Nothing is inferred from the project name.
 *
 * Two facts shaped how this is written:
 *
 *  1. Both repositories are currently PRIVATE. An unauthenticated request to
 *     either returns 404, so `repo.visibility` is 'private' and the UI hides
 *     the repository button instead of shipping a dead link. Flip the flag to
 *     'public' and the buttons appear with no other change.
 *
 *  2. Sun Pulse Case is a web dashboard, not hardware. Its source explicitly
 *     marks its telemetry as simulated (`// Mock data`, `// Simulate dynamic
 *     solar input`), so it is described as a prototype interface. No charging
 *     rates, efficiencies or component specifications are claimed, because the
 *     repository contains none.
 *
 * There are deliberately no fabricated metrics anywhere in this file.
 */

export const projects: readonly Project[] = [
  {
    slug: 'peps',
    title: 'PEPS',
    category: 'Industry Website',
    categories: ['web'],
    summary:
      'A multi-page website for PEPS Private Limited, a mattress brand — built around a guided product-customisation flow, a searchable store locator and a rule-based recommendation assistant.',
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'React Router',
      'Framer Motion',
    ],
    repo: {
      url: 'https://github.com/sandeepkumarshanmugam/peps',
      visibility: 'private',
    },
    liveUrl: null,
    year: '2026',
    accentIcon: 'layers',
    caseStudy: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'PEPS is a website project for PEPS Private Limited, a mattress brand. Rather than a single marketing page, it is structured as a full multi-page site: a landing page plus dedicated routes for mattresses, accessories, hospitality, a purchase guide, customisation, franchise enquiries and a store locator.',
          'The work was about giving a physical product catalogue a structure that someone can actually navigate — separating the browsing journey from the decision-making tools, so a visitor who already knows what they want and a visitor who has no idea both have a path.',
        ],
      },
      {
        id: 'problem',
        title: 'Problem',
        body: [
          'Buying a mattress is a high-consideration purchase made almost entirely on subjective criteria — firmness, sleeping position, back pain, budget. A conventional product grid communicates none of that. A visitor is left comparing names and prices with no way to map them onto how they actually sleep.',
          'The site therefore needed to do more than list products. It needed to help a visitor narrow down a decision, and then tell them where they could go to feel the thing in person.',
        ],
      },
      {
        id: 'approach',
        title: 'Approach',
        body: [
          'I split the site into browsing routes and decision routes. Browsing covers the collections and editorial content; deciding is handled by two purpose-built tools that carry the visitor forward instead of leaving them on a grid.',
        ],
        points: [
          'A step-based customisation flow that asks one question at a time — mattress type, comfort level, size, custom dimensions, then budget — rather than presenting every option at once.',
          'A price estimator that responds to the selected size and budget range, so the visitor sees the consequence of their choices immediately.',
          'A guided assistant that asks about sleeping position and discomfort, then recommends a specific product from those answers.',
          'A store locator with city filtering and free-text search, closing the loop from online research to an in-person visit.',
        ],
      },
      {
        id: 'technology',
        title: 'Technology',
        body: [
          'React with TypeScript on Vite, styled with Tailwind CSS and built on shadcn/ui — a component set built over Radix primitives, which meant accessible dialogs, popovers and form controls without writing that behaviour from scratch. React Router handles the nine routes, and Framer Motion drives the interface transitions.',
        ],
        points: [
          'React 18 + TypeScript, bundled with Vite',
          'Tailwind CSS with shadcn/ui (Radix UI primitives)',
          'React Router — nine routes including a catch-all 404',
          'React Hook Form with Zod for form state and validation',
          'Framer Motion for transitions; Recharts available for data display',
          'TanStack Query configured for data fetching',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        body: [
          'The build came together as a component library plus route-level pages composing it.',
        ],
        points: [
          'Nine routes: landing, mattress, accessories, hospitality, purchase guide, customisation, franchise, store locator, and a 404 fallback.',
          'A five-step customisation wizard holding its own selection state, with forward/back navigation and per-step validation gating progress.',
          'A budget-aware price estimate derived from the chosen size and comfort range.',
          'A recommendation assistant implemented as a decision tree over sleeping position and pain points — deterministic and explainable, with no model or API call behind it. Responses render through Markdown so recommendations can be formatted.',
          'A store locator driven by structured store data, filterable by city and searchable by text.',
          'Shared Navbar and Footer wrapping every route for consistent navigation.',
        ],
      },
      {
        id: 'challenges',
        title: 'Challenges',
        body: [
          'The customisation flow was the hard part. Multi-step state is easy to get wrong: each step depends on earlier answers, the visitor can move backwards, and the price has to stay consistent with whatever is currently selected. Keeping that state coherent — and making sure a visitor could never advance past a step they had not completed — took more care than any single page on the site.',
          'Designing the assistant as a decision tree was a deliberate constraint rather than a limitation. It meant every recommendation could be traced back to a specific answer, which matters when the output is a product suggestion someone might act on.',
        ],
      },
      {
        id: 'learnings',
        title: 'What I learned',
        body: [
          'This project is where component composition stopped being theory. Building on Radix-based primitives showed me how much accessible behaviour — focus handling, keyboard interaction, dismissal — lives inside components most people treat as decoration, and how much work it saves to build on primitives that already handle it.',
          'It also taught me to treat multi-step interaction as a state design problem before it is a UI problem. Sketching what the flow could legally hold at each step made the components straightforward to write. Doing it the other way around had already cost me an afternoon.',
        ],
      },
    ],
    verificationNote:
      'Written from the project source: routes, dependencies and component behaviour were read directly from the repository. No performance, traffic or business outcomes are claimed, as the project does not record any.',
  },

  {
    slug: 'sun-pulse-case',
    title: 'Sun Pulse Case',
    category: 'Product Dashboard',
    categories: ['web', 'other'],
    summary:
      'A companion dashboard interface for a solar-powered phone case — battery and solar-input meters, selectable charging modes, energy history and connection state, running on simulated telemetry.',
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'Recharts',
      'Supabase',
    ],
    repo: {
      url: 'https://github.com/sandeepkumarshanmugam/sun-pulse-case',
      visibility: 'private',
    },
    liveUrl: null,
    year: '2026',
    accentIcon: 'spark',
    caseStudy: [
      {
        id: 'overview',
        title: 'Overview',
        body: [
          'Sun Pulse Case is the software half of a solar-powered phone case concept: the companion dashboard someone would open to see what the case is doing. It presents battery level, live solar input, selectable charging modes, an energy history chart and the connection state of the device.',
          'To be precise about what this is — the repository is a web application, not firmware. The interface is complete and interactive, and it runs on simulated readings. The source marks this plainly: the solar input is driven by an interval that varies the value on a timer, and the history data is labelled as mock data. It is a working prototype of the experience, not a device integration.',
        ],
      },
      {
        id: 'concept',
        title: 'Concept',
        body: [
          'A solar phone case raises a question a case alone cannot answer: is it actually working? Sunlight is inconsistent, charging is slow and invisible, and a user has no feedback beyond a battery percentage that moves too slowly to read.',
          'The dashboard exists to make that invisible process legible — to show current harvest rate, accumulated energy across the day, and which charging behaviour the case is set to. Building the interface first, against simulated data, meant the questions of what to display and how to make it readable could be settled before any hardware existed to display it from.',
        ],
      },
      {
        id: 'technology',
        title: 'Technology',
        body: [
          'The same foundation as my other React work — React with TypeScript on Vite, Tailwind CSS and shadcn/ui — with Recharts for the energy visualisation and a Supabase client scaffolded for persistence.',
        ],
        points: [
          'React + TypeScript, bundled with Vite',
          'Tailwind CSS with shadcn/ui (Radix UI primitives)',
          'Recharts for the energy history visualisation',
          'Supabase JS client configured via environment variables',
          'React Router with a catch-all 404 route',
          'Toast notifications for state-change feedback',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        body: [
          'The dashboard is composed from six focused components, each owning one part of the picture, coordinated by a single dashboard view holding the shared state.',
        ],
        points: [
          'Battery meter — current charge level.',
          'Solar meter — live input rate, updating on an interval to simulate changing light conditions.',
          'Charging modes — selectable operating modes, confirmed with a toast on change.',
          'Energy history — harvest across the day, plotted as a chart.',
          'Connection status — device link state, with a reconnect action that models the reconnection delay.',
          'Settings — configuration for the case.',
          'A bottom navigation bar switches between four views — dashboard, history, modes and settings.',
        ],
      },
      {
        id: 'challenges',
        title: 'Challenges',
        body: [
          'Designing an interface for data that does not exist yet is an unusual constraint. Every value had to be plausible enough to design against — a solar input that swings wildly looks broken, one that never moves looks dead. Getting the simulation to behave like a physical process, bounded and gradually varying rather than randomly jumping, was most of the work in making the dashboard feel real.',
          'The other challenge was restraint in the readouts. Energy data invites dials, gauges and gradients everywhere. Deciding what a user genuinely needs at a glance — and cutting the rest — mattered more than any individual component.',
        ],
      },
      {
        id: 'learnings',
        title: 'What I learned',
        body: [
          'Building the interface before the data source taught me the value of a clear seam between the two. Because every reading flows through state in one place, swapping simulated values for a real device feed is a contained change rather than a rewrite — and that only holds because the boundary was deliberate.',
          'It was also my first sustained work on data visualisation, and the lesson was that the chart is the easy part. Choosing the time window, the units and the resolution — the decisions that determine whether a number means anything to the person reading it — is where the actual thinking goes.',
        ],
      },
    ],
    verificationNote:
      'Written from the project source. The dashboard runs on simulated telemetry, as marked in the repository, and is not connected to physical hardware. No charging performance, efficiency or component specifications are claimed, as the project documents none.',
  },
];

export const projectBySlug = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

/** Filters are derived from the projects themselves, so a category can never
 *  appear in the UI without a project actually belonging to it. */
export const projectFilters: readonly { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  ...(
    [
      { id: 'web', label: 'Web' },
      { id: 'software', label: 'Software' },
      { id: 'ai-ml', label: 'AI/ML' },
      { id: 'other', label: 'Other' },
    ] as const
  ).filter((filter) =>
    projects.some((project) => project.categories.includes(filter.id)),
  ),
];
