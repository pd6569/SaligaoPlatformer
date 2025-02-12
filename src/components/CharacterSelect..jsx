import React from 'react';
import { useNavigate } from 'react-router-dom';
import { characters } from '../game/characters';

const CharacterSelect = () => {
  const navigate = useNavigate();

  const handleCharacterSelect = (character) => {
    // Store selected character in state/context
    navigate('/game');
  };

  return (
    <div className="character-select">
      <h2>Choose Your Ancestor</h2>
      <div className="character-grid">
        {Object.entries(characters).map(([id, character]) => (
          <div
            key={id}
            className="character-card"
            onClick={() => handleCharacterSelect(character)}
          >
            <h3>{character.name}</h3>
            <p>Special Ability: {character.abilities.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelect;