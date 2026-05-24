import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Fab,
  Avatar,
  Badge,
  Divider,
  CircularProgress,
  useTheme,
  Zoom,
  Slide,
  Collapse,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { aiApi } from '../services/api';

// Styled components
const MotionFab = motion(Fab);

const ChatSupport = ({ user }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [agentMode, setAgentMode] = useState('ai'); // 'ai' or 'human'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Initial messages from the system
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: 'system',
        text: 'Welcome to Smart Library chat support! How can I help you today?',
        timestamp: new Date(),
      },
      {
        id: 2,
        sender: 'system',
        text: 'You can ask me about finding books, account information, borrowing policies, or library services.',
        timestamp: new Date(Date.now() + 100),
      }
    ]);
  }, []);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);
  
  // Set predefined messages that will be answered
  const aiResponses = {
    borrowPolicy: "Our borrowing policy allows you to borrow up to 5 books for 14 days. You can renew books twice if no one else has requested them. Late returns incur a fee of $0.50 per day.",
    hours: "The library is open Monday to Friday from 9 AM to 8 PM, Saturday from 10 AM to 6 PM, and Sunday from 12 PM to 5 PM.",
    returns: "You can return books at the front desk during library hours or use the drop box outside the building for after-hours returns.",
    account: "You can manage your account by logging in and going to the Dashboard section. There you can see your borrowed books, due dates, and account information.",
    recommendations: "Our AI recommendation system analyzes your reading history and preferences to suggest books you might enjoy. You can find this feature in the 'AI Recommendations' section after logging in."
  };
  
  // Helper to get a smart response based on the message
  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("borrow") || lowerQuestion.includes("loan") || lowerQuestion.includes("policy")) {
      return aiResponses.borrowPolicy;
    } else if (lowerQuestion.includes("hour") || lowerQuestion.includes("open") || lowerQuestion.includes("time")) {
      return aiResponses.hours;
    } else if (lowerQuestion.includes("return") || lowerQuestion.includes("drop")) {
      return aiResponses.returns;
    } else if (lowerQuestion.includes("account") || lowerQuestion.includes("login") || lowerQuestion.includes("dashboard")) {
      return aiResponses.account;
    } else if (lowerQuestion.includes("recommendation") || lowerQuestion.includes("suggest") || lowerQuestion.includes("ai")) {
      return aiResponses.recommendations;
    } else {
      return "I'm sorry, I don't have specific information about that. Would you like to speak with a human librarian? You can switch to human support using the button at the top of the chat.";
    }
  };
  
  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setHasNewMessage(false);
    }
  };
  
  // Minimize chat
  const minimizeChat = () => {
    setIsMinimized(true);
  };
  
  // Restore chat
  const restoreChat = () => {
    setIsMinimized(false);
    setHasNewMessage(false);
  };
  
  // Toggle between AI and human support
  const toggleAgentMode = () => {
    const newMode = agentMode === 'ai' ? 'human' : 'ai';
    setAgentMode(newMode);
    
    // Add a system message about the change
    setMessages(prev => [
      ...prev, 
      {
        id: Date.now(),
        sender: 'system',
        text: newMode === 'ai' 
          ? 'Switched to AI assistant. How can I help you?' 
          : 'Connecting you with a human librarian. A staff member will respond shortly.',
        timestamp: new Date()
      }
    ]);
    
    // If switching to human, simulate a delayed response
    if (newMode === 'human') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'human-agent',
            text: "Hi there! I'm Sarah, a librarian. How can I assist you today?",
            timestamp: new Date()
          }
        ]);
      }, 3000);
    }
  };
  
  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  // Send a message
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    
    // Simulate AI/human response with a delay
    setTimeout(async () => {
      try {
        let responseText;
        
        if (agentMode === 'ai') {
          // Use the helper function to get a relevant response
          responseText = getAIResponse(userMessage.text);
        } else {
          // If in human mode, simulate a human response
          responseText = "Thank you for your question. I'll look into this and get back to you shortly. Is there anything else you'd like to know about our library services?";
        }
        
        // Add the response
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: agentMode === 'ai' ? 'ai-agent' : 'human-agent',
            text: responseText,
            timestamp: new Date()
          }
        ]);
        
        // If chat is minimized, show notification
        if (isMinimized) {
          setHasNewMessage(true);
        }
      } catch (err) {
        console.error('Error getting chat response:', err);
        
        // Add error message
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'system',
            text: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date()
          }
        ]);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };
  
  // Send message on Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };
  
  // Render message bubble
  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    const isAi = message.sender === 'ai-agent';
    const isHuman = message.sender === 'human-agent';
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          mb: 2,
          maxWidth: '100%'
        }}
      >
        {!isUser && !isSystem && (
          <Avatar
            sx={{
              bgcolor: isAi ? 'secondary.main' : 'success.main',
              width: 32,
              height: 32,
              mr: 1
            }}
          >
            {isAi ? <SmartToyIcon fontSize="small" /> : <SupportAgentIcon fontSize="small" />}
          </Avatar>
        )}
        
        <Box
          sx={{
            maxWidth: '75%',
            p: 1.5,
            borderRadius: 2,
            bgcolor: isUser 
              ? 'primary.main' 
              : isSystem 
                ? 'grey.100' 
                : theme.palette.mode === 'dark' 
                  ? 'grey.800' 
                  : 'grey.200',
            color: isUser ? 'white' : 'text.primary',
            position: 'relative',
            boxShadow: 1,
            ...(isAi && {
              borderLeft: 3,
              borderColor: 'secondary.main'
            }),
            ...(isHuman && {
              borderLeft: 3,
              borderColor: 'success.main'
            }),
            ...(isSystem && {
              borderLeft: 3,
              borderColor: 'info.main',
              fontStyle: 'italic',
              maxWidth: '90%',
              mx: 'auto',
              textAlign: 'center'
            })
          }}
        >
          {isAi && (
            <Box
              component={AutoAwesomeIcon}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                color: 'secondary.main',
                fontSize: 16,
              }}
            />
          )}
          
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {message.text}
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              textAlign: isUser ? 'left' : 'right',
              mt: 0.5,
              opacity: 0.7
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </Box>
        
        {isUser && (
          <Avatar
            sx={{
              bgcolor: 'primary.dark',
              width: 32,
              height: 32,
              ml: 1
            }}
          >
            {user ? user.username?.charAt(0).toUpperCase() : <PersonIcon fontSize="small" />}
          </Avatar>
        )}
      </Box>
    );
  };
  
  return (
    <>
      {/* Chat Bubble Button */}
      <Box
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 1000
        }}
      >
        <Badge
          color="error"
          variant="dot"
          invisible={!hasNewMessage}
          overlap="circular"
        >
          <MotionFab
            color="primary"
            onClick={toggleChat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ChatIcon />
          </MotionFab>
        </Badge>
      </Box>
      
      {/* Chat Window */}
      <Zoom in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: 350,
            height: isMinimized ? 'auto' : 450,
            maxHeight: '80vh',
            zIndex: 999,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChatIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Library Support
              </Typography>
            </Box>
            
            <Box>
              {isMinimized ? (
                <IconButton size="small" color="inherit" onClick={restoreChat}>
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={!hasNewMessage}
                  >
                    <ChatIcon fontSize="small" />
                  </Badge>
                </IconButton>
              ) : (
                <>
                  <IconButton 
                    size="small" 
                    color="inherit" 
                    onClick={toggleAgentMode}
                    sx={{ mr: 0.5 }}
                  >
                    {agentMode === 'ai' ? (
                      <SupportAgentIcon fontSize="small" />
                    ) : (
                      <SmartToyIcon fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="inherit" 
                    onClick={minimizeChat}
                    sx={{ mr: 0.5 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>—</Typography>
                  </IconButton>
                  <IconButton size="small" color="inherit" onClick={toggleChat}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
          
          {/* Mode indicator */}
          <Collapse in={!isMinimized}>
            <Box 
              sx={{ 
                bgcolor: agentMode === 'ai' ? 'secondary.main' : 'success.main',
                color: 'white',
                py: 0.5,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {agentMode === 'ai' ? (
                  <>
                    <SmartToyIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    AI Assistant
                  </>
                ) : (
                  <>
                    <SupportAgentIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Human Support
                  </>
                )}
              </Typography>
              
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={toggleAgentMode}
                sx={{ 
                  py: 0,
                  minWidth: 0,
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <Typography variant="caption">
                  Switch to {agentMode === 'ai' ? 'Human' : 'AI'}
                </Typography>
              </Button>
            </Box>
          </Collapse>
          
          <Collapse in={!isMinimized} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <Box
              sx={{
                p: 2,
                overflowY: 'auto',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {messages.map(message => renderMessage(message))}
              
              {loading && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    alignSelf: 'flex-start',
                    my: 1 
                  }}
                >
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {agentMode === 'ai' ? 'AI thinking...' : 'Librarian typing...'}
                  </Typography>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>
            
            <Divider />
            
            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={message}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                inputRef={inputRef}
                multiline
                maxRows={3}
                sx={{ mr: 1 }}
              />
              <IconButton 
                color="primary" 
                onClick={sendMessage}
                disabled={!message.trim() || loading}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Collapse>
        </Paper>
      </Zoom>
    </>
  );
};

export default ChatSupport; 