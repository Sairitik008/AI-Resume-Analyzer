# Backend Deployment to Render

This guide outlines the steps to deploy the AI Resume Analyzer backend on Render as a Web Service. The application is Dockerized and ready for production.

## Prerequisites

1. A Render account (https://render.com).
2. A separate MySQL Database provider. (Render does offer Redis and PostgreSQL but their native MySQL availability can vary; a free tier database on PlanetScale, Aiven, or Railway is highly recommended as a reliable alternative).
3. The repository hosted on GitHub.

## Deployment Steps

1. In the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name:** Choose a suitable name (e.g., `ai-resume-analyzer-backend`).
   - **Root Directory:** `backend`
   - **Environment:** `Docker`
   - **Branch:** `main` (or your preferred branch).
4. Scroll down to **Advanced** and set up the Environment Variables (see section below).
5. Click **Create Web Service**. Render will automatically detect the `Dockerfile`, build the image leveraging layer caching, and deploy the gunicorn server binding dynamically to `$PORT`.

## Environment Variables

These variables **must** be set securely in the Render dashboard and **never** committed to version control.

| Key | Example / Explanation |
| :--- | :--- |
| `FLASK_ENV` | `production` (Triggers production configurations like restricted CORS). |
| `SECRET_KEY` | A strong, random string for JWT hashing. |
| `DB_HOST` | Your remote MySQL host (e.g., `aws.connect.psdb.cloud`). |
| `DB_PORT` | The port for your database (usually `3306`). |
| `DB_USER` | Your database username. |
| `DB_PASSWORD` | Your database password. |
| `DB_NAME` | The target schema/database name. |
| `FRONTEND_URL` | The live URL where the frontend is deployed (e.g., `https://my-frontend.vercel.app`). Do not use `*`. |
| `LLM_PROVIDER` | `gemini` (as configured for this portfolio). |
| `LLM_API_KEY` | Your Google Gemini API Key. |
| `UPLOAD_FOLDER` | `uploads/resumes` (Safe to leave as default, handled by the app). |
| `MAX_CONTENT_LENGTH_MB` | `5` (Enforces 5MB max upload limits before reaching the validation layer). |

## Important Considerations

### Database Migrations
Once the database environment variables are set and the app is live, you must run the database migrations against the production database once to build the schema.
- You can do this by navigating to the "Shell" tab on your Render Web Service dashboard and running:
  `flask db upgrade`

### ⚠️ Known Limitation: Ephemeral Storage
In this portfolio version of the application, PDF resumes are stored locally on the server filesystem.
**Render Web Service instances use ephemeral storage.** This means any files uploaded will be completely wiped whenever the application is redeployed, restarted, or if it spins down due to inactivity on the free tier.
For a true production environment, you would need to integrate a persistent storage solution (such as AWS S3, Cloudinary, Google Cloud Storage, or a Render Persistent Disk attached to a Render Background Worker). For demonstrating the AI AI capabilities in this portfolio piece, the ephemeral storage is fully acceptable as long as it is documented.
