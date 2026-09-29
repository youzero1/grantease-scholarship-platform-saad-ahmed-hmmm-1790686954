---
status: pending
title: GrantEase — Financial Aid CRM MVP
---

## Context and constraints

- Stack is fixed: React + Vite + TypeScript, TanStack Router (file-based routes under `src/routes/`), Tailwind CSS v4 via `@tailwindcss/vite`, lucide-react icons, Framer Motion for page/section transitions only, npm, ESM, `@/` alias to `src/`.
- The original brief asked for React Router and shadcn/ui. Substitute TanStack Router file-based routing and hand-built Tailwind components in `src/components/ui/`. Do not install shadcn or react-router-dom.
- Supabase is already connected; env vars are written. Use it for auth, data, and row-level security. No mocked data layers.
- Out of scope: admin dashboards, analytics suites, billing/checkout flows, native mobile.

## Phase 0 — Project scaffold

1. Initialise a Vite React + TypeScript project at the repo root (keep existing `README.md` and `env.example`). Install runtime deps: `@tanstack/react-router`, `@supabase/supabase-js`, `lucide-react`, `framer-motion`, `recharts`. Install dev deps: `vite`, `@vitejs/plugin-react`, `typescript`, `@tanstack/router-plugin`, `@tailwindcss/vite`, `tailwindcss`, `@types/react`, `@types/react-dom`. Outcome: `package.json` with ESM `"type": "module"` and npm lockfile.
2. Create `vite.config.ts` registering, in order, the TanStack Router plugin (`@tanstack/router-plugin/vite`, target react, autoCodeSplitting on), the React plugin, and the Tailwind plugin; add the `@` → `./src` resolve alias. Outcome: dev server generates `src/routeTree.gen.ts` automatically.
3. Create `tsconfig.json` and `tsconfig.node.json` with `strict: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, and `paths` mapping `@/*` → `src/*`. Outcome: alias imports typecheck.
4. Create `index.html` with a dark default (`<html class="dark">`), the app title "GrantEase — Building the future", a meta description, and the Google Fonts links for the two display/body faces chosen in Phase 1. Outcome: shell loads `/src/main.tsx`.
5. Update `env.example` and confirm `.env` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Add `.gitignore` covering `node_modules`, `dist`, `.env`. Outcome: no secrets committed; `src/routeTree.gen.ts` stays generated but committed-safe.

## Phase 1 — Design system

6. Create `src/styles/global.css` starting with exactly `@import "tailwindcss";` on line one, then an `@theme` block defining HSL design tokens: `--color-bg` (near-black slate), `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-text`, `--color-muted`, one bold accent `--color-accent` (warm signal amber/lime — explicitly not purple, no gradient stacks), `--color-accent-soft`, plus semantic `--color-success`, `--color-warn`, `--color-danger`. Add font family tokens: a distinctive geometric/grotesk display face for headings and a clean neutral face for body. Add radius and shadow tokens. Base layer sets body background, text colour, and font smoothing. Outcome: single stylesheet, all colour usage through tokens.
7. Create `src/main.tsx` that imports `@/styles/global.css` exactly once, builds the router from `src/routeTree.gen.ts`, wraps the app in the auth provider, and renders into `#root`. Outcome: app boots.
8. Create primitive components in `src/components/ui/`: `Button.tsx` (variants primary/secondary/ghost/danger, sizes sm/md/lg, loading state), `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `Label.tsx`, `Card.tsx`, `Badge.tsx` (status colour map), `Progress.tsx`, `Modal.tsx` (focus trap + escape), `Tabs.tsx`, `EmptyState.tsx`, `Skeleton.tsx`, `Toast.tsx` plus a toast context hook. Each is plain Tailwind using the tokens. Outcome: consistent UI vocabulary with no component library dependency.
9. Create `src/lib/cn.ts` (class merge helper), `src/lib/format.ts` (currency, relative deadline, percentage formatting), and `src/lib/motion.ts` exporting a small set of shared Framer Motion variants (fade-up on section mount, page fade on route change) used only for page and section transitions. Outcome: no per-element gratuitous animation.

## Phase 2 — Supabase schema, RLS, seed

10. Create `supabase/migrations/0001_init.sql` defining the schema below. Every user-owned table has `user_id uuid not null references auth.users(id) on delete cascade`, `created_at timestamptz default now()`, `updated_at timestamptz default now()` with a shared trigger function.
    - `profiles`: `id uuid pk references auth.users(id) on delete cascade`, `full_name text`, `email text`, `school text`, `graduation_year int`, `gpa numeric(3,2)`, `major text`, `state text`, `demographic_tags text[]`, `goal text` (onboarding step 1), `primary_use_case text` (onboarding step 2), `onboarded boolean default false`, `plan text default 'free' check (plan in ('free','pro','scale'))`.
    - `scholarships` (shared corpus, not user-owned): `id uuid pk`, `name text`, `provider text`, `amount_cents int`, `deadline date`, `essay_required boolean`, `essay_word_count int`, `recommendations_required int default 0`, `eligibility_summary text`, `prompt_text text`, `prompt_theme text`, `applicant_pool_estimate int`, `effort_score int` (1–100, lower = less work), `win_probability numeric(4,3)`, `external_url text`, `tags text[]`.
    - `applications`: `id uuid pk`, `user_id`, `scholarship_id references scholarships(id)`, `status text check (status in ('saved','in_progress','submitted','awarded','rejected'))`, `progress int default 0`, `submitted_at timestamptz`, `awarded_cents int`, `notes text`, unique on `(user_id, scholarship_id)`.
    - `essay_clusters`: `id uuid pk`, `user_id`, `theme text`, `master_draft text`, `word_count int`, `status text check (status in ('not_started','drafting','ready'))`.
    - `essay_assignments`: join table `id uuid pk`, `user_id`, `cluster_id references essay_clusters(id) on delete cascade`, `application_id references applications(id) on delete cascade`, `tailored_notes text`, unique on `(cluster_id, application_id)` — this is how one draft unlocks multiple grants.
    - `recommenders`: `id uuid pk`, `user_id`, `name text`, `role text`, `email text`.
    - `recommendation_requests`: `id uuid pk`, `user_id`, `recommender_id references recommenders(id) on delete cascade`, `application_id references applications(id) on delete cascade`, `status text check (status in ('not_requested','requested','reminded','received'))`, `requested_at timestamptz`, `due_date date`.
    - `funding_goals`: `id uuid pk`, `user_id unique`, `tuition_cents int`, `already_covered_cents int`, `academic_year text`.
    - `waitlist_signups`: `id uuid pk`, `email text unique`, `source text`, `created_at` — public insert only, for the landing CTA.
11. In the same migration, enable `row level security` on every table and add policies: user-owned tables get select/insert/update/delete policies scoped to `auth.uid() = user_id` (`profiles` uses `auth.uid() = id`); `scholarships` gets a select-only policy for `authenticated` (and `anon` for the landing teaser) with no write policy; `waitlist_signups` gets an insert-only policy for `anon` and `authenticated` with no select policy. Outcome: no cross-tenant reads possible.
12. Add `supabase/migrations/0002_profile_trigger.sql`: an `on auth.users insert` trigger that creates a `profiles` row and an empty `funding_goals` row for the new user. Outcome: every signed-up user has a profile without client round-trips.
13. Add `supabase/seed/scholarships.sql` with 24–30 realistic scholarship rows spanning amounts ($500–$25,000), deadlines across the next 9 months, mixed essay requirements, and exactly 5–6 recurring `prompt_theme` values (e.g. "Community impact", "Overcoming adversity", "Career vision", "First-generation journey", "STEM innovation", "Leadership in service") so clustering visibly collapses many applications into few drafts. Document in the plan's README note that this file is run once against the connected project. Outcome: a real corpus the ranking engine can operate on.
14. Create `src/types/db.ts` with hand-written TypeScript interfaces mirroring every table plus enums for status unions, and `src/lib/supabase.ts` exporting a typed singleton client built from `import.meta.env`. Outcome: typed data access everywhere.

## Phase 3 — Auth and session

15. Create `src/hooks/useAuth.tsx` exposing an `AuthProvider` and `useAuth()` with `session`, `user`, `profile`, `loading`, `signUp`, `signIn`, `signOut`, `refreshProfile`. It reads the initial session, subscribes to `onAuthStateChange`, and fetches the profile row on session change. Outcome: single source of session truth.
16. Create `src/components/auth/AuthGuard.tsx` that renders a loading skeleton while `loading`, redirects unauthenticated users to `/signin` with a `redirect` search param, and redirects authenticated but `onboarded === false` users to `/onboarding`. Outcome: reusable protection wrapper.
17. Create `src/routes/__root.tsx` — the app shell: `<AuthProvider>` is already above, so this renders the toast host, an `<Outlet />` wrapped in the page-fade motion variant, and a dark background. No global navbar here (marketing and app layouts differ). Outcome: one shell, two layouts.
18. Create `src/routes/signup.tsx` and `src/routes/signin.tsx`: centred split-panel cards with brand mark, email + password fields, inline validation, Supabase error surfacing (invalid credentials, duplicate email, weak password), and a cross-link between the two. On success, navigate to `/onboarding` (sign up) or the `redirect` target / `/app` (sign in). Outcome: working email + password auth end to end.

## Phase 4 — Marketing surface

19. Create `src/routes/index.tsx` as the landing page, composed from section components in `src/components/marketing/`: `Nav.tsx` (logo, anchor links, Sign in / Get started), `Hero.tsx` (eyebrow "Financial aid CRM for students", h1 "Building the future", sub-copy of the value prop, primary CTA to `/signup`, secondary "See how it works" anchor, plus a small stat strip), `Problem.tsx` (the spreadsheet-and-portals chaos, three short pain bullets), `Features.tsx` (exactly 3 cards: "Ranked by effort-to-win", "One draft, many grants", "Nothing slips — deadlines and recommenders"), `HowItWorks.tsx` (three numbered steps), `Pricing.tsx` (Free / Pro / Scale, Pro highlighted, copy notes pricing is being set with campus partners — no checkout), `EmailCapture.tsx` (inserts into `waitlist_signups`, success and duplicate states), `Footer.tsx`. Sections use the fade-up motion variant once on scroll into view. Outcome: dark, high-whitespace landing page with real founder-voice copy and no purple gradients.
20. Write all landing copy directly into those components — confident, plain-spoken, student- and coordinator-facing, referencing campus workshops and institutional partnerships in the footer/CTA band. No placeholder Latin. Outcome: shippable copy.

## Phase 5 — Onboarding

21. Create `src/routes/onboarding.tsx` guarded by `AuthGuard` (auth required, onboarding check bypassed). Two steps with a progress indicator and back/next: step 1 captures the goal (cards: "Cover a specific tuition gap", "Win as much as possible", "Find low-effort quick wins") plus tuition and already-covered amounts writing to `funding_goals`; step 2 captures the primary use case (cards: "Track applications and deadlines", "Write fewer essays", "Chase recommendation letters") plus school, graduation year, GPA and major. Finish writes `goal`, `primary_use_case`, profile fields, sets `onboarded = true`, refreshes profile, and navigates to `/app`. Outcome: profile-complete users land in the workspace.

## Phase 6 — App shell and dashboard

22. Create `src/routes/app.tsx` as a pathless-free layout route rendering `AuthGuard` + `src/components/app/AppShell.tsx`: left sidebar (GrantEase mark, nav links to Dashboard, Opportunities, Applications, Essays, Recommenders, Settings via lucide icons), top bar with the tuition-gap pill and the user menu, and `<Outlet />`. Outcome: consistent authenticated chrome.
23. Create `src/hooks/useDashboardData.ts` — loads scholarships, the user's applications (joined to scholarships), essay clusters with assignment counts, recommendation requests with recommender names, and the funding goal in parallel; exposes `refetch` and derived aggregates. Outcome: one data entry point for the workspace.
24. Create `src/lib/ranking.ts` — a pure `scoreOpportunity(scholarship, profile)` function combining award amount, `effort_score`, `win_probability`, deadline proximity, tag/profile fit, and a bonus when the scholarship's `prompt_theme` matches a cluster the user already drafted. Returns a 0–100 score, a tier label ("Quick win", "Strong fit", "Stretch"), and a one-line reason string. Outcome: explainable ranking, no black box.
25. Create `src/routes/app/index.tsx` — the dashboard. Top row: `TuitionBurndown.tsx` (recharts area/step chart of remaining gap over time from awarded applications vs `funding_goals`, with a headline "$X still to close" and projected coverage from pending applications), plus three stat cards (open applications, upcoming deadlines in 14 days, essays reused). Middle: `TopOpportunities.tsx` — top 5 ranked cards showing amount, effort tier, deadline countdown, reason line, and a one-click "Add to pipeline" that inserts an `applications` row. Bottom row: `DeadlineTimeline.tsx` (next 30 days, colour-coded urgency) and `DependencyList.tsx` (outstanding recommendation requests with status and a "Send reminder" action that bumps status to `reminded`). Outcome: the value prop is visible within one screen.
26. Create `src/routes/app/opportunities.tsx` — full ranked corpus with search, filters (amount, deadline window, essay required, effort tier), sort control, and an `OpportunityDetail` modal showing eligibility, prompt text, matching essay cluster if any, and add-to-pipeline. Outcome: browsing without leaving the CRM.
27. Create `src/routes/app/applications.tsx` — pipeline board grouped by status (Saved → In progress → Submitted → Awarded/Rejected) with status change controls, per-application checklist (essay attached, recommendations received, external form autofill), progress bar, and an `AutofillPanel.tsx` that renders the user's profile fields as copy-to-clipboard answer chips plus a "Open external portal" link — the honest MVP form of autofill. Outcome: tangible time saving.
28. Create `src/routes/app/essays.tsx` — clusters view. `src/lib/clustering.ts` groups the user's pipeline applications by `prompt_theme` and proposes clusters; the UI shows "1 draft → N grants" with the grants listed, a master draft editor autosaving to `essay_clusters.master_draft`, word-count vs the strictest requirement, and per-application tailored notes written to `essay_assignments`. Outcome: the clustering promise is functional, not decorative.
29. Create `src/routes/app/recommenders.tsx` — recommender contacts CRUD and requests linked to applications, with status stepper (not requested → requested → reminded → received), due dates derived from scholarship deadlines minus a buffer, and overdue highlighting. Outcome: third-party dependency tracking.

## Phase 7 — Settings and polish

30. Create `src/routes/app/settings.tsx` with three sections: Profile (name, school, graduation year, GPA, major, state, demographic tags — updates `profiles`), Funding goal (tuition and covered amounts — updates `funding_goals`), Plan (current tier from `profiles.plan`, Free/Pro/Scale comparison, an inert "Contact us to upgrade" CTA — no billing), and Sign out. Outcome: account management complete.
31. Add `src/routes/app/$.tsx` or a root `notFoundComponent` plus a router `defaultErrorComponent` for unmatched paths and query failures. Outcome: no blank screens.
32. Pass: verify all colours come from tokens, every mutation surfaces a toast on success/failure, all lists have empty states with a clear next action, keyboard focus rings are visible, and Framer Motion is confined to route and section transitions. Outcome: coherent, accessible dark UI.
33. Run `npm run build` and fix all TypeScript and Vite errors; confirm the generated `src/routeTree.gen.ts` matches the route map and was never hand-edited. Outcome: deployable build.

## Route map

| Path | File | Access |
|---|---|---|
| `/` | `src/routes/index.tsx` | public |
| `/signin` | `src/routes/signin.tsx` | public |
| `/signup` | `src/routes/signup.tsx` | public |
| `/onboarding` | `src/routes/onboarding.tsx` | auth only |
| `/app` | `src/routes/app.tsx` (layout) + `src/routes/app/index.tsx` | auth + onboarded |
| `/app/opportunities` | `src/routes/app/opportunities.tsx` | auth + onboarded |
| `/app/applications` | `src/routes/app/applications.tsx` | auth + onboarded |
| `/app/essays` | `src/routes/app/essays.tsx` | auth + onboarded |
| `/app/recommenders` | `src/routes/app/recommenders.tsx` | auth + onboarded |
| `/app/settings` | `src/routes/app/settings.tsx` | auth + onboarded |

## Build sequence summary

Phase 0 scaffold → Phase 1 design system → Phase 2 Supabase schema/RLS/seed → Phase 3 auth → Phase 4 landing → Phase 5 onboarding → Phase 6 workspace → Phase 7 settings, polish, build verification.
