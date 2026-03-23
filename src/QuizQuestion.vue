<script setup lang="ts">
import { ref, computed, inject, watch, onMounted } from "vue"
import type { QuizData, QuizAnswer, QuizLocale, SavedAnswer } from "./types/quiz"

const props = defineProps({
  dataQuiz: { type: String, required: true },
})

const rawQuiz = computed<QuizData | null>(() => {
  try {
    return JSON.parse(props.dataQuiz) as QuizData
  } catch {
    return null
  }
})

// Shuffle helper (Fisher-Yates)
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Shuffled answers — computed once at mount, re-shuffled on reset
const shuffledAnswers = ref<(QuizAnswer & { originalIndex: number })[]>([])
function initAnswers() {
  if (!rawQuiz.value || rawQuiz.value.type === "input") {
    shuffledAnswers.value = []
    return
  }
  const indexed = rawQuiz.value.answers.map((a, i) => ({ ...a, originalIndex: i }))
  shuffledAnswers.value = rawQuiz.value.shuffle ? shuffleArray(indexed) : indexed
}

// Quiz data with shuffled answers
const quiz = computed(() => {
  if (!rawQuiz.value) return null
  return {
    ...rawQuiz.value,
    answers: shuffledAnswers.value,
  }
})

const isInputMode = computed(() => rawQuiz.value?.type === 'input')

const correctCount = computed(() =>
  quiz.value && !isInputMode.value
    ? quiz.value.answers.filter((a) => a.correct).length
    : 0
)
const isMultiple = computed(() => correctCount.value > 1)

// Selected answer indices (for choice mode)
const selected = ref(new Set<number>())
// Text input value (for fill-in-the-blank mode)
const inputValue = ref("")

// Registration with parent QuizPage
const register = inject<((q: { answered: typeof answered; isCorrect: typeof isCorrect }) => void) | null>("quiz-register", null)
const validated = inject<ReturnType<typeof ref<boolean>>>("quiz-validated", ref(false))
const resetCounter = inject<ReturnType<typeof ref<number>>>("quiz-reset", ref(0))
const t = inject<QuizLocale>("quiz-locale")!

// Per-question persistence
const getQuestionId = inject<(() => number) | null>("quiz-question-id", null)
const saveAnswer = inject<((id: number, data: SavedAnswer) => void) | null>("quiz-save-answer", null)
const getAnswer = inject<((id: number) => SavedAnswer | null) | null>("quiz-get-answer", null)
const myId: number | null = getQuestionId ? getQuestionId() : null

const answered = computed(() => {
  if (isInputMode.value) return inputValue.value.trim().length > 0
  return selected.value.size > 0
})

const isCorrect = computed(() => {
  if (!quiz.value || !answered.value) return false

  if (isInputMode.value) {
    // Case-insensitive comparison against any accepted variant
    const input = inputValue.value.trim().toLowerCase()
    return rawQuiz.value!.expected.some((e) => input === e.trim().toLowerCase())
  }

  const correctIndices = new Set(
    quiz.value.answers
      .map((a, i) => (a.correct ? i : -1))
      .filter((i) => i >= 0)
  )
  if (selected.value.size !== correctIndices.size) return false
  for (const idx of selected.value) {
    if (!correctIndices.has(idx)) return false
  }
  return true
})

// Register this question with the parent page
if (register) {
  register({ answered, isCorrect })
}

// Watch for reset from parent
watch(resetCounter, () => {
  selected.value = new Set()
  inputValue.value = ''
  initAnswers()
})

onMounted(() => {
  initAnswers()
  // Restore saved answer state
  if (getAnswer && myId !== null) {
    const saved = getAnswer(myId)
    if (saved) {
      if (saved.type === "input") {
        inputValue.value = saved.input
      } else if (saved.type === "choice") {
        selected.value = new Set(saved.selected)
      }
    }
  }
})

function toggle(idx: number) {
  if (validated.value) return
  const next = new Set(selected.value)
  if (isMultiple.value) {
    if (next.has(idx)) next.delete(idx)
    else next.add(idx)
  } else {
    next.clear()
    next.add(idx)
  }
  selected.value = next
  persistState()
}

// Save input value on change
watch(inputValue, () => {
  if (!validated.value) persistState()
})

