#Python version
FROM python:3.9-slim

#Wokring directory
WORKDIR /app

#Copy files to working directory
COPY requirements.txt requirements.txt

#Install dependencies
RUN pip3 install -r requirements.txt

#Copy project
COPY . .

#Run the application on port 80
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--reload"]