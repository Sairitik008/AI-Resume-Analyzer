from flask import Blueprint
from app.controllers.dashboard_controller import dashboard_summary_controller

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

dashboard_bp.add_url_rule('/summary', view_func=dashboard_summary_controller, methods=['GET'])
