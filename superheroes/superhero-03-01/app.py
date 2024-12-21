import subprocess
import os

print('Starting FeatureCraft')

# Set the environment variable for unbuffered output
env = os.environ.copy()
env["PYTHONUNBUFFERED"] = "1"

# Start the backend server
backend_process = subprocess.Popen(
    ['python3','-m','uvicorn', 'backend.back_server:app', '--host', '0.0.0.0', '--port', '8080', '--reload'],
    env=env
)
print('Backend server has been launched')

# Wait for the processes to complete
backend_process.wait()