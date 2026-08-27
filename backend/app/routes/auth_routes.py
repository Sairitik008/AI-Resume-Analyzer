from flask import Blueprint
from app.controllers.auth_controller import register_controller, login_controller, me_controller

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

auth_bp.add_url_rule('/register', view_func=register_controller, methods=['POST'])
auth_bp.add_url_rule('/login', view_func=login_controller, methods=['POST'])
auth_bp.add_url_rule('/me', view_func=me_controller, methods=['GET'])
