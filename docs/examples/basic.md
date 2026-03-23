# World Capitals Quiz

A universally fun demo — no technical knowledge needed. Showcases all three question types.

---

## Single-choice

One correct answer out of four options.

:::quiz
question: What is the capital of France?
answer: Lyon
answer-correct: Paris
answer: Marseille
answer: Nice
explanation: **Paris** has been the capital of France since the 10th century.
shuffle: true
:::

---

## Single-choice with a surprise answer

A classic trick — the most obvious city is wrong.

:::quiz
question: What is the capital of Australia?
answer: Sydney
answer: Melbourne
answer-correct: Canberra
answer: Brisbane
explanation: Many people guess Sydney, but **Canberra** is the capital — chosen in 1908 as a compromise between the rival cities of Sydney and Melbourne.
shuffle: true
:::

---

## Multiple-choice

Two or more correct answers. A *"Multiple answers possible"* hint appears automatically.

:::quiz
question: Which of these cities are national capitals?
answer-correct: Ottawa
answer-correct: Berlin
answer-correct: Nairobi
answer: Barcelona
answer: Sydney
explanation: **Ottawa** (Canada), **Berlin** (Germany), and **Nairobi** (Kenya) are all national capitals. Barcelona is the capital of Catalonia, not Spain — and Sydney is not Australia's capital.
shuffle: true
:::

---

## Fill-in-the-blank (single accepted answer)

The player types a free-text answer. Comparison is case-insensitive.

:::quiz
question: What is the capital of Japan?
answer-input: Tokyo
explanation: **Tokyo** has been Japan's capital since 1869, when Emperor Meiji moved the imperial seat there from Kyoto.
:::

---

## Fill-in-the-blank (multiple accepted variants)

Multiple `answer-input:` lines accept different spellings or formats.

:::quiz
question: What is the capital of Italy?
answer-input: Rome
answer-input: Roma
explanation: **Rome** (Roma in Italian) became Italy's capital in 1871. Both the English and Italian spellings are accepted here.
:::

---

## Without shuffle

Answers are displayed in the order they were written.

:::quiz
question: What is the capital of Canada?
answer: Toronto
answer: Vancouver
answer-correct: Ottawa
answer: Montréal
explanation: **Ottawa**, in Ontario, has been Canada's capital since 1857 — chosen by Queen Victoria as a neutral compromise between the rival cities of Toronto and Montréal.
:::
