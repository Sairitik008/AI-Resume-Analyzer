# Product Requirements Document (PRD)

## 1. Problem Statement
Job seekers frequently struggle to tailor their resumes for specific job descriptions, often applying with generic resumes that fail to pass Applicant Tracking Systems (ATS) or catch recruiters' attention. Manually identifying missing keywords and formatting resumes to match job descriptions is time-consuming and error-prone. This project aims to bridge that gap by using AI to instantly evaluate a candidate's resume against a targeted job description.

## 2. Target Users
- **Active Job Seekers**: Professionals applying to multiple roles who need fast, actionable feedback on their resume matching score.
- **Career Changers**: Individuals pivoting to new industries looking to understand skill gaps and how to communicate their transferable skills.
- **Recent Graduates**: Students looking to optimize their academic projects and early experience against entry-level job descriptions.

## 3. Core Features
- **Secure Authentication**: JWT-based login and registration system protecting user data.
- **Document Ingestion**: Capability to upload and parse `.pdf` and `.docx` formatted resumes securely.
- **Job Description Management**: Full CRUD interface for adding, tracking, and managing target job descriptions.
- **AI-Powered Match Analysis**: Vector-based semantic similarity scoring (FAISS + Embeddings) between the resume and the job description.
- **Skill Detection**: Exact keyword matching identifying intersecting and missing professional skills.
- **AI Feedback & Recommendations**: Conversational, non-robotic LLM-generated feedback (via Gemini) providing actionable advice on what to improve.
- **ATS Structure & Parsability Check**: Rule-based, non-LLM analysis of resume structure (sections, contact info, dates, quantification, length) that produces an ats_score and honest, scoped feedback — essentially checking common ATS-relevant text patterns, not any proprietary algorithm.
- **Targeted Certification Suggestions**: A small, curated, capped (max 5) list of real, verifiable certifications/courses mapped to the SPECIFIC skills missing for a given job description — intentionally scoped and NOT a generic "learn everything" list, addressing decision fatigue.
- **Prioritized Improvement Summary**: A ranked, capped (max 5) list of the most impactful fixes for a resume, combining ATS/structure/quantification/skill-gap signals into one actionable "fix this first" view.
- **Dashboard & History**: A centralized dashboard tracking total analyses, recent activity, and an archive of historical score comparisons.

## 4. Out-of-Scope (Version 1)
- **Multi-JD Comparison**: Comparing one resume simultaneously against multiple job descriptions.
- **Automated Resume Editing**: The system will not automatically rewrite or generate a new resume PDF for the user.
- **Recruiter Accounts**: Team, enterprise, or recruiter portals for evaluating multiple candidates are intentionally excluded.
- **Direct PDF Export**: Exporting the analysis results to a downloadable PDF.
- **Proprietary Plagiarism or ATS emulation**: Does not detect plagiarism, replicate any specific company's actual proprietary ATS algorithm, or provide authoritative visa/immigration/certification requirements for specific countries — this is proprietary variable information that cannot be responsibly automated.

## 5. Success Criteria (v1 Definition of Done)
- Users can successfully register, log in, and maintain a persistent, secure session.
- Users can upload resumes and job descriptions without parsing errors or string encoding issues.
- The AI analysis completes within 15 seconds, returning a quantitative score and qualitative feedback gracefully.
- The UI is fully responsive across mobile, tablet, and desktop viewports, strictly adhering to the design system variables.
- All endpoints are secure, validated, and natively handle edge cases (empty files, API timeouts) without leaking stack traces.

## 6. User Stories
- **As a job seeker**, I want to upload my PDF resume, so that the system has a baseline of my experience.
- **As a job seeker**, I want to paste a job description I found on LinkedIn, so that I can evaluate my fit for the role.
- **As a job seeker**, I want to generate an AI analysis comparing my uploaded resume to my saved job description, so that I can receive a match score and actionable feedback.
- **As a user**, I want to view my dashboard, so that I can quickly see my recent analyses and track my overall application readiness.
- **As a job seeker**, I want to see a prioritized list of what to fix first, so that I don't feel overwhelmed by every possible improvement at once.
- **As a job seeker**, I want any suggested certification or course to be tightly targeted towards a specific missing skill instead of generic broad advice.
