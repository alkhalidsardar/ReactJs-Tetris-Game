interface ScoreProps {
  score: number;
}

export default function Score({ score }: ScoreProps) {
  return (
    <div className="points">
      <h2>Total Points</h2>
      <div className="points">{score}</div>
    </div>
  );
}
