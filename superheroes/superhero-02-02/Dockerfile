FROM python:3.10-slim

WORKDIR /app

# Set environment variables
ENV KEY_DIR=/app/key
ENV FILES_DIR=/app/files
ENV PROMPT_DIR=/app/prompt_feedback


# Create necessary directories with full path
RUN mkdir -p /app/key \
    /app/files \
    /app/prompt_feedback


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "src/run.py"]