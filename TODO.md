# Pet Picker MVP – Build Plan

## 1. Project Scaffolding & Tooling
- [ ] Create Angular 20 workspace with standalone setup and strict mode.
- [ ] Integrate Tailwind CSS (postcss config) and define brand gradient palette (teal → violet).
- [ ] Configure DaisyUI or custom Tailwind components if needed.
- [ ] Set up linting (ESLint with Angular plugin) and formatting (Prettier) rules.
- [ ] Configure Husky/commit hooks (optional) to run lint/tests.

## 2. UX & Visual Design
- [ ] Draft low-fidelity wireframe for single-page flow (hero → questionnaire → results).
- [ ] Define responsive breakpoints and layout behavior for desktop/tablet/mobile.
- [ ] Decide on typography scale and supporting accent colors.
- [ ] Plan motion/interaction details (button states, result card transitions).

## 3. Data Modeling & Assets
- [ ] Define `Breed` interface/schema with attributes (species, traits, care needs, compatibility flags, images, summary, rationale tags).
- [ ] Assemble initial dataset (≈10 dog breeds, ≈10 cat breeds) referencing open data sources.
- [ ] Normalize trait tags and scoring weight constants for maintainability.
- [ ] Collect placeholder images (ensure documented sources/licensing follow-up).

## 4. Form & State Architecture
- [ ] Map questionnaire inputs to trait keys (housing, lifestyle, care preferences, health, temperament, goals).
- [ ] Implement reactive form with segmented sections and validation rules.
- [ ] Provide sensible defaults and helper text per field.
- [ ] Persist latest submission and saved favorites in `localStorage`.

## 5. Matching & Recommendation Engine
- [ ] Implement rule-based scoring service:
  - [ ] Hard filters for critical constraints (allergies, housing conflicts, size limits).
  - [ ] Weighted scoring for soft preferences and temperament matches.
  - [ ] Generate “Why it matches you” reasons from satisfied criteria.
- [ ] Ensure fallback behavior for near-miss matches when <5 perfect fits.
- [ ] Add unit tests covering edge cases and scoring accuracy.

## 6. UI Implementation
- [ ] Build page shell (header, hero with CTA, gradient background).
- [ ] Create questionnaire component(s) with progressive grouping and validation feedback.
- [ ] Implement results section showing up to five cards with image, stats, match rationale, and favorite toggle.
- [ ] Add empty-state and error messaging for no matches or incomplete form.
- [ ] Provide reset/clear actions for form and stored preferences.

## 7. Accessibility & Performance
- [ ] Ensure semantic markup, aria labels, and keyboard navigation support.
- [ ] Verify color contrast and focus states align with WCAG 2.1 AA.
- [ ] Optimize image assets (lazy loading, responsive sizes).
- [ ] Add analytics hooks placeholder (even if not used yet).

## 8. Testing & QA
- [ ] Unit tests: form validators, scoring service, local storage helper.
- [ ] Component tests (Jasmine/Karma or Jest) for questionnaire and results rendering.
- [ ] Optional E2E scenario (Cypress/Playwright) for end-to-end submission flow.
- [ ] Manual QA checklist (responsive sizes, accessibility checks, data edge cases).

## 9. Documentation & Handoff
- [ ] Update README with setup/run instructions, tech stack, and data source credits.
- [ ] Document scoring rules and how to extend breed data.
- [ ] Capture outstanding licensing tasks and future roadmap in TODO.

