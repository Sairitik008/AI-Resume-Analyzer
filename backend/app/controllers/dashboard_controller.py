from flask import g
from app.utils.response_handler import success_response, error_response
from app.middlewares.auth_middleware import token_required
from app.services import dashboard_service

@token_required
def dashboard_summary_controller():
    try:
        summary = dashboard_service.get_summary(g.user.id)
        return success_response(data=summary, message="Dashboard summary fetched successfully", status_code=200)
    except Exception as e:
        return error_response(message=str(e), status_code=500)
