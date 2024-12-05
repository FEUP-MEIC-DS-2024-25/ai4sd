from pymongo import MongoClient
from pymongo.errors import ConnectionFailure


import os
from dotenv import load_dotenv
from bson import ObjectId


# Load environment variables
load_dotenv()

# Read database configuration from environment
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_URI = f"mongodb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}"

class MongoDBHelper:
    def __init__(self, uri="mongodb://localhost:27017", database_name="featurecraft"):
        self.uri = uri
        self.database_name = database_name
        self.client = None
        self.db = None
        self.connect()

    def connect(self):
        try:
            # Connect to MongoDB
            self.client = MongoClient(self.uri)
            # Check if the database already exists
            if self.database_name in self.client.list_database_names():
                print(f"Database '{self.database_name}' already exists.")
            else:
                # Create the database by accessing it and adding an empty collection
                self.db = self.client[self.database_name]
                self.db.create_collection("initial_collection")
                print(f"Database '{self.database_name}' created.")
            # Set the database reference
            self.db = self.client[self.database_name]
            print("Connected to MongoDB")
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")

    def create(self, collection_name, data):
        """Insert a document into a collection."""
        collection = self.db[collection_name]
        result = collection.insert_one(data)
        print(f"Inserted document with ID: {result.inserted_id}")
        return result.inserted_id

    def read(self, collection_name, query={}):
        """Find documents in a collection based on a query."""
        collection = self.db[collection_name]
        documents = collection.find(query)
        return list(documents)

    def update(self, collection_name, query, new_values):
        """Update documents that match a query."""
        collection = self.db[collection_name]
        result = collection.update_many(query, {"$set": new_values})
        print(f"Modified {result.modified_count} documents")
        return result.modified_count

    def delete(self, collection_name, query):
        """Delete documents that match a query."""
        collection = self.db[collection_name]
        result = collection.delete_many(query)
        print(f"Deleted {result.deleted_count} documents")
        return result.deleted_count

    def close(self):
        """Close the MongoDB connection."""
        if self.client:
            self.client.close()
            print("MongoDB connection closed")

    #def getChat(self, conversation_id):
    #    """Get chat by conversation ID."""
    #    chat = self.read("chat_history", {"_id": ObjectId(conversation_id)})
    #    if chat:
    #        return True, chat
    #    else:
    #        return False, None
    #
    #def addMessagesToChat(self, conversation_id, messages):
    #    """Add a group of messages to an existing chat conversation."""
    #    collection = self.db["chat_history"]
    #    result = collection.update_one(
    #        {"_id": ObjectId(conversation_id)},
    #        {
    #            "$push": {"messages": {"$each": messages}},
    #            "$inc": {"totalMessages": len(messages)}
    #        }
    #    )
    #    return result.modified_count > 0

    #def createChat(self, new_message):
    #    """Create a new chat conversation."""
    #    try:
    #        members = ["You", "Gemini"]
    #        description = "Conversation with Gemini"
    #        new_conversation = {
    #            "members": members,
    #            "description": description,
    #            "messages": [new_message],
    #            "pinnedMessages": [],
    #            "totalMessages": 1
    #        }
    #        collection = self.db["chat_history"]
    #        result = collection.insert_one(new_conversation)
    #        print(f"Created new conversation with ID: {result.inserted_id}")
    #        return result.inserted_id
    #    except Exception as e:
    #        print(f"Failed to create new conversation: {e}")
    #        return None
        
    #def read(self, collection_name, filters=None, sort_field=None, sort_order=1, page=1, page_size=10):
    #    """
    #    Find documents in a collection based on dynamic filters with pagination and sorting.
    #    
    #    :param collection_name: The name of the collection to query.
    #    :param filters: A dictionary of filters to construct the query (default is None for no filters).
    #    :param sort_field: The field to sort by (default is None, which means no sorting).
    #    :param sort_order: The order to sort by (1 for ascending, -1 for descending; default is 1).
    #    :param page: The page number for pagination (default is 1).
    #    :param page_size: The number of documents per page (default is 10).
    #    :return: A list of documents.
    #    """
    #    collection = self.db[collection_name]
#
    #    # Construct the query from filters
    #    query = filters if filters else {}
#
    #    # Calculate the number of documents to skip
    #    skip_count = (page - 1) * page_size
#
    #    # Build the cursor
    #    cursor = collection.find(query)
    #    if sort_field:
    #        cursor = cursor.sort(sort_field, sort_order)
    #    cursor = cursor.skip(skip_count).limit(page_size)
#
    #    return list(cursor)

# Initialize MongoDB helper
db_helper = MongoDBHelper(uri=DB_URI, database_name=DB_NAME)
