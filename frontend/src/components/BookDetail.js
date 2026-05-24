import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tabs,
  Tab,
  Rating,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar
} from '@mui/material';
import { alpha, darken, lighten } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import DescriptionIcon from '@mui/icons-material/Description';
import ReviewsIcon from '@mui/icons-material/Reviews';
import BookIcon from '@mui/icons-material/Book';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { motion } from 'framer-motion';
import { booksApi, borrowApi, aiApi } from '../services/api';
import Book3DFallback from './Book3DFallback';

// Styled motion components
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const BookDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowing, setBorrowing] = useState(false);
  const [success, setSuccess] = useState('');
  const [aiDetails, setAiDetails] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [is3DView, setIs3DView] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [bookSummary, setBookSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await booksApi.getBookById(id);
        setBook(response.data);
        
        // Record view if user is logged in
        if (user && user.id) {
          try {
            await booksApi.recordBookView(user.id, id);
          } catch (err) {
            console.error("Error recording book view:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookDetails();
  }, [id, user]);
  
  // Function to borrow a book
  const handleBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBorrowing(true);
    setError('');
    
    try {
      const response = await borrowApi.borrowBook(user.id, book.id);
      if (response.data && response.data.message) {
        setSuccess('Book borrowed successfully!');
        // Update book availability
        setBook(prevBook => ({ ...prevBook, available: 0 }));
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Failed to borrow book.');
      } else {
        setError('An error occurred while borrowing the book. Please try again.');
      }
    } finally {
      setBorrowing(false);
    }
  };
  
  // Function to get AI-generated book details
  const handleGetAiDetails = async () => {
    if (!book) return;
    
    setAiLoading(true);
    
    try {
      const response = await aiApi.getBookDetails(book.title, book.author);
      if (response.data && response.data.details) {
        setAiDetails(response.data.details);
        setShowAiDetails(true);
      }
    } catch (err) {
      console.error("Error getting AI details:", err);
      setError('Failed to get AI-generated details. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };
  
  // Handle closing the AI details dialog
  const handleCloseAiDetails = () => {
    setShowAiDetails(false);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Load data for the selected tab if needed
    if (newValue === 1 && !bookSummary && !loadingSummary) {
      fetchBookSummary();
    } else if (newValue === 2 && similarBooks.length === 0 && !loadingSimilar) {
      fetchSimilarBooks();
    }
  };
  
  // Toggle 3D view
  const toggle3DView = () => {
    setIs3DView(!is3DView);
  };
  
  // Fetch AI-generated book summary
  const fetchBookSummary = async () => {
    if (!book || bookSummary) return;
    
    setLoadingSummary(true);
    
    try {
      const response = await aiApi.generateBookSummary(book.id);
      if (response.data && response.data.summary) {
        setBookSummary(response.data.summary);
      }
    } catch (err) {
      console.error("Error fetching book summary:", err);
      setBookSummary("We couldn't generate a summary for this book at the moment. Please try again later.");
    } finally {
      setLoadingSummary(false);
    }
  };
  
  // Fetch similar books
  const fetchSimilarBooks = async () => {
    if (!book) return;
    
    setLoadingSimilar(true);
    
    try {
      const response = await aiApi.getSimilarBooks(book.id);
      if (response.data) {
        setSimilarBooks(response.data);
      }
    } catch (err) {
      console.error("Error fetching similar books:", err);
    } finally {
      setLoadingSimilar(false);
    }
  };
  
  // Share book
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out this book: ${book.title} by ${book.author}`,
        url: url
      })
      .catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(url)
        .then(() => {
          setSuccess('Link copied to clipboard!');
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch(err => {
          console.error('Error copying:', err);
          setError('Failed to copy link');
        });
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </motion.div>
      </Box>
    );
  }
  
  if (error && !book) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        <Button 
          component={RouterLink} 
          to="/books" 
          startIcon={<ArrowBackIcon />}
        >
          Back to Books
        </Button>
      </Container>
    );
  }
  
  if (!book) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 2 }}>Book not found</Alert>
        <Button 
          component={RouterLink} 
          to="/books" 
          startIcon={<ArrowBackIcon />}
        >
          Back to Books
        </Button>
      </Container>
    );
  }
  
  return (
    <Container>
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button 
          component={RouterLink} 
          to="/books" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Books
        </Button>
      </MotionBox>
      
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>
        </motion.div>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <CircularProgress size={60} />
          </motion.div>
        </Box>
      ) : book ? (
        <>
          <MotionPaper 
            elevation={0} 
            sx={{ 
              p: isMobile ? 2 : 4,
              borderRadius: 4,
              background: theme => `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: '0 20px 80px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: theme => `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 60%)`,
                zIndex: 0
              }
            }}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Grid container spacing={isMobile ? 4 : 6}>
              {/* Book Cover/Image */}
              <Grid item xs={12} md={4}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ z: 30 }}
                  sx={{ 
                    width: '100%', 
                    height: isMobile ? 300 : 450, 
                    borderRadius: 4,
                    overflow: 'hidden',
                    mb: 2,
                    position: 'relative',
                    boxShadow: theme.shadows[8],
                    transformStyle: 'preserve-3d',
                    transform: 'perspective(1000px)',
                  }}
                >
                  <MotionBox
                    component="div"
                    animate={{ 
                      rotateY: [-2, 2, -2],
                      rotateX: [1, -1, 1]
                    }}
                    transition={{ 
                      duration: 10, 
                      repeat: Infinity,
                      repeatType: "mirror"
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* 3D View Toggle */}
                    <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                      <Tooltip title={is3DView ? "Show Cover Image" : "Show 3D View"}>
                        <IconButton 
                          onClick={toggle3DView} 
                          size="small"
                          sx={{ 
                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(8px)',
                            '&:hover': { 
                              backgroundColor: alpha(theme.palette.background.paper, 0.9)
                            }
                          }}
                        >
                          <ViewInArIcon color={is3DView ? "primary" : "action"} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {/* Book Status Tag */}
                    <Chip 
                      label={book.available ? "Available" : "Borrowed"} 
                      color={book.available ? "success" : "error"}
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      }}
                    />
                    
                    {is3DView ? (
                      <Box sx={{ width: '100%', height: '100%' }}>
                        <Book3DFallback
                          title={book.title}
                          author={book.author}
                          color={theme.palette.primary.main}
                          height={isMobile ? 300 : 450}
                        />
                      </Box>
                    ) : (
                      book.cover_image ? (
                        <motion.img 
                          src={`/images/${book.cover_image}`} 
                          alt={book.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
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
                          <BookIcon sx={{ fontSize: 60, color: 'white', mb: 2, opacity: 0.8 }} />
                          <Typography 
                            variant="h5" 
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
                      )
                    )}
                    
                    {/* Shadow Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '30%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        opacity: is3DView ? 0 : 0.7,
                        zIndex: 1,
                      }}
                    />
                  </MotionBox>
                </MotionBox>
                
                {/* Action buttons */}
                <Stack 
                  direction="row" 
                  spacing={2} 
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <Tooltip title="Share this book">
                    <IconButton 
                      color="primary"
                      sx={{ 
                        boxShadow: theme => `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                        }
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Add to favorites">
                    <IconButton 
                      color="error"
                      sx={{ 
                        boxShadow: theme => `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: theme => `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`,
                        }
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Add to reading list">
                    <IconButton 
                      color="secondary"
                      sx={{ 
                        boxShadow: theme => `0 2px 8px ${alpha(theme.palette.secondary.main, 0.3)}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: theme => `0 4px 12px ${alpha(theme.palette.secondary.main, 0.4)}`,
                        }
                      }}
                    >
                      <BookmarkAddIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
              
              {/* Book Details */}
              <Grid item xs={12} md={8}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    spacing={1} 
                    sx={{ mb: 1 }}
                  >
                    {book.genre && (
                      <Chip 
                        label={book.genre} 
                        size="small" 
                        color="secondary"
                        sx={{ 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background: theme => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          color: 'white'
                        }}
                      />
                    )}
                    {book.rating && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        background: alpha(theme.palette.background.paper, 0.7),
                        backdropFilter: 'blur(8px)',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}>
                        <Rating 
                          value={book.rating} 
                          precision={0.1} 
                          readOnly 
                          size="small" 
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            ml: 1,
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          {book.rating}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                  
                  <MotionTypography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2rem', sm: '2.5rem' },
                      background: theme => `linear-gradient(90deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                      mb: 1
                    }}
                  >
                    {book.title}
                  </MotionTypography>
                  
                  <MotionTypography 
                    variant="h5" 
                    component="div"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    sx={{ 
                      color: 'text.secondary',
                      mb: 3,
                      fontWeight: 500,
                      fontStyle: 'italic'
                    }}
                  >
                    by {book.author}
                  </MotionTypography>
                  
                  <Divider sx={{ mb: 3, opacity: 0.6 }} />
                  
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                      {book.publication_year && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.07),
                          }}>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Year
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {book.publication_year}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      {book.isbn && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.secondary.main, 0.07),
                          }}>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                              ISBN
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {book.isbn}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      {book.num_pages && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ 
                            textAlign: 'center',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.07),
                          }}>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                              Pages
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {book.num_pages}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ 
                          textAlign: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: book.available 
                            ? alpha(theme.palette.success.main, 0.07)
                            : alpha(theme.palette.error.main, 0.07),
                        }}>
                          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Status
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: book.available ? 'success.main' : 'error.main'
                            }}
                          >
                            {book.available ? "Available" : "Borrowed"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Tabs for Book Content */}
                  <Box sx={{ width: '100%', mb: 3 }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{
                        '& .MuiTabs-indicator': {
                          height: 3,
                          borderRadius: '3px 3px 0 0',
                        },
                        '& .MuiTab-root': {
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          minHeight: 48,
                          borderRadius: '8px 8px 0 0',
                          '&.Mui-selected': {
                            color: 'primary.main',
                          },
                        },
                      }}
                    >
                      <Tab 
                        icon={<DescriptionIcon />} 
                        iconPosition="start" 
                        label="Description" 
                      />
                      <Tab 
                        icon={<InfoIcon />} 
                        iconPosition="start" 
                        label="Summary" 
                      />
                      <Tab 
                        icon={<AutoStoriesIcon />} 
                        iconPosition="start" 
                        label="Similar Books" 
                      />
                      <Tab 
                        icon={<ReviewsIcon />} 
                        iconPosition="start" 
                        label="Reviews" 
                      />
                    </Tabs>
                    
                    {/* Tab Panels */}
                    <Box 
                      sx={{ 
                        p: 3, 
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        backdropFilter: 'blur(8px)',
                        borderRadius: '0 0 16px 16px',
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        minHeight: 200,
                      }}
                    >
                      {/* Description Tab */}
                      {tabValue === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {book.description ? (
                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                              {book.description}
                            </Typography>
                          ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No description available for this book.
                            </Typography>
                          )}
                          
                          {!showAiDetails && (
                            <Button
                              variant="outlined"
                              onClick={handleGetAiDetails}
                              disabled={aiLoading}
                              startIcon={aiLoading ? <CircularProgress size={20} /> : <InfoIcon />}
                              sx={{ mt: 3 }}
                            >
                              {aiLoading ? 'Getting AI Insights...' : 'Get AI Insights'}
                            </Button>
                          )}
                        </motion.div>
                      )}
                      
                      {/* Summary Tab */}
                      {tabValue === 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {loadingSummary ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                              <CircularProgress />
                            </Box>
                          ) : bookSummary ? (
                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                              {bookSummary}
                            </Typography>
                          ) : (
                            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No summary available for this book. Click the button below to generate one with AI.
                            </Typography>
                          )}
                          
                          {!bookSummary && !loadingSummary && (
                            <Button
                              variant="outlined"
                              onClick={fetchBookSummary}
                              startIcon={<AutoStoriesIcon />}
                              sx={{ mt: 3 }}
                            >
                              Generate Summary with AI
                            </Button>
                          )}
                        </motion.div>
                      )}
                      
                      {/* Similar Books Tab */}
                      {tabValue === 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {loadingSimilar ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                              <CircularProgress />
                            </Box>
                          ) : similarBooks.length > 0 ? (
                            <Grid container spacing={2}>
                              {similarBooks.map((book, index) => (
                                <Grid item xs={12} sm={6} key={book.id || index}>
                                  <Card 
                                    component={motion.div}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <CardContent>
                                      <Typography variant="h6" noWrap>{book.title}</Typography>
                                      <Typography variant="body2" color="text.secondary" noWrap>
                                        by {book.author}
                                      </Typography>
                                      {book.similarity && (
                                        <Chip 
                                          size="small" 
                                          label={`${book.similarity}% match`}
                                          color="primary"
                                          sx={{ mt: 1 }}
                                        />
                                      )}
                                      <Button 
                                        size="small" 
                                        component={RouterLink} 
                                        to={`/books/${book.id}`}
                                        sx={{ mt: 1 }}
                                      >
                                        View Details
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Typography variant="body1">
                              No similar books found.
                            </Typography>
                          )}
                        </motion.div>
                      )}
                      
                      {/* Reviews Tab */}
                      {tabValue === 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <Typography variant="body1">
                            Reviews feature coming soon!
                          </Typography>
                        </motion.div>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Action Button */}
                  {book.available ? (
                    <MotionButton
                      variant="contained"
                      color="primary"
                      disabled={borrowing || !user}
                      onClick={handleBorrow}
                      startIcon={borrowing ? <CircularProgress size={20} /> : <LocalLibraryIcon />}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: '30px',
                        background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        boxShadow: theme => `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                        '&:hover': {
                          boxShadow: theme => `0 8px 25px ${alpha(theme.palette.primary.main, 0.6)}`,
                        }
                      }}
                    >
                      {borrowing ? 'Borrowing...' : user ? 'Borrow This Book' : 'Sign In To Borrow'}
                    </MotionButton>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      disabled
                      startIcon={<BookIcon />}
                      sx={{ 
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: '30px',
                      }}
                    >
                      Currently Unavailable
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </MotionPaper>
          
          {/* AI Details Dialog */}
          <Dialog
            open={showAiDetails}
            onClose={handleCloseAiDetails}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                p: 2,
                background: theme => `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            <DialogTitle sx={{ 
              fontSize: '1.5rem', 
              fontWeight: 700,
              background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI Insights: {book.title}
            </DialogTitle>
            <DialogContent>
              <DialogContentText component="div" sx={{ color: 'text.primary' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                  {aiDetails}
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAiDetails} variant="outlined">Close</Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Typography variant="h5" color="text.secondary" sx={{ textAlign: 'center', my: 8 }}>
          Book not found
        </Typography>
      )}
    </Container>
  );
};

export default BookDetail; 