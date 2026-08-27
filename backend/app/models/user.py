from .base import db, BaseModel

class User(BaseModel):
    __tablename__ = 'users'

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)

    # Relationships
    resumes = db.relationship('Resume', back_populates='user', cascade='all, delete-orphan')
    job_descriptions = db.relationship('JobDescription', back_populates='user', cascade='all, delete-orphan')
    analyses = db.relationship('Analysis', back_populates='user', cascade='all, delete-orphan')
