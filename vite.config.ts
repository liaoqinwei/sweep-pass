import { defineConfig } from 'vite'
import path from "node:path"
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: "SweepPass",
      fileName: "index",
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["three"],
    }
  },
  plugins: [dts({
    insertTypesEntry: true,
  })]
})