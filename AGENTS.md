# MoreCoffee UI implementation guide

## Project overview

MoreCoffee is a coffee logging app focused on a clean, warm, and user-centered mobile experience.

Tech stack:

- React Native
- TypeScript
- Expo

The UI style should feel:

- modern
- calm
- youthful
- rounded
- lightweight
- coffee-oriented

Do not make the UI feel overly enterprise, dense, or mechanical.

---

## Core UI principles

When implementing screens from Figma or screenshots, prioritize in this order:

1. information hierarchy
2. spacing rhythm
3. typography consistency
4. component reuse
5. visual polish

The app should feel easy to scan at a glance.
Avoid cluttered layouts and overly heavy visual treatment.

---

## Reuse before creating

Before creating any new component:

- check whether an existing shared component already solves most of the need
- prefer extending an existing component over duplicating it
- do not create near-duplicate card, button, icon, or tab components

Prefer reuse for:

- cards
- buttons
- icon buttons
- tabs
- list rows
- section wrappers

---

## Design tokens

Always use existing design tokens for:

- colors
- spacing
- radius
- typography
- shadows
- icon sizes

Do not hardcode raw hex values, spacing values, or font sizes unless:

- the token truly does not exist
- and the addition is necessary

If a new token is required:

- add it in the token file
- keep naming semantic and reusable
- do not add screen-specific one-off tokens unless unavoidable

---

## Layout rules

- Prefer flex layouts over fragile absolute positioning
- Keep layouts responsive for common iPhone widths
- Avoid horizontal overflow
- Preserve comfortable spacing between sections
- Do not over-pack cards with too much information

For home/dashboard screens:

- the first screen should be quickly scannable
- important metrics should be visually dominant
- secondary metrics should not compete with primary actions

---

## Typography rules

- Keep typography simple and consistent
- Avoid too many font sizes on one screen
- Use clear hierarchy between screen title, section title, card title, body, and caption
- Do not rely on color alone to create hierarchy

Avoid overly long truncated titles when a cleaner text structure would work better.

---

## Interaction rules

- Do not invent hidden interactions not shown in the design
- If a component looks informational, do not make it appear editable
- Analysis bars should not look like sliders unless they are actually interactive
- Keep CTA hierarchy clear:
  - one primary action
  - secondary actions should feel lighter

---

## Screen implementation approach

When building a screen from design:

1. create the structural layout first
2. apply shared components
3. apply tokens
4. refine spacing and hierarchy
5. add only the shown states and interactions

If a design detail is ambiguous:

- do not invent product behavior
- leave a TODO comment if needed
- mention the ambiguity in the final summary

---

## Home screen guidance

The home screen is a user-centered dashboard.

It should help the user understand:

- their coffee activity this week and totals
- their taste profile
- their recent coffee logs
- their saved gear and bean/origin data

For dashboard-style sections:

- prefer compact, readable summaries
- avoid overly dense cards
- make the next action obvious

Recent coffee rows should stay compact and readable.
Gear and Beans empty states should feel intentional, not unfinished.

---

## Code style

- Keep components small and readable
- Prefer simple props over over-engineered abstractions
- Keep presentational components separated from data logic when possible
- Avoid deeply nested style objects if shared styles can be extracted
- Name components clearly and consistently

---

## Output expectations for Codex tasks

At the end of each implementation task, provide:

- files changed
- short summary of what was implemented
- any design ambiguities
- any deviations from the mock
