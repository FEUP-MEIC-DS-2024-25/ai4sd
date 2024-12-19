FROM python:3.11-slim

ARG GCLOUD_SECRET

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

RUN echo "${GCLOUD_SECRET}" > /app/.env

EXPOSE 8080

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
