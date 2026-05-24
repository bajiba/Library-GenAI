# Library GenAI - Smart Library Management System

A modern library management system with AI-powered book recommendations, built using React for the frontend, Flask for the backend, SQLite for the database, and Google's Gemini LLM for intelligent book suggestions.

## Dashboard
![image](https://github.com/user-attachments/assets/32036220-454c-4183-9cb9-a056796cf3f3)

## Books feature 
![image](https://github.com/user-attachments/assets/5ca6ca0a-1924-4591-8827-a201a4b59130)

## AI Recommendations
![image](https://github.com/user-attachments/assets/09e2bc33-d5c0-4643-bed0-45452487b586)

## Features

- **User Authentication**: Different roles for students, librarians, and administrators
- **Book Search & Browse**: Search books by title, author, genre, or description
- **AI-Powered Recommendations**: Get personalized book recommendations based on preferences and reading history
- **Book Management**: Track availability status, borrow and return books
- **Admin Dashboard**: Manage books, users, and borrowing records

## Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Flask RESTful API
- **Database**: SQLite
- **AI**: Google Gemini LLM (via LangChain)

## Project Structure

```
├── backend/               # Flask backend
│   ├── app/               # Application code
│   │   ├── api.py         # REST API endpoints
│   │   ├── models.py      # Data models
│   │   └── ai_recommendations.py  # AI recommendation system
│   ├── database/          # Database components
│   │   ├── db.py          # Database connection & initialization
│   │   └── schema.sql     # Database schema
│   └── app.py             # Main application entry point
├── frontend/              # React frontend
│   ├── public/            # Static files
│   └── src/               # Source code
│       ├── components/    # React components
│       └── services/      # API services
├── .env                   # Environment variables
└── requirements.txt       # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.7 or higher
- Node.js and npm
- Google API key for Gemini LLM

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/LibraryGenAI.git
   cd LibraryGenAI
   ```

2. Set up the backend:
   ```
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory with your Google API key:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   python app.py
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Demo Accounts

The system comes with pre-configured demo accounts:

- **Admin**: Username: `admin`, Password: `admin123`
- **Librarian**: Username: `librarian`, Password: `lib123`
- **Student**: Username: `student1`, Password: `student123`

## AI Book Recommendations

The system uses Google's Gemini LLM through LangChain to provide intelligent book recommendations based on:

- User's stated preferences
- Reading history (previously borrowed books)
- Available books in the library

## Future Enhancements

- Book reservation system
- Notifications for due dates
- Integration with external book APIs
- Enhanced security features
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
