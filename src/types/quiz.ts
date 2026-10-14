export interface QuizAnswer {
  text: string
  correct: boolean
  originalIndex?: number
}

export interface QuizPair {
  left: string
  right: string
}

export interface QuizData {
  question: string
  type: "choice" | "input" | "association"
  answers: QuizAnswer[]
  expected: string[]
  pairs: QuizPair[]
  options: string[]
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
  associationHint: string
  associationPlaceholder: string
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

export interface SavedAssociationAnswer {
  type: "association"
  chosen: (number | null)[]
}

export type SavedAnswer = SavedChoiceAnswer | SavedInputAnswer | SavedAssociationAnswer
