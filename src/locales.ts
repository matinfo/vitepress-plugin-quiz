import type { QuizLocale } from "./types/quiz"

export const locales: Record<string, QuizLocale> = {
  en: {
    answered: "answered",
    validate: "Validate",
    reset: "Restart",
    correctAnswers: (n) => `correct answer${n !== 1 ? "s" : ""}`,
    multipleHint: "Multiple answers possible",
    explanation: "Explanation: ",
    inputHint: "Type your answer",
    inputPlaceholder: "Your answer…",
    expectedAnswer: "Expected answer:",
  },
  fr: {
    answered: "répondue(s)",
    validate: "Valider",
    reset: "Recommencer",
    correctAnswers: (n) => `réponse${n > 1 ? "s" : ""} correcte${n > 1 ? "s" : ""}`,
    multipleHint: "Plusieurs réponses possibles",
    explanation: "Explication : ",
    inputHint: "Saisissez votre réponse",
    inputPlaceholder: "Votre réponse…",
    expectedAnswer: "Réponse attendue :",
  },
  de: {
    answered: "beantwortet",
    validate: "Überprüfen",
    reset: "Neu starten",
    correctAnswers: (n) => `richtige Antwort${n !== 1 ? "en" : ""}`,
    multipleHint: "Mehrere Antworten möglich",
    explanation: "Erklärung:",
    inputHint: "Geben Sie Ihre Antwort ein",
    inputPlaceholder: "Ihre Antwort…",
    expectedAnswer: "Erwartete Antwort:",
  },
  it: {
    answered: "risposta/e",
    validate: "Verifica",
    reset: "Ricominciare",
    correctAnswers: (n) => `rispost${n !== 1 ? "e corrette" : "a corretta"}`,
    multipleHint: "Più risposte possibili",
    explanation: "Spiegazione: ",
    inputHint: "Digita la tua risposta",
    inputPlaceholder: "La tua risposta…",
    expectedAnswer: "Risposta attesa:",
  },
  es: {
    answered: "respondida(s)",
    validate: "Validar",
    reset: "Reiniciar",
    correctAnswers: (n) => `respuesta${n !== 1 ? "s correctas" : " correcta"}`,
    multipleHint: "Varias respuestas posibles",
    explanation: "Explicación: ",
    inputHint: "Escribe tu respuesta",
    inputPlaceholder: "Tu respuesta…",
    expectedAnswer: "Respuesta esperada:",
  },
}

/**
 * Get locale strings for a given language code.
 * Falls back to English if the language is not found.
 */
export function getLocale(lang = "en"): QuizLocale {
  return locales[lang] ?? locales.en
}
