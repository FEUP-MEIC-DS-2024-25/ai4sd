FROM python:3.10-slim
ENV VENV_DIR=/venv
ENV PATH="$VENV_DIR/bin:$PATH"
WORKDIR /app
COPY requirements.txt .

RUN python3 -m venv $VENV_DIR && \
    $VENV_DIR/bin/python -m pip install --upgrade pip && \
    $VENV_DIR/bin/pip install -r requirements.txt
COPY . .
EXPOSE 8080

CMD ["python", "src/run.py"]
