import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { booksApi, userApi, borrowApi } from '../services/api';

// TabPanel component for tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = ({ user }) => {
  const [tabValue, setTabValue] = useState(0);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Book form state
  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    publication_year: '',
    genre: '',
    description: '',
    cover_image: '',
    available: 1
  });
  
  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch books
        const booksResponse = await booksApi.getAllBooks();
        setBooks(booksResponse.data);
        
        // Fetch users if admin
        if (user && user.role === 'admin') {
          const usersResponse = await userApi.getAllUsers();
          setUsers(usersResponse.data);
        }
        
        // Fetch borrows
        const borrowsResponse = await borrowApi.getAllBorrows();
        setBorrows(borrowsResponse.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Handle book form input change
  const handleBookFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open book dialog for add/edit
  const handleOpenBookDialog = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publication_year: book.publication_year || '',
        genre: book.genre || '',
        description: book.description || '',
        cover_image: book.cover_image || '',
        available: book.available
      });
    } else {
      setEditingBook(null);
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        publication_year: '',
        genre: '',
        description: '',
        cover_image: '',
        available: 1
      });
    }
    setOpenBookDialog(true);
  };
  
  // Close book dialog
  const handleCloseBookDialog = () => {
    setOpenBookDialog(false);
  };
  
  // Submit book form
  const handleBookSubmit = async () => {
    setError('');
    setSuccess('');
    
    try {
      if (editingBook) {
        // Update existing book
        const response = await booksApi.updateBook(editingBook.id, bookForm);
        if (response.data && response.data.message) {
          setSuccess('Book updated successfully!');
          // Update books list
          setBooks(prevBooks => prevBooks.map(book => 
            book.id === editingBook.id ? { ...book, ...bookForm } : book
          ));
        }
      } else {
        // Add new book
        const response = await booksApi.addBook(bookForm);
        if (response.data && response.data.id) {
          setSuccess('Book added successfully!');
          // Add new book to list
          const newBook = { id: response.data.id, ...bookForm };
          setBooks(prevBooks => [...prevBooks, newBook]);
        }
      }
      
      handleCloseBookDialog();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Failed to save book.');
      } else {
        setError('An error occurred while saving the book. Please try again.');
      }
    }
  };
  
  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (bookId) => {
    setDeletingBookId(bookId);
    setConfirmDelete(true);
  };
  
  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setDeletingBookId(null);
  };
  
  // Delete a book
  const handleDeleteBook = async () => {
    if (!deletingBookId) return;
    
    setError('');
    setSuccess('');
    
    try {
      const response = await booksApi.deleteBook(deletingBookId);
      if (response.data && response.data.message) {
        setSuccess('Book deleted successfully!');
        // Remove book from list
        setBooks(prevBooks => prevBooks.filter(book => book.id !== deletingBookId));
      }
      
      handleCloseDeleteDialog();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Failed to delete book.');
      } else {
        setError('An error occurred while deleting the book. Please try again.');
      }
      handleCloseDeleteDialog();
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<BookIcon />} label="Books" />
          {user && user.role === 'admin' && <Tab icon={<PersonIcon />} label="Users" />}
          <Tab icon={<SwapHorizIcon />} label="Borrows" />
        </Tabs>
        
        {/* Books Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<LibraryAddIcon />}
              onClick={() => handleOpenBookDialog()}
            >
              Add New Book
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.genre}</TableCell>
                    <TableCell>
                      {book.available ? 'Available' : 'Borrowed'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenBookDialog(book)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(book.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Users Tab (Admin only) */}
        {user && user.role === 'admin' && (
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.light' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        )}
        
        {/* Borrows Tab */}
        <TabPanel value={tabValue} index={user && user.role === 'admin' ? 2 : 1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Book Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Borrow Date</TableCell>
                  <TableCell>Return Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {borrows.map((borrow) => (
                  <TableRow key={borrow.id}>
                    <TableCell>{borrow.id}</TableCell>
                    <TableCell>{borrow.title}</TableCell>
                    <TableCell>{borrow.username}</TableCell>
                    <TableCell>{borrow.borrow_date}</TableCell>
                    <TableCell>{borrow.return_date || 'Not returned'}</TableCell>
                    <TableCell>{borrow.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
      
      {/* Add/Edit Book Dialog */}
      <Dialog open={openBookDialog} onClose={handleCloseBookDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={bookForm.title}
                onChange={handleBookFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Author"
                name="author"
                value={bookForm.author}
                onChange={handleBookFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={bookForm.isbn}
                onChange={handleBookFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Publication Year"
                name="publication_year"
                type="number"
                value={bookForm.publication_year}
                onChange={handleBookFormChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={bookForm.genre}
                onChange={handleBookFormChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cover Image"
                name="cover_image"
                value={bookForm.cover_image}
                onChange={handleBookFormChange}
                placeholder="filename.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={bookForm.description}
                onChange={handleBookFormChange}
                multiline
                rows={4}
              />
            </Grid>
            {editingBook && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    name="available"
                    value={bookForm.available}
                    onChange={handleBookFormChange}
                    label="Availability"
                  >
                    <MenuItem value={1}>Available</MenuItem>
                    <MenuItem value={0}>Borrowed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookDialog}>Cancel</Button>
          <Button onClick={handleBookSubmit} variant="contained">
            {editingBook ? 'Update Book' : 'Add Book'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this book? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteBook} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 