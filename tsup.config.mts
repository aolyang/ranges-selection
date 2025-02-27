import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts", "src/utils.ts"],
    define: {
        "import.meta.vitest": "false"
    },
    treeshake: true,
    sourcemap: true,
    splitting: false,
    shims: true
})
