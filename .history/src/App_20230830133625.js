import React, { useState, useEffect } from 'react';



const Game = () => {

  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  const [numberToGuess, setNumberToGuess] = useState(generateRandomNumber());
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedGuesses = JSON.parse(localStorage.getItem('guesses'));
    if (storedGuesses) {
      setGuesses(storedGuesses);
    }
  }, []);

  

  const handleGuess = () => {
    const parsedGuess = parseInt(guess, 10);
    if (isNaN(parsedGuess)) {
      setMessage('Lütfen bir sayı girin.');
    } else {
      setGuesses([...guesses, parsedGuess]);
      if (parsedGuess === numberToGuess) {
        setMessage('Tebrikler! Doğru tahmin ettiniz.');
        setNumberToGuess(generateRandomNumber());
        setGuess('');
      } else if (parsedGuess < numberToGuess) {
        setMessage('Daha büyük bir sayı deneyin.');
        setGuess('');
      } else {
        setMessage('Daha küçük bir sayı deneyin.');
        setGuess('');
      }
    }
    localStorage.setItem('guesses', JSON.stringify(guesses));
  };

  return (
    <div>
      <h1>Sayı Tahmin Oyunu</h1>
      <button onClick={handleShowModal}>Yeni Oyun</button>
      <p>{message}</p>
      {showModal && (
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button onClick={handleGuess}>Tahmin Et</button>
      <h2>Tahminleriniz:</h2>
      <ul>
        {guesses.map((guess, index) => (
          <li key={index}>{guess}</li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default Game;
