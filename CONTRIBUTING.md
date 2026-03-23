# Contributing

Thank you for considering a contribution to `vitepress-plugin-quiz`!

## Development setup

**Prerequisites:** [Bun](https://bun.sh) ≥ 1.2, Node.js ≥ 18.

```sh
# Clone the repo
git clone https://github.com/matinfo/vitepress-plugin-quiz.git
cd vitepress-plugin-quiz

# Install dependencies
bun install

# Build the library
bun run build

# Lint
bun run lint

# Format
bun run format
```

## Running the test project

The `test-project/` directory is a local VitePress site that consumes the plugin from a packed tarball.

```sh
# 1. Pack the built library
bun run pack        # produces vitepress-plugin-quiz-x.x.x.tgz

# 2. Install in test-project (tgz is referenced via file: in its package.json)
cd test-project && bun install

# 3. Start VitePress dev server
bun run docs:dev
```

## Running the docs site locally

```sh
cd docs && bun install && bun run docs:dev
```

## Pull request guidelines

- Keep PRs focused on a single concern.
- Run `bun run lint` and `bun run format` before pushing.
- For new features, add or update the relevant `docs/guide/` or `docs/examples/` page.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) in commit messages (`feat:`, `fix:`, `docs:`, `chore:`, …).

## Releasing

1. Update `package.json` version.
2. Add an entry to `CHANGELOG.md`.
3. Commit: `chore(release): vX.Y.Z`
4. Tag: `git tag vX.Y.Z && git push --tags`

The `publish-npm` GitHub Actions workflow runs automatically on tag push.
