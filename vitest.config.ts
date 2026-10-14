import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    environment: "happy-dom",
  },
})
