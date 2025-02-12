import React from 'react';
import { Link } from 'react-router-dom';

const MainMenu = () => {
  return (
    <div className="main-menu">
      <h1>Saligao Adventures</h1>
      <nav>
        <Link to="/character-select">Start Game</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
    </div>
  );
};

export default MainMenu;
