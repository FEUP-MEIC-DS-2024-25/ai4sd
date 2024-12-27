import os
import logging
from dotenv import load_dotenv
import coloredlogs

load_dotenv()
coloredlogs.install(level="INFO")
logger = logging.getLogger(__name__)

def get_env_variable(var_name, error_message = "Environment variable not found."):
    value = os.getenv(var_name)
    if not value:
        logger.error(error_message)
        raise ValueError(error_message)
    return value