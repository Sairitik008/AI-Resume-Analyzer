from marshmallow import Schema, fields, validate

class JobDescriptionSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=2, max=150))
    description_text = fields.String(required=True, validate=validate.Length(min=20))

job_description_schema = JobDescriptionSchema()
