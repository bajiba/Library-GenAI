import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ChatSupport from './components/ChatSupport';

// Pages
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import BookSearch from './components/BookSearch';
import BookDetail from './components/BookDetail';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import AIRecommendations from './components/AIRecommendations';

// Context for dark mode
export const ColorModeContext = React.createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

function App() {
  const [user, setUser] = useState(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');
  
  // Set initial theme mode based on user preference if not set
  useEffect(() => {
    if (!localStorage.getItem('themeMode')) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);
  
  // Save theme mode to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('libraryUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Color mode context
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );
  
  // Dynamic theme based on color mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1565c0' : '#90caf9',
            light: mode === 'light' ? '#5e92f3' : '#c3fdff',
            dark: mode === 'light' ? '#003c8f' : '#5d99c6',
            contrastText: '#ffffff',
          },
          secondary: {
            main: mode === 'light' ? '#7c4dff' : '#ce93d8',
            light: mode === 'light' ? '#b47cff' : '#ffc4ff',
            dark: mode === 'light' ? '#3f1dcb' : '#9c64a6',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light' ? '#f8f9fa' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.01562em',
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 500,
            letterSpacing: '-0.00833em',
          },
          h3: {
            fontSize: '1.5rem',
            fontWeight: 500,
            letterSpacing: '0em',
          },
          h4: {
            fontSize: '1.25rem',
            fontWeight: 500,
            letterSpacing: '0.00735em',
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 28,
                padding: '8px 24px',
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                borderRadius: 16,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [mode],
  );
  
  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('libraryUser', JSON.stringify(userData));
  };
  
  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('libraryUser');
  };
  
  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <CssBaseline />
          <Header user={user} onLogout={handleLogout} />
          <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookSearch />} />
              <Route path="/books/:id" element={<BookDetail user={user} />} />
              <Route path="/recommendations" element={
                <ProtectedRoute>
                  <AIRecommendations user={user} />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard user={user} />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin', 'librarian']}>
                  <AdminDashboard user={user} />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
          <Footer />
          
          {/* Chat Support */}
          <ChatSupport user={user} />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App; 