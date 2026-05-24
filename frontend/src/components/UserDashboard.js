import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { borrowApi } from '../services/api';

const UserDashboard = ({ user }) => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returning, setReturning] = useState(null);
  const [success, setSuccess] = useState('');
  
  // Fetch user's borrows
  useEffect(() => {
    const fetchBorrows = async () => {
      if (!user) return;
      
      try {
        const response = await borrowApi.getUserBorrows(user.id);
        setBorrows(response.data);
      } catch (err) {
        console.error("Error fetching borrows:", err);
        setError('Failed to load borrowing history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBorrows();
  }, [user]);
  
  // Handle returning a book
  const handleReturnBook = async (borrowId) => {
    setReturning(borrowId);
    setError('');
    setSuccess('');
    
    try {
      const response = await borrowApi.returnBook(borrowId);
      if (response.data && response.data.message) {
        setSuccess('Book returned successfully!');
        // Update borrows list
        setBorrows(prevBorrows => prevBorrows.map(borrow => 
          borrow.id === borrowId 
            ? { ...borrow, status: 'returned', return_date: new Date().toISOString().split('T')[0] }
            : borrow
        ));
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Failed to return book.');
      } else {
        setError('An error occurred while returning the book. Please try again.');
      }
    } finally {
      setReturning(null);
    }
  };
  
  // Group borrows by status
  const currentBorrows = borrows.filter(borrow => borrow.status === 'borrowed');
  const returnedBorrows = borrows.filter(borrow => borrow.status === 'returned');
  
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
        Your Dashboard
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      {/* User Info */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5">{user?.username}</Typography>
            <Typography variant="body1" color="text.secondary">{user?.email}</Typography>
            <Chip 
              label={user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Borrow Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AutoStoriesIcon sx={{ mr: 1 }} />
                Currently Borrowed
              </Typography>
              <Typography variant="h3" color="primary" align="center">
                {currentBorrows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <KeyboardReturnIcon sx={{ mr: 1 }} />
                Total Returned
              </Typography>
              <Typography variant="h3" color="secondary" align="center">
                {returnedBorrows.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Current Borrows */}
      <Typography variant="h5" gutterBottom>
        Currently Borrowed Books
      </Typography>
      
      {currentBorrows.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          You don't have any books currently borrowed.
          <Button 
            component={RouterLink} 
            to="/books" 
            size="small" 
            sx={{ ml: 2 }}
          >
            Browse Books
          </Button>
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell>Book Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Borrow Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentBorrows.map((borrow) => (
                <TableRow key={borrow.id}>
                  <TableCell>
                    <RouterLink 
                      to={`/books/${borrow.book_id}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Typography color="primary.main" fontWeight="medium">
                        {borrow.title}
                      </Typography>
                    </RouterLink>
                  </TableCell>
                  <TableCell>{borrow.author}</TableCell>
                  <TableCell>{borrow.borrow_date}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      startIcon={<BookmarkRemoveIcon />}
                      onClick={() => handleReturnBook(borrow.id)}
                      disabled={returning === borrow.id}
                    >
                      {returning === borrow.id ? 'Returning...' : 'Return'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Borrow History */}
      {returnedBorrows.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Borrowing History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'secondary.light' }}>
                  <TableCell>Book Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Borrowed On</TableCell>
                  <TableCell>Returned On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnedBorrows.map((borrow) => (
                  <TableRow key={borrow.id}>
                    <TableCell>
                      <RouterLink 
                        to={`/books/${borrow.book_id}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography color="primary.main">
                          {borrow.title}
                        </Typography>
                      </RouterLink>
                    </TableCell>
                    <TableCell>{borrow.author}</TableCell>
                    <TableCell>{borrow.borrow_date}</TableCell>
                    <TableCell>{borrow.return_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      
      {/* Get Recommendations */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/recommendations"
        >
          Get Book Recommendations
        </Button>
      </Box>
    </Container>
  );
};

export default UserDashboard; 