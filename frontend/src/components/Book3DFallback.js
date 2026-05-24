import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

// A simple 2D fallback for when 3D rendering isn't working
const Book3DFallback = ({ 
  title = 'Book Title', 
  author = 'Author Name',
  color = '#1565c0',
  height = 400,
  width = '100%'
}) => {
  return (
    <Box 
      component={motion.div}
      initial={{ rotateY: -20 }}
      animate={{ 
        rotateY: [-15, 15, -15],
        y: [0, -10, 0]
      }}
      transition={{ 
        rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{ 
        width, 
        height, 
        perspective: '1000px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: '80%',
          height: '90%',
          backgroundColor: color,
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.1) inset',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '5%',
            width: '90%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0), rgba(255,255,255,0.1))',
            filter: 'blur(5px)',
          }
        }}
      >
        <Typography 
          variant="h5" 
          component={motion.h2}
          whileHover={{ scale: 1.05 }}
          textAlign="center" 
          px={3} 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)' 
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ mt: 2, width: '40%', height: '1px', bgcolor: 'rgba(255,255,255,0.5)' }} />
        
        <Typography 
          variant="body1" 
          textAlign="center" 
          mt={2} 
          sx={{ 
            fontStyle: 'italic',
            opacity: 0.8,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)' 
          }}
        >
          by {author}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Book3DFallback; 