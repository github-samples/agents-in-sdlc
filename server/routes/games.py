from flask import jsonify, Response, Blueprint, request
from models import db, Game, Publisher, Category
from sqlalchemy.orm import Query
from typing import Optional

# Create a Blueprint for games routes
games_bp = Blueprint('games', __name__)

def get_games_base_query() -> Query:
    return db.session.query(Game).join(
        Publisher, 
        Game.publisher_id == Publisher.id, 
        isouter=True
    ).join(
        Category, 
        Game.category_id == Category.id, 
        isouter=True
    )

@games_bp.route('/api/games', methods=['GET'])
def get_games() -> Response:
    # Get filter parameters from query string
    category_id: Optional[str] = request.args.get('category_id')
    publisher_id: Optional[str] = request.args.get('publisher_id')
    
    # Start with base query
    games_query = get_games_base_query()
    
    # Apply filters if provided
    if category_id:
        try:
            category_id_int = int(category_id)
            games_query = games_query.filter(Game.category_id == category_id_int)
        except ValueError:
            return jsonify({"error": "Invalid category_id parameter"}), 400
    
    if publisher_id:
        try:
            publisher_id_int = int(publisher_id)
            games_query = games_query.filter(Game.publisher_id == publisher_id_int)
        except ValueError:
            return jsonify({"error": "Invalid publisher_id parameter"}), 400
    
    # Execute query
    games_result = games_query.all()
    
    # Convert the results using the model's to_dict method
    games_list = [game.to_dict() for game in games_result]
    
    return jsonify(games_list)

@games_bp.route('/api/games/<int:id>', methods=['GET'])
def get_game(id: int) -> tuple[Response, int] | Response:
    # Use the base query and add filter for specific game
    game_query = get_games_base_query().filter(Game.id == id).first()
    
    # Return 404 if game not found
    if not game_query: 
        return jsonify({"error": "Game not found"}), 404
    
    # Convert the result using the model's to_dict method
    game = game_query.to_dict()
    
    return jsonify(game)
