import subprocess
import os

print('Starting FeatureCraft')

# Set the environment variable for unbuffered output
env = os.environ.copy()
env["PYTHONUNBUFFERED"] = "1"

# Start the frontend server
frontend_process = subprocess.Popen(
    ['python3', '-u', 'frontend/front_server.py'],
    env=env
)
print('Frontend webserver has been launched')

# Start the backend server
backend_process = subprocess.Popen(
    ['python3','-m','uvicorn', 'backend.back_server:app', '--host', '0.0.0.0', '--port', '8000', '--reload'],
    env=env
)
print('Backend server has been launched')

# Wait for the processes to complete
frontend_process.wait()
backend_process.wait()