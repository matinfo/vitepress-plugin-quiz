# Developer Tools & Ecosystem Quiz

A deeper quiz covering Git, npm/package managers, TypeScript, and VitePress itself.  
This page mixes all question types — including fill-in-the-blank — and tests session persistence: try answering a few questions, navigate away, and come back.

---

## Git

:::quiz
question: Which Git command creates a new branch **and** immediately switches to it?
answer-input: git checkout -b
answer-input: git switch -c
explanation: Both `git checkout -b <name>` (classic) and `git switch -c <name>` (modern) create and switch to a new branch. Either is accepted here.
:::

:::quiz
question: What does `git rebase -i HEAD~3` allow you to do?
answer: View the last 3 commits
answer-correct: Interactively edit, squash, or reorder the last 3 commits
answer: Merge the last 3 commits into the main branch
answer: Delete the last 3 commits permanently
explanation: Interactive rebase (`-i`) opens an editor where you can `pick`, `squash`, `reword`, `drop`, or reorder the listed commits before replaying them.
shuffle: true
:::

:::quiz
question: Which `git log` flag shows a compact one-line-per-commit output?
answer-input: --oneline
explanation: `git log --oneline` prints each commit as a single line with its abbreviated hash and subject.
:::

:::quiz
question: What does the `--force-with-lease` flag add to `git push --force`?
answer: Bypasses branch protection rules
answer-correct: Rejects the push if the remote has commits you have not fetched
answer: Forces push even if the remote branch is ahead
answer: Skips pre-push hooks
explanation: `--force-with-lease` is a safer alternative to `--force`: it only succeeds if the remote ref matches what you last fetched, preventing overwriting others' work.
shuffle: true
:::

---

## Package managers & npm

:::quiz
question: Which file locks the exact dependency tree for reproducible installs?
answer: `package.json`
answer-correct: `package-lock.json`
answer-correct: `bun.lock`
answer-correct: `yarn.lock`
answer: `.npmrc`
explanation: Lock files (`package-lock.json`, `yarn.lock`, `bun.lock`, `pnpm-lock.yaml`) pin exact resolved versions. `package.json` only declares *ranges*.
shuffle: true
:::

:::quiz
question: In `package.json`, what is the correct field to declare packages needed only during development?
answer-input: devDependencies
explanation: `devDependencies` lists packages that are only needed to build, test, or lint the project — they are not installed when another package depends on yours.
:::

:::quiz
question: Which `npm` script lifecycle hook runs *automatically* after `npm install`?
answer: `prebuild`
answer: `start`
answer-correct: `prepare`
answer: `postinstall`
explanation: The `prepare` script runs automatically after `npm install` (when there is no `--production` flag) and before `npm publish`. `postinstall` also runs after install but is more commonly used for post-install steps.
shuffle: true
:::

---

## TypeScript

:::quiz
question: Which TypeScript utility type makes all properties of `T` optional?
answer-input: Partial
answer-input: Partial<T>
explanation: `Partial<T>` constructs a type with all properties of `T` set to optional (`?`). The counterpart is `Required<T>`.
:::

:::quiz
question: What does the `satisfies` operator (TS 4.9+) do?
answer: Asserts the type of an expression at runtime
answer-correct: Validates that an expression matches a type without widening the inferred type
answer: Casts a value to a narrower type
answer: Disables type checking for the following expression
explanation: `satisfies` checks that a value matches a type *at compile time* but keeps the *most specific* inferred type — unlike `as` which asserts, or `: Type` which widens.
shuffle: true
:::

:::quiz
question: In TypeScript, which keyword narrows a `string | number` union to just `string` inside an if block?
answer-input: typeof
explanation: `if (typeof x === "string") { /* x is string here */ }` — the `typeof` guard is the standard way to narrow primitive unions.
:::

---

## VitePress & Vite

:::quiz
question: Which VitePress frontmatter property selects the home-page hero layout?
answer-input: layout
explanation: Setting `layout: home` in frontmatter activates the hero / features homepage layout provided by VitePress's default theme.
:::

:::quiz
question: In Vite's library mode, which `vite.config.ts` option sets the package entry point?
answer: `build.outDir`
answer-correct: `build.lib.entry`
answer: `build.rollupOptions.input`
answer: `resolve.alias`
explanation: `build.lib.entry` specifies the source entry file(s) for the library bundle. `rollupOptions.input` is used for multi-page app mode, not library mode.
shuffle: true
:::

:::quiz
question: What is the purpose of the `vite-plugin-dts` Vite plugin?
answer: Compiles TypeScript faster
answer-correct: Generates `.d.ts` type declaration files alongside the library bundle
answer: Enables HMR for `.d.ts` files
answer: Validates TypeScript types during the build
explanation: `vite-plugin-dts` runs `tsc` in emit mode during the Vite library build to produce `.d.ts` files, making your library fully typed for consumers.
shuffle: true
:::
