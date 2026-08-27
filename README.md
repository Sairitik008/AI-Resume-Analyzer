# AI Resume Analyzer

An intelligent, full-stack application that helps users objectively score and adapt their resumes against specific job descriptions using LLMs.

I built this project to solve a very real problem: the black box of Applicant Tracking Systems (ATS). Job seekers often throw their resumes into portals without knowing if they hit the critical keywords or structure that a recruiter is looking for. By leveraging Google's Gemini alongside a dense-vector semantic search, this app provides immediate, actionable feedback on where a resume thrives and what skills are glaringly absent for a specific role.

## 🚀 Key Features

*   **Semantic Match Scoring:** Uses vectorized embeddings (`sentence-transformers`) and Cosine Similarity to evaluate how well the resume text conceptually aligns with the job description, rather than relying on brittle keyword-matching.
*   **Skill Gap Analysis:** Extracts technical skills from both the resume and JD to surface exactly what is missing from the applicant's profile.
*   **AI-Powered Actionable Feedback:** Generates clear, localized feedback on the candidate's strengths and concrete recommendations for how to improve the resume for this specific role.
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

### Deployment & DevOps
*   **Containerization:** Production-ready `Dockerfile` optimized for Python (via `gunicorn`).
*   **Hosting:** Deployable architecture tailored for Render (Backend) and Vercel (Frontend).

## 📸 Screenshots

*(Add real screenshots here after deployment)*
*   ![Dashboard View](./placeholder-dashboard.png)
*   ![Analysis Detail](./placeholder-analysis.png)
*   ![Dark Mode Support](./placeholder-darkmode.png)

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
