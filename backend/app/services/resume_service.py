import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app
from app.models import db, Resume
from app.utils.text_extractor import extract_resume_text

def save_resume_file(file):
    original_filename = secure_filename(file.filename)
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    
    file.save(file_path)
    return file_path, file.filename, ext

def process_resume_upload(file, user_id):
    file_path, original_filename, ext = save_resume_file(file)
    
    extracted_text = extract_resume_text(file_path, ext)
    
    resume = Resume(
        user_id=user_id,
        original_filename=original_filename,
        file_path=file_path,
        extracted_text=extracted_text
    )
    db.session.add(resume)
    db.session.commit()
    return resume

def get_user_resumes(user_id):
    return Resume.query.filter_by(user_id=user_id).all()

def get_resume_by_id(resume_id, user_id):
    resume = Resume.query.get(resume_id)
    if not resume:
        raise ValueError("Resume not found")
    if resume.user_id != user_id:
        raise PermissionError("Access denied to this resume")
    return resume
