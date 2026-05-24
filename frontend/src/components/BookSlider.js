import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  useTheme,
  useMediaQuery,
  Skeleton,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { motion, AnimatePresence } from 'framer-motion';
import { booksApi } from '../services/api';

// Styled components
const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: 550,
  borderRadius: 20,
  margin: theme.spacing(4, 0, 8),
  [theme.breakpoints.down('md')]: {
    height: 480,
  },
  [theme.breakpoints.down('sm')]: {
    height: 400,
  },
}));

const BookCard = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  perspective: 1000,
}));

const SlideControl = styled(IconButton)(({ theme, position }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(8px)',
  color: theme.palette.text.primary,
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  width: 48,
  height: 48,
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
  },
  [position === 'left' ? 'left' : 'right']: theme.spacing(2),
}));

const BookContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  maxWidth: 500,
  marginLeft: theme.spacing(8),
  [theme.breakpoints.down('md')]: {
    marginLeft: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(2),
    maxWidth: '85%',
  },
}));

const BookTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  color: 'white',
  textShadow: '0 2px 12px rgba(0,0,0,0.3)',
  fontSize: '3rem',
  [theme.breakpoints.down('lg')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
}));

const bookVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const coverVariants = {
  hover: {
    rotateY: 10,
    scale: 1.05,
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const BookSlider = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch featured books on component mount
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await booksApi.getFeaturedBooks();
        setBooks(response.data.slice(0, 5)); // Limit to 5 books for better performance
      } catch (error) {
        console.error('Error fetching featured books:', error);
        // Fallback data in case API fails
        setBooks([
          {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            cover_image: 'gatsby.jpg',
            description: 'A story of wealth, love, and the American Dream in the 1920s.',
            genre: 'Classic',
          },
          {
            id: 2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            cover_image: 'mockingbird.jpg',
            description: 'A powerful story of racial injustice and moral growth in the American South.',
            genre: 'Fiction',
          },
          {
            id: 3,
            title: '1984',
            author: 'George Orwell',
            cover_image: '1984.jpg',
            description: 'A dystopian classic about totalitarianism and surveillance.',
            genre: 'Science Fiction',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedBooks();
  }, []);

  // Handle slider navigation
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % books.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
  };

  // Navigate to book detail page
  const handleViewBook = (id) => {
    navigate(`/books/${id}`);
  };

  if (loading) {
    return (
      <SliderContainer>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          animation="wave"
          sx={{ borderRadius: 5 }}
        />
      </SliderContainer>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <SliderContainer>
      <SlideControl position="left" onClick={prevSlide} aria-label="Previous book">
        <ArrowBackIosNewIcon />
      </SlideControl>
      
      <SlideControl position="right" onClick={nextSlide} aria-label="Next book">
        <ArrowForwardIosIcon />
      </SlideControl>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        <BookCard
          key={currentIndex}
          custom={direction}
          variants={bookVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
        >
          {/* Background Image */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(to right, 
                ${alpha(theme.palette.common.black, 0.85)} 0%, 
                ${alpha(theme.palette.common.black, 0.6)} 50%, 
                ${alpha(theme.palette.common.black, 0.4)} 100%
              ), url(/images/${books[currentIndex].cover_image || 'default-cover.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px)',
              transform: 'scale(1.05)', // Prevent blur from showing edges
            }}
          />

          {/* Book Content */}
          <BookContent>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Typography 
                variant="overline" 
                sx={{ 
                  color: theme.palette.primary.light,
                  fontWeight: 600,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  mb: 1,
                  display: 'block',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                Featured Book
              </Typography>
              
              <BookTitle variant="h2" component={motion.h2}>
                {books[currentIndex].title}
              </BookTitle>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  mb: 3,
                  fontStyle: 'italic',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                by {books[currentIndex].author}
              </Typography>
              
              {books[currentIndex].genre && (
                <Box
                  sx={{
                    display: 'inline-block',
                    bgcolor: alpha(theme.palette.primary.main, 0.3),
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    mb: 3,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                  }}
                >
                  {books[currentIndex].genre}
                </Box>
              )}
              
              {!isTablet && books[currentIndex].description && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    mb: 4,
                    maxWidth: '95%',
                    lineHeight: 1.7,
                    textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }}
                >
                  {isMobile
                    ? `${books[currentIndex].description.slice(0, 80)}...`
                    : books[currentIndex].description.length > 150
                      ? `${books[currentIndex].description.slice(0, 150)}...` 
                      : books[currentIndex].description
                  }
                </Typography>
              )}
              
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoStoriesIcon />}
                onClick={() => handleViewBook(books[currentIndex].id)}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  mt: 2,
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  borderRadius: 30,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  '&:hover': {
                    bgcolor: 'white',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.35)',
                  }
                }}
              >
                Explore This Book
              </Button>
            </Box>
          </BookContent>

          {/* Book Cover */}
          <Box
            component={motion.div}
            whileHover="hover"
            sx={{
              position: 'absolute',
              right: isMobile ? -140 : isTablet ? -100 : 80,
              bottom: isMobile ? -30 : 40,
              width: isMobile ? 180 : isTablet ? 230 : 280,
              height: isMobile ? 270 : isTablet ? 350 : 420,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }}
          >
            <Box
              component={motion.div}
              variants={coverVariants}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-15deg)',
              }}
            >
              <Box
                component="img"
                src={`/images/${books[currentIndex].cover_image || 'default-cover.jpg'}`}
                alt={books[currentIndex].title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
        </BookCard>
      </AnimatePresence>

      {/* Pagination Dots */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
        }}
      >
        {books.map((_, index) => (
          <Box
            key={index}
            component={motion.div}
            animate={{ 
              scale: currentIndex === index ? 1.2 : 1,
              opacity: currentIndex === index ? 1 : 0.5,
            }}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </Box>
    </SliderContainer>
  );
};

export default BookSlider; 