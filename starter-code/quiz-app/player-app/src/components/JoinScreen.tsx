import { useState } from 'react'

interface Props {
  onJoin: (code: string, name: string) => void
  error?: string
}

export default function JoinScreen({ onJoin, error }: Props) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return
    onJoin(code.trim().toUpperCase(), name.trim())
  }

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <h1>Kayhoot !</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Code du quiz</label>
        <input
          className="code-input"
          type="text"
          placeholder="ABC123"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          required
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Pseudo</label>
        <input
          type="text"
          placeholder="Ton nom"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
          required
        />
      </div>

      <button type="submit" className="btn-primary">
        Rejoindre
      </button>
    </form>
  )
}

