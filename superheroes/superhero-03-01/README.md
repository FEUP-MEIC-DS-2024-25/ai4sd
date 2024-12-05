# T03_G01

## API documentation
The API developed can be consulted on [SwaggerHub](https://app.swaggerhub.com/apis-docs/RICARDOPERALTA0000_1/1MEIC03_T1/1.0.0).

## Run the project

### Docker

Use the following command to always build the docker image when using the docker-compose file.:

```bash
docker-compose up --build
```

### OR

Use the following command to build the docker image once when using the docker-compose file.:

```bash
docker-compose up
```

firebase.json file is required to run the project and must be placed in the root directory.



Add firebase credentials to the environment variables
    
```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/firebase.json"
```

or 

```bash
export GOOGLE_APPLICATION_CREDENTIALS="full/path/firebase.json"
```


