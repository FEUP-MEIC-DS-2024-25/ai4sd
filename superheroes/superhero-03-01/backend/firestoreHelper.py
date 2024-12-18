import os
from uuid import uuid4
import datetime
import firebase_admin
from dns.e164 import query
from firebase_admin import firestore
import uuid


db_collection = "superhero-03-01"

class FirestoreHelper:
    def __init__(self, collectionName="superhero-03-01"):
        self.database_name = collectionName
        self.app = firebase_admin.initialize_app()
        self.db = firestore.client(app=self.app)
        self.collection = self.db.collection(self.database_name)
        print(f"Connected to Firestore : {self.app.project_id}")
        #self.test()


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


    def getLatestConversations(self, limit):
        """Find documents in a collection based on a query."""
        query =( self.collection.document("chat").collection("history"))
        query = query.order_by("lastChanged", direction=firestore.Query.DESCENDING).limit(limit)



        # Execute query
        docs = list(query.stream())


        if docs:
            result = [
                {
                    "id": doc.id,
                    "description": doc.to_dict().get("description"),
                    "lastChanged": doc.to_dict().get("lastChanged")
                }
                for doc in docs
            ]
            return result
        else:
            print("Fail to get")
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
                    "lastChanged": datetime.datetime.now().isoformat(),
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
                    "lastChanged": datetime.datetime.now().isoformat(),
                    "pinnedMessages": firestore.ArrayUnion([pinned])
                }
            )

            # Retrieve the updated document
            updated_doc = chat.get()

            # Return the document data, including the ID
            if updated_doc.exists:
                return {"id": updated_doc.id, **updated_doc.to_dict()}
            else:
                print("Document does not exist.")
                return None
        except Exception as e:
            print(f"Failed: {e}")
            return None

    def getPinnedMessages(self, conversation_id):
        """Retrieve all pinned messages for a given conversation ID from Firestore."""
        if not conversation_id:
            return False, {"status": "error", "message": "Invalid conversation ID"}


        try:
            chat = self.collection.document("chat").collection("history").document(conversation_id)
            docs = chat.get()
            #print(docs,"HERE")

            if not docs.exists:
                return False, {"status": "error", "message": "The provided ID does not exist"}


            result={
                    "id": docs.id,
                    "pinnedMessage": docs.to_dict().get("pinnedMessages"),
                }
            return True, result
        
        except Exception as e:
            return {"status": "error", "message": f"Failed to retrieve pinned messages: {e}"}

    def createChat(self, new_message):
        try:
            members = ["You", "Gemini"]
            description = new_message['body']
            new_conversation = {
                "members": members,
                "description": description,
                "messages": [new_message],
                "pinnedMessages": [],
                "lastChanged": datetime.datetime.now().isoformat(),
                "totalMessages": 1
            }
            result = self.create("chat", "history", new_conversation)
            print(f"Created new conversation with ID: {result['id']}")
            return result
        except Exception as e:
            print(f"Failed to create new conversation: {e}")
            return None

    def deletePinnedMessage(self, chat_id, pinned_message_id):
        try:
            chat_ref = self.collection.document("chat").collection("history").document(chat_id)
            chat = chat_ref.get()

            if not chat.exists:
                return False

            chat_dict = chat.to_dict()
            pinned_messages = chat_dict.get("pinnedMessages", [])
            updated_pinned_messages = [msg for msg in pinned_messages if msg["id"] != pinned_message_id]

            if len(pinned_messages) == len(updated_pinned_messages):
                # No pinned message was removed
                return False

            chat_ref.update({"pinnedMessages": updated_pinned_messages})
            return True
        except Exception as e:
            print(f"Failed to delete pinned message: {e}")
            return False

# Initialize Firestore helper
db_helper = FirestoreHelper(collectionName=db_collection)
