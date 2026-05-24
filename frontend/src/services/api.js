import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000/api';

// Create an axios instance with additional debugging
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Books API
export const booksApi = {
  // Get all books
  getAllBooks: (availableOnly = false) => {
    return apiClient.get(`/books?available=${availableOnly}`);
  },
  
  // Search books
  searchBooks: (query) => {
    return apiClient.get(`/books?query=${encodeURIComponent(query)}`);
  },
  
  // Get a book by ID
  getBookById: (id) => {
    return apiClient.get(`/books/${id}`);
  },
  
  // Get featured books
  getFeaturedBooks: () => {
    return apiClient.get('/books/featured');
  },
  
  // Add a new book (admin/librarian only)
  addBook: (bookData) => {
    return apiClient.post('/books', bookData);
  },
  
  // Update a book (admin/librarian only)
  updateBook: (id, bookData) => {
    return apiClient.put(`/books/${id}`, bookData);
  },
  
  // Delete a book (admin only)
  deleteBook: (id) => {
    return apiClient.delete(`/books/${id}`);
  },
  
  // Get user's view history
  getUserViewHistory: (userId) => {
    return apiClient.get(`/users/${userId}/view-history`);
  },
  
  // Get trending books
  getTrendingBooks: () => {
    return apiClient.get('/books/trending');
  },
  
  // Record book view
  recordBookView: (userId, bookId) => {
    return apiClient.post('/book-view', { user_id: userId, book_id: bookId });
  },
};

// User API
export const userApi = {
  // Login
  login: (credentials) => {
    return apiClient.post('/login', credentials);
  },
  
  // Register
  register: (userData) => {
    return apiClient.post('/users', userData);
  },
  
  // Get all users (admin only)
  getAllUsers: () => {
    return apiClient.get('/users');
  },
  
  // Get user preferences
  getUserPreferences: (userId) => {
    return apiClient.get(`/users/${userId}/preferences`);
  },
  
  // Update user preferences
  updateUserPreferences: (userId, preferences) => {
    return apiClient.put(`/users/${userId}/preferences`, preferences);
  },
};

// Borrow API
export const borrowApi = {
  // Get all borrows (admin/librarian only)
  getAllBorrows: () => {
    return apiClient.get('/borrows');
  },
  
  // Get borrows for a specific user
  getUserBorrows: (userId) => {
    return apiClient.get(`/borrows?user_id=${userId}`);
  },
  
  // Borrow a book
  borrowBook: (userId, bookId) => {
    return apiClient.post('/borrow', { user_id: userId, book_id: bookId });
  },
  
  // Return a book
  returnBook: (borrowId) => {
    return apiClient.post(`/return/${borrowId}`);
  },
};

// AI Recommendations API
export const aiApi = {
  // Get book recommendations
  getRecommendations: (preferences, userId = null, options = {}) => {
    const data = { 
      preferences,
      ...options
    };
    if (userId) {
      data.user_id = userId;
    }
    return apiClient.post('/recommendations', data);
  },
  
  // Get detailed book information
  getBookDetails: (title, author) => {
    return apiClient.post('/book-details', { title, author });
  },
  
  // Save a recommendation
  saveRecommendation: (userId, recommendation) => {
    return apiClient.post(`/users/${userId}/saved-recommendations`, recommendation);
  },
  
  // Get saved recommendations
  getSavedRecommendations: (userId) => {
    return apiClient.get(`/users/${userId}/saved-recommendations`);
  },
  
  // Delete a saved recommendation
  deleteSavedRecommendation: (userId, recommendationId) => {
    return apiClient.delete(`/users/${userId}/saved-recommendations/${recommendationId}`);
  },
  
  // Generate book summary
  generateBookSummary: (bookId) => {
    return apiClient.get(`/ai/book-summary/${bookId}`);
  },
  
  // Generate similar books
  getSimilarBooks: (bookId) => {
    return apiClient.get(`/ai/similar-books/${bookId}`);
  },
}; 