import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import Game from './components/Game';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/character-select" element={<CharacterSelect />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;