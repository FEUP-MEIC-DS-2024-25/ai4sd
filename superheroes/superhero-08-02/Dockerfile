FROM python:3

WORKDIR /spark

COPY spark/Pipfile spark/Pipfile.lock ./

RUN pip install -U pipenv
RUN pipenv install --system

COPY spark/.env ./
COPY spark/ ./

EXPOSE 8080

CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8080"]