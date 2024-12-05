FROM python:3.10

WORKDIR /backend

COPY . .

RUN pip install -r requirements.txt

ENTRYPOINT ["python", "manage.py"]

ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["runserver", "0.0.0.0:8000"]
