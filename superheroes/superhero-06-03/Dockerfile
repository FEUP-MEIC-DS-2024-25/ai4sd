FROM python:3.11

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY . /app

ENV DJANGO_SETTINGS_MODULE=backend.settings

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
