# Project Rules

## Backend Guidelines
- Enforce the **Flask App Factory** pattern (`create_app()`).
- All configurations must be read from environment variables (`.env`).
- Maintain compatibility with **Python 3.8.10**.
- Return universally structured JSON for both success and errors.
- Never hardcode API keys or credentials.
- Handle database operations gracefully via central `db` instance from SQLAlchemy.

## Frontend Guidelines
- Always type variables explicitly where necessary utilizing TypeScript.
- Follow SCSS modular organization (`_variables`, `_mixins`, etc.).
- Isolate API calls into the `services` layer.
