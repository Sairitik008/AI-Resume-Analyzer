from .base import db, BaseModel

class Resume(BaseModel):
    __tablename__ = 'resumes'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    original_filename = db.Column(db.String(255))
    file_path = db.Column(db.String(255))
    extracted_text = db.Column(db.Text)

    # Relationships
    user = db.relationship('User', back_populates='resumes')
    analyses = db.relationship('Analysis', back_populates='resume', cascade='all, delete-orphan')
