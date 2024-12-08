# To start the backend

```bash
node index.js
```

# To put a user (update)
```bash
curl -X PUT http://localhost:3000/users/user10 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Alice Smith",
    "email": "alice.smith@example.com",
    "password": "Al1ceS!2024",
    "historico": ["historico_1", "historico_2"]
  }'

```

# To get all users
```bash
curl http://localhost:3000/users
```

# To get a user
```bash
curl http://localhost:3000/users/user1
```

# To add a user
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "user6",
    "nome": "Frank Moore",
    "email": "frank.moore@example.com",
    "password": "Fr@nkM2024",
    "historico": ["historico_16", "historico_17"]
  }'
```

# To remove a user
```bash
curl -X DELETE http://localhost:3000/users/user6
```

# To get all historico entries
```bash
curl http://localhost:3000/historico
```

# To get a historico entry by ID

```bash
curl http://localhost:3000/historico/historico_1
``` 

# To add a new historico entry
```bash
curl -X POST http://localhost:3000/historico \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "historico_101",
    "codigo": "codigo_101.js",
    "teste": "teste_101.js",
    "contexto": "contexto_101.txt"
  }'
```

# To update an existing historico entry
```bash
curl -X PUT http://localhost:3000/historico/historico_101 \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "codigo_102.js",
    "teste": "teste_102.js",
    "contexto": "contexto_102.txt"
  }'
```

# To delete a historico entry
```bash
curl -X DELETE http://localhost:3000/historico/historico_101
```
