import { defineConfig } from "tsup"

export default defineConfig({
    treeshake: true,
    entry: ["src/lib.ts"],
    define: {
        "import.meta.vitest": "false"
    }
})
