from sqlalchemy import func
from app.models import db, Resume, JobDescription, Analysis

def get_summary(user_id):
    total_resumes = Resume.query.filter_by(user_id=user_id).count()
    total_job_descriptions = JobDescription.query.filter_by(user_id=user_id).count()
    total_analyses = Analysis.query.filter_by(user_id=user_id).count()

    avg_result = db.session.query(func.avg(Analysis.match_score))\
        .filter(Analysis.user_id == user_id).scalar()
    average_match_score = round(float(avg_result), 1) if avg_result is not None else None

    recent = Analysis.query.filter_by(user_id=user_id)\
        .order_by(Analysis.created_at.desc()).first()

    most_recent_analysis = None
    if recent:
        most_recent_analysis = {
            "id": recent.id,
            "match_score": recent.match_score,
            "created_at": recent.created_at.isoformat(),
            "jd_title": recent.job_description.title if recent.job_description else "Unknown",
            "resume_filename": recent.resume.original_filename if recent.resume else "Unknown",
        }

    return {
        "total_resumes": total_resumes,
        "total_job_descriptions": total_job_descriptions,
        "total_analyses": total_analyses,
        "average_match_score": average_match_score,
        "most_recent_analysis": most_recent_analysis,
    }
