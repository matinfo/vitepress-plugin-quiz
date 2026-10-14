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
    associationHint: "Match each item with its answer",
    associationPlaceholder: "Choose…",
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
    associationHint: "Associez chaque élément à sa réponse",
    associationPlaceholder: "Choisir…",
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
    associationHint: "Ordnen Sie jedem Element die passende Antwort zu",
    associationPlaceholder: "Auswählen…",
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
    associationHint: "Abbina ogni elemento alla risposta corretta",
    associationPlaceholder: "Scegli…",
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
    associationHint: "Asocia cada elemento con su respuesta",
    associationPlaceholder: "Elegir…",
  },
}

/**
 * Get locale strings for a given language code.
 * Falls back to English if the language is not found.
 */
export function getLocale(lang = "en"): QuizLocale {
  return locales[lang] ?? locales.en
}
