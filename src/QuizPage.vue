<script setup lang="ts">
import { ref, computed, provide, inject } from "vue"
import type { QuizLocale, QuizState, SavedAnswer } from "./types/quiz"

const t = inject<QuizLocale>("quiz-locale")!
const questions = ref<QuizState[]>([])
const validated = ref(false)

// Generate a storage key from the page path — set eagerly so children can read on mount
// (Vue mounts children before parent, so onMounted would be too late)
const storageKey = typeof window !== 'undefined'
  ? 'quiz-state:' + window.location.pathname
  : ''

// Restore quiz-level state immediately so validated is set before children mount
restoreState()

// Question index counter for stable per-question storage keys
let questionIdx = 0

provide("quiz-validated", validated)
provide("quiz-register", (q: QuizState) => {
  questions.value.push(q)
})

// Per-question persistence: each question gets a unique sub-key
provide("quiz-question-id", () => questionIdx++)
provide("quiz-save-answer", (qId: number, data: SavedAnswer) => {
  if (!storageKey) return
  try {
    sessionStorage.setItem(storageKey + ":q" + qId, JSON.stringify(data))
  } catch { /* ignore */ }
})
provide("quiz-get-answer", (qId: number): SavedAnswer | null => {
  if (!storageKey) return null
  try {
    const raw = sessionStorage.getItem(storageKey + ":q" + qId)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
})

// Provide a reset trigger for child components
const resetCounter = ref(0)
provide("quiz-reset", resetCounter)

const totalQuestions = computed(() => questions.value.length)
const answeredCount = computed(() =>
  questions.value.filter((q) => q.answered).length
)
const correctCount = computed(() =>
  questions.value.filter((q) => q.isCorrect).length
)
const allAnswered = computed(() => answeredCount.value === totalQuestions.value)
const progressPct = computed(() =>
  totalQuestions.value ? Math.round((answeredCount.value / totalQuestions.value) * 100) : 0
)

function validate() {
  validated.value = true
  saveState()
}

function reset() {
  validated.value = false
  resetCounter.value++
  clearState()
}

/* ── sessionStorage persistence ───────────────────────────────────── */
function saveState() {
  if (!storageKey) return
  try {
    const data = { validated: validated.value, ts: Date.now() }
    sessionStorage.setItem(storageKey, JSON.stringify(data))
  } catch { /* storage full or unavailable */ }
}

function restoreState() {
  if (!storageKey) return
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return
    const data = JSON.parse(raw)
    if (data && data.validated) {
      validated.value = true
    }
  } catch { /* corrupted – ignore */ }
}

function clearState() {
  if (!storageKey) return
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(storageKey)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k))
  } catch { /* ignore */ }
}
</script>

<template>
  <div class="quiz-page" role="region" aria-label="Quiz">
    <div class="quiz-progress-bar" role="progressbar"
      :aria-valuenow="answeredCount"
      :aria-valuemin="0"
      :aria-valuemax="totalQuestions"
      :aria-label="answeredCount + ' / ' + totalQuestions + ' ' + t.answered"
    >
      <div class="quiz-progress-track">
        <div
          class="quiz-progress-fill"
          :style="{ width: progressPct + '%' }"
          :class="{ complete: progressPct === 100 }"
        ></div>
      </div>
      <span class="quiz-progress-label" aria-live="polite">
        {{ answeredCount }} / {{ totalQuestions }} {{ t.answered }}
      </span>
    </div>

    <slot />

    <div class="quiz-actions">
      <button
        v-if="!validated"
        class="quiz-btn quiz-btn-validate"
        :disabled="!allAnswered"
        @click="validate"
      >
        {{ t.validate }}
      </button>

      <template v-if="validated">
        <div class="quiz-score" role="status" aria-live="polite"
          :aria-label="correctCount + ' / ' + totalQuestions + ' ' + t.correctAnswers(correctCount)"
        >
          <span class="quiz-score-value">{{ correctCount }} / {{ totalQuestions }}</span>
          <span class="quiz-score-label">
            {{ t.correctAnswers(correctCount) }}
            ({{ totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0 }}%)
          </span>
        </div>
        <button class="quiz-btn quiz-btn-reset" @click="reset">
          {{ t.reset }}
        </button>
      </template>
    </div>
  </div>
</template>
