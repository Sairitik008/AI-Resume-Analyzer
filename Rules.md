# Project Rules — AI Resume Analyzer

These rules apply to every chunk of work on this project, whether backend, frontend, docs, or fixes. Read this file before starting any task.

---

## 1. Code Minimalism (Applies to ALL code)

- Write only the code necessary to fulfill the CURRENT requirement — no speculative abstractions, no unused helper functions, no "just in case" flexibility.
- Do not create new files, folders, or architectural layers unless explicitly required by the current task.
- Prefer straightforward, readable logic over "clever" or heavily abstracted patterns.
- Do not add extra configuration options, feature flags, or generalized utilities beyond what's asked.
- If a simpler built-in language/framework feature can do the job, use that instead of writing custom logic.
- Avoid premature optimization — write the direct, correct solution first, not a hypothetical "scale to millions of users" version, unless explicitly asked.
- Keep functions short and single-purpose. Avoid deeply nested logic or overly generic parameter lists.
- Before adding a new abstraction (a new class, wrapper, or utility), ask: "Does this solve a problem that exists right now?" If not, don't add it.
- Comments should explain WHY, not WHAT — don't narrate obvious code line by line.

---

## 2. Backend Guidelines

- Enforce the **Flask App Factory** pattern (`create_app()`).
- Follow strict layering: `routes -> controllers -> services -> validations -> models`. Routes only map URLs; controllers only extract/validate/respond; services hold business logic; models are data only.
- All configuration must be read from environment variables (`.env`) — never hardcoded.
- Maintain compatibility with **Python 3.8.10** at all times. Pin package versions that are known to drop 3.8 support (document these pins with a comment explaining why).
- Return universally structured JSON for both success and errors via the shared `success_response()` / `error_response()` helpers — never raw `jsonify()`.
- Never hardcode API keys, credentials, or secrets, anywhere, under any circumstance.
- Handle all database operations through the central `db` (SQLAlchemy) instance — no separate/duplicate DB connections.
- Wrap risky operations (file I/O, DB calls, LLM API calls, vector/ML operations) in try/except with meaningful, user-safe error messages — never leak raw stack traces to the client.
- Prefer deterministic, rule-based logic over LLM calls wherever a task doesn't genuinely need natural language generation (faster, free, explainable, no hallucination risk).
- Every protected route must use `@token_required`, and every user-owned resource fetch/update/delete must verify ownership (`user_id` match) before returning data.

---

## 3. Frontend Guidelines

- **React + TypeScript**, explicit typing everywhere it adds clarity — avoid `any` unless truly unavoidable.
- Follow the established SCSS modular structure (`abstracts/_variables`, `abstracts/_mixins`, `base/`) — no hardcoded colors, spacing, or breakpoints in component-level SCSS.
- Isolate ALL API calls into the `services/` layer — no inline `axios`/`fetch` calls inside components.
- Reuse existing components (`Button`, `Card`, `Modal`, `TextInput`, `Textarea`, `SelectDropdown`, `EmptyState`, `Toast`, `ScoreGauge`, `SkillTag`, `ChecklistItem`, etc.) before creating new ones — check `/components` first.
- Every page that fetches data must handle all four states: loading, error (with retry), empty, and populated. No page should be able to render a blank screen on failure.
- Fully responsive at all times: mobile, tablet, and desktop — test every new UI addition at all three widths before considering it done.
- Match the existing visual language (spacing, card treatment, typography) of whichever page/section you're extending — don't introduce a new inconsistent style.

---

## 4. Honesty & Scope Discipline

- Never claim or imply capabilities the tool doesn't have (e.g., "guarantees ATS pass," "replicates a specific company's algorithm," "detects plagiarism"). If a request pushes toward this, flag it and scope it down to something honest and real.
- Any user-facing copy about scoring, matching, or recommendations must use accurate, non-absolute language ("commonly checked by ATS systems," not "will pass Google's ATS").
- Static/curated data (e.g., certification mappings) must only reference REAL, verifiable resources — never invent names, URLs, or credentials.
- If a feature request can't be built responsibly or accurately (e.g., authoritative visa/immigration requirements), say so plainly instead of building a fake version of it.

---

## 5. Security & Credentials

- Never write real credentials, API keys, or secrets into any file, chat message, or code comment.
- Whenever `.env` or credential setup is needed, only provide `.env.example` with placeholder keys — the human fills in real values locally, never through the AI agent.
- `.gitignore` must always exclude: `.env`, `venv/`, `__pycache__/`, `node_modules/`, `build/`, `dist/`, `uploads/` (contents).

---

## 6. Process Discipline

- Build in CHUNKS. Do not combine multiple unrelated features into a single change.
- After each chunk, STOP. Do not proceed to the next chunk until the current one is explicitly tested and confirmed working.
- Every chunk that changes the database must update models only — the human runs `flask db migrate` / `flask db upgrade` themselves, never the agent.
- When auditing/fixing existing code, document findings in `AUDIT_NOTES.md` (backend/frontend respectively) rather than silently changing things without a record.
- Keep `/docs` (prd.md, architecture.md, phases.md, design.md, memory.md) and the root `README.md` updated as real, accurate reflections of the current codebase — not aspirational or outdated.

---

## 7. When In Doubt

- Prefer the simpler solution.
- Prefer the honest claim over the impressive-sounding one.
- Prefer asking for clarification over silently guessing on ambiguous scope.
- Prefer fixing root causes over patching symptoms.
