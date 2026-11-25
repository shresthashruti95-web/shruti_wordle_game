
import Row from "./Row";

function GameBoard({ pastGuesses, currentGuess, answer }) {
  return (
    <div className="gameboard">
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const submitted = index < pastGuesses.length;

        const word = submitted
          ? pastGuesses[index]
          : index === pastGuesses.length
          ? currentGuess
          : "";

        return (
          <Row
            key={index}
            word={word}
            answer={answer}
            submitted={submitted}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;
