CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    publication_year INTEGER,
    genre TEXT,
    description TEXT,
    cover_image TEXT,
    available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('admin', 'librarian', 'student')) NOT NULL DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS borrows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    borrow_date TEXT NOT NULL,
    return_date TEXT,
    status TEXT CHECK(status IN ('borrowed', 'returned', 'overdue')) NOT NULL DEFAULT 'borrowed',
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Insert some sample data for testing
INSERT INTO books (title, author, isbn, publication_year, genre, description, cover_image, available)
VALUES 
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, 'Fiction', 'A novel about racism and injustice in the American South', 'mockingbird.jpg', 1),
('1984', 'George Orwell', '9780451524935', 1949, 'Dystopian', 'A dystopian novel about totalitarianism and mass surveillance', '1984.jpg', 1),
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 'Fiction', 'A novel about the American Dream and decadence in the Jazz Age', 'gatsby.jpg', 1),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 1813, 'Romance', 'A romantic novel about societal expectations and personal growth', 'pride.jpg', 1),
('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 1937, 'Fantasy', 'A fantasy novel about a hobbit on an adventure', 'hobbit.jpg', 1),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', '9780590353427', 1997, 'Fantasy', 'A fantasy novel about a young wizard', 'harrypotter.jpg', 1),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 1951, 'Fiction', 'A novel about teenage alienation and identity', 'catcher.jpg', 1),
('The Lord of the Rings', 'J.R.R. Tolkien', '9780618640157', 1954, 'Fantasy', 'A fantasy epic about the battle of good versus evil', 'lotr.jpg', 1),
('The Alchemist', 'Paulo Coelho', '9780062315007', 1988, 'Fiction', 'A philosophical novel about following one''s dreams', 'alchemist.jpg', 1),
('The Da Vinci Code', 'Dan Brown', '9780307474278', 2003, 'Mystery', 'A mystery thriller about religious symbolism', 'davinci.jpg', 1);

INSERT INTO users (username, password, email, role)
VALUES 
('admin', 'admin123', 'admin@library.com', 'admin'),
('librarian', 'lib123', 'librarian@library.com', 'librarian'),
('student1', 'student123', 'student1@university.edu', 'student'),
('student2', 'student456', 'student2@university.edu', 'student'); 