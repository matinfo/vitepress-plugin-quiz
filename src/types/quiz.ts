export interface QuizAnswer {
  text: string
  correct: boolean
  originalIndex?: number
}

export interface QuizData {
  question: string
  type: "choice" | "input"
  answers: QuizAnswer[]
  expected: string[]
  explanation: string
  shuffle: boolean
}

export interface QuizLocale {
  answered: string
  validate: string
  reset: string
  correctAnswers: (n: number) => string
  multipleHint: string
  explanation: string
  inputHint: string
  inputPlaceholder: string
  expectedAnswer: string
}

export interface QuizState {
  answered: boolean
  isCorrect: boolean
}

export interface SavedChoiceAnswer {
  type: "choice"
  selected: number[]
}

export interface SavedInputAnswer {
  type: "input"
  input: string
}

export type SavedAnswer = SavedChoiceAnswer | SavedInputAnswer
