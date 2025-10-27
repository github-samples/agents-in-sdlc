import unittest
import json
from typing import Dict, List, Any, Optional
from flask import Flask, Response
from models import Publisher, db
from routes.publishers import publishers_bp

class TestPublishersRoutes(unittest.TestCase):
    # Test data as complete objects
    TEST_DATA: Dict[str, Any] = {
        "publishers": [
            {"name": "DevGames Inc", "description": "Leading developer of programming-themed games"},
            {"name": "Scrum Masters", "description": "Agile methodology gaming specialists"}
        ]
    }
    
    # API paths
    PUBLISHERS_API_PATH: str = '/api/publishers'

    def setUp(self) -> None:
        """Set up test database and seed data"""
        # Create a fresh Flask app for testing
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Register the publishers blueprint
        self.app.register_blueprint(publishers_bp)
        
        # Initialize the test client
        self.client = self.app.test_client()
        
        # Initialize in-memory database for testing
        db.init_app(self.app)
        
        # Create tables and seed data
        with self.app.app_context():
            db.create_all()
            self._seed_test_data()

    def tearDown(self) -> None:
        """Clean up test database and ensure proper connection closure"""
        with self.app.app_context():
            db.session.remove()
            db.drop_all()
            db.engine.dispose()

    def _seed_test_data(self) -> None:
        """Helper method to seed test data"""
        # Create test publishers
        publishers = [
            Publisher(**publisher_data) for publisher_data in self.TEST_DATA["publishers"]
        ]
        db.session.add_all(publishers)
        db.session.commit()

    def _get_response_data(self, response: Response) -> Any:
        """Helper method to parse response data"""
        return json.loads(response.data)

    def test_get_publishers_success(self) -> None:
        """Test successful retrieval of multiple publishers"""
        # Act
        response = self.client.get(self.PUBLISHERS_API_PATH)
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), len(self.TEST_DATA["publishers"]))
        
        # Verify all publishers
        for i, publisher_data in enumerate(data):
            test_publisher = self.TEST_DATA["publishers"][i]
            self.assertEqual(publisher_data['name'], test_publisher["name"])
            self.assertEqual(publisher_data['description'], test_publisher["description"])

    def test_get_publishers_structure(self) -> None:
        """Test the response structure for publishers"""
        # Act
        response = self.client.get(self.PUBLISHERS_API_PATH)
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), len(self.TEST_DATA["publishers"]))
        
        required_fields = ['id', 'name', 'description', 'game_count']
        for field in required_fields:
            self.assertIn(field, data[0])

    def test_get_publisher_by_id_success(self) -> None:
        """Test successful retrieval of a single publisher by ID"""
        # Get the first publisher's ID from the list endpoint
        response = self.client.get(self.PUBLISHERS_API_PATH)
        publishers = self._get_response_data(response)
        publisher_id = publishers[0]['id']
        
        # Act
        response = self.client.get(f'{self.PUBLISHERS_API_PATH}/{publisher_id}')
        data = self._get_response_data(response)
        
        # Assert
        first_publisher = self.TEST_DATA["publishers"][0]
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['name'], first_publisher["name"])
        self.assertEqual(data['description'], first_publisher["description"])
        
    def test_get_publisher_by_id_not_found(self) -> None:
        """Test retrieval of a non-existent publisher by ID"""
        # Act
        response = self.client.get(f'{self.PUBLISHERS_API_PATH}/999')
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['error'], "Publisher not found")

if __name__ == '__main__':
    unittest.main()