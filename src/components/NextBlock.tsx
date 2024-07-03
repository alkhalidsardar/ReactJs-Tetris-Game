// Import necessary types and constants from the types module
import { Block, SHAPES } from "../types";

// Define the props for the NextBlock component
interface NextBlockProps {
  // upcomingBlock is either a Block or null
  upcomingBlock: Block | null;
}

// Define the NextBlock functional component
function NextBlock({ upcomingBlock }: NextBlockProps) {
  // If there is an upcoming block, get its shape and filter out empty rows.
  // Otherwise, set shape to an empty array.
  const shape = upcomingBlock ? SHAPES[upcomingBlock].shape.filter((row) => row.some((cell) => cell)) : [];

  return (
    <div className="nextBlock">
      {/* Display the title for the next block */}
      <h2>Incoming Piece</h2>
      <div>
        {/* Iterate over each row in the shape */}
        {shape.map((row, rowIndex) => {
          return (
            // Each row is a div with a key to help React identify elements
            <div key={rowIndex} className="row">
              {/* Iterate over each cell in the row */}
              {row.map((isSet, cellIndex) => {
                // Determine the class of the cell based on whether it is set or hidden
                const cellClass = isSet ? upcomingBlock : "hidden";
                // Return a div for each cell with a unique key
                return <div key={`${rowIndex}-${cellIndex}`} className={`cell ${cellClass}`} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Export the NextBlock component as the default export
export default NextBlock;
