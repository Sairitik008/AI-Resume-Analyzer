from flask import Blueprint
from app.middlewares.auth_middleware import token_required
from app.controllers.resume_controller import (
    upload_resume_controller, list_resumes_controller, get_resume_controller
)

resume_bp = Blueprint('resumes', __name__, url_prefix='/api/resumes')

resume_bp.add_url_rule('/upload', view_func=token_required(upload_resume_controller), methods=['POST'])
resume_bp.add_url_rule('', view_func=token_required(list_resumes_controller), methods=['GET'])
resume_bp.add_url_rule('/<int:resume_id>', view_func=token_required(get_resume_controller), methods=['GET'])
