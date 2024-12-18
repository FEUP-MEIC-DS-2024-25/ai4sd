FROM python:3.11.5-slim

WORKDIR /usr/src/app

# Install dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Python dependencies
RUN pip install --no-cache-dir \
    openai-whisper \
    flask \
    flask-cors \
    google-generativeai \
    python-docx \
    markdown2 \
    beautifulsoup4 \
    google-cloud-secret-manager

COPY . .

EXPOSE 5000

CMD ["python", "backend.py"]