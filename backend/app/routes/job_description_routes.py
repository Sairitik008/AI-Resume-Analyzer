from flask import Blueprint
from app.middlewares.auth_middleware import token_required
from app.controllers.job_description_controller import (
    create_jd_controller, list_jd_controller, get_jd_controller, update_jd_controller, delete_jd_controller
)

job_description_bp = Blueprint('job_descriptions', __name__, url_prefix='/api/job-descriptions')

job_description_bp.add_url_rule('', view_func=token_required(create_jd_controller), methods=['POST'])
job_description_bp.add_url_rule('', view_func=token_required(list_jd_controller), methods=['GET'])
job_description_bp.add_url_rule('/<int:jd_id>', view_func=token_required(get_jd_controller), methods=['GET'])
job_description_bp.add_url_rule('/<int:jd_id>', view_func=token_required(update_jd_controller), methods=['PUT'])
job_description_bp.add_url_rule('/<int:jd_id>', view_func=token_required(delete_jd_controller), methods=['DELETE'])
