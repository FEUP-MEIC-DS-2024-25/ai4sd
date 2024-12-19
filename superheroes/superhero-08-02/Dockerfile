FROM python:3.12-slim

WORKDIR /backend

COPY backend/Pipfile backend/Pipfile.lock ./

RUN pip install -U pipenv
RUN pipenv install --system

#RUN --mount=type=secret,id=superhero-08-02-secret \
#    cat /run/secrets/secret > .env

COPY backend/ ./

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]