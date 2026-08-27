def validate_schema(data, schema):
    """
    Takes incoming dict data and a Marshmallow schema.
    Returns (is_valid: bool, errors: dict)
    """
    errors = schema.validate(data)
    if errors:
        return False, errors
    return True, None
