from flask import request, g
from app.utils.response_handler import success_response, error_response
from app.validations.resume_validation import validate_resume_file
from app.services import resume_service

def upload_resume_controller():
    if 'file' not in request.files:
        return error_response(message="No file part in request", status_code=400)
        
    file = request.files['file']
    is_valid, err_msg = validate_resume_file(file)
    if not is_valid:
        return error_response(message=err_msg, status_code=400)
        
    try:
        resume = resume_service.process_resume_upload(file, g.user.id)
        data = {
            "id": resume.id,
            "original_filename": resume.original_filename,
            "created_at": resume.created_at.isoformat()
        }
        return success_response(data=data, message="Resume uploaded successfully", status_code=201)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def list_resumes_controller():
    try:
        resumes = resume_service.get_user_resumes(g.user.id)
        data = [
            {"id": r.id, "original_filename": r.original_filename, "created_at": r.created_at.isoformat()}
            for r in resumes
        ]
        return success_response(data=data, message="Resumes fetched successfully", status_code=200)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def get_resume_controller(resume_id):
    try:
        resume = resume_service.get_resume_by_id(resume_id, g.user.id)
        data = {
            "id": resume.id,
            "original_filename": resume.original_filename,
            "created_at": resume.created_at.isoformat(),
            "extracted_text": resume.extracted_text
        }
        return success_response(data=data, message="Resume fetched successfully", status_code=200)
    except ValueError as e:
        return error_response(message=str(e), status_code=404)
    except PermissionError as e:
        return error_response(message=str(e), status_code=403)
    except Exception as e:
        return error_response(message=str(e), status_code=500)
