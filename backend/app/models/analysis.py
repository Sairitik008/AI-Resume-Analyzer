from .base import db, BaseModel

class Analysis(BaseModel):
    __tablename__ = 'analyses'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'), nullable=False)
    job_description_id = db.Column(db.Integer, db.ForeignKey('job_descriptions.id'), nullable=False)
    
    match_score = db.Column(db.Float)
    skills_matched = db.Column(db.Integer)
    total_skills = db.Column(db.Integer)
    experience_years = db.Column(db.Float, nullable=True)
    education_match = db.Column(db.String(255), nullable=True)
    feedback_text = db.Column(db.Text, nullable=True)
    recommendations_text = db.Column(db.Text, nullable=True)
    skills_detected = db.Column(db.JSON)
    
    # ATS Structural Analytics
    ats_score = db.Column(db.Integer, nullable=True)
    missing_sections = db.Column(db.JSON, nullable=True)
    has_email = db.Column(db.Boolean, nullable=True)
    has_phone = db.Column(db.Boolean, nullable=True)
    has_dates = db.Column(db.Boolean, nullable=True)
    quantification_ratio = db.Column(db.Float, nullable=True)
    word_count = db.Column(db.Integer, nullable=True)
    length_flag = db.Column(db.String(20), nullable=True)
    suggested_resources = db.Column(db.JSON, nullable=True)
    improvement_summary = db.Column(db.JSON, nullable=True)

    # Relationships
    user = db.relationship('User', back_populates='analyses')
    resume = db.relationship('Resume', back_populates='analyses')
    job_description = db.relationship('JobDescription', back_populates='analyses')
