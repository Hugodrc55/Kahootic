import { useState, useEffect, useRef } from 'react'
import { useWebSocket } from './hooks/useWebSocket'
import type { QuizPhase, QuizQuestion, ServerMessage } from '@shared/index'
import JoinScreen from './components/JoinScreen'
import WaitingLobby from './components/WaitingLobby'
import AnswerScreen from './components/AnswerScreen'
import FeedbackScreen from './components/FeedbackScreen'
import ScoreScreen from './components/ScoreScreen'

const WS_URL = 'ws://localhost:3001'

function App() {
  const { status, sendMessage, lastMessage } = useWebSocket(WS_URL)

  const [phase, setPhase] = useState<QuizPhase | 'join' | 'feedback'>('join')
  const [playerName, setPlayerName] = useState('')
  const [players, setPlayers] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Omit<QuizQuestion, 'correctIndex'> | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [lastAnswerIndex, setLastAnswerIndex] = useState<number | null>(null)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [rankings, setRankings] = useState<{ name: string; score: number }[]>([])
  const [error, setError] = useState<string | undefined>(undefined)

  const playerNameRef = useRef(playerName)
  playerNameRef.current = playerName

  useEffect(() => {
    if (!lastMessage) return

    const msg = lastMessage as ServerMessage

    switch (msg.type) {
      case 'joined': {
        setPlayers(msg.players)
        setPhase('lobby')
        setError(undefined)
        break
      }

      case 'question': {
        setCurrentQuestion(msg.question)
        setRemaining(msg.question.timerSec)
        setHasAnswered(false)
        setLastAnswerIndex(null)
        setPhase('question')
        break
      }

      case 'tick': {
        setRemaining(msg.remaining)
        break
      }

      case 'results': {
        const isCorrect = lastAnswerIndex !== null && lastAnswerIndex === msg.correctIndex
        setLastCorrect(isCorrect)
        const myScore = msg.scores[playerNameRef.current] ?? 0
        setScore(myScore)
        setPhase('feedback')
        break
      }

      case 'leaderboard': {
        setRankings(msg.rankings)
        setPhase('leaderboard')
        break
      }

      case 'ended': {
        setPhase('ended')
        break
      }

      case 'error': {
        setError(msg.message)
        break
      }
    }
  }, [lastMessage, lastAnswerIndex])

  const handleJoin = (code: string, name: string) => {
    setPlayerName(name)
    playerNameRef.current = name
    sendMessage({ type: 'join', quizCode: code, name })
  }

  const handleAnswer = (choiceIndex: number) => {
    if (hasAnswered || !currentQuestion) return
    setHasAnswered(true)
    setLastAnswerIndex(choiceIndex)
    sendMessage({ type: 'answer', questionId: currentQuestion.id, choiceIndex })
  }

  const renderPhase = () => {
    switch (phase) {
      case 'join':
        return <JoinScreen onJoin={handleJoin} error={error} />

      case 'lobby':
        return <WaitingLobby players={players} />

      case 'question':
        return currentQuestion ? (
          <AnswerScreen
            question={currentQuestion}
            remaining={remaining}
            onAnswer={handleAnswer}
            hasAnswered={hasAnswered}
            selectedIndex={lastAnswerIndex}
          />
        ) : null

      case 'feedback':
        return <FeedbackScreen correct={lastCorrect} score={score} />

      case 'results':
        return <FeedbackScreen correct={lastCorrect} score={score} />

      case 'leaderboard':
        return <ScoreScreen rankings={rankings} playerName={playerName} />

      case 'ended':
        return (
          <div className="phase-container">
            <h1>Quiz termine !</h1>
            <p className="ended-message">Merci d'avoir participe !</p>
            <button className="btn-primary" onClick={() => setPhase('join')}>
              Rejoindre un autre quiz
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h2>Kayhoot</h2>
        <span className={`status-badge status-${status}`}>
          {status === 'connected' ? 'Connecte' : status === 'connecting' ? 'Connexion...' : 'Deconnecte'}
        </span>
      </header>
      <main className="app-main">
        {renderPhase()}
      </main>
    </div>
  )
}

export default App
