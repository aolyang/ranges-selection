import { defineConfig } from "tsup"

export default defineConfig({
    treeshake: true,
    entry: ["src/index.ts"],
    define: {
        "import.meta.vitest": "false"
    }
})
