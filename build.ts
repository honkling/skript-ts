import { build } from "esbuild";

await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    minify: true,
    keepNames: true,
    target: ["chrome58", "firefox57"],
    outfile: "dist/skript.js"
})