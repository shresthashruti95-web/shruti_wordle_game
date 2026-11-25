
import { useState, useEffect } from "react";

import GameBoard from "./components/wordlecomponent/Gameboard";
import Keyboard from "./components/wordlecomponent/Keyboard";

import "./App.css";

function App() {

  // The word students need to guess
  const [solutionWord] = useState("REACT");

  // Current word being typed
  const [currentGuess, setCurrentGuess] = useState("");

  // Previously submitted guesses
  const [pastGuesses, setPastGuesses] = useState([]);

  // Game status: IN_PROGRESS, WON, or LOST
  const [gameStatus, setGameStatus] = useState("IN_PROGRESS");

  // Message for invalid words
  const [message, setMessage] = useState("");

  // Prevent multiple submissions while checking a word
  const [isChecking, setIsChecking] = useState(false);


  // Add a letter to the current guess
  function addLetter(letter) {
    if (gameStatus !== "IN_PROGRESS" || isChecking) return;

    if (currentGuess.length < 5) {
      setCurrentGuess((previous) => previous + letter);
      setMessage("");
    }
  }


  // Delete the last letter
  function deleteLetter() {
    if (gameStatus !== "IN_PROGRESS" || isChecking) return;

    setCurrentGuess((previous) => previous.slice(0, -1));
    setMessage("");
  }


  // Check whether the entered word exists
  async function checkGuess() {
    if (gameStatus !== "IN_PROGRESS" || isChecking) return;

    if (currentGuess.length !== 5) {
      setMessage("Please enter a five-letter word!");
      return;
    }

    setIsChecking(true);
    setMessage("");

    try {
      // Check the word using an English dictionary API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess.toLowerCase()}`
      );

      // If the word does not exist
      if (!response.ok) {
        setMessage("Word doesn't exist! Try another word.");
        return;
      }

      // If the word exists, submit the guess
      const newGuesses = [...pastGuesses, currentGuess];

      setPastGuesses(newGuesses);
      setCurrentGuess("");

      if (currentGuess === solutionWord) {
        setGameStatus("WON");
      } else if (newGuesses.length === 6) {
        setGameStatus("LOST");
      }

    } catch (error) {
      setMessage("Unable to check the word. Please check your internet connection.");
    } finally {
      setIsChecking(false);
    }
  }


  // Support physical keyboard input
  useEffect(() => {
    function handleKeyDown(event) {
      if (gameStatus !== "IN_PROGRESS" || isChecking) return;

      if (event.key === "Enter") {
        checkGuess();
      } else if (event.key === "Backspace") {
        deleteLetter();
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        addLetter(event.key.toUpperCase());
      }
    }

    window.addEventListener("keydown", handleKeyDown);
//Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, pastGuesses, gameStatus, isChecking]);


  // Restart the game
  function restartGame() {
    setCurrentGuess("");
    setPastGuesses([]);
    setGameStatus("IN_PROGRESS");
    setMessage("");
    setIsChecking(false);
  }


  // Determine keyboard letter colors
  const keyStatuses = {};

  pastGuesses.forEach((guess) => {
    [...guess].forEach((letter, index) => {
      if (letter === solutionWord[index]) {
        keyStatuses[letter] = "correct";
      } else if (
        solutionWord.includes(letter) &&
        keyStatuses[letter] !== "correct"
      ) {
        keyStatuses[letter] = "present";
      } else if (
        !solutionWord.includes(letter) &&
        !keyStatuses[letter]
      ) {
        keyStatuses[letter] = "absent";
      }
    });
  });


  return (
    <div className="game">

      <h1>WORDLE</h1>

      <p className="subtitle">
        Guess the hidden five-letter word!
      </p>

      <GameBoard
        pastGuesses={pastGuesses}
        currentGuess={currentGuess}
        answer={solutionWord}
      />

      {/* Display messages */}
      {message && (
        <p className="message">{message}</p>
      )}

      {isChecking && (
        <p className="message">Checking word...</p>
      )}

      {gameStatus === "WON" && (
        <h2 className="result">You Won! 🎉</h2>
      )}

      {gameStatus === "LOST" && (
        <h2 className="result">
          Game Over! The word was {solutionWord}.
        </h2>
      )}

      {gameStatus === "IN_PROGRESS" && (
        <Keyboard
          onLetter={addLetter}
          onEnter={checkGuess}
          onDelete={deleteLetter}
          keyStatuses={keyStatuses}
        />
      )}

      {gameStatus !== "IN_PROGRESS" && (
        <button className="restart" onClick={restartGame}>
          Play Again
        </button>
      )}

      <p className="attempts">
        Attempts: {pastGuesses.length}/6
      </p>

    </div>
  );
}

export default App;
