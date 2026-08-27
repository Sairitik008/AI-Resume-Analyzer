import datetime
import jwt
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import db, User

def register_user(name, email, password):
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        raise ValueError("Email already exists")
    
    hashed_password = generate_password_hash(password)
    user = User(name=name, email=email, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }

def login_user(email, password):
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        raise ValueError("Invalid credentials")
    
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    token = jwt.encode(payload, current_app.config.get('SECRET_KEY'), algorithm='HS256')
    
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }
