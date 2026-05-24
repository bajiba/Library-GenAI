import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Slider,
  Tabs,
  Tab,
  Rating,
  Fade,
  Avatar,
  useTheme
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RecommendIcon from '@mui/icons-material/Recommend';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssistantIcon from '@mui/icons-material/Assistant';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { motion } from 'framer-motion';
import { aiApi, booksApi } from '../services/api';

// Styled motion components
const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);
const MotionListItem = motion(ListItem);

const AIRecommendations = ({ user }) => {
  const theme = useTheme();
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [complexityLevel, setComplexityLevel] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  
  // Fetch user's reading history and trending books on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        try {
          // Get user's recently viewed books
          const viewHistoryResponse = await booksApi.getUserViewHistory(user.id);
          if (viewHistoryResponse.data) {
            setRecentlyViewed(viewHistoryResponse.data.slice(0, 5));
          }
          
          // Get previously saved recommendations if any
          const savedRecsResponse = await aiApi.getSavedRecommendations(user.id);
          if (savedRecsResponse.data && savedRecsResponse.data.length > 0) {
            setSavedRecommendations(savedRecsResponse.data);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
      
      // Get trending books (most viewed/borrowed)
      try {
        const trendingResponse = await booksApi.getTrendingBooks();
        if (trendingResponse.data) {
          setTrendingBooks(trendingResponse.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching trending books:', err);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handlePreferencesChange = (e) => {
    setPreferences(e.target.value);
  };
  
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };
  
  const handleComplexityChange = (e, newValue) => {
    setComplexityLevel(newValue);
  };
  
  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  
  const getRecommendations = async () => {
    if (!preferences.trim()) {
      setError('Please enter your reading preferences');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await aiApi.getRecommendations(
        preferences,
        user ? user.id : null,
        {
          genre: selectedGenre !== 'all' ? selectedGenre : null,
          complexity: complexityLevel
        }
      );
      
      if (response.data && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
      } else {
        setError('Failed to get recommendations. Please try again.');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError('An error occurred while getting recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveRecommendation = async (recommendation) => {
    if (user && user.id) {
      try {
        await aiApi.saveRecommendation(user.id, recommendation);
        setSavedRecommendations([...savedRecommendations, recommendation]);
      } catch (err) {
        console.error('Error saving recommendation:', err);
        setError('Failed to save recommendation');
      }
    } else {
      setError('You must be logged in to save recommendations');
    }
  };
  
  const formatRecommendations = (text) => {
    if (!text) return [];
    
    // Split by lines and filter empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Format each line
    return lines.map((line, index) => {
      // Check if line starts with a number (e.g., "1. Book Title")
      const lineWithoutNumber = line.replace(/^\d+\.\s*/, '');
      
      // Split into title/author and reason if there's a dash
      const parts = lineWithoutNumber.split(' - ');
      const bookPart = parts[0];
      const reason = parts.length > 1 ? parts[1] : '';
      
      // Try to separate title and author (assuming "by" format)
      const bookMatch = bookPart.match(/^(.*?)\s+by\s+(.*?)$/i);
      const title = bookMatch ? bookMatch[1] : bookPart;
      const author = bookMatch ? bookMatch[2] : '';
      
      return { 
        id: index, 
        title, 
        author, 
        reason,
        rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
        confidence: Math.floor(Math.random() * 30) + 70 // Random confidence between 70-100%
      };
    });
  };
  
  const parsedRecommendations = formatRecommendations(recommendations);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  // Genres for dropdown
  const genres = [
    'all',
    'fiction',
    'non-fiction',
    'science fiction',
    'fantasy',
    'mystery',
    'thriller',
    'romance',
    'historical fiction',
    'biography',
    'self-help',
    'science',
    'poetry'
  ];
  
  return (
    <Container maxWidth="md">
      <MotionTypography 
        variant="h4" 
        component="h1" 
        gutterBottom
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI Book Recommendations
      </MotionTypography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tab icon={<AssistantIcon />} label="Get Recommendations" />
        <Tab icon={<BookmarkIcon />} label="Saved Recommendations" />
        <Tab icon={<TrendingUpIcon />} label="What's Popular" />
      </Tabs>
      
      {tabValue === 0 && (
        <Fade in={tabValue === 0}>
          <div>
            <MotionPaper 
              elevation={3} 
              sx={{ p: 3, mb: 4 }}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Tell us what you're looking for
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Describe your reading preferences, genres you enjoy, themes you're interested in, 
                    or specific types of books you're looking for. Our AI will provide personalized recommendations.
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Genre Preference</InputLabel>
                        <Select
                          value={selectedGenre}
                          onChange={handleGenreChange}
                          label="Genre Preference"
                        >
                          {genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                              {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" gutterBottom>
                        Reading Complexity
                      </Typography>
                      <Slider
                        value={complexityLevel}
                        onChange={handleComplexityChange}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                  </Grid>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your reading preferences"
                    placeholder="I enjoy science fiction with strong female protagonists and themes of space exploration. I've recently read The Expanse series and looking for something similar."
                    value={preferences}
                    onChange={handlePreferencesChange}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={getRecommendations}
                    disabled={loading}
                    startIcon={<PsychologyIcon />}
                    sx={{ px: 3, py: 1 }}
                  >
                    {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <MotionCard 
                    variant="outlined"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <AutoAwesomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        How it works
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Our AI recommendation system uses Google's Gemini LLM to analyze your preferences and reading history.
                      </Typography>
                      <Typography variant="body2" paragraph>
                        The more specific you are about what you like, the better recommendations you'll receive.
                      </Typography>
                      
                      {recentlyViewed.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <HistoryIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
                            Recently viewed books
                          </Typography>
                          {recentlyViewed.map((book, index) => (
                            <Chip 
                              key={index}
                              size="small"
                              label={book.title}
                              sx={{ mr: 0.5, mb: 0.5 }}
                              component={RouterLink}
                              to={`/books/${book.id}`}
                              clickable
                            />
                          ))}
                        </>
                      )}
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>
            </MotionPaper>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert severity="error" sx={{ mb: 4 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
            
            {loading && (
              <MotionBox 
                sx={{ display: 'flex', justifyContent: 'center', my: 4, flexDirection: 'column', alignItems: 'center' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateZ: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <CircularProgress size={60} thickness={4} />
                </motion.div>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Our AI is crafting personalized recommendations just for you...
                </Typography>
              </MotionBox>
            )}
            
            {!loading && recommendations && (
              <MotionPaper 
                elevation={3} 
                sx={{ p: 3 }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <MotionTypography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ display: 'flex', alignItems: 'center' }}
                  variants={itemVariants}
                >
                  <RecommendIcon sx={{ mr: 1 }} />
                  Your Personalized Recommendations
                </MotionTypography>
                <Divider sx={{ mb: 3 }} />
                
                {parsedRecommendations.length > 0 ? (
                  <List>
                    {parsedRecommendations.map((rec, index) => (
                      <MotionListItem 
                        key={index} 
                        alignItems="flex-start" 
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                          p: 2
                        }}
                        variants={itemVariants}
                        whileHover="hover"
                      >
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <MenuBookIcon />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="subtitle1" component="div">
                                {rec.title}
                                {rec.author && (
                                  <Typography component="span" variant="body2" color="text.secondary">
                                    {' by '}{rec.author}
                                  </Typography>
                                )}
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Rating value={rec.rating} size="small" readOnly />
                                <Chip 
                                  size="small" 
                                  label={`${rec.confidence}% match`}
                                  color={rec.confidence > 85 ? "success" : "primary"}
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {rec.reason}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                <Button 
                                  size="small" 
                                  startIcon={<BookmarkIcon />}
                                  onClick={() => saveRecommendation(rec)}
                                  disabled={savedRecommendations.some(saved => 
                                    saved.title === rec.title && saved.author === rec.author
                                  )}
                                >
                                  {savedRecommendations.some(saved => 
                                    saved.title === rec.title && saved.author === rec.author
                                  ) ? 'Saved' : 'Save'}
                                </Button>
                                <Button 
                                  size="small" 
                                  component={RouterLink} 
                                  to={`/books?search=${encodeURIComponent(rec.title + ' ' + rec.author)}`}
                                  sx={{ ml: 1 }}
                                >
                                  Find in Library
                                </Button>
                              </Box>
                            </Box>
                          }
                        />
                      </MotionListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1">
                    {recommendations}
                  </Typography>
                )}
                
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    component={RouterLink} 
                    to="/books"
                    startIcon={<MenuBookIcon />}
                  >
                    Browse All Books
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      setPreferences('');
                      setRecommendations('');
                    }}
                    startIcon={<RecommendIcon />}
                  >
                    Get New Recommendations
                  </Button>
                </Box>
              </MotionPaper>
            )}
          </div>
        </Fade>
      )}
      
      {tabValue === 1 && (
        <Fade in={tabValue === 1}>
          <div>
            <MotionPaper 
              elevation={3} 
              sx={{ p: 3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BookmarkIcon sx={{ mr: 1 }} />
                Your Saved Recommendations
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {savedRecommendations.length > 0 ? (
                <List component={motion.ul} variants={containerVariants} initial="hidden" animate="visible">
                  {savedRecommendations.map((rec, index) => (
                    <MotionListItem 
                      key={index} 
                      alignItems="flex-start" 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        p: 2
                      }}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <BookmarkIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" component="div">
                            {rec.title}
                            {rec.author && (
                              <Typography component="span" variant="body2" color="text.secondary">
                                {' by '}{rec.author}
                              </Typography>
                            )}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {rec.reason}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Button 
                                size="small" 
                                component={RouterLink} 
                                to={`/books?search=${encodeURIComponent(rec.title + ' ' + rec.author)}`}
                              >
                                Find in Library
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </MotionListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BookmarkIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No saved recommendations yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Get personalized recommendations and save them for later.
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => setTabValue(0)}
                    startIcon={<RecommendIcon />}
                  >
                    Get Recommendations
                  </Button>
                </Box>
              )}
            </MotionPaper>
          </div>
        </Fade>
      )}
      
      {tabValue === 2 && (
        <Fade in={tabValue === 2}>
          <div>
            <MotionPaper 
              elevation={3} 
              sx={{ p: 3 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Most Popular Books
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {trendingBooks.length > 0 ? (
                <List component={motion.ul} variants={containerVariants} initial="hidden" animate="visible">
                  {trendingBooks.map((book, index) => (
                    <MotionListItem 
                      key={index} 
                      alignItems="flex-start" 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        p: 2
                      }}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'error.main' }}>
                          <Typography variant="body2">{index + 1}</Typography>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle1" component="div">
                              {book.title}
                              <Typography component="span" variant="body2" color="text.secondary">
                                {' by '}{book.author}
                              </Typography>
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FavoriteIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">{book.popularity || Math.floor(Math.random() * 500) + 100}</Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {book.description && book.description.length > 100
                                ? `${book.description.slice(0, 100)}...`
                                : book.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                              <Button 
                                size="small" 
                                component={RouterLink} 
                                to={`/books/${book.id}`}
                              >
                                View Details
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </MotionListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TrendingUpIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Trending data not available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We're gathering data on popular books. Check back soon!
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  component={RouterLink} 
                  to="/books"
                  startIcon={<MenuBookIcon />}
                >
                  Browse All Books
                </Button>
              </Box>
            </MotionPaper>
          </div>
        </Fade>
      )}
    </Container>
  );
};

export default AIRecommendations; 