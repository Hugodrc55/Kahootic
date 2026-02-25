import type { QuizQuestion } from '@shared/index'

interface Props {
  question: Omit<QuizQuestion, 'correctIndex'>
  remaining: number
  onAnswer: (choiceIndex: number) => void
  hasAnswered: boolean
  selectedIndex: number | null
}

export default function AnswerScreen({ question, remaining, onAnswer, hasAnswered, selectedIndex }: Props) {
  const timerClass =
    remaining <= 3 ? 'danger' :
    remaining <= 7 ? 'warning' : ''

  return (
    <div className="answer-screen">
      <p className={`answer-timer ${timerClass}`}>{remaining}s</p>
      <p className="answer-question">{question.text}</p>

      <div className="answer-grid">
        {question.choices.map((choice, i) => (
          <button
            key={i}
            className={`answer-btn${selectedIndex === i ? ' selected' : ''}`}
            onClick={() => onAnswer(i)}
            disabled={hasAnswered}
          >
            {choice}
          </button>
        ))}
      </div>

      {hasAnswered && (
        <p className="answered-message">Reponse envoyee !</p>
      )}
    </div>
  )
}
