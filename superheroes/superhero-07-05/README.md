# T07_G05
Our work is an AI assistant for mutation tests selection. The user give us the code and the test code, and we generate mutation tests from the original tests. If the user provides us some context about what is supposed to do the program, we will select, by an IA, the tests that match the context.

---

### Python directory
Inside this directory, you have the file *script.sh* that is the only thing that you need to run to do mutations tests in *python*.

Because we use *mutmut* to generate mutations tests,so it's necessary to have the *mutmut* installed before running the *script.sh*. If you don't have it installed yet, run this command.
```bash
pip install mutmut
```

This *script.sh* file starts for running the command:
```bash
mut.py --target my_code --unit-test test_my_code --show-mutants > mutation_report.txt
``` 
That command writes a report about the mutation test realized by *mutmut* based in the code (*my_code*) and in the tests code (*test_my_code*) and keep the results in the *mutation_report.txt*. 

Since we have the possible mutation in the report, we need to extract them and, with them, make all the possible combinations of mutation tests that are possible for the given inputs. This is up to the command:
``` bash
python3 filtra_linhas.py mutation_report.txt mutation_report_filtered.txt
``` 

In the final, it only removes the auxiliary file by using the following command:
``` bash
rm mutation_report.txt -rf
``` 

---

### JavaScript directory

We're using *Jest* to write unit tests so you need to install it by running:
```bash
npm init -y
npm i --save-dev jest
```

You also have to add the testing package to the ```packages.json``` file:
```bash
"test": "jest"
```
Or to generate an HTML file:
```bash
"test": "jest --coverage"
```

Then to run unit tests you can use:
```bash
npm test
```

Because we use *Stryker* to generate mutations tests, it's necessary to have the *Stryker* plugin installed before running the code. If you don't have it installed yet, run this commands:
```bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner
npx stryker init
```

Then, we need to add configurations to use *Stryker*. In the ```stryker.config.json``` file add ```"json"``` to the reporters list.
~~~
"reporters": [
    "html",
    "clear-text",
    "progress",
    "json"
]
~~~
This specifies the file types in which you want to see the results.

In the same file add ```"mutate"``` field, according to the directory structure:
~~~
"mutate": [
    "*.js",
    "!*.test.js"
]
~~~
This indicates the name structure of the code and respective tests files, so that *Stryker* knows how to get to them.

Lastly, you can run *Stryker* by running:
```bash
npx stryker run
```

Since we have the possible mutations in the report, we need to extract them. This is up to the command:
```bash
node generate_mutants.js
```

---

### Java directory

Inside this directory, you have the file *getTests.py*, *Main.Java* and *MainTest.java*.
To get mutation tests you need to run the python script with the file you want to get the tests from as you can see below:

```bash
python getTests.py Main.java
```

The command writes all the mutation tests and saves the results in the *mutations.txt*. 

---

### Gemini directory
Inside this directory, you have the files that we used to make the selection of the mutation tests. To do that, we used *Gemini*.

To run the program that select the tests, first you need to have installed the *SDK* for the *API Gemini*. If you don't have it installed, run the next command:
```bash
pip install -q -U google-generativeai
```

After that, you need to insert the context about your program in the *context.txt* file and the mutation tests in the *tests.txt* file, that are inside the *files* directory.

Now, you only need to run the *select_tests.py* file and a query will be sent to the Gemini to select the most important tests based on the context provided.

---

### Join the back-end
To run the back-end all together, you only need to put the code file, the test file and the context file into DS directory.
Then, you only need to run the follow command:
```sh
python3 juncao.py <languague> <code-file> <test-code-file> <context>
```

The context file is optional, so, if you don't provide it, we will return all the possible mutation tests result. One important thing is that the **context file must be named as context.txt**. The **result is saved in the mutations.txt** file.

Below you have some examples how to run this code.

- For python:
```sh
python3 juncao.py python ./python/my_code.py ./python/test_my_code.py
```

- For Java:
```sh
python3 juncao.py java ./java/Main.java ./java/MainTest.java
```

- For JavaScript:
```sh
python3 juncao.py javascript sum.js asdsad.js
```

- For python with context:
```sh
python3 juncao.py python ./python/my_code.py ./python/test_my_code.py context.txt
```

### Database
We used mongoDB to keep data related to the users interactions. The database is composed by two collection, one that is the user (all the users) and other the historico (all the historicos). Each user have an id, nome, email, password and a list of historicos. Each historico is composed by an id, codigo that is the path for the code file, teste that is a path for the teste code and contexto that is the path for the context of the code.

Users:
~~~
[
    {
      "_id": "historico_1",
      "codigo": "codigo_1.js",
      "teste": "teste_1.js",
      "contexto": "contexto_1.txt"
    },
    {
      "_id": "historico_2",
      "codigo": "codigo_2.js",
      "teste": "teste_2.js",
      "contexto": "contexto_2.txt"
    },
    ...
]
~~~

Historicos:
~~~
[
    {
      "_id": "historico_1",
      "codigo": "codigo_1.js",
      "teste": "teste_1.js",
      "contexto": "contexto_1.txt"
    },
    {
      "_id": "historico_2",
      "codigo": "codigo_2.js",
      "teste": "teste_2.js",
      "contexto": "contexto_2.txt"
    },
    ...
]
~~~

To run the database, you need to run the following blocks, separately, in the DS directory:

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

### Back end for database
We made an API which you can make get, update, delete and update each historico and get all users and historicos.

To run it, you need to run the following command in DS directory:
```bash
node index.js
```

Here, you can check some examples how to make requests:

To put a user (update)
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

To get all users:
```bash
curl http://localhost:3000/users
```

To get a user:
```bash
curl http://localhost:3000/users/user1
```

To add a user:
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

To remove a user:
```bash
curl -X DELETE http://localhost:3000/users/user6
```

To get all historico entries:
```bash
curl http://localhost:3000/historico
```

To get a historico entry by ID:

```bash
curl http://localhost:3000/historico/historico_1
``` 

To add a new historico entry:
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

To update an existing historico entry:
```bash
curl -X PUT http://localhost:3000/historico/historico_101 \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "codigo_102.js",
    "teste": "teste_102.js",
    "contexto": "contexto_102.txt"
  }'
```

To delete a historico entry:
```bash
curl -X DELETE http://localhost:3000/historico/historico_101
```

### Mockups in Figma
We used the Figma for doing our mockups. The results are in the next video:

The prototype is available in the link by clicking in
[here](https://www.figma.com/design/ewbsuGg3wS850OQ8ojRx6m/Demo-DS?node-id=0-1&node-type=canvas&t=uvDv5qWIqdJ7Jwzd-0).

### Front-end + Back-end
After join with team 7.2 and 7.3, we needed to change the design of our interface. See an example of how to use the interface here: [demo](https://github.com/FEUP-MEIC-DS-2024-25/T07_G05/blob/main/multimidia/full.webm)


To run, you need to follow these steps:
In the frontend directory, open 2 terminals to execute these commands:
```bash
node server.js
```
```bash
npm run dev
```
