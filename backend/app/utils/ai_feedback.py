import os
import requests
import json

# Using Google Gemini API REST interface directly to avoid google.generativeai package compatibility issues
def generate_feedback_and_recommendations(resume_relevant_chunks: list, job_description_text: str, matched_skills: list, missing_skills: list, match_score: float) -> dict:
    fallback = {
        "feedback_text": "Unable to generate AI feedback at this time.",
        "recommendations_text": "Please review your resume against the job description manually."
    }
    
    from flask import current_app
    api_key = current_app.config.get("LLM_API_KEY") if current_app else os.environ.get("LLM_API_KEY")
    if not api_key:
        fallback["feedback_text"] = "AI API key not configured."
        return fallback

    try:
        context_chunks = "\\n...\\n".join(resume_relevant_chunks)
        
        prompt = f"""
        You are an experienced, friendly career mentor giving honest, specific, conversational feedback to a candidate.
        Do NOT use robotic or generic corporate AI phrasing. Write openly and supportively.
        
        Job Description: {job_description_text}
        
        Relevant snippets from candidate's resume:
        {context_chunks}
        
        Match Score: {match_score}%
        Matched Skills: {', '.join(matched_skills)}
        Missing Skills: {', '.join(missing_skills)}
        
        Tasks:
        1. Write feedback_text (1-2 paragraphs) talking to the candidate directly about how well their resume hits the core needs.
        2. Write recommendations_text (3-4 bullet points) offering actionable advice on what to improve or learn based on missing skills.
        
        Return ONLY valid JSON format strictly matching:
        {{"feedback_text": "...", "recommendations_text": "..."}}
        No markdown code fencing, just the JSON string.
        """
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=90.0)
        
        if response.status_code != 200:
            print(f"LLM API Error: {response.text}")
            return fallback

        data = response.json()
        try:
            parts = data["candidates"][0]["content"]["parts"]
            text = parts[-1]["text"].strip()
        except (KeyError, IndexError):
            print("LLM API parsing error: unexpected response format")
            return fallback

        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        result = json.loads(text.strip())
        return {
            "feedback_text": result.get("feedback_text", fallback["feedback_text"]),
            "recommendations_text": result.get("recommendations_text", fallback["recommendations_text"])
        }
    except Exception as e:
        print(f"LLM Error: {e}")
        return fallback
