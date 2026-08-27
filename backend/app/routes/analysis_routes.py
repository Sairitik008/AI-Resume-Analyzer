from flask import Blueprint
from app.middlewares.auth_middleware import token_required
from app.controllers.analysis_controller import (
    analyze_controller, list_analyses_controller, get_analysis_controller
)

analysis_bp = Blueprint('analyses', __name__, url_prefix='/api/analyses')

analysis_bp.add_url_rule('', view_func=token_required(analyze_controller), methods=['POST'])
analysis_bp.add_url_rule('', view_func=token_required(list_analyses_controller), methods=['GET'])
analysis_bp.add_url_rule('/<int:analysis_id>', view_func=token_required(get_analysis_controller), methods=['GET'])
