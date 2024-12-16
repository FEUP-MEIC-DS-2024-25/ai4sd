# Populate the data base
We have to run the following code blocks, 1 at a time, to run the database. This must run in DS directory.

```bash
docker stop mongo
docker rm mongo
docker run -d --name mongo -p 27017:27017 mongo
```

```bash
docker cp bd/client.json mongo:/tmp
docker cp bd/historico.json mongo:/tmp
docker exec -it mongo bash
```

```bash
mongoimport -d twisterAI -c users --file /tmp/client.json --jsonArray
mongoimport -d twisterAI -c historicos --file /tmp/historico.json --jsonArray

mongosh
```

```bash
use twisterAI
```