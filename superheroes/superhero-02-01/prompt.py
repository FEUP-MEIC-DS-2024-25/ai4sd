import os
import textwrap
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings

# Load environment variables from .env file for the API key
env_path = Path('.env') / '.keys'
load_dotenv(dotenv_path=env_path)

# Get the API key for Google generative AI (Gemini)
GOOGLE_API_KEY = os.getenv('CLOUD_KEY')

# Initialize Google generative AI model
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Initialize Chroma Client for document retrieval
client = chromadb.PersistentClient(
    path="./database",  # Path to the database
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)

# Load Sentence Transformer model to generate embeddings for query
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')


# Query the database for documents relevant to the prompt
def retrieve_documents_from_db(query_text, num_results=3):
    # Connect to the collection
    collection = client.get_collection("architectural_patterns")

    # Query the collection for relevant documents
    results = collection.query(
        query_texts=[query_text],
        n_results=num_results
    )

    # Extract and return the text of the retrieved documents (excluding image references)
    documents = []
    for document in results["documents"]:
        for doc in document:
            if "Image reference" not in doc:  # Skip image references
                documents.append(doc)
    
    return documents

# Function to generate content using RAG (retrieval-augmented generation)
def generate_with_rag(query_text):
    # Step 1: Retrieve documents from the database based on the query
    print("Retrieving relevant documents from the database...\n")
    retrieved_docs = retrieve_documents_from_db(query_text)
    
    # Step 2: Combine the retrieved documents to provide context for the model
    context = "\n\n".join(retrieved_docs)
    print("Retrieved Documents:\n", context, "\n")
    
    # Step 3: Generate content using the generative model (RAG)
    response = model.generate_content(f"Context: {context}\n\nQuestion: {query_text}")
    
    # Step 4: Display the result
    print("Generated Response:\n")
    print(response.text)
    
    return response.text

# Example prompt
query = "How can development teams exploit the capabilities provided by containers?"

# Generate the response using RAG
result = generate_with_rag(query)

# Print the result (no need for Markdown)
print("\nFinal Output:\n")
print(result)  # Just print the result since it's not a notebook environment
