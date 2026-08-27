from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
import os

from app.config.config import config_by_name
from app.models import db
from app.utils.response_handler import error_response

migrate = Migrate()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")
        
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    if config_name == "development":
        CORS(app, origins="*")
    else:
        frontend_url = os.environ.get("FRONTEND_URL", "")
        # If multiple URLs are provided, this split allows supporting them gracefully, e.g., 'https://domain1.com,https://domain2.com'
        allowed_origins = [url.strip() for url in frontend_url.split(',')] if frontend_url else []
        CORS(app, origins=allowed_origins)
    
    db.init_app(app)
    
    # Initialize Flask-Migrate
    # Run the following commands to generate initial migrations:
    # flask db init
    # flask db migrate -m "create initial tables"
    # flask db upgrade
    migrate.init_app(app, db)
    
    from app.utils.response_handler import success_response
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return success_response({"status": "ok"}, message="Service is healthy", status_code=200)
    
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    
    from app.routes.resume_routes import resume_bp
    app.register_blueprint(resume_bp)
    
    from app.routes.job_description_routes import job_description_bp
    app.register_blueprint(job_description_bp)
    
    from app.routes.analysis_routes import analysis_bp
    app.register_blueprint(analysis_bp)

    from app.routes.dashboard_routes import dashboard_bp
    app.register_blueprint(dashboard_bp)
    
    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    # Global error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return error_response(message="Bad Request", status_code=400)
        
    @app.errorhandler(404)
    def not_found(e):
        return error_response(message="Not Found", status_code=404)
        
    @app.errorhandler(405)
    def method_not_allowed(e):
        return error_response(message="Method Not Allowed", status_code=405)
        
    @app.errorhandler(500)
    def internal_error(e):
        return error_response(message="Internal Server Error", status_code=500)
        
    @app.errorhandler(Exception)
    def handle_exception(e):
        import logging
        logging.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return error_response(message="Internal Server Error", status_code=500)

    return app
