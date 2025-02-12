import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';

const MainMenu = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Saligao Adventures
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/character-select')}
          >
            Start Game
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default MainMenu;