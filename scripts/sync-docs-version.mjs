import { readFileSync, writeFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'))
const docsPath = './docs/package.json'
const docs = JSON.parse(readFileSync(docsPath, 'utf8'))

docs.version = version

writeFileSync(docsPath, JSON.stringify(docs, null, 2) + '\n')
console.log(`docs/package.json synced to version ${version}`)
