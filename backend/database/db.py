import sqlite3
import os
import pathlib

# Path to the database file
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'library.db')
SCHEMA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'schema.sql')

def get_db_connection():
    """Create a connection to the SQLite database"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with the schema"""
    # Check if database file exists
    db_exists = os.path.exists(DB_PATH)
    
    # Print debug info
    print(f"Database path: {DB_PATH}")
    print(f"Schema path: {SCHEMA_PATH}")
    print(f"Database exists: {db_exists}")
    
    # Create a connection to the database
    conn = get_db_connection()
    
    # If the database doesn't exist, create tables
    if not db_exists:
        print(f"Initializing database at {DB_PATH}")
        try:
            with open(SCHEMA_PATH, 'r') as f:
                schema = f.read()
            conn.executescript(schema)
            print("Database initialized with schema")
        except Exception as e:
            print(f"Error initializing database: {e}")
    else:
        print("Database already exists, checking if it has content...")
        # Check if books table has data
        cursor = conn.cursor()
        count = cursor.execute("SELECT COUNT(*) FROM books").fetchone()[0]
        print(f"Found {count} books in the database")
    
    conn.close()

if __name__ == "__main__":
    init_db() 