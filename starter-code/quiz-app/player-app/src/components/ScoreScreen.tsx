interface Props {
  rankings: { name: string; score: number }[]
  playerName: string
}

export default function ScoreScreen({ rankings, playerName }: Props) {
  return (
    <div className="score-screen">
      <h2 className="leaderboard-title">Classement</h2>
      <div className="leaderboard">
        {rankings.map((entry, i) => {
          const isMe = entry.name === playerName
          return (
            <div key={i} className={`leaderboard-item${isMe ? ' is-me' : ''}`}>
              <span className="leaderboard-rank">{i + 1}</span>
              <span className="leaderboard-name">
                {entry.name}
                {isMe && ' (vous)'}
              </span>
              <span className="leaderboard-score">{entry.score} pts</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}