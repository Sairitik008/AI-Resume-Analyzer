from app.models import db, JobDescription

def create_job_description(user_id, title, description_text):
    jd = JobDescription(user_id=user_id, title=title, description_text=description_text)
    db.session.add(jd)
    db.session.commit()
    return jd

def get_user_job_descriptions(user_id):
    return JobDescription.query.filter_by(user_id=user_id).all()

def get_job_description_by_id(jd_id, user_id):
    jd = JobDescription.query.get(jd_id)
    if not jd:
        raise ValueError("Job description not found")
    if jd.user_id != user_id:
        raise PermissionError("Access denied to this job description")
    return jd

def update_job_description(jd_id, user_id, title, description_text):
    jd = get_job_description_by_id(jd_id, user_id)
    jd.title = title
    jd.description_text = description_text
    db.session.commit()
    return jd

def delete_job_description(jd_id, user_id):
    jd = get_job_description_by_id(jd_id, user_id)
    db.session.delete(jd)
    db.session.commit()
