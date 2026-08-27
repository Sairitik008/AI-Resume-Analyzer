from flask import request, g
from app.middlewares.auth_middleware import token_required
from app.utils.response_handler import success_response, error_response
from app.utils.validator import validate_schema
from app.validations.auth_validation import register_validation_schema, login_validation_schema
from app.services import auth_service

def register_controller():
    data = request.get_json() or {}
    
    is_valid, errors = validate_schema(data, register_validation_schema)
    if not is_valid:
        return error_response(message="Validation Error", status_code=400, errors=errors)
        
    try:
        user_info = auth_service.register_user(
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password')
        )
        return success_response(data=user_info, message="User registered successfully", status_code=201)
    except ValueError as e:
        return error_response(message=str(e), status_code=400)
    except Exception as e:
        return error_response(message="Internal error during registration", status_code=500)

def login_controller():
    data = request.get_json() or {}
    
    is_valid, errors = validate_schema(data, login_validation_schema)
    if not is_valid:
        return error_response(message="Validation Error", status_code=400, errors=errors)
        
    try:
        login_data = auth_service.login_user(
            email=data.get('email'),
            password=data.get('password')
        )
        return success_response(data=login_data, message="Login successful", status_code=200)
    except ValueError as e:
        return error_response(message=str(e), status_code=401)
    except Exception as e:
        return error_response(message="Internal error during login", status_code=500)

@token_required
def me_controller():
    user = g.user
    return success_response(
        data={
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at.isoformat(),
        },
        message="User profile fetched successfully",
        status_code=200,
    )
