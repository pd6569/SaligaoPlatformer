import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Grid 
} from '@mui/material';
import { characters } from '../game/characters';

const CharacterSelect = () => {
  const navigate = useNavigate();

  const handleCharacterSelect = (character) => {
    navigate('/game');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Choose Your Ancestor
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(characters).map(([id, character]) => (
          <Grid item xs={12} sm={6} key={id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="/assets/sprites/placeholder-character.png"
                alt={character.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {character.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Special Abilities: {character.abilities.join(', ')}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleCharacterSelect(character)}
                >
                  Select Character
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CharacterSelect;