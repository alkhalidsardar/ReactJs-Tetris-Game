// Defines the props expected by the Controls component
interface ControlsProps {
  startGame: () => void; // Function to start the game
  togglePause: () => void; // Function to toggle the game's pause state
  stopGame: () => void; // Function to stop the game
  isPlaying: boolean; // Indicates if the game is currently playing
  isPaused: boolean; // Indicates if the game is currently paused
}

// Functional component to render the game controls
function Controls({ startGame, togglePause, stopGame, isPlaying, isPaused }: ControlsProps) {
  return (
    // Renders the controls container
    <div className="controls">
      <h2>Controls</h2>
      {/* Button to start or stop the game based on the current playing state */}
      <button className={isPlaying ? "stopBtn" : "startBtn"} onClick={isPlaying ? stopGame : startGame}>
        {isPlaying ? "End" : "Start"} {/* Text changes based on whether the game is playing */}
      </button>
      {/* Button to pause or resume the game, disabled if the game is not playing */}
      <button
        className={isPaused ? "resumeBtn" : `pauseBtn ${isPlaying ? "" : "disabled"}`} // Button style changes based on pause state and playing state
        onClick={togglePause}
        disabled={!isPlaying} // Button is disabled if the game is not playing
      >
        {isPaused ? "Resume" : "Pause"} {/* Text changes based on whether the game is paused */}
      </button>
    </div>
  );
}

// Exports the Controls component for use in other parts of the application
export default Controls;
