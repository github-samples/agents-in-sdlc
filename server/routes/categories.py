from flask import jsonify, Response, Blueprint
from models import db, Category
from sqlalchemy.orm import Query

# Create a Blueprint for categories routes
categories_bp = Blueprint('categories', __name__)

def get_categories_base_query() -> Query:
    return db.session.query(Category)

@categories_bp.route('/api/categories', methods=['GET'])
def get_categories() -> Response:
    # Use the base query for all categories
    categories_query = get_categories_base_query().all()
    
    # Convert the results using the model's to_dict method
    categories_list = [category.to_dict() for category in categories_query]
    
    return jsonify(categories_list)

@categories_bp.route('/api/categories/<int:id>', methods=['GET'])
def get_category(id: int) -> tuple[Response, int] | Response:
    # Use the base query and add filter for specific category
    category_query = get_categories_base_query().filter(Category.id == id).first()
    
    # Return 404 if category not found
    if not category_query: 
        return jsonify({"error": "Category not found"}), 404
    
    # Convert the result using the model's to_dict method
    category = category_query.to_dict()
    
    return jsonify(category)