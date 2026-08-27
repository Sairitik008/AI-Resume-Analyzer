from marshmallow import Schema, fields

class AnalysisSchema(Schema):
    resume_id = fields.Integer(required=True)
    job_description_id = fields.Integer(required=True)

analysis_schema = AnalysisSchema()
