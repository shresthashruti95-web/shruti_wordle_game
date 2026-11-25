
import Tile from "./Tile";

function Row({ word, answer, submitted }) {
  const letters = word.split("");

  const statuses = Array(5).fill("");

  if (submitted) {
    const remainingLetters = {};

    // First, identify letters in the correct position
    for (let i = 0; i < 5; i++) {
      if (letters[i] === answer[i]) {
        statuses[i] = "correct";
      } else {
        remainingLetters[answer[i]] =
          (remainingLetters[answer[i]] || 0) + 1;
      }
    }

    // Then, identify letters in the wrong position
    for (let i = 0; i < 5; i++) {
      if (statuses[i] === "correct") continue;

      if (remainingLetters[letters[i]] > 0) {
        statuses[i] = "present";
        remainingLetters[letters[i]]--;
      } else {
        statuses[i] = "absent";
      }
    }
  }

  return (
    <div className="row">
      {[0, 1, 2, 3, 4].map((index) => (
        <Tile
          key={index}
          letter={letters[index] || ""}
          status={statuses[index]}
        />
      ))}
    </div>
  );
}

export default Row;
