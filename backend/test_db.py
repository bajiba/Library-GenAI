from database.db import init_db, get_db_connection

def test_database():
    """Test database connection and queries"""
    print("Initializing database...")
    init_db()
    
    print("\nTesting database connection...")
    conn = get_db_connection()
    
    print("\nTesting database queries...")
    # Test books table
    try:
        books = conn.execute("SELECT * FROM books LIMIT 5").fetchall()
        print(f"Books table exists with {len(books)} rows")
        if books:
            print("Sample book data:")
            for book in books:
                print(f"  - {book['title']} by {book['author']}")
    except Exception as e:
        print(f"Error querying books table: {e}")
    
    # Test users table
    try:
        users = conn.execute("SELECT * FROM users LIMIT 5").fetchall()
        print(f"Users table exists with {len(users)} rows")
        if users:
            print("Sample user data:")
            for user in users:
                print(f"  - {user['username']} ({user['role']})")
    except Exception as e:
        print(f"Error querying users table: {e}")
    
    conn.close()
    print("\nDatabase test completed")

if __name__ == "__main__":
    test_database() 