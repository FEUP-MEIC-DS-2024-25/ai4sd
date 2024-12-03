import os
from markdown import markdown
from bs4 import BeautifulSoup
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from sentence_transformers import SentenceTransformer
import re
import uuid  # For generating unique IDs

# Function to extract metadata from YAML front matter
def extract_metadata(md_content):
    metadata = {}
    yaml_match = re.match(r'---(.*?)---', md_content, re.DOTALL)
    if yaml_match:
        yaml_content = yaml_match.group(1).strip()
        for line in yaml_content.split('\n'):
            key_value = line.split(':')
            if len(key_value) == 2:
                key, value = key_value[0].strip(), key_value[1].strip()
                metadata[key] = value
    return metadata

# Function to extract content and images from markdown file
def extract_markdown_content(md_file):
    with open(md_file, 'r') as f:
        content = f.read()
    # Extract metadata
    metadata = extract_metadata(content)
    # Remove YAML front matter for content extraction
    content_without_metadata = re.sub(r'---(.*?)---', '', content, flags=re.DOTALL)
    # Convert markdown to HTML and extract plain text
    html = markdown(content_without_metadata)
    soup = BeautifulSoup(html, 'html.parser')
    text_content = soup.get_text()

    # Extract image references from markdown
    image_refs = []
    for img in soup.find_all('img'):
        image_refs.append(img['src'])

    return text_content, image_refs, metadata

# Function to chunk text content
def chunk_text(text, chunk_size=500):
    # Break the text into chunks of a specified size
    chunks = []
    words = text.split('\n')
    current_chunk = []
    current_length = 0

    for word in words:
        current_chunk.append(word)
        current_length += len(word.split())
        if current_length > chunk_size:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_length = 0

    if current_chunk:  # Append any remaining text
        chunks.append(' '.join(current_chunk))

    return chunks

## Database Initialization

# Initialize Chroma DB and embeddings model
client = chromadb.PersistentClient(
    path="./database",
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Create a collection in Chroma to store embeddings
collection = client.create_collection("architectural_patterns")

def add_to_vector_db(text_content, file_name, metadata, chunk_id):
    # Generate embeddings for the text content
    embedding = model.encode(text_content)
    # Generate a unique id for this chunk (you can use UUID or other methods)
    document_id = f"{chunk_id}-{str(uuid.uuid4())}"  # e.g., "chunk-1-uuid"
    
    # Store the embeddings in the Chroma collection
    collection.add(
        documents=[text_content],
        metadatas=[{**metadata, "source": file_name}],  # Add metadata to the document
        embeddings=[embedding],
        ids=[document_id]  # Add the unique ID here
    )

## Process all markdown files in the data directory

data_dir = "data/"
for root, dirs, files in os.walk(data_dir):
    # First, find README.md for folder-level metadata
    folder_metadata = {}
    if 'README.md' in files:
        readme_file = os.path.join(root, 'README.md')
        readme_text, _, readme_metadata = extract_markdown_content(readme_file)
        folder_metadata = readme_metadata  # Use the metadata from README as folder-level metadata

    # Process other markdown files in the folder
    for file in files:
        if file.endswith(".md") and file != "README.md":  # Ignore README.md here
            md_file = os.path.join(root, file)
            text_content, image_refs, file_metadata = extract_markdown_content(md_file)
            
            # Merge folder-level metadata with file-level metadata
            combined_metadata = {**folder_metadata, **file_metadata}

            # Chunk the text content for better management
            text_chunks = chunk_text(text_content)

            # Add each chunk and metadata to the vector DB
            for idx, chunk in enumerate(text_chunks):
                add_to_vector_db(chunk, md_file, combined_metadata, f"{file}_{idx}")

            # If there are images referenced, handle them too
            for image_ref in image_refs:
                image_path = os.path.join(root, 'assets', image_ref)
                # Store image metadata or description in the vector DB
                add_to_vector_db(f"Image reference: {image_path}", image_path, combined_metadata, f"{image_path}")
