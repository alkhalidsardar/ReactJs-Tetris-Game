import Board from "./components/Board";
import Controls from "./components/Controls";
import NextBlock from "./components/NextBlock";
import Score from "./components/Score";
import { useTetris } from "./hooks/useTetris";

function App() {
  const { board, isPlaying, isPaused, score, startGame, togglePause, stopGame, upcomingBlock } = useTetris();

  return (
    <>
      <h1>TETRIS</h1>
      <div className="container">
        <Board currentBoard={board} />
        <NextBlock upcomingBlock={upcomingBlock} />
        <Score score={score} />
        <Controls
          isPlaying={isPlaying}
          isPaused={isPaused}
          startGame={startGame}
          stopGame={stopGame}
          togglePause={togglePause}
        />
      </div>
    </>
  );
}

export default App;
