
function Keyboard({
  onLetter,
  onEnter,
  onDelete,
  keyStatuses
}) {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
  ];

  function handleClick(key) {
    if (key === "ENTER") {
      onEnter();
    } else if (key === "DELETE") {
      onDelete();
    } else {
      onLetter(key);
    }
  }

  return (
    <div className="keyboard">
      {keys.map((row, index) => (
        <div className="key-row" key={index}>
          {row.map((key) => (
            <button
              key={key}
              className={`key ${
                key === "ENTER" || key === "DELETE"
                  ? "wide-key"
                  : ""
              } ${keyStatuses[key] || ""}`}
              onClick={() => handleClick(key)}
            >
              {key === "DELETE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
