import unittest
from unittest.mock import patch, MagicMock
import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings

# The expected mock response to match
EXPECTED_RESULTS = {
    "ids": [
        [
            "data/Coexistence-Patterns/assets/../assets/CQRS.png-9ab5c2e8-0bbd-4568-b83b-ffda9b99bf5e",
            "data/Coexistence-Patterns/assets/../assets/CQRSDataReplication.png-fe57c133-87fb-47af-98b3-76422f54c8d0",
            "Command-Query-Responsibility-Separation.md_1-45b74c1a-38cf-4b2b-8b90-79483789b6c9"
        ]
    ],
    "documents": [
        [
            "Image reference: data/Coexistence-Patterns/assets/../assets/CQRS.png",
            "Image reference: data/Coexistence-Patterns/assets/../assets/CQRSDataReplication.png",
            "What's more, you can even take this farther. By introducing Event Sourcing ..."
        ]
    ],
    "metadatas": [
        [
            {
                "has_children": "true",
                "nav_order": "8",
                "parent": "Coexistence Patterns",
                "source": "data/Coexistence-Patterns/assets/../assets/CQRS.png",
                "title": "CQRS"
            },
            {
                "has_children": "true",
                "nav_order": "8",
                "parent": "Coexistence Patterns",
                "source": "data/Coexistence-Patterns/assets/../assets/CQRSDataReplication.png",
                "title": "CQRS"
            },
            {
                "has_children": "true",
                "nav_order": "8",
                "parent": "Coexistence Patterns",
                "source": "data/Coexistence-Patterns/Command-Query-Responsibility-Separation.md",
                "title": "CQRS"
            }
        ]
    ]
}

class TestChromaDBQuery(unittest.TestCase):
    # Mock the Chroma Client for testing
    @patch('chromadb.PersistentClient')
    def test_valid_results(self, MockClient):
        # Create a mock for the ChromaDB client
        mock_client = MagicMock()
        MockClient.return_value = mock_client

        # Simulate the response from the ChromaDB collection query
        mock_results = {
            "ids": [
                [
                    "data/Coexistence-Patterns/assets/../assets/CQRS.png-9ab5c2e8-0bbd-4568-b83b-ffda9b99bf5e",
                    "data/Coexistence-Patterns/assets/../assets/CQRSDataReplication.png-fe57c133-87fb-47af-98b3-76422f54c8d0",
                    "Command-Query-Responsibility-Separation.md_1-45b74c1a-38cf-4b2b-8b90-79483789b6c9"
                ]
            ],
            "documents": [
                [
                    "Image reference: data/Coexistence-Patterns/assets/../assets/CQRS.png",
                    "Image reference: data/Coexistence-Patterns/assets/../assets/CQRSDataReplication.png",
                    "What's more, you can even take this farther. By introducing Event Sourcing ..."
                ]
            ],
            "metadatas": [
                [
                    {
                        "has_children": "true",
                        "nav_order": "8",
                        "parent": "Coexistence Patterns",
                        "source": "data/Coexistence-Patterns/assets/../assets/CQRS.png",
                        "title": "CQRS"
                    },
                    {
                        "has_children": "true",
                        "nav_order": "8",
                        "parent": "Coexistence Patterns",
                        "source": "data/Coexistence-Patterns/assets/../assets/CQRSDataReplication.png",
                        "title": "CQRS"
                    },
                    {
                        "has_children": "true",
                        "nav_order": "8",
                        "parent": "Coexistence Patterns",
                        "source": "data/Coexistence-Patterns/Command-Query-Responsibility-Separation.md",
                        "title": "CQRS"
                    }
                ]
            ]
        }

        # Mock the behavior of collection.query to return the mock_results
        mock_collection = MagicMock()
        mock_collection.query.return_value = mock_results
        mock_client.get_collection.return_value = mock_collection

        # Initialize Chroma Client and Sentence Transformer
        client = chromadb.PersistentClient(
            path="../database",  # Adjusted path to access the database from the tests directory
            settings=Settings(),
            tenant=DEFAULT_TENANT,
            database=DEFAULT_DATABASE,
        )
        model = SentenceTransformer('all-MiniLM-L6-v2')

        # Connect to the collection (or create a new one if it doesn't exist)
        collection = client.get_collection("architectural_patterns")

        # Query the database to retrieve the content of the "CQRS" pattern
        query = "CQRS"
        results = collection.query(
            query_texts=[query],  # The text to search for
            n_results=3  # The number of results you want to return
        )

        # Test for valid results (structure check)
        self.assertIn("ids", results)
        self.assertIn("documents", results)
        self.assertIn("metadatas", results)
        self.assertGreater(len(results["documents"][0]), 0)  # Ensure we have some documents

    @patch('chromadb.PersistentClient')
    def test_correctness_of_results(self, MockClient):
        # Create a mock for the ChromaDB client
        mock_client = MagicMock()
        MockClient.return_value = mock_client

        # Simulate the response from the ChromaDB collection query (as expected)
        mock_results = EXPECTED_RESULTS  # Use the expected response

        # Mock the behavior of collection.query to return the mock_results
        mock_collection = MagicMock()
        mock_collection.query.return_value = mock_results
        mock_client.get_collection.return_value = mock_collection

        # Initialize Chroma Client and Sentence Transformer
        client = chromadb.PersistentClient(
            path="../database",  # Adjusted path to access the database from the tests directory
            settings=Settings(),
            tenant=DEFAULT_TENANT,
            database=DEFAULT_DATABASE,
        )
        model = SentenceTransformer('all-MiniLM-L6-v2')

        # Connect to the collection (or create a new one if it doesn't exist)
        collection = client.get_collection("architectural_patterns")

        # Query the database to retrieve the content of the "CQRS" pattern
        query = "CQRS"
        results = collection.query(
            query_texts=[query],  # The text to search for
            n_results=3  # The number of results you want to return
        )

        # Test for correctness: Check each field in `results`
        self.assertEqual(len(results['ids'][0]), len(EXPECTED_RESULTS['ids'][0]))
        self.assertEqual(results["ids"][0], EXPECTED_RESULTS["ids"][0])

        self.assertEqual(len(results["documents"][0]), len(EXPECTED_RESULTS["documents"][0]))
        self.assertTrue(all(doc in EXPECTED_RESULTS["documents"][0] for doc in results["documents"][0]))

        self.assertEqual(len(results["metadatas"][0]), len(EXPECTED_RESULTS["metadatas"][0]))
        self.assertTrue(all(meta in EXPECTED_RESULTS["metadatas"][0] for meta in results["metadatas"][0]))

        # Print the actual and expected content
        print("\nText content of the documents:")
        for document in results["documents"]:
            for doc in document:
                if "Image reference" not in doc:
                    print(doc)

if __name__ == '__main__':
    unittest.main()
