import os
from cgitb import reset
from uuid import uuid4
import datetime
import firebase_admin
from dns.e164 import query
from firebase_admin import firestore
import uuid


db_collection = os.getenv("C3T1_DB_COLLECTION")

class FirestoreHelper:
    def __init__(self, collectionName="featurecraft"):
        self.database_name = collectionName
        self.app = firebase_admin.initialize_app()
        self.db = firestore.client(app=self.app)
        self.collection = self.db.collection(self.database_name)
        print(f"Connected to Firestore : {self.app.project_id}")
        self.test()


    def test(self):
        print("Testing Firestore")
        new_message = {
            "id": str(uuid4()),
            "authorName": "EU",
            "body": "response",
            "timestamp": datetime.datetime.now().isoformat(),
            "isDeleted": False
        }
        newMessage= self.createChat(new_message)
        newMessageId= newMessage['id']

        chat = self.getChat(newMessageId)
        #print(chat)
        new_message = {
            "id": str(uuid4()),
            "authorName": "EU",
            "body": "response",
            "timestamp": datetime.datetime.now().isoformat(),
            "isDeleted": False
        }

        addmessage= self.addMessagesToChat(newMessageId, [new_message])

        self.addPinnedToChat(newMessageId, "this is a pinned 1")
        #self.addPinnedToChat(newMessageId, "this is a pinned 2")
        #print(self.addPinnedToChat(newMessageId, "this is a pinned 3"))
        #print(self.addPinnedToChat("newMessageId", "this is a pinned 3"))

    def create(self, document_name,collection_name, data):
        uuid = str(uuid4())
        thisCollection = self.collection.document(document_name).collection(collection_name)
        thisCollection.document(uuid).set(data)

        doc = thisCollection.document(uuid).get()

        if doc.exists:
            return { "id": uuid, **doc.to_dict()}
        else:
            print("Fail to create")
            return None


    def read(self, document_name, collection_name, query_json={}):
        """Find documents in a collection based on a query."""
        query = self.collection.document(document_name).collection(collection_name)


        # Apply filters
        for filter_item in query_json["filters"]:
            query = query.where(
                filter_item["field"], filter_item["operator"], filter_item["value"])

        # Apply orderBy
        if "orderBy" in query_json:
            query = query.order_by(
                query_json["orderBy"]["field"],
                direction=query_json["orderBy"]["direction"].upper())

        # Apply limit
        if "limit" in query_json:
            query = query.limit(query_json["limit"])

        # Execute query
        doc=  query.stream()
        if doc.exists:
            return { "id": uuid, **doc.to_dict()}
        else:
            print("Fail to create")
            return None

    def getChat(self, conversation_id):
        try:
            """Get chat by conversation ID."""
            chat = self.collection.document("chat").collection("history").document(conversation_id).get()
            #return position 0
            return True, { "id": chat.id, **chat.to_dict()}
        except Exception as e:
            print(f"Failed : {e}")
            return False, None

    def addMessagesToChat(self, conversation_id, messages):
        try:
            """Add a group of messages to an existing chat conversation."""
            chat = self.collection.document("chat").collection("history").document(conversation_id)
            result = chat.update(
                {
                    "totalMessages": firestore.Increment(len(messages)),
                    "messages": firestore.ArrayUnion(messages),
                }
            )
            updated_doc = chat.get()

            if updated_doc.exists:
                return {"id": updated_doc.id, **updated_doc.to_dict()}
            else:
                print("Document does not exist.")
                return None
        except Exception as e:
            print(f"Failed: {e}")
            return None

    def addPinnedToChat(self, conversation_id, message):
        """Add a group of messages to an existing chat conversation."""

        pinned = {
            "id": str(uuid4()),
            "message": message
        }

        try:
            # Reference to the specific chat document
            chat = self.collection.document("chat").collection("history").document(conversation_id)
            # Update the document by adding the message to the pinnedMessages array
            chat.update(
                {
                    "pinnedMessages": firestore.ArrayUnion([pinned])
                }
            )

            # Retrieve the updated document
            updated_doc = chat.get()
            print({"id": updated_doc.id, **updated_doc.to_dict()})


            # Return the document data, including the ID
            if updated_doc.exists:
                return {"id": updated_doc.id, **updated_doc.to_dict()}
            else:
                print("Document does not exist.")
                return None
        except Exception as e:
            print(f"Failed: {e}")
            return None


    def createChat(self, new_message):
        try:
            members = ["You", "Gemini"]
            description = "Conversation with Gemini"
            new_conversation = {
                "members": members,
                "description": description,
                "messages": [new_message],
                "pinnedMessages": [],
                "totalMessages": 1
            }
            result = self.create("chat", "history", new_conversation)
            print(f"Created new conversation with ID: {result['id']}")
            return result
        except Exception as e:
            print(f"Failed to create new conversation: {e}")
            return None

# Initialize Firestore helper
db_helper = FirestoreHelper(collectionName=db_collection)
