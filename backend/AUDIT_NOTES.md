# Backend Audit Notes

## Findings & Fixes
- **Global Error Handling**: Modified `handle_exception` in `app/__init__.py` to log errors internally and surface a generic "Internal Server Error" (500) to the client, preventing stack trace leaks.
- **Skill Detection Boundaries**: Refactored the regex matching in `utils/skill_detector.py` to use negative lookbehinds/lookaheads (`(?<![\w])` and `(?![\w])`) instead of `\b`. This handles skills containing special characters (like `C++` or `.NET`) accurately without triggering falsely inside unrelated words.
- **AI Feedback Timeout**: Appended an explicit 15-second `timeout` to the `generate_content` call within `utils/ai_feedback.py` via `request_options` to ensure that standard AI analysis requests never hang indefinitely. Also centralized `LLM_API_KEY` to load via `current_app.config`.
- **FAISS Edge Conditions**: Enhanced logic in `services/analysis_service.py` to check for empty or unextractable `resume.extracted_text`. If empty, it immediately returns a default payload bypassing FAISS index allocation and vector search, gracefully preventing application crashes.
- **Python 3.8 Compatibility**: Updated `requirements.txt` to strictly bound package versions known to drop Python 3.8 support. Pinned `sentence-transformers<3.0.0`, `numpy<2.0.0`, and `scipy<1.11.0`.

## Outcome
The backend API configuration is robust, properly handles extreme string matches and null buffers, prevents stack overflow timeouts, and guarantees cross-platform startup compatibility as targeted.
