from flask import Flask, request, jsonify
from flask_cors import CORS
from .models import Book, User, Borrow
from .ai_recommendations import BookRecommendationSystem

# Initialize the Flask application
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": "*"}})  # Enable CORS for all routes with more explicit configuration

# Initialize AI recommendation system
recommendation_system = BookRecommendationSystem()

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Library API"})

# Book routes
@app.route('/api/books', methods=['GET'])
def get_books():
    """Get all books or search for books"""
    query = request.args.get('query')
    available_only = request.args.get('available', 'false').lower() == 'true'
    
    if query:
        books = Book.search(query)
    else:
        books = Book.get_all(available_only)
    
    return jsonify(books)

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    """Get a book by ID"""
    book = Book.get_by_id(book_id)
    if book:
        return jsonify(book)
    return jsonify({"error": "Book not found"}), 404

@app.route('/api/books', methods=['POST'])
def add_book():
    """Add a new book"""
    data = request.json
    
    # Validate required fields
    required_fields = ['title', 'author', 'isbn']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Add the book
    book_id = Book.add(
        data['title'],
        data['author'],
        data['isbn'],
        data.get('publication_year'),
        data.get('genre'),
        data.get('description'),
        data.get('cover_image')
    )
    
    if book_id:
        return jsonify({"id": book_id, "message": "Book added successfully"}), 201
    return jsonify({"error": "Failed to add book. ISBN may already exist."}), 400

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    """Update a book"""
    data = request.json
    
    # Check if book exists
    book = Book.get_by_id(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    # Update the book
    success = Book.update(
        book_id,
        data.get('title', book['title']),
        data.get('author', book['author']),
        data.get('isbn', book['isbn']),
        data.get('publication_year', book['publication_year']),
        data.get('genre', book['genre']),
        data.get('description', book['description']),
        data.get('cover_image', book['cover_image']),
        data.get('available', book['available'])
    )
    
    if success:
        return jsonify({"message": "Book updated successfully"})
    return jsonify({"error": "Failed to update book"}), 400

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    """Delete a book"""
    # Check if book exists
    book = Book.get_by_id(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    
    # Delete the book
    success = Book.delete(book_id)
    if success:
        return jsonify({"message": "Book deleted successfully"})
    return jsonify({"error": "Failed to delete book"}), 400

# User routes
@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate a user"""
    data = request.json
    
    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400
    
    user = User.authenticate(data['username'], data['password'])
    if user:
        return jsonify({"user": user, "message": "Login successful"})
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users (admin only)"""
    # In a real app, this should check admin authorization
    users = User.get_all()
    return jsonify(users)

@app.route('/api/users', methods=['POST'])
def add_user():
    """Register a new user"""
    data = request.json
    
    # Validate required fields
    required_fields = ['username', 'password', 'email']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Add the user
    user_id = User.add(
        data['username'],
        data['password'],
        data['email'],
        data.get('role', 'student')
    )
    
    if user_id:
        return jsonify({"id": user_id, "message": "User registered successfully"}), 201
    return jsonify({"error": "Failed to register user. Username or email may already exist."}), 400

# Borrow routes
@app.route('/api/borrows', methods=['GET'])
def get_borrows():
    """Get all borrow records or for a specific user"""
    user_id = request.args.get('user_id')
    
    if user_id:
        borrows = Borrow.get_by_user(int(user_id))
    else:
        # In a real app, this should check admin authorization
        borrows = Borrow.get_all()
    
    return jsonify(borrows)

@app.route('/api/borrow', methods=['POST'])
def borrow_book():
    """Borrow a book"""
    data = request.json
    
    if 'user_id' not in data or 'book_id' not in data:
        return jsonify({"error": "User ID and Book ID are required"}), 400
    
    success = Borrow.borrow_book(data['user_id'], data['book_id'])
    if success:
        return jsonify({"message": "Book borrowed successfully"})
    return jsonify({"error": "Failed to borrow book. It may not be available."}), 400

@app.route('/api/return/<int:borrow_id>', methods=['POST'])
def return_book(borrow_id):
    """Return a borrowed book"""
    success = Borrow.return_book(borrow_id)
    if success:
        return jsonify({"message": "Book returned successfully"})
    return jsonify({"error": "Failed to return book"}), 400

# AI Recommendation routes
@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get AI-powered book recommendations"""
    data = request.json
    
    if 'preferences' not in data:
        return jsonify({"error": "User preferences are required"}), 400
    
    # Get available books for recommendations
    available_books = Book.get_all(available_only=True)
    
    # Get user's reading history if user_id is provided
    user_history = None
    if 'user_id' in data:
        # For simplicity, we're just getting borrowed books as history
        borrows = Borrow.get_by_user(data['user_id'])
        if borrows:
            user_history = ", ".join([f"{borrow['title']} by {borrow['author']}" for borrow in borrows])
    
    # Get recommendations
    recommendations = recommendation_system.get_recommendations(
        data['preferences'],
        available_books,
        user_history
    )
    
    return jsonify({"recommendations": recommendations})

@app.route('/api/book-details', methods=['POST'])
def get_book_details():
    """Get AI-powered detailed information about a book"""
    data = request.json
    
    if 'title' not in data or 'author' not in data:
        return jsonify({"error": "Book title and author are required"}), 400
    
    details = recommendation_system.get_book_details(data['title'], data['author'])
    
    return jsonify({"details": details})

def create_app():
    return app

if __name__ == '__main__':
    app.run(debug=True) 