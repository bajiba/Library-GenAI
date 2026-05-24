import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Pagination,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import { booksApi } from '../services/api';
import { alpha, darken, lighten } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// Styled components for animation
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const booksPerPage = 6;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    tap: {
      scale: 0.97
    }
  };
  
  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, [availableOnly]);
  
  // Filter books when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBooks(books);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery) ||
        (book.genre && book.genre.toLowerCase().includes(lowercaseQuery)) ||
        (book.description && book.description.toLowerCase().includes(lowercaseQuery))
      );
      setFilteredBooks(filtered);
    }
    setPage(1); // Reset to first page on new search
  }, [searchQuery, books]);
  
  const fetchBooks = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`Fetching books with availableOnly=${availableOnly}`);
      const response = await booksApi.getAllBooks(availableOnly);
      console.log('Fetched books:', response.data);
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (err) {
      console.error('Error fetching books:', err);
      if (err.response) {
        setError(`Failed to load books: ${err.response.status} ${err.response.statusText}`);
      } else if (err.request) {
        setError('Failed to connect to the server. Please check if the server is running.');
      } else {
        setError('Failed to load books. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleAvailableToggle = () => {
    setAvailableOnly(!availableOnly);
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (page - 1) * booksPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);
  
  // Animation for search input
  const searchVariants = {
    focus: { scale: 1.02, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" },
    blur: { scale: 1, boxShadow: "none" }
  };
  
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Browse Books
        </Typography>
      </motion.div>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              whileFocus="focus"
              whileTap="focus"
              animate="blur"
              variants={searchVariants}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Search Books"
                placeholder="Search by title, author, genre..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch 
                  checked={availableOnly}
                  onChange={handleAvailableToggle}
                  color="primary"
                />
              }
              label="Show available books only"
            />
          </Grid>
        </Grid>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress />
          </motion.div>
        </Box>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        </motion.div>
      ) : filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="info" sx={{ my: 2 }}>
            No books found matching your search criteria.
          </Alert>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Showing {paginatedBooks.length} of {filteredBooks.length} books
            </Typography>
          </motion.div>
          
          <MotionGrid 
            container 
            spacing={4}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginatedBooks.map((book) => (
              <MotionGrid 
                item 
                key={book.id} 
                xs={12} 
                sm={6} 
                md={4}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <MotionCard 
                  component={RouterLink} 
                  to={`/books/${book.id}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    background: theme => `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                    backdropFilter: 'blur(10px)',
                    border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: '16px',
                    boxShadow: theme => `0 10px 30px ${alpha(theme.palette.common.black, 0.1)}, 
                                         0 1px 2px ${alpha(theme.palette.common.black, 0.05)},
                                         inset 0 1px 0 ${alpha(theme.palette.common.white, 0.1)}`,
                    textDecoration: 'none',
                    color: 'text.primary',
                    transition: 'all 0.3s ease-in-out',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: theme => `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.1)}, transparent 30%)`,
                      zIndex: 0
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative', 
                      pt: '140%',
                      overflow: 'hidden',
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px',
                    }}
                  >
                    {/* Book Availability Tag */}
                    <Chip 
                      label={book.available ? "Available" : "Borrowed"} 
                      color={book.available ? "success" : "error"}
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 2,
                        fontWeight: 600,
                        borderRadius: '8px',
                        boxShadow: theme => `0 4px 8px ${alpha(theme.palette.common.black, 0.15)}`,
                      }}
                    />

                    {/* Category Tag */}
                    {book.genre && (
                      <Chip
                        label={book.genre}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          zIndex: 2,
                          background: theme => `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.secondary.dark, 0.9)})`,
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: '8px',
                          textTransform: 'capitalize',
                          boxShadow: theme => `0 4px 8px ${alpha(theme.palette.common.black, 0.15)}`,
                        }}
                      />
                    )}
                    
                    {/* Cover Image with Fallback */}
                    <Box
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      {book.cover_image ? (
                        <Box
                          component="img"
                          src={`/images/${book.cover_image}`}
                          alt={book.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            filter: book.available ? 'none' : 'grayscale(30%)',
                            transition: 'all 0.5s ease-in-out',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: theme => `linear-gradient(135deg, ${darken(theme.palette.primary.main, 0.2)}, ${theme.palette.primary.dark})`,
                            p: 3,
                          }}
                        >
                          <MenuBookIcon sx={{ fontSize: 60, color: 'white', mb: 2, opacity: 0.8 }} />
                          <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                              color: 'white', 
                              textAlign: 'center',
                              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              fontWeight: 700,
                            }}
                          >
                            {book.title}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {/* Gradient Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '50%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        opacity: 0.9,
                        zIndex: 1,
                      }}
                    />
                  </Box>
                  
                  <CardContent 
                    sx={{ 
                      position: 'relative',
                      zIndex: 2,
                      pt: 3,
                      pb: 4,
                      px: 3,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.35rem',
                        lineHeight: 1.3,
                        mb: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {book.title}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ 
                        mb: 1.5,
                        fontWeight: 500,
                        fontStyle: 'italic'
                      }}
                    >
                      {book.author}
                    </Typography>
                    
                    {/* Rating System */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          fontSize="small" 
                          sx={{ 
                            color: i < (book.rating || 4) ? 'warning.main' : 'action.disabled',
                            mr: 0.5
                          }} 
                        />
                      ))}
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        {book.rating || '4.0'}/5
                      </Typography>
                    </Box>
                    
                    {/* Description */}
                    {book.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.5,
                        }}
                      >
                        {book.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button 
                        startIcon={<AutoStoriesIcon />}
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{
                          borderRadius: '8px',
                          boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                          fontWeight: 600,
                          px: 2,
                          py: 0.75,
                          background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: theme => `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            boxShadow: theme => `0 6px 16px ${alpha(theme.palette.primary.main, 0.6)}`,
                          }
                        }}
                      >
                        View Details
                      </Button>
                      
                      <IconButton
                        color="secondary"
                        size="small"
                        sx={{
                          background: theme => alpha(theme.palette.secondary.main, 0.1),
                          '&:hover': {
                            background: theme => alpha(theme.palette.secondary.main, 0.2),
                          }
                        }}
                      >
                        <BookmarkAddIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </MotionCard>
              </MotionGrid>
            ))}
          </MotionGrid>
          
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  showFirstButton 
                  showLastButton
                />
              </Box>
            </motion.div>
          )}
        </>
      )}
    </Container>
  );
};

export default BookSearch; 