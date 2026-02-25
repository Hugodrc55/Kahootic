interface Props {
  players: string[]
}

export default function WaitingLobby({ players }: Props) {
  return (
    <div className="waiting-container">
      <p className="waiting-message">En attente du host...</p>
      <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
        {players.length} joueur{players.length !== 1 ? 's' : ''} connecte{players.length !== 1 ? 's' : ''}
      </p>
      <div className="player-list">
        {players.map((name, i) => (
          <span key={i} className="player-chip">{name}</span>
        ))}
      </div>
    </div>
  )
}
