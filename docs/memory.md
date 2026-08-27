# Project Memory & Decisions

This log serves as a context preservation document detailing crucial operational choices, constraints, and architecture boundaries for anyone picking up or resuming development.

## 1. Architectural Decisions
- **Framework Choice (Flask over FastAPI)**: Selected Flask due to its stability and long-standing compatibility with the specifically mandated Python 3.8.10 environment restrictions.
- **Database (MySQL)**: Chose standard relational MySQL via SQLAlchemy explicitly per user guidelines, prioritizing schema rigidity over the original prototype's mock MongoDB configurations.
- **Vector Search (FAISS)**: Chose Facebook's FAISS library to conduct in-process, offline CPU-based nearest neighbor searches. This avoids the cost, latency, and networking overheads associated with external managed vector databases (Pinecone, Qdrant) which are superfluous for a portfolio-scale solution.
- **Rule-Based Processing Logic over LLMs**: We explicitly developed the ATS Checker, Certification Suggestion map, and Priority Summary algorithms strictly leveraging deterministic python logic over generic generative AI. This guarantees high-certainty deterministic results, severely drops response latency and operating API cost, and inherently blocks AI "hallucinations" of bogus unverified learning platforms.
- **Application Serving (Gunicorn)**: Wrapped the production backend natively in Gunicorn WSGI isolating threading structures naturally without exposing the development Werkzeug bounds externally.

## 2. Known Limitations & Tradeoffs
- **In-Memory Volatility**: The FAISS index does not persist to disk. It rebuilds a miniature vector structure per-request targeting the single associated `JobDescription` and `Resume`. This tradeoff drastically simplifies systemic state management.
- **Temporary Ephemeral File Storage**: Standard cloud environments (e.g., Render) run ephemeral file systems. Any uploads directed to `uploads/resumes` are lost on restart. Long-term production requires attaching an explicit Object Store (like AWS S3) to the service logic.
- **Structural Parser Text-Flatting**: The ATS parsing limits structural evaluations precisely to extracted text strings (by PyPDF2/python-docx), oblivious to explicit visual formatting such as highly-designed CSS columns, graphic tables, or embedded icon hierarchies which these python dependencies naturally drop upon text-extraction. This specific limitation is explicitly cautioned to end users in the frontend UI.
- **Static Certification Mapping**: The skill and curriculum mapping dictionary inside `skill_resources.py` is entirely static overhead structure. While guaranteeing strict authenticity, it inherently mandates manual curational maintenance when organizations inevitably alter URLs, provider tags, or certifications inherently retire.

## 3. Mandatory Environment Variables
- `FLASK_ENV`: (e.g. `development` or `production`) Dictates debug logging and CORS rigidity.
- `SECRET_KEY`: Signs user JWT authentication payloads.
- `DB_USER`: Database authentication identity.
- `DB_PASSWORD`: Database authentication lock.
- `DB_HOST`: IPv4 routing / Alias.
- `DB_PORT`: Internal routing (usually `3306`).
- `DB_NAME`: Database table allocation.
- `FRONTEND_URL`: CORS binding allocation restricting requests safely to the `origin`.
- `UPLOAD_FOLDER`: Relative target identifying where temporary buffers execute.
- `MAX_CONTENT_LENGTH_MB`: Restricts arbitrary file flooding constraints natively.
- `LLM_API_KEY`: Secrets allocated explicitly bridging communication to Google's Gemini parameters.
- `LLM_PROVIDER`: Placeholder tracking potential transitions (defaults locally to `gemini`).

## 4. Gotchas & Workarounds
- **Python 3.8.10 Package End-of-Life**: Scipy and NumPy drastically shifted compilation standards over version ~1.11 and 2.0.0. `requirements.txt` strictly binds versions (e.g. `sentence-transformers<3.0.0`, `scipy<1.11.0`) ensuring deployment machines don't inherently break compiling wheel configurations silently.
- **Regex Boundary Special Char Handling**: Classic regex combinations evaluating word boundaries (`\b`) violently crash evaluating characters like `#` and `+` (e.g., `C++`, `C#`). Bounded searches utilizing lookaheads/lookbehinds (`(?<![\w])` / `(?![\w])`) natively fix this extraction flaw in `skill_detector.py`.
- **Axios Stray Routing**: `UploadResumePage.tsx` originally suffered from API drift. Utilizing Centralized API layers passing credentials reliably was actively retrofitted explicitly.
- **Frontend Contrast Reversing**: White texts (`#fff`) overlapping Light Teal backgrounds failed basic WCAG compliance parameters natively. Dynamic overriding into `--text-inverse` dynamically forces black (`#121817`) onto Light-themed variant overlays successfully.

## 5. Potential Future Integrations (v1.5+ Ideas)
- **Multi-JD Aggregation**: Comparing singular uploads across an infinite array of `job_description` models parsing a heatmap of general applicability natively.
- **S3 Object Persistence**: Offload transient PDF storage natively into AWS S3 avoiding Render's ephemeral limits.
- **Automated CI/CD**: Hook standard `pytest` blocks analyzing vector regressions iteratively against GitHub Actions. 
- **PDF Export Configurations**: Automatically bind AI response blocks utilizing `pdfkit` formatting offline PDF results natively back into output buffers.
- **Optical Formatting Detection Engine**: Reconstruct layout metrics using physical PDF-rendering parsing frameworks to assess deeper ATS unparseable risks like layered sidebars and floating tabular configurations securely bounding structural limits.
- **Dynamic Certification Pipeline Expansion**: Expand the `skill_resources.py` data structure map to allow administrative user feedback or periodic ingestion directly augmenting verified courses progressively.
