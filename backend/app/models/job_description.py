from .base import db, BaseModel

class JobDescription(BaseModel):
    __tablename__ = 'job_descriptions'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255))
    description_text = db.Column(db.Text)

    # Relationships
    user = db.relationship('User', back_populates='job_descriptions')
    analyses = db.relationship('Analysis', back_populates='job_description', cascade='all, delete-orphan')
