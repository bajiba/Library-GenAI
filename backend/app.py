from app.api import create_app
from database.db import init_db

# Initialize the database
init_db()

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000) 