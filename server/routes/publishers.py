from flask import jsonify, Response, Blueprint
from models import db, Publisher
from sqlalchemy.orm import Query

# Create a Blueprint for publishers routes
publishers_bp = Blueprint('publishers', __name__)

def get_publishers_base_query() -> Query:
    return db.session.query(Publisher)

@publishers_bp.route('/api/publishers', methods=['GET'])
def get_publishers() -> Response:
    # Use the base query for all publishers
    publishers_query = get_publishers_base_query().all()
    
    # Convert the results using the model's to_dict method
    publishers_list = [publisher.to_dict() for publisher in publishers_query]
    
    return jsonify(publishers_list)

@publishers_bp.route('/api/publishers/<int:id>', methods=['GET'])
def get_publisher(id: int) -> tuple[Response, int] | Response:
    # Use the base query and add filter for specific publisher
    publisher_query = get_publishers_base_query().filter(Publisher.id == id).first()
    
    # Return 404 if publisher not found
    if not publisher_query: 
        return jsonify({"error": "Publisher not found"}), 404
    
    # Convert the result using the model's to_dict method
    publisher = publisher_query.to_dict()
    
    return jsonify(publisher)