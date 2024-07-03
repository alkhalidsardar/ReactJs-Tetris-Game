// Import necessary hooks and types from React and local modules
import { useCallback, useEffect, useState } from "react";
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES, TickSpeed } from "../types";
import {
  BOARD_HEIGHT,
  INITIAL_COLUMN,
  INITIAL_ROW,
  getEmptyBoard,
  getRandomBlock,
  hasCollisions,
  useTetrisBoard,
} from "./useTetrisBoard";
import { useInterval } from "./useInterval";

// Custom hook to manage the Tetris game state
export function useTetris() {
  // State variables for score, upcoming block, game status, and tick speed
  const [score, setScore] = useState(0);
  const [upcomingBlock, setUpcomingBlock] = useState<Block | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tickSpeed, setTickSpeed] = useState<TickSpeed | null>(null);

  // Destructure the state and dispatch function from the useTetrisBoard hook
  const [{ board, droppingRow, droppingColumn, droppingBlock, droppingShape }, dispatchBoardState] = useTetrisBoard();

  // Callback to start the game
  const startGame = useCallback(() => {
    // Get a random block to start with
    const startingBlock = getRandomBlock();
    // Reset score and upcoming block, and set game state to playing
    setScore(0);
    setUpcomingBlock(startingBlock);
    setIsCommitting(false);
    setIsPlaying(true);
    setIsPaused(false);
    setTickSpeed(TickSpeed.Normal);
    // Dispatch a start action to the board state
    dispatchBoardState({ type: "start" });
  }, [dispatchBoardState]);

  // Callback to toggle the pause state of the game
  const togglePause = useCallback(() => {
    setIsPaused((previousState) => !previousState);
  }, []);

  // Callback to stop the game
  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setUpcomingBlock(null);
    setIsPaused(false);
  }, []);

  // Callback to commit the position of the current block
  const commitPosition = useCallback(() => {
    // If the block can move down without collisions, continue normal tick speed
    if (!hasCollisions(board, droppingRow + 1, droppingColumn, droppingShape)) {
      setIsCommitting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }

    // If there are collisions at the initial position, the game is over
    if (hasCollisions(board, INITIAL_ROW, INITIAL_COLUMN, SHAPES[upcomingBlock!].shape)) {
      setIsPlaying(false);
      setTickSpeed(null);
      return;
    }

    // Clone the board and add the dropping shape to it
    const newBoard = structuredClone(board) as BoardShape;
    addShapeToBoard(newBoard, droppingRow, droppingColumn, droppingBlock, droppingShape);

    // Check and clear full rows
    let clearedRows = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (newBoard[row].every((entry) => entry !== EmptyCell.Empty)) {
        clearedRows++;
        newBoard.splice(row, 1);
      }
    }

    // Update the score based on the number of cleared rows
    setScore((actual) => actual + clearedRows * 100);

    // Get the next block and update the tick speed
    const newBlock = upcomingBlock as Block;
    setUpcomingBlock(getRandomBlock());
    setTickSpeed(TickSpeed.Normal);

    // Dispatch a commit action to the board state with the new board and block
    dispatchBoardState({
      type: "commit",
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [board, dispatchBoardState, droppingBlock, droppingColumn, droppingRow, droppingShape, upcomingBlock]);

  // Callback to handle the game tick
  const gameTick = useCallback(() => {
    // If the game is paused, do nothing
    if (isPaused) {
      return;
    // If committing, finalize the block position
    } else if (isCommitting) {
      commitPosition();
    // If there are collisions, start sliding the block
    } else if (hasCollisions(board, droppingRow + 1, droppingColumn, droppingShape)) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    // Otherwise, continue dropping the block
    } else {
      dispatchBoardState({ type: "drop" });
    }
  }, [board, commitPosition, dispatchBoardState, droppingColumn, droppingRow, droppingShape, isCommitting, isPaused]);

  // Use a custom interval hook to handle the game tick
  useInterval(() => {
    isPlaying && gameTick();
  }, tickSpeed);

  // Effect to handle keyboard input for controlling the game
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      event.key === "ArrowDown" && setTickSpeed(TickSpeed.Fast);
      event.key === "ArrowUp" && dispatchBoardState({ type: "move", isRotating: true });
      event.key === "ArrowLeft" && dispatchBoardState({ type: "move", isPressingLeft: true });
      event.key === "ArrowRight" && dispatchBoardState({ type: "move", isPressingRight: true });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      event.key === "ArrowDown" && setTickSpeed(TickSpeed.Normal);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyDown);
    };
  }, [dispatchBoardState, isPlaying, isPaused]);

  // Render the current board with the dropping shape added
  const renderedBoard = structuredClone(board) as BoardShape;
  if (isPlaying) {
    addShapeToBoard(renderedBoard, droppingRow, droppingColumn, droppingBlock, droppingShape);
  }

  // Return the current game state and control functions
  return {
    board: renderedBoard,
    startGame,
    togglePause,
    stopGame,
    isPaused,
    isPlaying,
    score,
    upcomingBlock,
  };
}

// Helper function to add a shape to the board at the specified position
function addShapeToBoard(
  board: BoardShape,
  droppingRow: number,
  droppingColumn: number,
  droppingBlock: Block,
  droppingShape: BlockShape
) {
  // Iterate over the rows of the shape, ignoring empty rows
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row: boolean[], rowIndex: number) => {
      // Iterate over the cells in the row
      row.forEach((isSet: boolean, colIndex: number) => {
        // If the cell is set, add it to the board
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] = droppingBlock;
        }
      });
    });
}
