import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { ScrollPanel } from 'primereact/scrollpanel';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const secretKey = 'your-secret-key';

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const App = () => {
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
  const [isNewGame, setIsNewGame] = useState(() => {
    const storedGuesses = JSON.parse(localStorage.getItem('guesses'));
    return !storedGuesses || storedGuesses.length === 0;
  });

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
    <div className="app">
      <h1>Sayı Tahmin Oyunu</h1>
      {isNewGame ? (
        <>
          <Message severity="warn" text="Dikkat! 'Yeni Oyun Başlat' butonuna basmadığınız sürece eski oyuna devam edersiniz. (Doğru cevabı bulsanız bile 😉)" />
          <Button label="Yeni Oyun Başlat" onClick={handleNewGame} />
        </>
      ) : (
        <Button label="Oyunu Aç" onClick={handleShowModal} />
      )}
      <Message severity="info" text={message} />
      <Dialog header="Sayı Tahmin Oyunu" visible={showModal} onHide={() => setShowModal(false)}>
        <div className="modal-content">
          <InputText type="text" value={guess} onChange={(e) => setGuess(e.target.value)} />
          <Button label="Tahmin Et" onClick={handleGuess} />
          <h2>Tahminleriniz:</h2>
          <ScrollPanel style={{ height: '200px' }}>
            <ul>
              {guesses.map((guess, index) => (
                <li key={index}>{guess}</li>
              ))}
            </ul>
          </ScrollPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default App;
