from google.cloud import secretmanager
from google.oauth2 import service_account
def access_specific_secret(secret_id):
    credentials = service_account.Credentials.from_service_account_file("app/dst06g02-sevice_account.json")
    
    client = secretmanager.SecretManagerServiceClient()

    secret_path = f"projects/hero-alliance-feup-ds-24-25/secrets/{secret_id}/versions/latest"

    try:
        response = client.access_secret_version(name=secret_path)

        secret = response.payload.data.decode("UTF-8")

        print(f"Successfully accessed secret: {secret_id}, version: latest")
        return secret

    except Exception as e:
        print(f"Error accessing secret: {e}")
        return None
