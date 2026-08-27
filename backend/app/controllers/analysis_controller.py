from flask import request, g
from app.utils.response_handler import success_response, error_response
from app.utils.validator import validate_schema
from app.validations.analysis_validation import analysis_schema
from app.services import analysis_service

def analyze_controller():
    data = request.get_json() or {}
    is_valid, errors = validate_schema(data, analysis_schema)
    if not is_valid:
        return error_response(message="Validation Error", status_code=400, errors=errors)
        
    try:
        analysis = analysis_service.analyze_resume(
            resume_id=data.get('resume_id'),
            job_description_id=data.get('job_description_id'),
            user_id=g.user.id
        )
        data_out = {
            "id": analysis.id,
            "match_score": analysis.match_score,
            "skills_matched": analysis.skills_matched,
            "total_skills": analysis.total_skills,
            "skills_detected": analysis.skills_detected,
            "feedback_text": analysis.feedback_text,
            "recommendations_text": analysis.recommendations_text,
            "ats_score": getattr(analysis, 'ats_score', None),
            "missing_sections": getattr(analysis, 'missing_sections', []),
            "has_email": getattr(analysis, 'has_email', None),
            "has_phone": getattr(analysis, 'has_phone', None),
            "has_dates": getattr(analysis, 'has_dates', None),
            "quantification_ratio": getattr(analysis, 'quantification_ratio', None),
            "word_count": getattr(analysis, 'word_count', None),
            "length_flag": getattr(analysis, 'length_flag', None),
            "format_note": f"File natively uploaded for analysis. This structural check relies exclusively on flattening extracted text blocks. It cannot detect complex nested columns, opaque vector tables, or layout visuals which can occasionally derail older generation ATS parsers. Standard .docx or single-column .pdf are optimally safe.",
            "suggested_resources": getattr(analysis, 'suggested_resources', []),
            "improvement_summary": getattr(analysis, 'improvement_summary', []),
            "created_at": analysis.created_at.isoformat()
        }
        return success_response(data=data_out, message="Analysis completed successfully", status_code=201)
    except PermissionError as e:
        return error_response(message=str(e), status_code=403)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def list_analyses_controller():
    try:
        analyses = analysis_service.get_user_analyses(g.user.id)
        data = []
        for an in analyses:
            data.append({
                "id": an.id,
                "match_score": an.match_score,
                "created_at": an.created_at.isoformat(),
                "resume_filename": an.resume.original_filename if an.resume else "Unknown",
                "jd_title": an.job_description.title if an.job_description else "Unknown"
            })
        return success_response(data=data, message="Analyses fetched successfully", status_code=200)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def get_analysis_controller(analysis_id):
    try:
        an = analysis_service.get_analysis_by_id(analysis_id, g.user.id)
        data = {
            "id": an.id,
            "match_score": an.match_score,
            "skills_matched": an.skills_matched,
            "total_skills": an.total_skills,
            "skills_detected": an.skills_detected,
            "feedback_text": an.feedback_text,
            "recommendations_text": an.recommendations_text,
            "ats_score": getattr(an, 'ats_score', None),
            "missing_sections": getattr(an, 'missing_sections', []),
            "has_email": getattr(an, 'has_email', None),
            "has_phone": getattr(an, 'has_phone', None),
            "has_dates": getattr(an, 'has_dates', None),
            "quantification_ratio": getattr(an, 'quantification_ratio', None),
            "word_count": getattr(an, 'word_count', None),
            "length_flag": getattr(an, 'length_flag', None),
            "format_note": f"File natively uploaded for analysis. This structural check relies exclusively on flattening extracted text blocks. It cannot detect complex nested columns, opaque vector tables, or layout visuals which can occasionally derail older generation ATS parsers. Standard .docx or single-column .pdf are optimally safe.",
            "suggested_resources": getattr(an, 'suggested_resources', []),
            "improvement_summary": getattr(an, 'improvement_summary', []),
            "created_at": an.created_at.isoformat(),
            "resume_filename": an.resume.original_filename if an.resume else "Unknown",
            "jd_title": an.job_description.title if an.job_description else "Unknown"
        }
        return success_response(data=data, message="Analysis fetched successfully", status_code=200)
    except ValueError as e:
        return error_response(message=str(e), status_code=404)
    except PermissionError as e:
        return error_response(message=str(e), status_code=403)
    except Exception as e:
        return error_response(message=str(e), status_code=500)