function persistState() {
  if (!saveAnswer || myId === null) return
  if (isInputMode.value) {
    saveAnswer(myId, { type: "input", input: inputValue.value })
  } else {
    saveAnswer(myId, { type: "choice", selected: [...selected.value] })
  }
}

function answerClass(idx: number): string {
  if (!validated.value) {
    return selected.value.has(idx) ? "quiz-answer selected" : "quiz-answer"
  }
  const answer = quiz.value!.answers[idx]
  const wasPicked = selected.value.has(idx)
  if (answer.correct && wasPicked) return "quiz-answer correct"
  if (answer.correct && !wasPicked) return "quiz-answer missed"
  if (!answer.correct && wasPicked) return "quiz-answer wrong"
  return "quiz-answer"
}

const inputClass = computed(() => {
  if (!validated.value) return "quiz-input"
  return isCorrect.value ? "quiz-input correct" : "quiz-input wrong"
})

import { parseRichText, type RichPart } from './utils'
</script>

<template>
  <fieldset v-if="quiz" class="quiz-question" :class="{ validated: validated }" :aria-label="quiz.question">
    <legend class="quiz-question-title">
      <template v-for="(part, pi) in parseRichText(quiz.question)" :key="pi">
        <strong v-if="part.type === 'bold'">{{ part.value }}</strong>
        <em v-else-if="part.type === 'italic'">{{ part.value }}</em>
        <code v-else-if="part.type === 'code'">{{ part.value }}</code>
        <template v-else>{{ part.value }}</template>
      </template>
    </legend>

    <!-- Choice mode -->
    <template v-if="!isInputMode">
      <p v-if="isMultiple" class="quiz-hint">{{ t.multipleHint }}</p>
      <ul class="quiz-answers" role="listbox" :aria-multiselectable="isMultiple">
        <li
          v-for="(answer, idx) in quiz.answers"
          :key="answer.originalIndex"
          :class="answerClass(idx)"
          @click="toggle(idx)"
          role="option"
          :aria-selected="selected.has(idx)"
          tabindex="0"
          @keydown.enter="toggle(idx)"
          @keydown.space.prevent="toggle(idx)"
        >
          <span class="quiz-indicator" aria-hidden="true">
            <template v-if="isMultiple">
              <span v-if="selected.has(idx)" class="quiz-check">✓</span>
              <span v-else class="quiz-empty">☐</span>
            </template>
            <template v-else>
              <span v-if="selected.has(idx)" class="quiz-check">●</span>
              <span v-else class="quiz-empty">○</span>
            </template>
          </span>
          <span class="quiz-answer-text">
          <template v-for="(part, pi) in parseRichText(answer.text)" :key="pi">
            <strong v-if="part.type === 'bold'">{{ part.value }}</strong>
            <em v-else-if="part.type === 'italic'">{{ part.value }}</em>
            <code v-else-if="part.type === 'code'">{{ part.value }}</code>
              <template v-else>{{ part.value }}</template>
            </template>
          </span>
        </li>
      </ul>
    </template>

    <!-- Fill-in-the-blank mode -->
    <template v-if="isInputMode">
      <p class="quiz-hint">{{ t.inputHint }}</p>
      <div class="quiz-input-wrapper">
        <input
          v-model="inputValue"
          :class="inputClass"
          type="text"
          :disabled="validated"
          :placeholder="t.inputPlaceholder"
          :aria-label="quiz.question"
          autocomplete="off"
          spellcheck="false"
          @keydown.enter.prevent
        />
        <p v-if="validated && !isCorrect" class="quiz-expected">
          {{ t.expectedAnswer }} <code>{{ rawQuiz?.expected[0] }}</code>
        </p>
      </div>
    </template>

    <!-- Explanation (rich text: supports **bold** and `code`) -->
    <div v-if="validated && quiz.explanation" class="quiz-explanation" role="note">
      <strong>{{ t.explanation }}</strong>
      <template v-for="(part, pi) in parseRichText(quiz.explanation)" :key="pi">
        <strong v-if="part.type === 'bold'">{{ part.value }}</strong>
        <em v-else-if="part.type === 'italic'">{{ part.value }}</em>
        <code v-else-if="part.type === 'code'">{{ part.value }}</code>
        <template v-else>{{ part.value }}</template>
      </template>
    </div>
  </fieldset>
</template>
