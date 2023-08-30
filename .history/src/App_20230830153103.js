import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key';

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const Game = () => {
  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  const [numberToGuess, setNumberToGuess] = useState(() => {
    const storedNumber = localStorage.getItem('numberToGuess');
    return storedNumber ? decryptData(storedNumber) : generateRandomNumber();
  });

  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState(() => {
    const storedGuesses = JSON.parse(localStorage.getItem('guesses'));
    return storedGuesses || [];
  });

  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isNewGame, setIsNewGame] = useState(false);

  useEffect(() => {
    localStorage.setItem('numberToGuess', encryptData(numberToGuess));
  }, [numberToGuess]);

  useEffect(() => {
    localStorage.setItem('guesses', JSON.stringify(guesses));
  }, [guesses]);

  const handleShowModal = () => {
    setIsNewGame(true);
    setShowModal(true);
  };

  const handleGuess = () => {
    const parsedGuess = parseInt(guess, 10);
    if (isNaN(parsedGuess)) {
      setMessage('Lütfen bir sayı girin.');
    } else {
      const updatedGuesses = [...guesses, parsedGuess];
      setGuesses(updatedGuesses);
      if (parsedGuess === numberToGuess) {
        setMessage('Tebrikler! Doğru tahmin ettiniz.');
        setGuess('');
        if (!isNewGame) {
          setShowModal(true);
        }
      } else if (parsedGuess < numberToGuess) {
        setMessage('Daha büyük bir sayı deneyin.');
        setGuess('');
      } else {
        setMessage('Daha küçük bir sayı deneyin.');
        setGuess('');
      }
    }
  };

  const handleNewGame = () => {
    setNumberToGuess(generateRandomNumber());
    setGuess('');
    setGuesses([]);
    setMessage('');
    setShowModal(false);
    setIsNewGame(false);
  };

  return (
    <div>
      <h1>Sayı Tahmin Oyunu</h1>
      {isNewGame ? (
        <>
          <p>Oyuna yeni başlandı!</p>
          <button onClick={handleNewGame}>Yeni Oyun Başlat</button>
        </>
      ) : (
        <button onClick={handleShowModal}>Oyunu Aç</button>
      )}
      <p>{message}</p>
      {showModal && (
        <div className="modal">
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
        </div>
      )}
    </div>
  );
};

export default Game;
