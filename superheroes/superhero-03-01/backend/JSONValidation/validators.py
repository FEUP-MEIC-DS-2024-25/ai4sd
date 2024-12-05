import json
from jsonschema import validate, ValidationError

def load_schema(schema_path):
    """
    Loads a JSON schema from a file.

    Args:
        schema_path (str): Path to the schema file.

    Returns:
        dict: The loaded JSON schema.
    """
    try:
        with open(schema_path, 'r') as schema_file:
            return json.load(schema_file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Schema file not found: {schema_path}")
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON in schema file: {schema_path}")

def new_chat_validator(data):
    """
    Validates the input JSON for a new chat message.

    Args:
        data (dict): The JSON data to validate.

    Raises:
        ValidationError: If the JSON data is invalid.
    """
    schema_path = "backend/JSONValidation/Chat/new_chat.json"
    schema = load_schema(schema_path)
    validate(instance=data, schema=schema)
