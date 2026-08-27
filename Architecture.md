# Project Architecture

## Overview
The AI Resume Analyzer is built utilizing a decoupled, full-stack monorepo system.

## Tech Stack
### Frontend
- **Framework**: React.js (Vite)
- **Language**: TypeScript
- **Styling**: SCSS (Structured via Base, Abstracts, & Pages)

### Backend
- **Framework**: Flask (App Factory Pattern)
- **Language**: Python (3.8.10)
- **Database**: MySQL (Accessed via Flask-SQLAlchemy)
- **Migrations**: Alembic (via Flask-Migrate)
- **AI Processing**: TBD (e.g., OpenAI, LangChain, or HuggingFace)
