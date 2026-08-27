import os
from flask import current_app

def validate_resume_file(file):
    if not file or file.filename == '':
        return False, "No file provided"
        
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    if ext not in current_app.config['ALLOWED_EXTENSIONS']:
        return False, f"Invalid file type. Allowed extensions: {', '.join(current_app.config['ALLOWED_EXTENSIONS'])}"
        
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0, 0)
    
    if file_length > current_app.config['MAX_CONTENT_LENGTH']:
        mb_size = current_app.config['MAX_CONTENT_LENGTH'] / (1024 * 1024)
        return False, f"File size exceeds maximum limit of {mb_size}MB"
        
    return True, None
