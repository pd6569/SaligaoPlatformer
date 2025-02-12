import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import CharacterSelect from './components/CharacterSelect';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/character-select" element={<CharacterSelect />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;