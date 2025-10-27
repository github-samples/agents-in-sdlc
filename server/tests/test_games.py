import unittest
import json
from typing import Dict, List, Any, Optional
from flask import Flask, Response
from models import Game, Publisher, Category, db
from routes.games import games_bp

class TestGamesRoutes(unittest.TestCase):
    # Test data as complete objects
    TEST_DATA: Dict[str, Any] = {
        "publishers": [
            {"name": "DevGames Inc"},
            {"name": "Scrum Masters"}
        ],
        "categories": [
            {"name": "Strategy"},
            {"name": "Card Game"}
        ],
        "games": [
            {
                "title": "Pipeline Panic",
                "description": "Build your DevOps pipeline before chaos ensues",
                "publisher_index": 0,
                "category_index": 0,
                "star_rating": 4.5
            },
            {
                "title": "Agile Adventures",
                "description": "Navigate your team through sprints and releases",
                "publisher_index": 1,
                "category_index": 1,
                "star_rating": 4.2
            }
        ]
    }
    
    # API paths
    GAMES_API_PATH: str = '/api/games'

    def setUp(self) -> None:
        """Set up test database and seed data"""
        # Create a fresh Flask app for testing
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Register the games blueprint
        self.app.register_blueprint(games_bp)
        
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
        
        # Create test categories
        categories = [
            Category(**category_data) for category_data in self.TEST_DATA["categories"]
        ]
        db.session.add_all(categories)
        
        # Commit to get IDs
        db.session.commit()
        
        # Create test games
        games = []
        for game_data in self.TEST_DATA["games"]:
            game_dict = game_data.copy()
            publisher_index = game_dict.pop("publisher_index")
            category_index = game_dict.pop("category_index")
            
            games.append(Game(
                **game_dict,
                publisher=publishers[publisher_index],
                category=categories[category_index]
            ))
            
        db.session.add_all(games)
        db.session.commit()

    def _get_response_data(self, response: Response) -> Any:
        """Helper method to parse response data"""
        return json.loads(response.data)

    def test_get_games_success(self) -> None:
        """Test successful retrieval of multiple games"""
        # Act
        response = self.client.get(self.GAMES_API_PATH)
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), len(self.TEST_DATA["games"]))
        
        # Verify all games using loop instead of manual testing
        for i, game_data in enumerate(data):
            test_game = self.TEST_DATA["games"][i]
            test_publisher = self.TEST_DATA["publishers"][test_game["publisher_index"]]
            test_category = self.TEST_DATA["categories"][test_game["category_index"]]
            
            self.assertEqual(game_data['title'], test_game["title"])
            self.assertEqual(game_data['publisher']['name'], test_publisher["name"])
            self.assertEqual(game_data['category']['name'], test_category["name"])
            self.assertEqual(game_data['starRating'], test_game["star_rating"])

    def test_get_games_structure(self) -> None:
        """Test the response structure for games"""
        # Act
        response = self.client.get(self.GAMES_API_PATH)
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), len(self.TEST_DATA["games"]))
        
        required_fields = ['id', 'title', 'description', 'publisher', 'category', 'starRating']
        for field in required_fields:
            self.assertIn(field, data[0])

    def test_get_game_by_id_success(self) -> None:
        """Test successful retrieval of a single game by ID"""
        # Get the first game's ID from the list endpoint
        response = self.client.get(self.GAMES_API_PATH)
        games = self._get_response_data(response)
        game_id = games[0]['id']
        
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}/{game_id}')
        data = self._get_response_data(response)
        
        # Assert
        first_game = self.TEST_DATA["games"][0]
        first_publisher = self.TEST_DATA["publishers"][first_game["publisher_index"]]
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['title'], first_game["title"])
        self.assertEqual(data['publisher']['name'], first_publisher["name"])
        
    def test_get_game_by_id_not_found(self) -> None:
        """Test retrieval of a non-existent game by ID"""
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}/999')
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['error'], "Game not found")

    def test_get_games_filter_by_category(self) -> None:
        """Test filtering games by category"""
        # Get all games first to find a category ID
        response = self.client.get(self.GAMES_API_PATH)
        all_games = self._get_response_data(response)
        
        # Use the first game's category ID for filtering
        category_id = all_games[0]['category']['id']
        
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?category_id={category_id}')
        filtered_games = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(filtered_games), 0)
        
        # Verify all returned games have the same category
        for game in filtered_games:
            self.assertEqual(game['category']['id'], category_id)

    def test_get_games_filter_by_publisher(self) -> None:
        """Test filtering games by publisher"""
        # Get all games first to find a publisher ID
        response = self.client.get(self.GAMES_API_PATH)
        all_games = self._get_response_data(response)
        
        # Use the first game's publisher ID for filtering
        publisher_id = all_games[0]['publisher']['id']
        
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?publisher_id={publisher_id}')
        filtered_games = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(filtered_games), 0)
        
        # Verify all returned games have the same publisher
        for game in filtered_games:
            self.assertEqual(game['publisher']['id'], publisher_id)

    def test_get_games_filter_by_both_category_and_publisher(self) -> None:
        """Test filtering games by both category and publisher"""
        # Get all games first to find IDs
        response = self.client.get(self.GAMES_API_PATH)
        all_games = self._get_response_data(response)
        
        # Use the first game's category and publisher IDs for filtering
        category_id = all_games[0]['category']['id']
        publisher_id = all_games[0]['publisher']['id']
        
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?category_id={category_id}&publisher_id={publisher_id}')
        filtered_games = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(filtered_games), 0)
        
        # Verify all returned games have both the category and publisher
        for game in filtered_games:
            self.assertEqual(game['category']['id'], category_id)
            self.assertEqual(game['publisher']['id'], publisher_id)

    def test_get_games_filter_invalid_category_id(self) -> None:
        """Test filtering with invalid category ID"""
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?category_id=invalid')
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], "Invalid category_id parameter")

    def test_get_games_filter_invalid_publisher_id(self) -> None:
        """Test filtering with invalid publisher ID"""
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?publisher_id=invalid')
        data = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['error'], "Invalid publisher_id parameter")

    def test_get_games_filter_nonexistent_category(self) -> None:
        """Test filtering with non-existent category ID"""
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?category_id=999')
        filtered_games = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(filtered_games), 0)

    def test_get_games_filter_nonexistent_publisher(self) -> None:
        """Test filtering with non-existent publisher ID"""
        # Act
        response = self.client.get(f'{self.GAMES_API_PATH}?publisher_id=999')
        filtered_games = self._get_response_data(response)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(filtered_games), 0)

if __name__ == '__main__':
    unittest.main()