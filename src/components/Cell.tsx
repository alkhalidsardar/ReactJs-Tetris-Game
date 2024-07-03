// Imports the CellOptions type from the "../types" file for type definitions
import { CellOptions } from "../types";

// Defines the props expected by the Cell component, specifically the type of cell
interface CellProps {
  type: CellOptions; // The type of the cell, which determines its styling
}

// Functional component to render a single cell on the board
function Cell({ type }: CellProps) {
  // Returns a div element with a dynamic class name based on the cell type
  // This allows for different styles to be applied depending on the cell type
  return <div className={`cell ${type}`}></div>;
}

// Exports the Cell component for use in other parts of the application
export default Cell;
