import React, { useState, useEffect } from 'react';

const Game = () => {
  const generateRandomNumber = () => Math.floor(Math.random() * 100) + 1;

  const [numberToGuess, setNumberToGuess] = useState(generateRandomNumber());
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Yeni oyuna başlama işlemini kontrol etmek için bir state eklenir.
  const [isNewGame, setIsNewGame] = useState(false);

  useEffect(() => {
    const storedGuesses = JSON.parse(localStorage.getItem('guesses'));
    if (storedGuesses) {
      setGuesses(storedGuesses);
    }
    // Sayfa yenilendiğinde veya tarayıcı kapatılıp açıldığında oyun kaldığı yerden devam eder.
    const storedNumber = JSON.parse(localStorage.getItem('numberToGuess'));
    if (storedNumber) {
      setNumberToGuess(storedNumber);
    }
  }, []);

  useEffect(() => {
    // guesses state'i güncellendiğinde localStorage güncellenir.
    localStorage.setItem('guesses', JSON.stringify(guesses));
  }, [guesses]);

  useEffect(() => {
    // numberToGuess state'i güncellendiğinde localStorage güncellenir.
    localStorage.setItem('numberToGuess', JSON.stringify(numberToGuess));
  }, [numberToGuess]);

  const handleShowModal = () => {
    // Yeni oyun başladığında isNewGame true olarak güncellenir.
    setIsNewGame(true);
    setShowModal(true);
  };

  const handleGuess = () => {
    const parsedGuess = parseInt(guess, 10);
    if (isNaN(parsedGuess)) {
      setMessage('Lütfen bir sayı girin.');
    } else {
      setGuesses([...guesses, parsedGuess]);
      if (parsedGuess === numberToGuess) {
        setMessage('Tebrikler! Doğru tahmin ettiniz.');
        setGuess('');
        // Eğer yeni bir oyun başlamadıysa, kazandıktan sonra oyun yeniden başlamaz.
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
    // Yeni bir oyun başladığında gerekli state'leri günceller.
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
        <button onClick={handleShowModal}>Yeni Oyun</button>
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
