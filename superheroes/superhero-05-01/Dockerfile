FROM ubuntu:latest

SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y python3 python3-pip python3-venv curl

ENV VIRTUAL_ENV=/opt/venv

RUN python3 -m venv $VIRTUAL_ENV

ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# python3-ollama -y 

# python3-venv -y

# RUN python3 -m venv ./venv

RUN curl -fsSL https://ollama.com/install.sh | bash

RUN python3 -m pip install ollama

RUN python3 -m pip install --upgrade google-cloud-aiplatform

RUN python3 -m pip install "fastapi[standard]"

# source ./venv/bin/activate && 

RUN ollama serve & sleep 5 && ollama pull llama3.1

COPY script.py .

COPY api.py .

## COPY wardenai-bbe86d6d2916.json .

CMD ["bash", "-c", "ollama serve & sleep 5 && fastapi run api.py"]
