import numpy as np
import json
from app.models import db, Analysis, Resume, JobDescription
from app.utils.embedding_utils import generate_embedding, chunk_text
from app.utils.vector_store import VectorStore
from app.utils.skill_detector import detect_skills
from app.utils.ai_feedback import generate_feedback_and_recommendations
from app.utils.ats_checker import check_ats_structure
from app.utils.skill_resources import get_resources_for_skills
from app.utils.improvement_prioritizer import build_improvement_summary
import os
import logging

logger = logging.getLogger(__name__)

def cosine_similarity(vec1, vec2):
    dot = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)

def analyze_resume(resume_id, job_description_id, user_id):
    resume = Resume.query.get(resume_id)
    if not resume or resume.user_id != user_id:
        raise PermissionError("Resume not found or access denied")
        
    jd = JobDescription.query.get(job_description_id)
    if not jd or jd.user_id != user_id:
        raise PermissionError("Job description not found or access denied")
        
    # Check for empty or unextractable resumes
    if not resume.extracted_text or not resume.extracted_text.strip():
        analysis = Analysis(
            user_id=user_id,
            resume_id=resume.id,
            job_description_id=jd.id,
            match_score=0.0,
            skills_matched=0,
            total_skills=len(set(detect_skills(jd.description_text))),
            feedback_text="Resume text extraction failed or is empty.",
            recommendations_text="Please upload a resume containing recognizable text.",
            skills_detected=[],
            ats_score=0,
            missing_sections=["Experience", "Education", "Skills", "Projects", "Summary"],
            has_email=False,
            has_phone=False,
            has_dates=False,
            quantification_ratio=0.0,
            word_count=0,
            length_flag="too_short",
            suggested_resources=[],
            improvement_summary=[]
        )
        db.session.add(analysis)
        db.session.commit()
        return analysis
        
    # Chunking and Embeddings
    chunks = chunk_text(resume.extracted_text)
    if not chunks:
        chunks = [resume.extracted_text]
        
    chunk_embeddings = np.array([generate_embedding(c) for c in chunks])
    
    vs = VectorStore()
    vs.build_index(chunks, chunk_embeddings)
    
    jd_embedding = generate_embedding(jd.description_text)
    relevant_chunks = vs.search(jd_embedding, top_k=3)
    
    # Semantic match score based on overall text
    resume_embedding_overall = generate_embedding(resume.extracted_text)
    sim = cosine_similarity(resume_embedding_overall, jd_embedding)
    match_score = round(max(0.0, float(sim)) * 100, 2)
    
    # Skill Detection
    resume_skills = set(detect_skills(resume.extracted_text))
    jd_skills = set(detect_skills(jd.description_text))
    
    matched_skills = list(jd_skills.intersection(resume_skills))
    missing_skills = list(jd_skills.difference(resume_skills))
    
    # AI Feedback
    ai_resp = generate_feedback_and_recommendations(
        relevant_chunks, jd.description_text, matched_skills, missing_skills, match_score
    )
    
    # ATS Structural Analytics with Graceful Fallback
    file_extension = os.path.splitext(resume.original_filename)[1].lower() if resume.original_filename else ".unknown"
    try:
        ats_results = check_ats_structure(resume.extracted_text, file_extension)
    except Exception as e:
        logger.error(f"ATS Structure check failed: {str(e)}")
        ats_results = {
            "ats_score": 0,
            "missing_sections": ["Experience", "Education", "Skills"],
            "has_email": False,
            "has_phone": False,
            "has_dates": False,
            "quantification_ratio": 0.0,
            "word_count": len(resume.extracted_text.split()) if resume.extracted_text else 0,
            "length_flag": "too_short"
        }
        
    try:
        suggested_res = get_resources_for_skills(missing_skills)
    except Exception as e:
        logger.error(f"Skill Certification matching failed: {str(e)}")
        suggested_res = []
        
    analysis = Analysis(
        user_id=user_id,
        resume_id=resume.id,
        job_description_id=jd.id,
        match_score=match_score,
        skills_matched=len(matched_skills),
        total_skills=len(jd_skills),
        feedback_text=ai_resp.get("feedback_text"),
        recommendations_text=ai_resp.get("recommendations_text"),
        skills_detected=matched_skills,
        ats_score=ats_results["ats_score"],
        missing_sections=ats_results["missing_sections"],
        has_email=ats_results["has_email"],
        has_phone=ats_results["has_phone"],
        has_dates=ats_results["has_dates"],
        quantification_ratio=ats_results["quantification_ratio"],
        word_count=ats_results["word_count"],
        length_flag=ats_results["length_flag"],
        suggested_resources=suggested_res
    )
    
    # Calculate Priority Improvements using assembled metadata safely
    try:
        analysis_data_dict = {
            "has_email": ats_results.get("has_email", False),
            "has_phone": ats_results.get("has_phone", False),
            "missing_sections": ats_results.get("missing_sections", []),
            "has_dates": ats_results.get("has_dates", False),
            "quantification_ratio": ats_results.get("quantification_ratio", 0.0),
            "length_flag": ats_results.get("length_flag", "ok"),
            "missing_skills": missing_skills,
            "match_score": match_score
        }
        analysis.improvement_summary = build_improvement_summary(analysis_data_dict)
    except Exception as e:
        logger.error(f"Improvement Prioritizer failed: {str(e)}")
        analysis.improvement_summary = []

    db.session.add(analysis)
    db.session.commit()
    return analysis

def get_user_analyses(user_id):
    return Analysis.query.filter_by(user_id=user_id).all()

def get_analysis_by_id(analysis_id, user_id):
    analysis = Analysis.query.get(analysis_id)
    if not analysis:
        raise ValueError("Analysis not found")
    if analysis.user_id != user_id:
        raise PermissionError("Access denied to this analysis")
    return analysis
