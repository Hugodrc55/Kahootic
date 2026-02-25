interface Props {
  correct: boolean
  score: number
}

export default function FeedbackScreen({ correct, score }: Props) {
  return (
    <div className={`feedback-container feedback ${correct ? 'correct' : 'incorrect'}`}>
      <div className="feedback-icon" />
      <p className="feedback-text">
        {correct ? 'Bonne reponse !' : 'Mauvaise reponse'}
      </p>
      <p className="feedback-score">Score : {score} pts</p>
    </div>
  )
}