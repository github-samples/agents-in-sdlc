#!/bin/bash

# Setup environment: Python virtualenv and dependencies

# Determine project root
if [[ $(basename $(pwd)) == "scripts" ]]; then
    PROJECT_ROOT=$(pwd)/..
else
    PROJECT_ROOT=$(pwd)
fi

cd "$PROJECT_ROOT" || exit 1

# Create and activate virtual environment
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    py -m venv venv
    source venv/Scripts/activate || . venv/Scripts/activate
else
    python3 -m venv venv
    source venv/bin/activate || . venv/bin/activate
fi

echo "Installing Python dependencies..."
pip install -r server/requirements.txt

echo "Installing client dependencies..."
cd client || exit 1
npm install
npx playwright install

# Return to project root
cd "$PROJECT_ROOT"
