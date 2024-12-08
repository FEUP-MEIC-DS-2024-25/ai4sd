import coloredlogs
import logging
import os

from dotenv import load_dotenv
from utils.utils_misc import get_env_variable

load_dotenv()
coloredlogs.install(level="INFO")
logger = logging.getLogger(__name__)

_KEY_DIR = get_env_variable(
    "KEY_DIR",
    "Key folder not found. Please set the KEY_DIR environment variable."
)

def get_private_key(private_key_filename):
    key_path = _get_key_path(_KEY_DIR, private_key_filename)
    key = _load_private_key(key_path)
    return key

def _get_key_path(key_folder, private_key_filename):
    key_path = os.path.join(key_folder, private_key_filename)
    if not os.path.exists(key_path):
        error_message = f"The file '{key_path}' does not exist."
        logger.error(error_message)
        raise FileNotFoundError(error_message)
    return key_path

def _load_private_key(key_path):
    with open(key_path, "rb") as fh:
        key = fh.read()
    logger.info("Key loaded successfully.")
    return key