import "./App.css";
import Alert from "./components/Alert";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import React, { useEffect, useState } from "react";
import {
  fetchSecretWord,
  isGameOver,
  isHardModeWord,
  isInWordList,
} from "./utils";
import { MAX_NUM_GUESSES, WORD_LENGTH } from "./constants/constants";
import Toggle from "./components/Toggle";

function App() {
  const secretWord = useState(fetchSecretWord())[0];
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertShouldFade, setAlertShouldFade] = useState(true);
  const [isHardModeOn, setIsHardModeOn] = useState(true);

  const onKeyDown = (e) => {
    return onKeyboardInput(e.key);
  };

  const onKeyboardInput = (key) => {
    if (isGameOver(guesses, secretWord)) {
      return;
    }
    const isLetter =
      key.length === 1 && key.toLowerCase() !== key.toUpperCase();
    key = key.toLowerCase();
    if (isLetter) {
      onLetter(key);
    } else if (key === "enter") {
      onEnter();
    } else if (["backspace", "🔙"].includes(key)) {
      onBackspace();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  const onLetter = (key) => {
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const onBackspace = () => {
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const onEnter = () => {
    if (currentGuess.length < WORD_LENGTH) {
      // TODO: shake the row
      setAlertText("Not enough letters");
      setIsAlertVisible(true);
      return;
    }
    if (!isInWordList(currentGuess)) {
      // TODO: shake the row
      setAlertText("Not in word list");
      setIsAlertVisible(true);
      return;
    }
    if (isHardModeOn && !isHardModeWord(guesses, currentGuess, secretWord)) {
      setAlertText("Doesn't contain correctly guessed letters");
      setIsAlertVisible(true);
      return;
    }
    const isSecretWord = currentGuess === secretWord;
    const isGameLost = !isSecretWord && guesses.length + 1 === MAX_NUM_GUESSES;
    setGuesses([...guesses, currentGuess]);
    setCurrentGuess("");
    if (isSecretWord) {
      setAlertText("You win!");
      setIsAlertVisible(true);
      setAlertShouldFade(false);
      return;
    }
    if (isGameLost) {
      setAlertText(secretWord);
      setIsAlertVisible(true);
      setAlertShouldFade(false);
    }
  };

  const dismissAlert = () => {
    setIsAlertVisible(false);
  };

  const onKeyClick = (e) => {
    onKeyboardInput(e.target.textContent);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="title">Wordle</div>
      </header>
      <Alert
        {...{ isAlertVisible, alertText, dismissAlert, alertShouldFade }}
      />
      <Board {...{ guesses, secretWord, currentGuess }} />
      <Keyboard {...{ guesses, secretWord, onCellClick: onKeyClick }} />
      <Toggle {...{ isHardModeOn, setIsHardModeOn }} />
    </div>
  );
}

export default App;
