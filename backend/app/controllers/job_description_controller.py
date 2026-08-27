from flask import request, g
from app.utils.response_handler import success_response, error_response
from app.utils.validator import validate_schema
from app.validations.job_description_validation import job_description_schema
from app.services import job_description_service

def create_jd_controller():
    data = request.get_json() or {}
    
    is_valid, errors = validate_schema(data, job_description_schema)
    if not is_valid:
        return error_response(message="Validation Error", status_code=400, errors=errors)
        
    try:
        jd = job_description_service.create_job_description(
            user_id=g.user.id,
            title=data.get('title'),
            description_text=data.get('description_text')
        )
        data_out = {
            "id": jd.id,
            "title": jd.title,
            "created_at": jd.created_at.isoformat()
        }
        return success_response(data=data_out, message="Job description created successfully", status_code=201)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def list_jd_controller():
    try:
        jds = job_description_service.get_user_job_descriptions(g.user.id)
        data = [
            {"id": jd.id, "title": jd.title, "created_at": jd.created_at.isoformat()}
            for jd in jds
        ]
        return success_response(data=data, message="Job descriptions fetched successfully", status_code=200)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def get_jd_controller(jd_id):
    try:
        jd = job_description_service.get_job_description_by_id(jd_id, g.user.id)
        data = {
            "id": jd.id,
            "title": jd.title,
            "description_text": jd.description_text,
            "created_at": jd.created_at.isoformat()
        }
        return success_response(data=data, message="Job description fetched successfully", status_code=200)
    except ValueError as e:
        return error_response(message=str(e), status_code=404)
    except PermissionError as e:
        return error_response(message=str(e), status_code=403)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def update_jd_controller(jd_id):
    data = request.get_json() or {}
    
    is_valid, errors = validate_schema(data, job_description_schema)
    if not is_valid:
        return error_response(message="Validation Error", status_code=400, errors=errors)
        
    try:
        jd = job_description_service.update_job_description(
            jd_id=jd_id,
            user_id=g.user.id,
            title=data.get('title'),
            description_text=data.get('description_text')
        )
        data_out = {
            "id": jd.id,
            "title": jd.title,
            "description_text": jd.description_text,
            "created_at": jd.created_at.isoformat(),
            "updated_at": jd.updated_at.isoformat()
        }
        return success_response(data=data_out, message="Job description updated successfully", status_code=200)
    except ValueError as e:
        return error_response(message=str(e), status_code=404)
    except PermissionError as e:
        return error_response(message=str(e), status_code=403)
    except Exception as e:
        return error_response(message=str(e), status_code=500)

def delete_jd_controller(jd_id):
    try:
        job_description_service.delete_job_description(jd_id, g.user.id)
        return success_response(message="Job description deleted successfully", status_code=200)
    except ValueError as e:
        return error_response(message=str(e), status_code=404)
    except PermissionError as e:
        return error_response(message=str(e), status_code=403)
    except Exception as e:
        return error_response(message=str(e), status_code=500)
