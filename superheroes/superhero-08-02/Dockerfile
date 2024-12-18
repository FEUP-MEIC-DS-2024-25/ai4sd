FROM python:3

WORKDIR /backend

COPY backend/Pipfile backend/Pipfile.lock ./

RUN pip install -U pipenv
RUN pipenv install --system

RUN --mount=type=secret, id=superhero-08-02-secret \
    echo "SECRET_KEY=$(cat /run/secrets/superhero-08-02-secret)" > ./.env

COPY backend/ ./

EXPOSE 8080

CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8080"]