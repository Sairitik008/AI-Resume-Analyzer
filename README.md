# AI Resume Analyzer

An intelligent, full-stack application that helps users objectively score and adapt their resumes against specific job descriptions using LLMs.

I built this project to solve a very real problem: the black box of Applicant Tracking Systems (ATS). Job seekers often throw their resumes into portals without knowing if they hit the critical keywords or structure that a recruiter is looking for. By leveraging Google's Gemini alongside a dense-vector semantic search, this app provides immediate, actionable feedback on where a resume thrives and what skills are glaringly absent for a specific role.

## 🚀 Key Features

*   **Semantic Match Scoring:** Uses vectorized embeddings (`sentence-transformers`) and Cosine Similarity to evaluate how well the resume text conceptually aligns with the job description, rather than relying on brittle keyword-matching.
*   **Skill Gap Analysis:** Extracts technical skills from both the resume and JD to surface exactly what is missing from the applicant's profile.
*   **AI-Powered Actionable Feedback:** Generates clear, localized feedback on the candidate's strengths and concrete recommendations for how to improve the resume for this specific role.
*   **ATS Structure & Parsability Check:** A fast, rule-based analysis of resume structure — checking for standard sections, contact info, dates, and quantified achievements — surfaced as a clear "ATS Health" score with an honest disclaimer about what text-based analysis can and can't detect.
*   **Targeted Certification Suggestions:** Instead of a generic list of every possible course, the app suggests a small, curated set (max 5) of real, well-known certifications mapped specifically to the skills missing for the role being analyzed.
*   **Prioritized Improvement Summary:** A ranked "fix this first" list combining every signal (ATS structure, missing skills, quantification, resume length) into the 3-5 most impactful changes a user should make — designed to cut through overwhelm rather than dumping every possible suggestion at once.
*   **Intuitive "Home Base" Dashboard:** A crisp, responsive React frontend providing the user with their historical scores, quick-action links, and an overview of their uploaded data.
*   **Robust Security:** JWT-based authentication layered with robust backend validation (`marshmallow`).

## 🛠️ The Tech Stack

### Frontend
*   **Framework:** React 18 & TypeScript (via Vite)
*   **Styling:** Modular SCSS mapping to a custom design token system (avoiding utility-class clutter for a cleaner codebase).
*   **Routing & State:** React Router for client-side routing, custom React Contexts for global Auth and Theme management (Dark/Light mode).

### Backend
*   **Framework:** Python & Flask
*   **Database:** MySQL with SQLAlchemy (ORM) and Flask-Migrate.
*   **AI & ML:** `google-generativeai` (Gemini), `sentence-transformers` for embeddings, and `faiss-cpu` for efficient local vector search algorithms.
*   **Deterministic Rule-Based Utilities:** Independent Python utility modules (`ats_checker`, `skill_resources`, `improvement_prioritizer`) explicitly separating structural validations from generative AI overheads, prioritizing speed and cost-free runtime over generic inferences.

### Deployment & DevOps
*   **Containerization:** Production-ready `Dockerfile` optimized for Python (via `gunicorn`).
*   **Hosting:** Deployable architecture tailored for Render (Backend) and Vercel (Frontend).

## 🧠 Why Rule-Based Checks Alongside AI?

While generative LLMs are fantastic for synthesizing natural language and offering fluid advice, we explicitly engineered several core mechanisms natively outside of the LLM pipeline. Features like ATS structural validations, certification mapping, and improvement prioritizations are entirely deterministic algorithms. This design keeps specific evaluations blazing fast, API cost-free entirely, explainable natively, and completely immune to AI hallucinations (e.g., Gemini won't ever invent a fake "Mastering Python for Recruiters" certification URL because it's strictly bounded by our vetted backend variables). We restrict the LLM to what it does uniquely well: qualitative conversational tone.

## 📸 Screenshots

*(Add real screenshots here after deployment)*
*   ![Dashboard View](./placeholder-dashboard.png)
*   ![Analysis Detail](./placeholder-analysis.png)
*   ![Dark Mode Support](./placeholder-darkmode.png)
<!-- Add a screenshot of the "Your Top Priorities" + ATS Health section here once available -->

## 💻 Local Setup Instructions

Want to run this locally? Here's how to spin it up.

### 1. The Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/Scripts/activate  # On Windows
    # source venv/bin/activate    # On Mac/Linux
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure your environment variables. Copy `.env.example` to `.env` and fill in your local MySQL credentials and Gemini API key.
5.  Run the database migrations:
    ```bash
    flask db upgrade
    ```
6.  Start the Flask server:
    ```bash
    flask run
    ```

### 2. The Frontend

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Set your local variables. Copy `.env.example` to `.env`. It should point to your local Flask server (e.g., `VITE_API_BASE_URL=http://localhost:5000`).
4.  Start the Vite development server:
    ```bash
    npm run dev
    ```

## 🌐 Live Demo

*(Add the live link to the Vercel app here once deployed!)*

## ⚠️ Known Limitations

*   **Ephemeral Storage Built-in:** To keep the project architecture accessible for a portfolio demonstration, PDF resume files are stored directly on the server's filesystem. When deployed to a PaaS offering ephemeral instances (like Render's free tier), uploaded resumes will be wiped upon server spin-down or redeployment. Moving to production would require swapping the filesystem saving logic for a persistent cloud bucket like AWS S3 or Google Cloud Storage.
*   **Text-Only ATS Analysis:** The ATS structure check analyzes extracted text patterns only — it cannot detect visual layout issues like multi-column formatting, tables, or embedded graphics, since standard PDF/DOCX text extraction doesn't preserve layout information. For a full visual review, users should also manually check their resume's appearance.
*   **Static Certification Mapping:** Suggested certifications come from a manually curated, static list mapped to common skills — it doesn't cover every possible skill and isn't automatically updated as new certifications are released.
