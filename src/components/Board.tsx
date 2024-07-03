import { BoardShape } from "../types";
import Cell from "./Cell";

// Defines the props expected by the Board component
interface BoardProps {
  currentBoard: BoardShape; // The current state of the game board
}

// Functional component to render the game board
function Board({ currentBoard }: BoardProps) {
  return (
    // Renders the board as a div element
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        // Maps each row to a div element, using rowIndex as the key
        <div className="row" key={`${rowIndex}`}>
          {row.map((cell, colIndex) => (
            // Maps each cell in the row to a Cell component, using a combination of rowIndex and colIndex as the key
            <Cell key={`${rowIndex}-${colIndex}`} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
