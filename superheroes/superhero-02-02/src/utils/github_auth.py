from datetime import datetime, timedelta, timezone
import logging
import requests
from jwt import JWT, jwk_from_pem
from jwt.utils import get_int_from_datetime
from dotenv import load_dotenv
from utils.utils_misc import get_env_variable
from utils.private_key import get_private_key
import coloredlogs

load_dotenv()
coloredlogs.install(level="INFO")
logger = logging.getLogger(__name__)


def create_jwt_payload(client_id):
    now = datetime.now(timezone.utc)
    payload = {
        # Issued at time
        "iat": get_int_from_datetime(now),
        # JWT expiration time (10 minutes maximum)
        "exp": get_int_from_datetime(now + timedelta(minutes=10)),
        # GitHub App's client ID
        "iss": client_id,
    }
    logger.info("JWT payload created successfully.")
    return payload

def generate_jwt():
    private_key_filename = get_env_variable(
        "GITHUB_PRIVATE_KEY_FILENAME",
        "Private key filename not found. Please set the GITHUB_PRIVATE_KEY_FILENAME environment variable.",
    )
    client_id = get_env_variable(
        "GITHUB_APP_ID",
        "Client ID not found. Please set the GITHUB_APP_ID environment variable.",
    )

    payload = create_jwt_payload(client_id)
    signing_key = get_private_key(private_key_filename)
    signing_key = jwk_from_pem(signing_key)


    instance = JWT()
    encoded_jwt = instance.encode(payload, signing_key, alg="RS256")
    logger.info("JWT generated successfully.")

    return encoded_jwt


def get_installation_id(jwt_token, username):
    """Get the installation ID for the GitHub App for a specific user."""
    url = f"https://api.github.com/users/{username}/installation"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Accept": "application/vnd.github+json",
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        installation = response.json()
        return installation["id"]
    else:
        raise requests.exceptions.RequestException(
            f"Failed to fetch installation for user {username}: {response.status_code} - {response.text}"
        )


def request_access_token(jwt_token, installation_id, repository):
    """Get an access token for the GitHub App installation."""
    url = f"https://api.github.com/app/installations/{installation_id}/access_tokens"
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
    }

    data = {"repositories": [repository]}

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 201:
        token_data = response.json()
        return token_data["token"]
    else:
        raise requests.exceptions.RequestException(
            f"Failed to fetch access token for installation {installation_id}: {response.status_code} - {response.text}"
        )


def get_installation_access_token(username, repository):
    jwt_token = generate_jwt()
    inst_id = get_installation_id(jwt_token, username)
    token = request_access_token(jwt_token, inst_id, repository)
    return token


if __name__ == "__main__":
    jwt_token = generate_jwt()
    print(f"JWT: {jwt_token}")
