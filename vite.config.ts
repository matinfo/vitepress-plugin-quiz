import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VitepressPluginQuiz",
      fileName: (format) => {
        if (format === "es") return "vitepress-plugin-quiz.js";
        if (format === "umd") return "vitepress-plugin-quiz.umd.cjs";
        return `vitepress-plugin-quiz.${format}`;
      },
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
      },
    },
    sourcemap: true,
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    cssCodeSplit: false,
    outDir: "dist",
    emptyOutDir: true,
  },
});
