# T02_G01

## Use
Install the requirements
```
pip install -r requirements.txt
```

If you have the database already, just run for testing a prompt using retrieval-augmented generation (RAG) to give contextually rich and accurate responses based on the data stored in your Chroma database.
```
python prompt.py
```
You can change the prompt if you want, the default is `How can development teams exploit the capabilities provided by containers?` that is related to *Container Build Pipeline*.

## Interface
To run the interface you need to have django installed and java on your machine to run `plantuml.jar` compiler, run this command to start the server:
```python
python manage.py runserver
```
and it will be available on `http://127.0.0.1:8000/`. You can try the following paths:
```
    'create/' - create a diagram
    '/<int:project_id>/' - view a project
    '<int:project_id>/edit/' - edit a diagram (it is not working for now).
    '/admin'
```
Since the database is a *sqlite* file for now, I push it that to the repository, so if you want to see a entry for a project (model created to store the diagrams), you can put this id `12` in the url. If you create diagrams, dont push the static folder to the github, becuase it contains the project code associated with each entry.

You can also explore the admin panel, I created a user *admin* with *admin* as the password and `admin@admin.com` as the email.

## tests
You have some tests in the tests folder. The `testdb.py` check if you are getting a result from the database related to *CQRS*.


## Info about the scripts

- script **data.py** uses chromadb database, it receices in directory data expected patterns in markdown from the repository "https://kgb1001001.github.io/cloudadoptionpatterns/":
```
data
├── assets
│   ├── AdapterMicroservices.png
│   ├── AirlineExample.png
│   ├── BusinessMicroservices.png
│   ├── Caches.png
│   ├── ChatbotArchitecture.png
│   ├── ChatbotRelationships.png
│   ├── CLI.png
│   ├── CloudArchitecture.png
│   ├── CloudClientArchitecture.png
│   └── (...)
├── Basic-DevOps
│   ├── Automate-As-You-Go.md
│   ├── Blue-Green-Deployment.md
│   ├── Canary-Deployment.md
│   ├── Correlation-ID.md
│   ├── Feature-Toggle.md
│   ├── Log-Aggregator.md
│   ├── Microservices-DevOps.md
│   ├── Quality-Delivery-Pipeline.md
│   ├── Query-Engine.md
│   ├── README.md
│   └── Red-Black-Deploy.md
├── Cloud-Adoption
│   ├── Cloud-Centric-Design.md
│   ├── Cloud-Refactoring.md
│   ├── Containerize-The-Monolith.md
│   ├── (...)
```
Then the script procedes to construct a vectorial database with this info, it chucks the text for make it easier to travel around data, it creates the embeddings it it associates with each chunk.
```
documents=[text_content],
        metadatas=[{**metadata, "source": file_name}],  # Add metadata to the document
        embeddings=[embedding],
        ids=[document_id]
```
Plus, some info about the theme, in this case present in `README.md` of each folder is associated with a entrie as metadata. Also about the images, the file path is being stored but there is no action for that for now.