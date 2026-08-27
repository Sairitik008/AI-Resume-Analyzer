from functools import wraps
from flask import request, current_app, g
import jwt
from app.utils.response_handler import error_response
from app.models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check Authorization header (Format: Bearer <token>)
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]
                
        if not token:
            return error_response(message="Token is missing!", status_code=401)
            
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(payload['user_id'])
            if not current_user:
                return error_response(message="Invalid User!", status_code=401)
            g.user = current_user
        except jwt.ExpiredSignatureError:
            return error_response(message="Token has expired!", status_code=401)
        except jwt.InvalidTokenError:
            return error_response(message="Invalid token!", status_code=401)
            
        return f(*args, **kwargs)
    return decorated
