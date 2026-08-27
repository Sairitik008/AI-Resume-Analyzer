# Development Phases (Changelog)

This document tracks the iterative execution of the AI Resume Analyzer from scratch to production-ready status.

### Chunk 1: Project Scaffolding
- **What was built**: Initial project initialization, setting up the monorepo structure.
- **Key files**: `backend/venv`, `backend/requirements.txt`, `frontend/package.json`.
- **Verification**: Assured local environment could run basic `npm run dev` and python scripts natively.

### Chunk 2: Backend Core Configuration
- **What was built**: The Flask App Factory structure, CORS policy, and global routing blueprints.
- **Key files**: `app/__init__.py`, `config/config.py`, `.env.example`.
- **Verification**: Verified the `/api/health` endpoint booted and responded successfully.

### Chunk 3: Database Schema & Modeling
- **What was built**: MySQL connection string mappings, Alembic migration generation, and SQLAlchemy ORM models.
- **Key files**: `app/models/user.py`, `app/models/resume.py`, `app/models/job_description.py`, `app/models/analysis.py`.
- **Verification**: Successfully spun up tables locally using `flask db upgrade`.

### Chunk 4: JWT Authentication Engine
- **What was built**: Secure user registration and login endpoints, generating and verifying JSON Web Tokens, secured via Marshmallow schemas.
- **Key files**: `app/middlewares/auth_middleware.py`, `app/controllers/auth_controller.py`, `app/services/auth_service.py`.
- **Verification**: Blocked unauthorized requests using Postman, ensuring `@token_required` actively guarded isolated endpoints.

### Chunk 5: Resume Ingestion
- **What was built**: Dynamic document parsing extracting raw UTF-8 strings efficiently from binaries. 
- **Key files**: `app/utils/text_extractor.py`, `app/routes/resume_routes.py`.
- **Verification**: Successfully uploaded both `.pdf` and `.docx` configurations, logging output texts cleanly to the console.

### Chunk 6: Job Description Tracking
- **What was built**: Central CRUD management interfaces allowing users to save targeted job openings.
- **Key files**: `app/services/job_description_service.py`, `app/controllers/job_description_controller.py`.
- **Verification**: E2E test verifying users can Create, Read, Update, and Delete JDs mapped specifically to their `user_id`.

### Chunk 7: Sub-Process Vector Computing (FAISS)
- **What was built**: Heavy engineering isolating semantic embeddings via `sentence-transformers` and conducting K-NN similarity lookups utilizing `faiss-cpu`.
- **Key files**: `app/utils/vector_store.py`, `app/utils/embedding_utils.py`, `app/utils/skill_detector.py`.
- **Verification**: Processed a dummy text string against an IT baseline, correctly firing match percentage thresholds.

### Chunk 8: AI Feedback Wrapper (Gemini)
- **What was built**: The integration bridging internal FAISS retrieval scores and LLM generation formatting.
- **Key files**: `app/utils/ai_feedback.py`, `app/services/analysis_service.py`.
- **Verification**: Simulated real-world outputs ensuring the generator explicitly output valid JSON mapped logically bypassing generic AI hallucinations.

### Chunk 9: Frontend UI Foundations
- **What was built**: Vite React boot sequence and structured CSS mapping across a highly professional `.scss` color scheme.
- **Key files**: `src/styles/abstracts/_variables.scss`, `src/styles/global.scss`, `index.html`.
- **Verification**: Confirmed DOM rendering without console errors and standardized typography behaviors.

### Chunk 10: Frontend Auth & Context
- **What was built**: Centralized `AuthContext` to persist sessions leveraging local storage, attaching Bearer headers to Axios interceptors.
- **Key files**: `src/context/AuthContext.tsx`, `src/services/apiClient.ts`, `src/routes/ProtectedRoute.tsx`.
- **Verification**: Asserted unauthenticated users redirect securely to the `/login` route upon mounting protected variants.

### Chunk 11: Core UI Forms & Components
- **What was built**: Standalone generic abstractions of primitive elements enforcing standardized design languages dynamically.
- **Key files**: `src/components/Button.tsx`, `src/components/TextInput.tsx`, `/pages/Login/LoginPage.tsx`.
- **Verification**: Assured states, validations, and loading spinners successfully integrated natively.

### Chunk 12: Views & Analytical UI
- **What was built**: Dedicated pages querying database layers, outputting AI generated results via SkillTags and ScoreGauges.
- **Key files**: `pages/AnalysisDetail/AnalysisDetailPage.tsx`, `pages/UploadResume/UploadResumePage.tsx`.
- **Verification**: Sent test parameters and assured components structurally resolved data payloads symmetrically.

### Chunk 13: Dashboard UI Integration
- **What was built**: Statistical aggregating dashboards summarizing recent uploads and application scores logically.
- **Key files**: `pages/Dashboard/DashboardPage.tsx`.
- **Verification**: Validated state mounting pulling directly via aggregate routes successfully. 

### Chunk 14: Polishing & Production Prep
- **What was built**: Resolving dependency constraints, standardizing CORS, standardizing `.env` bounds, resolving responsive breakpoints organically.
- **Key files**: `app/__init__.py` origins configuration list.
- **Verification**: E2E check across a mobile view bypassing overflow hidden errors.

### Chunk 15: Deep Code Audit & Documentation Pass
- **What was built**: A widespread quality control fix bridging Python 3.8.10 constraints, enforcing safe LLM timeouts, mitigating FAISS null-array edge cases, and converting stray `axios` and HTML color hardcoding across into system-native standards.
- **Key files**: `requirements.txt`, `backend/app/utils/skill_detector.py`, `/docs/prd.md`.
- **Verification**: Standardized error bounds and assured WCAG contrasts adhered efficiently bypassing system warnings cleanly.

### Chunk 16: ATS Structure & Parsability Engine
- **What was built**: A deterministic rules-based structural analyzer evaluating resumes on non-LLM attributes like core sections, outcome quantifications, and parsing contact data honestly without emulating distinct proprietary algorithms.
- **Key files**: `app/utils/ats_checker.py`, `app/models/analysis.py`.
- **Verification**: Script isolated test execution outputting mapped dictionaries mapping exactly to DB interfaces.

### Chunk 17: ATS Health Frontend UI
- **What was built**: Clean UI displaying the parsed ATS metrics inside the analysis detail view via dynamically structured checklist badges avoiding DOM pollution.
- **Key files**: `src/pages/AnalysisDetail/AnalysisDetailPage.tsx`, `src/components/ChecklistItem/ChecklistItem.tsx`, `AnalysisDetailPage.module.scss`.
- **Verification**: Refactored components, circumventing preexisting `vite.config.ts` circular sass hooks blocking layout injections and successfully deploying layout cards visually.

### Chunk 18: Targeted Certification Suggestions
- **What was built**: Curated Python mapping routing missing technical skills (like AWS or React) selectively to verified high-impact external learning endpoints without AI hallucinations. 
- **Key files**: `app/utils/skill_resources.py`, `src/types/analysis.types.ts`.
- **Verification**: Confirmed URL anchors deployed correctly parsing mapped JSON via the Controller onto the detail page's supplementary container.

### Chunk 19: Prioritized Improvement Summary
- **What was built**: Top-tier prioritization algorithm weighing disparate flags (score, length, ATS flags) against each other yielding a Top 5 "Fix This First" array directly mitigating actionable fatigue.
- **Key files**: `app/utils/improvement_prioritizer.py`, `AnalysisDetailPage.tsx`.
- **Verification**: Verified ruleset logic dynamically truncating redundant recommendations and resolving into specific CSS severity colors.
