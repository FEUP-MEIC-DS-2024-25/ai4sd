import subprocess

# Nome do segredo e versão
secret_name = "superhero-07-05"
version = "1"

# Comando para acessar o segredo e salvar no ficheiro .env
command = f"gcloud secrets versions access {version} --secret={secret_name}"

# Abrir o ficheiro .env para escrever a saída do comando
with open(".env", "w") as env_file:
    subprocess.run(command, shell=True, stdout=env_file, check=True)

print(".env file created with the secret value.")
