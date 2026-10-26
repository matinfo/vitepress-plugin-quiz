// Preload for `bun test`: provides a DOM (happy-dom) and compiles `.vue` SFCs,
// mirroring what vitest.config.ts does for `vitest run`.
import { GlobalRegistrator } from "@happy-dom/global-registrator"
import { plugin } from "bun"
import { readFileSync } from "node:fs"
import { compileScript, compileTemplate, parse } from "@vue/compiler-sfc"

GlobalRegistrator.register()

plugin({
  name: "vue-sfc",
  setup(build) {
    build.onLoad({ filter: /\.vue$/ }, ({ path }) => {
      const { descriptor } = parse(readFileSync(path, "utf8"), { filename: path })
      const id = Bun.hash(path).toString(16)
      const script = compileScript(descriptor, { id, inlineTemplate: true })
      let code = script.content
      if (!descriptor.scriptSetup && descriptor.template) {
        const tpl = compileTemplate({ id, filename: path, source: descriptor.template.content })
        code = code.replace("export default", "const __sfc__ =") + "\n" + tpl.code +
          "\n__sfc__.render = render\nexport default __sfc__"
      }
      return { contents: code, loader: script.lang === "ts" ? "ts" : "js" }
    })
    build.onLoad({ filter: /\.css$/ }, ({ path }) => ({
      contents: `export default ${JSON.stringify(readFileSync(path, "utf8"))}`,
      loader: "js",
    }))
  },
})
