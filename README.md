# Sandeepkumar S — Portfolio

A multi-page personal portfolio and a small contact API behind it.

Black and crystal blue, seven routes plus two project case studies, built with
React 19, TypeScript and Tailwind CSS v4 on the front end, and Express with
Postgres on the back.

---

## Contents

- [Quick start](#quick-start)
- [Project layout](#project-layout)
- [Architecture](#architecture)
- [Why Postgres and not MongoDB](#why-postgres-and-not-mongodb)
- [Dependency choices](#dependency-choices)
- [Design system](#design-system)
- [Content policy](#content-policy)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Deployment](#deployment)
- [Maintenance](#maintenance)

---

## Quick start

Node 20.6 or newer (the API relies on `--env-file`, and both apps assume
built-in `fetch`).

```bash
npm install
npm run dev
```

That serves the site at <http://localhost:5173>.

The contact form needs the API running too, in a second terminal:

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API listens on <http://localhost:4000>, and Vite proxies `/api` to it, so
no front-end configuration is needed in development.

The API starts happily with an empty `.env`. Database and email are both
optional and independent — `GET /health` reports which are actually live:

```json
{ "ok": true, "capabilities": { "database": false, "email": false } }
```

With neither configured, submissions are validated and logged but not
delivered, and the form surfaces an honest failure that points at the direct
email address. Configure either one and it starts working.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Sitemap → typecheck → production bundle |
| `npm run preview` | Serve the built output locally |
| `npm run typecheck` | Types only, no emit |
| `npm run images` | Regenerate responsive images from the source portrait |
| `npm run sitemap` | Regenerate `public/sitemap.xml` |
| `cd server && npm run dev` | Contact API with watch mode |
| `cd server && npm run build` | Compile the API to `server/dist` |
| `cd server && npm run db:migrate` | Apply the database schema |

---

## Project layout

```
.
├── index.html               Pre-hydration metadata, font preconnect, LCP preload
├── scripts/
│   ├── generate-sitemap.mjs Reads the app's own routes; runs during build
│   └── optimize-images.mjs  AVIF/WebP/JPEG variants + the Open Graph card
├── public/
│   ├── media/               Generated images (committed)
│   └── resume/              The downloadable CV
├── src/
│   ├── animations/          Every duration, easing and variant, in one file
│   ├── components/          Presentation only
│   ├── data/                All copy and facts, typed
│   ├── hooks/               usePrefersReducedMotion
│   ├── layouts/MainLayout   Shell: nav, transitions, footer
│   ├── lib/                 cx(), shared form validation rules
│   └── pages/               One file per route
└── server/
    └── src/
        ├── app.ts           Express app, exported without binding a port
        ├── env.ts           Zod-validated configuration; exits on invalid
        ├── lib/             schema, db, mail, rate-limit, security
        └── routes/contact   POST /api/contact
```

Two rules keep this maintainable:

**Data is separate from presentation.** Nothing in `components/` or `pages/`
contains a hardcoded fact. Adding a project, a role, a certification or a
social link is an edit inside `src/data/` — the pages, and the sitemap, pick
it up. New content should never require touching a component.

**Motion lives in one place.** `src/animations/index.ts` owns every duration,
easing curve and variant. Components import from it rather than inlining
their own timings, which is what keeps ten routes feeling like one piece of
software.

---

## Architecture

```
Browser
  └─ React 19 + React Router 7
       ├─ MainLayout ── Navbar · AnimatePresence · Footer
       └─ Pages ── Components ── typed data (src/data)

Contact form
  └─ POST /api/contact
       └─ Express 5
            ├─ security headers + CORS allowlist
            ├─ rate limit (per IP, fixed window)
            ├─ Zod validation + sanitisation
            ├─ spam checks (honeypot, time-to-submit)
            ├─ Postgres  ─┐ settled independently, so
            └─ Resend    ─┘ neither failure loses the message
```

Home is imported eagerly since it is the common entry point; every other
route is `React.lazy`, so a visitor who only reads the home page never
downloads the case studies or the contact form.

Document metadata is handled by `src/components/Seo.tsx` using React 19's
native `<title>`/`<meta>` hoisting — which is what a helmet library used to be
for, minus the dependency.

### The contact endpoint

Ordered so that cheap rejections happen before expensive work — nothing
touches the database or an upstream API until the payload is known good.

Responses are deliberately distinct, because the recovery action differs:

| Status | Meaning | What the form does |
| --- | --- | --- |
| `201` | Stored and/or sent | Success state |
| `200` | Spam signal tripped | Success state (silently dropped) |
| `400` | Validation failed | Highlights the offending fields |
| `429` | Rate limited | Asks the visitor to wait |
| `503` | Neither channel available | Offers the direct email address |

Spam rejections return `200` on purpose. Telling a bot which check caught it
only helps it iterate, and no human can trip either check: the honeypot field
is hidden from sight *and* from assistive technology, and the timing check
rejects submissions faster than any person could type.

---

## Why Postgres and not MongoDB

A contact submission has a fixed, known shape — name, email, subject, message,
timestamp. There is no schema-flexibility problem here, so the schemaless
option would trade away guarantees for a benefit this data never needs.

What Postgres gives that actually matters at this size:

- **Constraints the database enforces**, not the application: `NOT NULL` and
  `CHECK (char_length(message) BETWEEN 20 AND 3000)` hold even if a bug or a
  future script bypasses the API. The validation rules exist in three places
  by design — client, server, and schema — and the schema is the one that
  cannot be talked out of them.
- **A real timestamp type.** `TIMESTAMPTZ` stores an unambiguous instant
  rather than a string that has to be trusted.
- **SQL for reading it back.** "Show me this month's messages, newest first"
  is a query, not a script.

The `postgres` driver is used rather than an ORM because there is one table
and two queries; an ORM would add a migration toolchain and a query builder
to save about six lines of SQL. Values are passed as tagged-template
parameters, so the statement text never contains user input — SQL injection is
structurally impossible rather than merely guarded against.

**Neon** is the suggested host: generous free tier, serverless, and a plain
connection string, so nothing in the code is specific to it. Supabase or
Render Postgres work unchanged.

---

## Dependency choices

Four runtime dependencies on the front end, three on the API. Each earns its
place, and several obvious ones were deliberately left out:

| Not installed | Why |
| --- | --- |
| An icon library | ~24 glyphs are drawn inline in `components/Icon.tsx`, on one 24×24 grid with a shared stroke. |
| `clsx` / `tailwind-merge` | Nothing composes conflicting utilities at runtime. `lib/cx.ts` is nine lines. |
| `react-helmet` | React 19 hoists document metadata natively. |
| `helmet` (API) | This is a JSON API with one endpoint; eight explicit headers are easier to audit than a config object. |
| `cors` (API) | One origin allowlist, fifteen lines, and it reflects only allowlisted origins rather than echoing whatever arrives. |
| `express-rate-limit` | Solves distributed stores this single-instance API does not have. See the tradeoff note in `lib/rate-limit.ts`. |
| `resend` SDK | The API is a single POST and Node has `fetch`. |
| `dotenv` | Node's `--env-file` does it. |

`sharp` is a **dev** dependency only. It generates the responsive images once;
the output is committed, so it never ships.

The largest dependency is Motion at ~45 kB gzipped. That is a real cost, and a
deliberate one — the brief called for a centralised animation system with page
transitions and scroll-driven reveals. It is isolated in its own chunk so it
caches independently of application code.

---

## Design system

Tailwind v4's CSS-first configuration. Tokens are defined once in
`src/index.css` under `@theme` and are available both as utilities
(`bg-bg`, `text-fg-secondary`) and as raw variables for gradients and shadows.

Black dominates; crystal blue is reserved for active navigation, the primary
action, icons, focus rings and hairline accents. Headings use `clamp()` so
type scales continuously from 360 px to 1600 px without a cascade of
breakpoint overrides.

One token departs from the original brief. Muted text was specified as
`#66727E`, which measured **3.99:1** in the footer and **4.15:1** on cards —
below the 4.5:1 WCAG AA minimum for small text. It is now `#808C99`
(~5.5:1), which keeps a clear three-step hierarchy of 19.3 / 8.3 / 5.5.

---

## Content policy

Everything on this site is traceable to a source: Sandeep's résumé, his own
supplied details, or the project repositories themselves.

Both case studies were written by reading the code — routes from `App.tsx`,
dependencies from `package.json`, behaviour from the component source — not
from the project names. Two consequences worth stating plainly:

- **Sun Pulse Case is a web dashboard, not hardware.** Its source marks the
  telemetry as simulated, so it is described as a prototype interface. No
  charging rates, efficiencies or component specifications are claimed,
  because the repository contains none.
- **No invented metrics anywhere.** The résumé's internship entry carries two
  bullets about "cost-control measures" and "efficiency" percentages that are
  leftover résumé-template filler — they describe finance work, not a
  cybersecurity internship — and they are deliberately excluded rather than
  reproduced as fact.

The types enforce this where they can. There is no field for a performance
number nobody measured; certifications omit dates rather than guessing them;
skills carry honest bands (`working` / `familiar` / `learning`) instead of
invented percentages. A social link with `url: null` renders **nothing** —
never a placeholder or a made-up handle.

Repository visibility is tracked in the data (`repo.visibility`). Both repos
are currently private, so the UI suppresses the GitHub button and says
"Private repo" instead of shipping a link that 404s. Making them public is a
one-word change per project.

---

## Accessibility

Verified by auditing the rendered DOM on every route, not by inspection:

- **683 text elements checked for contrast across 10 routes; zero failures**
  against WCAG AA, accounting for alpha compositing and Tailwind's `oklab()`
  output.
- Continuous heading outlines (`h1 → h2 → h3`, no skipped levels), exactly one
  `<h1>` per route, one `<main>` landmark.
- The mobile drawer is a real modal dialog: `aria-modal`, focus moved in on
  open and restored on close, Tab trapped inside, Escape to dismiss, and
  background scroll locked without layout shift.
- Route changes are announced through a polite live region, since a
  client-side navigation gives a screen reader no other signal.
- Every control has an accessible name; every `target="_blank"` carries
  `rel="noopener noreferrer"`; no dangling `aria-*` references.
- Form errors use `aria-invalid` + `aria-describedby`, validate on blur rather
  than per keystroke, and move focus to the first invalid field on submit.
- `prefers-reduced-motion` is honoured in two layers: CSS collapses
  transitions and hides decorative layers, and `usePrefersReducedMotion`
  makes Motion **skip** animations rather than shorten them — so nothing can
  be left stranded mid-fade at `opacity: 0`.

---

## Performance

- Route-level code splitting; ~17 kB gzipped of application JavaScript for the
  entry chunk, with React, Router and Motion in separate long-cached chunks.
- The portrait ships as AVIF with WebP and JPEG fallbacks at three widths,
  driven by `sizes`, and the LCP candidate is preloaded at high priority.
- Fonts preconnect and use `display=swap`, so text is never invisible.
- Hashed assets are served `immutable` for a year (see `vercel.json`).
- Decorative glows are contained with `overflow-x: clip` on both `html` and
  `body` — one of them alone is not enough, since body-level overflow is
  propagated to the viewport in some engines.

---

## Deployment

### Front end (Vercel)

`vercel.json` is committed with the build command, SPA rewrites (so a refresh
on `/projects/peps` resolves instead of 404ing), security headers and cache
policy. Import the repository and set one environment variable:

```
VITE_API_BASE_URL=https://your-api-host.example.com
```

Anything prefixed `VITE_` is **inlined into the client bundle and is public**.
Never put a secret there.

### API (Render, Railway, Fly, or similar)

```
Root directory:  server
Build command:   npm install && npm run build
Start command:   npm start
```

Then set, at minimum:

```
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.example.com
TRUST_PROXY=1
```

`TRUST_PROXY=1` matters: behind a proxy, without it Express reads the socket
address instead of the real client IP, and the rate limiter becomes trivially
evadable by forging `X-Forwarded-For`.

Add `DATABASE_URL` and the three Resend variables to switch on persistence and
delivery. `CONTACT_FROM_EMAIL` must be on a domain verified in the Resend
account — a Gmail address there will fail SPF/DKIM and land in spam.

Finally, update `profile.siteUrl` in `src/data/profile.ts` to the real domain;
it feeds the canonical tags, Open Graph URLs and the sitemap.

---

## Maintenance

**Add a project** — append to `src/data/projects.ts`. The card, the case study
route, the sitemap entry and the home-page listing all follow. Set
`repo.visibility` to `'public'` to expose the GitHub button.

**Add a page** — add it to `src/data/nav.ts` and register the route in
`App.tsx`. Navigation, the mobile drawer, the footer and the sitemap update
themselves.

**Add experience, a certification or an achievement** — one entry in
`src/data/experience.ts` or `src/data/credentials.ts`.

**Add a social link** — fill in the `url` in `src/data/profile.ts`. It appears
in the hero, footer, mobile drawer and contact page at once. Leaving it `null`
keeps it hidden everywhere.

**Replace the portrait or résumé** — drop the new file in
`src/assets/images/portrait-original.jpg` or `public/resume/`, then run
`npm run images`.
