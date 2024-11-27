FROM python:3.12

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# Copy the .env file into the container
COPY .env .env

# install dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

# Run main.py when the container launches
CMD ["python", "backend.py"]