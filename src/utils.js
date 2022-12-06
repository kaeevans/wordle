import {
  KEYBOARD,
  MAX_NUM_GUESSES,
  MILLIS_IN_DAY,
  START_DATE,
  WORD_LENGTH,
} from "./constants/constants";
import { ALLOWED_GUESSES } from "./constants/allowedGuesses";
import { SECRET_WORDS } from "./constants/secretWords";

export function fetchSecretWord() {
  const daysSinceStart = Math.floor((Date.now() - START_DATE) / MILLIS_IN_DAY);
  const index = daysSinceStart % SECRET_WORDS.length;
  return SECRET_WORDS[index];
}

export function isInWordList(word) {
  return ALLOWED_GUESSES.includes(word) || SECRET_WORDS.includes(word);
}

export function generateKeyboard(guesses, secretWord) {
  const keyColors = computeColorStatesForKeys(guesses, secretWord);
  return Array(KEYBOARD.length)
    .fill(null)
    .map((row, i) => {
      return Array(KEYBOARD[i].length)
        .fill(null)
        .map((key, j) => {
          const value = KEYBOARD[i][j];
          const colorState = value in keyColors ? keyColors[value] : null;
          let className = "key";
          if (["enter", "🔙"].includes(value)) {
            className = `${className} ${value}`;
          }
          return { value, colorState, className };
        });
    });
}

function computeColorStatesForKeys(guesses, secretWord) {
  const guessedChars = {};
  for (let guess of guesses) {
    for (let char of guess) {
      guessedChars[char] = secretWord.includes(char) ? "present" : "absent";
    }
  }
  for (let guess of guesses) {
    for (let i in guess) {
      const char = guess[i];
      guessedChars[char] =
        secretWord[i] === char ? "correct" : guessedChars[char];
    }
  }
  return guessedChars;
}

export function generateBoard(guesses, secretWord, currentGuess) {
  const board = Array(MAX_NUM_GUESSES)
    .fill(null)
    .map((row, i) => {
      const colorStates = compareGuessToSecretWord(
        guesses[i] || "",
        secretWord
      );
      return Array(WORD_LENGTH)
        .fill(null)
        .map((col, j) => {
          const value = guesses[i] ? guesses[i][j] : null;
          const colorState = colorStates[j] || null;
          return { value, colorState };
        });
    });
  // Add the currentGuess to the board.
  if (guesses.length < MAX_NUM_GUESSES) {
    for (let i = 0; i < currentGuess.length; i++) {
      board[guesses.length][i].value = currentGuess[i];
    }
  }
  return board;
}

// TODO: fix bug: If the secret word is HEATH, and you guess HHAAA (or some other word with 2 H's where one is in the wrong location), the second H should be marked as "present", but it is being marked as absent.
export function compareGuessToSecretWord(guess, secretWord) {
  const out = Array(WORD_LENGTH);
  const correctOccurances = {};
  for (let i = 0; i < guess.length; i++) {
    const char = guess[i];
    if (char === secretWord[i]) {
      correctOccurances[char] = correctOccurances[char] + 1 || 1;
    }
  }
  for (let i = 0; i < guess.length; i++) {
    const char = guess[i];
    if (char === secretWord[i]) {
      out[i] = "correct";
    } else if (!secretWord.includes(char)) {
      out[i] = "absent";
    } else {
      const numOccurancesofCharInGuessThusFar = (
        guess.substring(0, i + 1).match(new RegExp(char, "g")) || []
      ).length;
      const numOccurancesOfCharInSecretWord = (
        secretWord.match(new RegExp(char, "g")) || []
      ).length;
      const numCorrectOccurancesOfCharInGuess =
        correctOccurances[guess[i]] || 0;
      if (
        numOccurancesofCharInGuessThusFar <=
        numOccurancesOfCharInSecretWord - numCorrectOccurancesOfCharInGuess
      ) {
        out[i] = "present";
      } else {
        out[i] = "absent";
      }
    }
  }
  return out;
}

export function isHardModeWord(guesses, currentGuess, secretWord) {
  if (guesses.length !== 0) {
    const lastGuess = guesses[guesses.length - 1];
    const comparison = compareGuessToSecretWord(lastGuess, secretWord);
    let presentOrCorrectLetters = {};
    for (let i = 0; i < comparison.length; i++) {
      const c = comparison[i];
      if (c === "correct" && currentGuess[i] !== lastGuess[i]) {
        return false;
      }
      if (c === "present" || c === "correct") {
        if (!(lastGuess[i] in presentOrCorrectLetters)) {
          presentOrCorrectLetters[lastGuess[i]] = 0;
        }
        presentOrCorrectLetters[lastGuess[i]] += 1;
      }
    }
    for (let i = 0; i < currentGuess.length; i++) {
      if (currentGuess[i] in presentOrCorrectLetters) {
        presentOrCorrectLetters[currentGuess[i]] -= 1;
      }
    }
    for (let k in presentOrCorrectLetters) {
      if (presentOrCorrectLetters[k] !== 0) {
        return false;
      }
    }
  }
  return true;
}

export function isGameOver(guesses, secretWord) {
  return (
    guesses[guesses.length - 1] === secretWord ||
    guesses.length === MAX_NUM_GUESSES
  );
}
