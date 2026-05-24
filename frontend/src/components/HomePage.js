import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RecommendIcon from '@mui/icons-material/Recommend';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  height: '85vh',
  minHeight: '600px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  marginBottom: theme.spacing(10),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    padding: theme.spacing(8, 0),
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  background: theme.palette.background.paper,
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
}));

const IconAvatar = styled(Avatar)(({ theme, color }) => ({
  width: 80,
  height: 80,
  background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
  boxShadow: `0 10px 20px ${theme.palette[color].main}40`,
  marginTop: '-40px',
  marginBottom: theme.spacing(2),
}));

const GradientButton = styled(Button)(({ theme, color = 'primary' }) => ({
  background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
  color: '#fff',
  padding: theme.spacing(1.2, 3),
  transition: 'all 0.3s ease',
  borderRadius: '30px',
  fontWeight: 600,
  boxShadow: `0 4px 15px ${theme.palette[color].main}50`,
  '&:hover': {
    boxShadow: `0 8px 25px ${theme.palette[color].main}80`,
    transform: 'translateY(-2px)'
  },
}));

const OutlineGradientButton = styled(Button)(({ theme, color = 'primary' }) => ({
  background: 'transparent',
  border: `2px solid ${theme.palette[color].main}`,
  color: theme.palette[color].main,
  padding: theme.spacing(1.1, 2.9),
  transition: 'all 0.3s ease',
  borderRadius: '30px',
  fontWeight: 600,
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette[color].main}20 0%, ${theme.palette[color].dark}20 100%)`,
    transform: 'translateY(-2px)'
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
  background: theme.palette.background.paper,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -20,
    left: 30,
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  }
}));

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Mock data for stats and testimonials
  const stats = [
    { icon: <MenuBookIcon fontSize="large" color="primary" />, value: '10,000+', label: 'Books' },
    { icon: <PersonIcon fontSize="large" color="secondary" />, value: '5,000+', label: 'Members' },
    { icon: <LocalLibraryIcon fontSize="large" color="info" />, value: '50+', label: 'Collections' },
  ];
  
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Student', quote: 'The AI recommendations completely changed how I discover books. Every suggestion feels tailored to my tastes.' },
    { name: 'Michael Chen', role: 'Professor', quote: 'As an academic, I appreciate the intelligent search capabilities. Finding research material has never been easier.' },
  ];

  return (
    <Box component={motion.div} initial="hidden" animate="visible" variants={fadeIn}>
      {/* Hero Section */}
      <HeroSection>
        <Box 
          component={motion.div}
          sx={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            opacity: 0.1,
            backgroundImage: 'url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} 
              component={motion.div}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.8, ease: "easeOut" }
                }
              }}
            >
              <Typography 
                component={motion.h1} 
                variant={isSmall ? "h3" : "h2"} 
                sx={{ 
                  color: '#fff',
                  fontWeight: 800,
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                Discover Your Next Great Read
              </Typography>
              
              <Typography 
                variant={isSmall ? "body1" : "h6"} 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  maxWidth: 600,
                  lineHeight: 1.6
                }}
              >
                Our smart library system uses AI to connect you with books you'll love. Browse thousands of titles, get personalized recommendations, and join a community of readers.
              </Typography>
              
              <Box component={motion.div} sx={{ mt: 5 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.4, duration: 0.6 }
                  }
                }}
              >
                <Stack direction="row" spacing={3} sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? 2 : 0 }}>
                  <GradientButton 
                    size="large" 
                    component={RouterLink} 
                    to="/books" 
                    endIcon={<ArrowForwardIcon />}
                  >
                    Explore Library
                  </GradientButton>
                  
                  <OutlineGradientButton 
                    size="large" 
                    component={RouterLink} 
                    to="/register"
                    color="secondary"
                  >
                    Join Now
                  </OutlineGradientButton>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} 
              component={motion.div}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { delay: 0.2, duration: 0.8, ease: "easeOut" }
                }
              }}
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <Box 
                component={motion.div}
                sx={{ 
                  position: 'relative', 
                  width: '100%',
                  height: 500,
                }}
                whileHover={{ rotateY: 5, rotateX: -5 }}
              >
                <Box 
                  component={motion.div}
                  animate={{ 
                    y: [0, -15, 0], 
                    rotate: [-1, 1, -1],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '70%',
                    height: '80%',
                    borderRadius: 4,
                    background: 'white',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    transformStyle: 'preserve-3d',
                  }}
                />
                
                <Box 
                  component={motion.div}
                  animate={{ 
                    y: [0, 20, 0], 
                    rotate: [1, -1, 1],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                  sx={{
                    position: 'absolute',
                    top: '30%',
                    right: '5%',
                    width: '60%',
                    height: '70%',
                    borderRadius: 4,
                    background: 'white',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
                    transformStyle: 'preserve-3d',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Grid container spacing={4} justifyContent="center"
          component={motion.div}
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index} component={motion.div} variants={fadeIn}>
              <StatCard>
                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {stat.label}
                </Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}
          component={motion.div}
          variants={fadeIn}
        >
          <Typography variant="overline" component="div" sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 600,
            letterSpacing: 2,
            mb: 1
          }}>
            SMART FEATURES
          </Typography>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 800,
            mb: 2,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Elevate Your Reading Experience
          </Typography>
          <Divider sx={{ 
            width: '80px', 
            mx: 'auto', 
            borderWidth: '3px', 
            borderColor: theme.palette.primary.main,
            borderRadius: '10px',
            my: 3
          }} />
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Our platform combines cutting-edge technology with thoughtfully designed features to make your library experience seamless and enjoyable.
          </Typography>
        </Box>

        <Grid container spacing={6} 
          component={motion.div}
          variants={staggerContainer}
        >
          {/* Feature 1 */}
          <Grid item xs={12} md={4} component={motion.div} variants={fadeIn}>
            <FeatureCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <IconAvatar color="primary">
                  <SearchIcon sx={{ fontSize: 40 }} />
                </IconAvatar>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Intelligent Search
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Find exactly what you're looking for with our powerful search system. Filter by genre, author, topic, or even themes mentioned in reviews.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/books" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 600, mt: 'auto' }}
                >
                  Search Books
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4} component={motion.div} variants={fadeIn}>
            <FeatureCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <IconAvatar color="secondary">
                  <AutoStoriesIcon sx={{ fontSize: 40 }} />
                </IconAvatar>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Digital Bookshelf
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Manage your entire reading life in one place. Track borrowed books, save favorites, and create custom reading lists for future exploration.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 600, mt: 'auto' }}
                >
                  Your Bookshelf
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4} component={motion.div} variants={fadeIn}>
            <FeatureCard>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <IconAvatar color="info">
                  <EmojiObjectsIcon sx={{ fontSize: 40 }} />
                </IconAvatar>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  AI Recommendations
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Discover new favorites with our AI-powered recommendation engine. Get personalized suggestions based on your reading history and preferences.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/recommendations" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 600, mt: 'auto' }}
                >
                  Get Recommendations
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.default', py: 10, mb: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}
            component={motion.div}
            variants={fadeIn}
          >
            <Typography variant="overline" component="div" sx={{ 
              color: theme.palette.secondary.main,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 1
            }}>
              TESTIMONIALS
            </Typography>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
              What Our Users Say
            </Typography>
            <Divider sx={{ 
              width: '80px', 
              mx: 'auto', 
              borderWidth: '3px', 
              borderColor: theme.palette.secondary.main,
              borderRadius: '10px',
              my: 3
            }} />
          </Box>

          <Grid container spacing={4}
            component={motion.div}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index} component={motion.div} variants={fadeIn}>
                <TestimonialCard>
                  <Typography variant="body1" sx={{ 
                    fontStyle: 'italic',
                    mb: 3,
                    fontSize: '1.1rem',
                    lineHeight: 1.6
                  }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      bgcolor: index % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.main,
                      mr: 2
                    }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </TestimonialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            p: 6,
            borderRadius: theme.shape.borderRadius * 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: '0 15px 50px rgba(0,0,0,0.15)',
          }}
          component={motion.div}
          variants={fadeIn}
        >
          <Typography variant="h3" sx={{ 
            color: 'white', 
            fontWeight: 800,
            mb: 2,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Ready to start your reading journey?
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            mb: 4,
            maxWidth: 700,
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Join thousands of readers who have already discovered their next favorite book.
          </Typography>
          <GradientButton
            size="large"
            component={RouterLink}
            to="/register"
            endIcon={<LibraryBooksIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 8px 25px rgba(255,255,255,0.4)'
              }
            }}
          >
            Join Our Library Today
          </GradientButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 