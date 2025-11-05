---
description: 'Flask API endpoint and server test generation instructions for Python'
applyTo: 'server/tests/test_*.py'
---

# Python Unit Testing Guidelines

## Test Class Structure

- Blueprints should have their own test files for proper grouping and maintainability
- Use `unittest.TestCase` as base class
- Name pattern: `Test<FeatureName>Routes` or `Test<FeatureName>Models`
- Include type hints for all methods and parameters
- Add docstrings describing what each test validates

## Test Data

- Define `TEST_DATA` as class-level constant dict with all fixtures
- Keep data minimal but cover edge cases and relationships
- Use descriptive names indicating purpose

## Setup and Teardown

- `setUp(self) -> None` must:
  - Create Flask app with `TESTING = True` and `sqlite:///:memory:`
  - Register blueprints and initialize `self.app.test_client()`
  - Create tables and seed data within app context
- `tearDown(self) -> None` must:
  - Call `db.session.remove()`, `db.drop_all()`, `db.engine.dispose()`

## Required Test Coverage

- Success cases with valid data
- Not found cases (404 errors)
- Empty database/collection scenarios
- Invalid inputs and edge cases
- Response structure validation (required fields present)

## Test Method Best Practices

- Follow Arrange-Act-Assert pattern
- Name: `test_<action>_<scenario>` (e.g., `test_get_game_by_id_not_found`)
- Create helper methods for common operations (`_seed_test_data`, `_get_response_data`)
- Assert status code first, then response data
- Use specific assertions: `assertEqual`, `assertIn`, `assertIsInstance`
- Define API paths as class constants: `GAMES_API_PATH = '/api/games'`
- Parse JSON with helper: `json.loads(response.data)`
