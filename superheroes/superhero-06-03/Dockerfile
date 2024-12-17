FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

ENV DJANGO_SETTINGS_MODULE=backend.settings

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]