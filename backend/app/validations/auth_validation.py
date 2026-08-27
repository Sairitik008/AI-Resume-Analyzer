from marshmallow import Schema, fields, validate

class RegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6))

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)

register_validation_schema = RegisterSchema()
login_validation_schema = LoginSchema()
