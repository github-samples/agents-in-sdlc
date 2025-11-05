---
description: 'Flask API endpoint instructions'
applyTo: 'server/routes/*.py'
---

# Flask Endpoint Development Guidelines

## Blueprint Structure

- Create Blueprint: `bp_name = Blueprint('name', __name__)`
- Use descriptive names matching resource (e.g., `games_bp`)
- Include type hints: `Response`, `tuple[Response, int]`, `Query`
- Import: `from flask import jsonify, Response, Blueprint`

## Data Access Patterns

- Create base query functions: `get_<resource>_base_query() -> Query`
- Use SQLAlchemy with outer joins: `isouter=True` for optional relations
- Return queries from helpers for reusability across endpoints
- Use `.all()` for multiple results, `.first()` for single result

## Route Definitions

- Full path with methods: `@bp.route('/api/resource', methods=['GET'])`
- REST conventions: GET (retrieve), POST (create), PUT/PATCH (update)
- Path params with types: `@bp.route('/api/games/<int:id>')`

## Response Handling

- Use model `to_dict()` for serialization
- Status codes: 200 (OK), 404 (not found), 400 (bad request)
- Error format: `{"error": "Resource not found"}`
- Always use `jsonify()` for JSON responses
- Non-200 responses: `return jsonify(error), 404`

## Query and Validation

- Filter conditions: `.filter(Model.id == id)`
- Check None: `if not result: return jsonify({"error": "..."}), 404`
- Apply ordering when needed

## Required Testing

- All endpoints need unit tests per [python-tests.instructions.md](./python-tests.instructions.md)
- Run: [scripts/run-server-tests.sh](../../scripts/run-server-tests.sh)
- All tests must pass before commit

## Registration & References

- Register in [server/app.py](../../server/app.py): `app.register_blueprint(bp)`
- Example: [server/routes/games.py](../../server/routes/games.py)
- Tests: [server/tests/test_games.py](../../server/tests/test_games.py)
