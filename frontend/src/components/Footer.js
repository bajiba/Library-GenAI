import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      py: 3, 
      px: 2, 
      mt: 'auto', 
      backgroundColor: (theme) => theme.palette.grey[100] 
    }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Smart Library System with AI - '}
          <Link color="inherit" href="/">
            Powered by Gemini LLM
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 