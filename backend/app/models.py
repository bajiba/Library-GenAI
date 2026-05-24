import sqlite3
import sys
import os
from datetime import datetime

# Add the parent directory to the path to find database module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.db import get_db_connection

class Book:
    @staticmethod
    def get_all(available_only=False):
        """Get all books or only available books"""
        conn = get_db_connection()
        query = "SELECT * FROM books"
        if available_only:
            query += " WHERE available = 1"
        books = conn.execute(query).fetchall()
        conn.close()
        return [dict(book) for book in books]
    
    @staticmethod
    def get_by_id(book_id):
        """Get a book by ID"""
        conn = get_db_connection()
        book = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
        conn.close()
        if book:
            return dict(book)
        return None
    
    @staticmethod
    def search(query):
        """Search books by title, author, or genre"""
        conn = get_db_connection()
        search_query = f"%{query}%"
        books = conn.execute(
            """
            SELECT * FROM books 
            WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? OR description LIKE ?
            """, 
            (search_query, search_query, search_query, search_query)
        ).fetchall()
        conn.close()
        return [dict(book) for book in books]
    
    @staticmethod
    def add(title, author, isbn, publication_year, genre, description, cover_image):
        """Add a new book to the database"""
        conn = get_db_connection()
        try:
            conn.execute(
                """
                INSERT INTO books (title, author, isbn, publication_year, genre, description, cover_image, available)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
                """,
                (title, author, isbn, publication_year, genre, description, cover_image)
            )
            conn.commit()
            # Get the ID of the newly inserted book
            book_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            conn.close()
            return book_id
        except sqlite3.IntegrityError:
            conn.close()
            return None
    
    @staticmethod
    def update(book_id, title, author, isbn, publication_year, genre, description, cover_image, available):
        """Update book information"""
        conn = get_db_connection()
        try:
            conn.execute(
                """
                UPDATE books
                SET title = ?, author = ?, isbn = ?, publication_year = ?, 
                    genre = ?, description = ?, cover_image = ?, available = ?
                WHERE id = ?
                """,
                (title, author, isbn, publication_year, genre, description, cover_image, available, book_id)
            )
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error:
            conn.close()
            return False
    
    @staticmethod
    def delete(book_id):
        """Delete a book from the database"""
        conn = get_db_connection()
        try:
            conn.execute("DELETE FROM books WHERE id = ?", (book_id,))
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error:
            conn.close()
            return False


class User:
    @staticmethod
    def get_all():
        """Get all users"""
        conn = get_db_connection()
        users = conn.execute("SELECT id, username, email, role FROM users").fetchall()
        conn.close()
        return [dict(user) for user in users]
    
    @staticmethod
    def get_by_id(user_id):
        """Get a user by ID"""
        conn = get_db_connection()
        user = conn.execute(
            "SELECT id, username, email, role FROM users WHERE id = ?", 
            (user_id,)
        ).fetchone()
        conn.close()
        if user:
            return dict(user)
        return None
    
    @staticmethod
    def authenticate(username, password):
        """Authenticate a user"""
        conn = get_db_connection()
        user = conn.execute(
            "SELECT id, username, email, role FROM users WHERE username = ? AND password = ?",
            (username, password)
        ).fetchone()
        conn.close()
        if user:
            return dict(user)
        return None
    
    @staticmethod
    def add(username, password, email, role="student"):
        """Add a new user"""
        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
                (username, password, email, role)
            )
            conn.commit()
            user_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            conn.close()
            return user_id
        except sqlite3.IntegrityError:
            conn.close()
            return None


class Borrow:
    @staticmethod
    def get_all():
        """Get all borrow records"""
        conn = get_db_connection()
        borrows = conn.execute(
            """
            SELECT b.*, u.username, bk.title, bk.author
            FROM borrows b
            JOIN users u ON b.user_id = u.id
            JOIN books bk ON b.book_id = bk.id
            """
        ).fetchall()
        conn.close()
        return [dict(borrow) for borrow in borrows]
    
    @staticmethod
    def get_by_user(user_id):
        """Get borrow records for a specific user"""
        conn = get_db_connection()
        borrows = conn.execute(
            """
            SELECT b.*, bk.title, bk.author
            FROM borrows b
            JOIN books bk ON b.book_id = bk.id
            WHERE b.user_id = ?
            """,
            (user_id,)
        ).fetchall()
        conn.close()
        return [dict(borrow) for borrow in borrows]
    
    @staticmethod
    def borrow_book(user_id, book_id):
        """Borrow a book"""
        conn = get_db_connection()
        try:
            # Check if book is available
            book = conn.execute("SELECT available FROM books WHERE id = ?", (book_id,)).fetchone()
            if not book or not book['available']:
                conn.close()
                return False
            
            # Update book availability
            conn.execute("UPDATE books SET available = 0 WHERE id = ?", (book_id,))
            
            # Create borrow record
            current_date = datetime.now().strftime("%Y-%m-%d")
            conn.execute(
                """
                INSERT INTO borrows (book_id, user_id, borrow_date, status)
                VALUES (?, ?, ?, 'borrowed')
                """,
                (book_id, user_id, current_date)
            )
            
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error:
            conn.close()
            return False
    
    @staticmethod
    def return_book(borrow_id):
        """Return a borrowed book"""
        conn = get_db_connection()
        try:
            # Get the book ID associated with this borrow
            borrow = conn.execute("SELECT book_id FROM borrows WHERE id = ?", (borrow_id,)).fetchone()
            if not borrow:
                conn.close()
                return False
            
            book_id = borrow['book_id']
            
            # Update book availability
            conn.execute("UPDATE books SET available = 1 WHERE id = ?", (book_id,))
            
            # Update borrow record
            current_date = datetime.now().strftime("%Y-%m-%d")
            conn.execute(
                """
                UPDATE borrows
                SET return_date = ?, status = 'returned'
                WHERE id = ?
                """,
                (current_date, borrow_id)
            )
            
            conn.commit()
            conn.close()
            return True
        except sqlite3.Error:
            conn.close()
            return False 