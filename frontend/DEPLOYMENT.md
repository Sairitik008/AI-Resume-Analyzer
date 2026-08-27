# Frontend Deployment to Vercel

This guide outlines the steps to deploy the React frontend of the AI Resume Analyzer on Vercel.

## Prerequisites

1. A Vercel account (https://vercel.com).
2. The backend must be deployed first (e.g., on Render). You will need its live URL.
3. The repository hosted on GitHub.

## Deployment Steps

1. In the Vercel Dashboard, click **Add New...** and select **Project**.
2. Import the GitHub repository containing this project.
3. In the project configuration screen:
   - **Project Name:** Choose a suitable name (e.g., `ai-resume-analyzer-web`).
   - **Framework Preset:** Vercel should automatically detect `Vite`.
   - **Root Directory:** Ensure you click "Edit" and explicitly select the `/frontend` directory.
4. Expand the **Environment Variables** section and add the required variable (see below).
5. Click **Deploy**. Vercel will run `npm run build` and launch the application.

## Environment Variables

| Key | Example / Explanation |
| :--- | :--- |
| `VITE_API_BASE_URL` | The live URL where the backend is deployed (e.g., `https://ai-resume-analyzer-backend.onrender.com`). Crucially, this must **not** have a trailing slash. |

**Important Note:** The frontend requires the backend URL to function. Since you must deploy the backend first to get its URL, you will set this environment variable in the Vercel dashboard. If the backend URL changes, you must update this environment variable in Vercel and **trigger a redeployment** so the Vite build process can bake the new URL into your React application assets.

## SPA Routing

The repository includes a `vercel.json` file inside the `frontend` folder. This is a critical configuration flag that instructs Vercel to redirect all incoming traffic to `index.html`. This ensures that Vercel's edge network delegates the routing strictly to React Router on the client, avoiding frustrating 404 errors when a user refreshes the page while on a sub-route (e.g., `/dashboard`).
